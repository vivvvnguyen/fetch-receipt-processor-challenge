const receipt = require('../models/receipt.model');

module.exports = {
    create : (req, res) => {
        // request/takes in JSON receipt and res/returns JSON object with an ID
        receipt.create(req.body)
            .then(newReceipt => {res.json({id: newReceipt._id})})
                .catch(err => res.status(400).json(err));
                
    },
    findOne : (req, res) => {
        // looks up receipt by ID and returns object that specifies the points awarded
        receipt.findById(req.params.id)
            .then(oneReceipt => {
                function getAlphanumericaLength(str) {
                    const alphanumericChars = str.match(/[a-z0-9]/gi);
                    return alphanumericChars ? alphanumericChars.length : 0;
                }
                function getDateNumber (date){
                    const dateConverted = new Date(date);
                    const dayOfMonth = dateConverted.getUTCDate();
                        // .getDate() would not return correct date 
                        // UTC - universal time coordinate
                        return dayOfMonth;
                }
                function getDateTimeNumber (date, time){
                    const dateTimeConverted = new Date(date + "T" + time);
                    const dateTimeHours = dateTimeConverted.getHours();
                    return dateTimeHours;
                }
                function calculatePoints(oneReceipt){
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
                        if (oneReceipt.total % .25 === 0){
                            points += 25;
                        }
                        // console.log(points);
                    // For every 2 items on the receipt, add 5 points
                        for (var i = 2; i <= oneReceipt.items.length; i+=2){
                            points += 5;
                        }
                        // console.log(points);
                    // If the trimmed description is a multiple of 3, multiply price by 0.2 and round UP (ceiling) to the nearest integer; the result = points earned
                        for (var i = 0; i < oneReceipt.items.length; i++){
                            trimmedDescription = oneReceipt.items[i].shortDescription.trim();
                            if(trimmedDescription.length % 3 === 0){
                                points += Math.ceil(oneReceipt.items[i].price * 0.2);
                            }
                        };
                        // console.log(points);
                    // If the day in the purchase date is odd, add 6 points (create function to check the date)
                        if (getDateNumber(oneReceipt.purchaseDate) % 2 === 1){
                            points += 6;
                        }
                        console.log(points);
                    // If the time of purchase is after 2:00pm and before 4:00pm, add 10 points
                        const purchaseHour = getDateTimeNumber(oneReceipt.purchaseDate, oneReceipt.purchaseTime);
                        // console.log(purchaseHour);
                        if (purchaseHour >= 14 && purchaseHour < 16){
                            points += 10;
                        }
                        // console.log(points);
                    return points;
                }
                const pointsAwarded = calculatePoints(oneReceipt);
                res.json({points: pointsAwarded});
            })
            .catch(err => res.status(400).json(err));
    },
}