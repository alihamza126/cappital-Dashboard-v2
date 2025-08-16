const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const Series = require('../../models/series/series');
const Test = require('../../models/series/test');
const Enrollment = require('../../models/series/enrollments');
const Payment = require('../../models/series/orders');

// Get all series
router.get('/all', wrapAsync(async (req, res) => {
    try {
        const series = await Series.find().populate('createdBy', 'username email');
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch series" });
    }
}));

// Get single series by ID
router.get('/:id', wrapAsync(async (req, res) => {
    try {
        const series = await Series.findById(req.params.id).populate('createdBy', 'username email');
        if (!series) {
            return res.status(404).json({ error: "Series not found" });
        }
        res.status(200).json(series);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch series" });
    }
}));

// Create new series
router.post('/', wrapAsync(async (req, res) => {
    try {
        const {
            slug,
            title,
            coverImageUrl,
            description,
            subjects,
            difficulty,
            price,
            originalPrice,
            tags,
            totalTests,
            totalDurationMin,
            expiresAt
        } = req.body;

        // Check if series with same slug already exists
        const existingSeries = await Series.findOne({ slug });
        if (existingSeries) {
            return res.status(400).json({ error: "Series with this slug already exists" });
        }

        const series = new Series({
            slug,
            title,
            coverImageUrl,
            description,
            subjects,
            difficulty,
            price,
            originalPrice,
            tags,
            totalTests,
            totalDurationMin,
            expiresAt,
        });

        await series.save();
        res.status(201).json({ message: "Series created successfully", series });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create series" });
    }
}));

// Update series
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const {
            slug,
            title,
            coverImageUrl,
            description,
            subjects,
            difficulty,
            price,
            originalPrice,
            isActive,
            tags,
            totalTests,
            totalDurationMin,
            expiresAt
        } = req.body;

        // Check if slug is being changed and if it already exists
        if (slug) {
            const existingSeries = await Series.findOne({ slug, _id: { $ne: req.params.id } });
            if (existingSeries) {
                return res.status(400).json({ error: "Series with this slug already exists" });
            }
        }

        const series = await Series.findByIdAndUpdate(
            req.params.id,
            {
                slug,
                title,
                coverImageUrl,
                description,
                subjects,
                difficulty,
                price,
                originalPrice,
                isActive,
                tags,
                totalTests,
                totalDurationMin,
                expiresAt
            },
            { new: true }
        );

        if (!series) {
            return res.status(404).json({ error: "Series not found" });
        }

        res.status(200).json({ message: "Series updated successfully", series });
    } catch (error) {
        res.status(500).json({ error: "Failed to update series" });
    }
}));

// Delete series
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const series = await Series.findByIdAndDelete(req.params.id);
        if (!series) {
            return res.status(404).json({ error: "Series not found" });
        }

        // Also delete related tests, enrollments, and payments
        await Test.deleteMany({ seriesId: req.params.id });
        await Enrollment.deleteMany({ seriesId: req.params.id });
        await Payment.deleteMany({ seriesId: req.params.id });

        res.status(200).json({ message: "Series deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete series" });
    }
}));

// Get series statistics
router.get('/:id/stats', wrapAsync(async (req, res) => {
    try {
        const seriesId = req.params.id;
        
        const [enrollments, payments, tests] = await Promise.all([
            Enrollment.find({ seriesId }),
            Payment.find({ seriesId }),
            Test.find({ seriesId })
        ]);

        const totalEnrollments = enrollments.length;
        const totalRevenue = payments
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0);
        const totalTests = tests.length;
        const activeEnrollments = enrollments.filter(e => !e.expiresAt || e.expiresAt > new Date()).length;

        res.status(200).json({
            totalEnrollments,
            totalRevenue,
            totalTests,
            activeEnrollments,
            enrollmentData: enrollments,
            paymentData: payments
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch series statistics" });
    }
}));

module.exports = router;
