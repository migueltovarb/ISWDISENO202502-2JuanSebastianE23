const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Claim = require('../models/Claim');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const router = express.Router();

// Get statistics
router.get('/stats', auth, role(['Administrador']), async (req, res) => {
  try {
    const totalClaims = await Claim.countDocuments();
    const pending = await Claim.countDocuments({ status: 'Pendiente' });
    const inProcess = await Claim.countDocuments({ status: 'En proceso' });
    const resolved = await Claim.countDocuments({ status: 'Resuelto' });
    const rejected = await Claim.countDocuments({ status: 'Rechazado' });

    // Monthly statistics for the last 12 months
    const monthlyStats = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);

      const count = await Claim.countDocuments({
        createdAt: { $gte: date, $lt: nextMonth }
      });

      monthlyStats.push({
        month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        count
      });
    }

    res.json({ totalClaims, pending, inProcess, resolved, rejected, monthlyStats });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).send('Server error');
  }
});

// Generate report data
router.get('/', auth, role(['Administrador']), async (req, res) => {
  const { startDate, endDate, status, user, format } = req.query;
  let filter = {};
  if (startDate && endDate) filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  if (status) filter.status = status;
  if (user) filter.user = user;

  try {
    const claims = await Claim.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    if (format === 'excel') {
      return exportToExcel(claims, res);
    } else if (format === 'pdf') {
      return exportToPDF(claims, res);
    }

    res.json(claims);
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).send('Server error');
  }
});

// Export to Excel
async function exportToExcel(claims, res) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reportes de Reclamos');

  // Add headers
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 25 },
    { header: 'Título', key: 'title', width: 30 },
    { header: 'Descripción', key: 'description', width: 50 },
    { header: 'Tipo', key: 'type', width: 15 },
    { header: 'Estado', key: 'status', width: 15 },
    { header: 'Cliente', key: 'client', width: 25 },
    { header: 'Empleado Asignado', key: 'employee', width: 25 },
    { header: 'Fecha Creación', key: 'createdAt', width: 20 },
    { header: 'Fecha Actualización', key: 'updatedAt', width: 20 }
  ];

  // Style headers
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF667EEA' }
  };

  // Add data
  claims.forEach(claim => {
    worksheet.addRow({
      id: claim._id.toString(),
      title: claim.title,
      description: claim.description,
      type: claim.type,
      status: claim.status,
      client: claim.user?.name || 'N/A',
      employee: claim.assignedTo?.name || 'No asignado',
      createdAt: claim.createdAt.toLocaleDateString('es-ES'),
      updatedAt: claim.updatedAt.toLocaleDateString('es-ES')
    });
  });

  // Generate filename with date
  const date = new Date().toISOString().split('T')[0];
  const filename = `reporte-reclamos-${date}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  await workbook.xlsx.write(res);
  res.end();
}

// Export to PDF
function exportToPDF(claims, res) {
  const doc = new PDFDocument();
  const date = new Date().toISOString().split('T')[0];
  const filename = `reporte-reclamos-${date}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  doc.pipe(res);

  // Title
  doc.fontSize(20).text('Reporte de Reclamos', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });
  doc.moveDown(2);

  // Statistics
  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'Pendiente').length,
    inProcess: claims.filter(c => c.status === 'En proceso').length,
    resolved: claims.filter(c => c.status === 'Resuelto').length,
    rejected: claims.filter(c => c.status === 'Rechazado').length
  };

  doc.fontSize(14).text('Estadísticas:');
  doc.fontSize(10);
  doc.text(`Total de reclamos: ${stats.total}`);
  doc.text(`Pendientes: ${stats.pending}`);
  doc.text(`En proceso: ${stats.inProcess}`);
  doc.text(`Resueltos: ${stats.resolved}`);
  doc.text(`Rechazados: ${stats.rejected}`);
  doc.moveDown(2);

  // Claims table
  doc.fontSize(14).text('Detalle de Reclamos:');
  doc.moveDown();

  claims.forEach((claim, index) => {
    if (doc.y > 700) {
      doc.addPage();
    }

    doc.fontSize(10);
    doc.text(`${index + 1}. ${claim.title}`);
    doc.text(`   Descripción: ${claim.description.substring(0, 100)}...`);
    doc.text(`   Estado: ${claim.status}`);
    doc.text(`   Cliente: ${claim.user?.name || 'N/A'}`);
    doc.text(`   Empleado: ${claim.assignedTo?.name || 'No asignado'}`);
    doc.text(`   Fecha: ${claim.createdAt.toLocaleDateString('es-ES')}`);
    doc.moveDown();
  });

  doc.end();
}

module.exports = router;