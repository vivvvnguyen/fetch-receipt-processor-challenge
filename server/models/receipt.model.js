// const mongoose = require('mongoose');

const items = {
    shortDescription: {
        // reference api.yml file maybe change data types and formats to match exercise
        type: String,
        required: [true, "Must enter a short description."],
        minLength: [3, "Description must contain at least 3 characters."]
    },
    price: {
        type: String,
        pattern:["^\\d+\\.\\d{2}$"],
        required: [true, "Must enter a price."],
        // min: [1, "Price must be more than 0"], 
    }
}

const receiptSchema = {
    retailer: {
        // one point for every alphanumeric character
        type: String,
        required: [true, "Please enter the name of the retailer or store than the receipt is from."],
    },
    purchaseDate : {
        type: String,
        format: Date,
        required: [true, "Please enter the date of the purchase printed on the receipt."],
    },
    purchaseTime : {
        type: String,
        format: Date,
        required: [true, "Please enter the time of the purchase printed on the receipt. 24-hour time is expected"],
    },
    items : {
        type: [items],
        required: [true, "Please enter the items purchased on the receipt."],
        minLength: [1, "There must be at least one item on the receipt."],
    },
    total: {
        type: String,
        pattern:["^\\d+\\.\\d{2}$"],
        required: [true, "Please enter the total amount paid on the receipt."],
    }
};
// module.exports = mongoose.model('receipt', receiptSchema);
module.exports = ('receipt', receiptSchema);
