const mongoose = require('mongoose');
//This will create a database if the one named doesn't already exist
mongoose.connect("mongodb://127.0.0.1/receipt_processor_challenge", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));