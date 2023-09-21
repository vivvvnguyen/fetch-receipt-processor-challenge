const receipt = require('../models/receipt.model');
const receiptsArray = [];
const crypto = require('crypto'); 

module.exports = {
    create: (req, res) => {
        const newReceipt = {
            retailer: req.body.retailer,
            purchaseDate: req.body.purchaseDate,
            purchaseTime: req.body.purchaseTime,
            items: req.body.items,
            total: req.body.total,
        };
        receiptsArray.push(newReceipt);
        function generateNewId(){
            return crypto.randomUUID();
        }
        const newId = generateNewId();
        newReceipt.id = newId;
        res.json({ id: newReceipt.id });
    },
    findOne: (req, res) => {
        // looks up receipt by ID and returns object that specifies the points awarded
        function findReceiptById(id){
            const oneReceipt = receiptsArray.find((receipt) => receipt.id === id);
            return oneReceipt || null;
        }
        const oneReceipt = findReceiptById(req.params.id);
        if (!oneReceipt){
            res.status(404).json({error: "Receipt not found"});
        }
        function getAlphanumericaLength(str) {
            const alphanumericChars = str.match(/[a-z0-9]/gi);
            return alphanumericChars ? alphanumericChars.length : 0;
        }
        function getDateNumber(date) {
            const dateConverted = new Date(date);
            const dayOfMonth = dateConverted.getUTCDate();
            // .getDate() would not return correct date 
            // UTC - universal time coordinate
            return dayOfMonth;
        }
        function getDateTimeNumber(date, time) {
            const dateTimeConverted = new Date(date + "T" + time);
            const dateTimeHours = dateTimeConverted.getHours();
            return dateTimeHours;
        }
        function calculatePoints(oneReceipt) {
            let points = 0;
            // Add one point for every alphanumeric character in the retailer name (create function to check the string)
            points += getAlphanumericaLength(oneReceipt.retailer);
            // console.log(points);
            // If the total is a round dollar amount (no cents), add 50 points
            if (oneReceipt.total % 1 === 0) {
                points += 50;
            }
            // console.log(points);
            // If the total is a multiple of 0.25, add 25 points
            if (oneReceipt.total % .25 === 0) {
                points += 25;
            }
            // console.log(points);
            // For every 2 items on the receipt, add 5 points
            for (var i = 2; i <= oneReceipt.items.length; i += 2) {
                points += 5;
            }
            // console.log(points);
            // If the trimmed description is a multiple of 3, multiply price by 0.2 and round UP (ceiling) to the nearest integer; the result = points earned
            for (var i = 0; i < oneReceipt.items.length; i++) {
                trimmedDescription = oneReceipt.items[i].shortDescription.trim();
                if (trimmedDescription.length % 3 === 0) {
                    points += Math.ceil(oneReceipt.items[i].price * 0.2);
                }
            };
            // console.log(points);
            // If the day in the purchase date is odd, add 6 points (create function to check the date)
            if (getDateNumber(oneReceipt.purchaseDate) % 2 === 1) {
                points += 6;
            }
            // console.log(points);
            // If the time of purchase is after 2:00pm and before 4:00pm, add 10 points
            const purchaseHour = getDateTimeNumber(oneReceipt.purchaseDate, oneReceipt.purchaseTime);
            // console.log(purchaseHour);
            if (purchaseHour >= 14 && purchaseHour < 16) {
                points += 10;
            }
            // console.log(points);
            return points;
        }
        const pointsAwarded = calculatePoints(oneReceipt);
        res.json({ points: pointsAwarded });
    },
}