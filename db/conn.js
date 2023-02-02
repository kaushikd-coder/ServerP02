const mongoose = require('mongoose');

const DB = process.env.DATABASE

mongoose.set('strictQuery', false);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useNewUrlParser: true,
}).then(() =>  console.log("Database Connected"))
.catch((err) => console.log(err));

