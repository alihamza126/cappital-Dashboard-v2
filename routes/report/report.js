const router = require('express').Router();
const Report = require('../../models/report');
const wrapAsync = require('../../utils/wrapAsync');


// get all Report
router.get('/',wrapAsync(async (req, res) => {
    try {
        const reports = await Report.find().populate('postedBy', 'email username contact');
        const modifiedReports = reports.map(report => {
            const { email, username, contact } = report.postedBy;
            return { ...report.toObject(), email, username, contact };
        });
        res.json(modifiedReports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
    
}))

//add new Report
router.post('/',wrapAsync(async (req, res) => {
    const report = new Report({
        postedBy:req.user._id,
        name: req.user.username,
        msg: req.body.msg,
        question: req.body.question
    });
    try {
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}));

//get report by id and update isRead to true
router.get('/:id',wrapAsync(async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        report.isRead = true; // Set isRead to true
        await report.save(); // Save the updated report
        res.json(report);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

//delete Report
router.delete('/:id',wrapAsync(async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json({ message: 'Report deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

module.exports = router;