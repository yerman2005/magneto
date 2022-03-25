const mongoose = require('mongoose');

const dbConnection = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Base de datos conectada.');
    }catch(error){
        console.error(error);
        throw new Error('Error al conectarme con la base de datos.');
    }
}

module.exports = { dbConnection }