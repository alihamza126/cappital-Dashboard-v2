const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const Enrollment = require('../../models/series/enrollments');
const Series = require('../../models/series/series');
const Payment = require('../../models/series/orders');
const User = require('../../models/user');

// Get all enrollments
router.get('/all', wrapAsync(async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('userId', 'username email')
            .populate('seriesId', 'title slug')
            // .populate('sourceOrderId', 'amount status');
        res.status(200).json(enrollments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch enrollments" });
    }
}));

// Get enrollments for a specific series
router.get('/series/:seriesId', wrapAsync(async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ seriesId: req.params.seriesId })
            .populate('userId', 'username email')
            .populate('sourceOrderId', 'amount status');
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch enrollments" });
    }
}));

// Get enrollments for a specific user
router.get('/user/:userId', wrapAsync(async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.params.userId })
            .populate('seriesId', 'title slug coverImageUrl')
            .populate('sourceOrderId', 'amount status');
        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch enrollments" });
    }
}));

// Create new enrollment
router.post('/', wrapAsync(async (req, res) => {
    try {
        const {
            userId,
            seriesId,
            activatedAt,
            expiresAt,
            sourceOrderId
        } = req.body;
        console.log(req.body);

        // Check if user is already enrolled in this series
        const existingEnrollment = await Enrollment.findOne({ userId, seriesId });
        if (existingEnrollment) {
            return res.status(400).json({ error: "User is already enrolled in this series" });
        }

        // Verify series exists
        const series = await Series.findById(seriesId);
        if (!series) {
            return res.status(404).json({ error: "Series not found" });
        }

        const enrollment = new Enrollment({
            userId,
            seriesId,
            activatedAt: activatedAt || new Date(),
            expiresAt,
            sourceOrderId
        });

        await enrollment.save();
        res.status(201).json({ message: "Enrollment created successfully", enrollment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create enrollment" });
    }
}));

// Update enrollment
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const {
            activatedAt,
            expiresAt,
            progress
        } = req.body;

        const enrollment = await Enrollment.findByIdAndUpdate(
            req.params.id,
            {
                activatedAt,
                expiresAt,
                progress
            },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        res.status(200).json({ message: "Enrollment updated successfully", enrollment });
    } catch (error) {
        res.status(500).json({ error: "Failed to update enrollment" });
    }
}));

// Delete enrollment
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        res.status(200).json({ message: "Enrollment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete enrollment" });
    }
}));

// Get enrollment statistics
router.get('/stats/overview', wrapAsync(async (req, res) => {
    try {
        const [totalEnrollments, activeEnrollments, expiredEnrollments] = await Promise.all([
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ 
                $or: [
                    { expiresAt: { $exists: false } },
                    { expiresAt: { $gt: new Date() } }
                ]
            }),
            Enrollment.countDocuments({ expiresAt: { $lt: new Date() } })
        ]);

        res.status(200).json({
            totalEnrollments,
            activeEnrollments,
            expiredEnrollments
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch enrollment statistics" });
    }
}));

module.exports = router;
