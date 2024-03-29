const { Order } = require("../models/order");
const { auth, isAdmin, isorder } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();

//GET ALL ORDERS
router.get("/", isAdmin, async(req, res) => {
    const query = req.query.new
    try {
        const orders = query ? await Order.find().sort({_id: -1}).limit(4) :
        await Order.find().sort({_id: -1})

        res.status(200).send(orders)
        
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

// UPDATE AN ORDER
router.put("/:id",isAdmin, async(req, res) => {
    try {
        const orderUpdate = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).send(orderUpdate)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});

// GET AN ORDER 
router.get("/findOne/:id", auth, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (req.user?._id !== order.userId || !req.user.isAdmin)
        return res.status(403).send("Access denied. Not authorized!!");

        res.status(200).send(order);
    } catch (err) {
        res.status(500).send(err);
        console.log(err);
    }
})

// GET Orders Stats

router.get("/stats", isAdmin, async(req, res) => {
    const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

try {
    const orders = await Order.aggregate([
        {
            $match: { createdAt: { $gte: new Date(previousMonth) } },
        },
        {
            $project: { 
                month: { $month: "$createdAt" } 
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: 1 },
            },
        },
    ])
    res.status(200).send(orders)
} catch (error) {
    console.log(error)
    res.status(500).send(error)
}
});
// GET Earnings

router.get("/income/stats", isAdmin, async(req, res) => {
    const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm:ss");

try {
    const income = await Order.aggregate([
        {
            $match: { createdAt: { $gte: new Date(previousMonth) } },
        },
        {
            $project: { 
                month: { $month: "$createdAt" }, 
                sales: "$total"
            },
        },
        {
            $group: {
                _id: "$month",
                total: { $sum: "$sales" },
            },
        },
    ])
    res.status(200).send(income)
} catch (error) {
    console.log(error)
    res.status(500).send(error)
}
});

//  GET WEEKLY SALES

router.get("/week-sales",  async(req, res) => {
    const last7Days = moment()
    .day(moment().day() - 1)
    .format("YYYY-MM-DD HH:mm:ss")
    try {
        const income = await Order.aggregate([
            {
                $match: { createdAt: { $gt: new Date(last7Days) } },
            },
            {
                $project: {  
                    day: { $dayOfWeek: "$createdAt"},
                    sales: "$total",
                },
            },
            {
                $group: {
                    _id: "$day",
                    total: { $sum: "$sale"},
                },
            }
        ])
        res.status(200).send(income)
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err)
    } 
})

module.exports = router;