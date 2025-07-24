const mongoose = require('mongoose');
const wrapAsync = require('../../utils/wrapAsync.js');
const Purchase = require('../../models/purchase.js');
const Earnings = require('../../models/earning.js');
const router = require('express').Router();



//get all purchases for admin panel

router.get('/', wrapAsync(async (req, res, next) => {
    // Define promises for aggregation queries
    const simpleDatePromise = Purchase.aggregate([
        {
            $group: {
                _id: {
                    status: "$status",
                    course: "$course"
                },
                totalAmount: { $sum: "$price" },
                purchases: { $push: "$$ROOT" } // Store the entire purchase document for each group
            }
        },
        {
            $project: {
                _id: 0, // Exclude the default MongoDB _id field from the output
                status: "$_id.status",
                course: "$_id.course",
                totalAmount: 1,
                purchases: 1
            }
        }
    ]).exec();

    const today = new Date();
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    const lastYearStart = new Date();
    lastYearStart.setDate(today.getDate() - 365); // Previous 365 days

    const lastMonthEarningsPromise = Earnings.aggregate([
        {
            $match: {
                date: {
                    $gte: lastMonthStart,
                    $lt: today
                }
            }
        },
        {
            $group: {
                _id: "$course",
                lastMonthPrice: { $sum: "$price" }
            }
        }
    ]).exec();

    const lastYearEarningsPromise = Earnings.aggregate([
        {
            $match: {
                date: {
                    $gte: lastYearStart,
                    $lt: today
                }
            }
        },
        {
            $group: {
                _id: "$course",
                lastYearPrice: { $sum: "$price" }
            }
        }
    ]).exec();

    const totalEarningsPromise = Earnings.aggregate([
        {
            $group: {
                _id: "$course",
                totalEarnings: { $sum: "$price" }
            }
        }
    ]).exec();

    // Wait for all promises to resolve
    const [simpleDate, lastMonthEarnings, lastYearEarnings ,totalEarnings] = await Promise.all([simpleDatePromise, lastMonthEarningsPromise, lastYearEarningsPromise,totalEarningsPromise]);
    const earnings = {
        simpleDate,
        lastMonth: lastMonthEarnings,
        lastYear: lastYearEarnings,
        totalEarning: totalEarnings
    };
    res.status(200).send(earnings);
}));





module.exports = router;