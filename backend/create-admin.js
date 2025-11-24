const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    // Crear Admin
    const adminEmail = 'admin001@admin.com';
    const adminPassword = 'admin';

    let existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new User({
        name: 'Administrador Sistema',
        email: adminEmail,
        password: hashedPassword,
        role: 'Administrador',
        isActive: true
      });

      await admin.save();
      console.log('Administrador creado exitosamente');
      console.log('Email: admin001@admin.com');
      console.log('Contraseña: admin');
    } else {
      console.log('El administrador ya existe');
    }

    // Crear Empleado
    const employeeEmail = 'carlos2309@empleado.com';
    const employeePassword = 'empleado';

    let existingEmployee = await User.findOne({ email: employeeEmail });
    if (!existingEmployee) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(employeePassword, salt);

      const employee = new User({
        name: 'Empleado Sistema',
        email: employeeEmail,
        password: hashedPassword,
        role: 'Empleado',
        isActive: true
      });

      await employee.save();
      console.log('Empleado creado exitosamente');
      console.log('Email: carlos2309@empleado.com');
      console.log('Contraseña: empleado');
    } else {
      console.log('El empleado ya existe');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error creando usuarios:', error);
    mongoose.connection.close();
  }
};

createUsers();