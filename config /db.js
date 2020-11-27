const mongoose = require('mongoose');

const connectDB = async () => {
   const conn = await mongoose.connect('mongodb+srv://el123:el123@clientmanager.6apat.mongodb.net/client?retryWrites=true&w=majority', {
       useNewUrlParser: true,
       useCreateIndex: true,
       useFindAndModify: false,
       useUnifiedTopology: true
   });

   console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;
