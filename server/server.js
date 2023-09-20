const express = require("express");
const cors = require("cors");
const port = 8000;
const app = express();
app.use(express.json(), express.urlencoded({extended:true}), cors());

require("./config/mongoose.config");
require("./routes/receipt.routes")(app);

app.listen(port, () => console.log(`Listening on port: ${port}`));