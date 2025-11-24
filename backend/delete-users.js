const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const deleteUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    // Lista de emails a eliminar
    const emailsToDelete = [
      'empleado001@empleado.com',
      'carlos2309@empleado.com'
    ];

    if (emailsToDelete.length === 0) {
      console.log('No hay emails especificados para eliminar. Edita el array emailsToDelete.');
      mongoose.connection.close();
      return;
    }

    const result = await User.deleteMany({ email: { $in: emailsToDelete } });
    console.log(`Eliminados ${result.deletedCount} usuarios`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error eliminando usuarios:', error);
    mongoose.connection.close();
  }
};

deleteUsers();