const receiptController = require("../controllers/receipt.controllers");

module.exports = app => {
    app.post('/receipts/process', receiptController.create);
    app.get('/receipts/:id/points', receiptController.findOne);
}