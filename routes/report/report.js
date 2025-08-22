const router = require('express').Router();
const Report = require('../../models/report');
const wrapAsync = require('../../utils/wrapAsync');

// get all Report
router.get('/', wrapAsync(async (req, res) => {
    try {
        const reports = await Report.find().populate('postedBy', 'email username contact').sort({ createdAt: -1 });
        const modifiedReports = reports.map(report => {
            if (report.postedBy) {
                const { email, username, contact } = report.postedBy;
                return { ...report.toObject(), email, username, contact };
            } else {
                // Handle case where postedBy is null or undefined
                return { ...report.toObject(), email: 'N/A', username: 'N/A', contact: 'N/A' };
            }
        });
        res.json(modifiedReports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}));

// add new Report
router.post('/', wrapAsync(async (req, res) => {
    try {
        const report = new Report({
            postedBy: req.user?._id,
            name: req.user?.username || req.body.name,
            msg: req.body.msg,
            question: req.body.question
        });
        
        const newReport = await report.save();
        res.status(201).json(newReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}));

// get report by id and update isRead to true
router.get('/:id', wrapAsync(async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('postedBy', 'email username contact');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        // Update isRead to true
        report.isRead = true;
        await report.save();
        
        // Return the updated report with populated user data
        const modifiedReport = report.postedBy ? {
            ...report.toObject(),
            email: report.postedBy.email,
            username: report.postedBy.username,
            contact: report.postedBy.contact
        } : { ...report.toObject(), email: 'N/A', username: 'N/A', contact: 'N/A' };
        
        res.json(modifiedReport);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

// update report
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { 
                msg: req.body.msg,
                question: req.body.question,
                isRead: req.body.isRead
            },
            { new: true }
        ).populate('postedBy', 'email username contact');
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        
        const modifiedReport = report.postedBy ? {
            ...report.toObject(),
            email: report.postedBy.email,
            username: report.postedBy.username,
            contact: report.postedBy.contact
        } : { ...report.toObject(), email: 'N/A', username: 'N/A', contact: 'N/A' };
        
        res.json(modifiedReport);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

// mark multiple reports as read
router.patch('/mark-read', wrapAsync(async (req, res) => {
    try {
        const { reportIds } = req.body;
        
        if (!Array.isArray(reportIds) || reportIds.length === 0) {
            return res.status(400).json({ message: 'No report IDs provided' });
        }
        
        await Report.updateMany(
            { _id: { $in: reportIds } },
            { $set: { isRead: true } }
        );
        
        res.json({ message: `${reportIds.length} reports marked as read` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

// get reports statistics
router.get('/stats/overview', wrapAsync(async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        const unreadReports = await Report.countDocuments({ isRead: false });
        const readReports = await Report.countDocuments({ isRead: true });
        
        res.json({
            total: totalReports,
            unread: unreadReports,
            read: readReports
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

// delete Report
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json({ message: 'Report deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

// delete multiple reports
router.delete('/', wrapAsync(async (req, res) => {
    try {
        const { reportIds } = req.body;
        
        if (!Array.isArray(reportIds) || reportIds.length === 0) {
            return res.status(400).json({ message: 'No report IDs provided' });
        }
        
        const result = await Report.deleteMany({ _id: { $in: reportIds } });
        res.json({ message: `${result.deletedCount} reports deleted successfully` });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}));

module.exports = router;