const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const Test = require('../../models/series/test');
const Series = require('../../models/series/series');

// Get all tests for a series
router.get('/series/:seriesId', wrapAsync(async (req, res) => {
    try {
        const tests = await Test.find({ seriesId: req.params.seriesId })
            .populate('questions.questionId', 'question options correctAnswer')
            .populate('createdBy', 'username email');
        res.status(200).json(tests);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch tests" });
    }
}));

// Get single test by ID
router.get('/:id', wrapAsync(async (req, res) => {
    try {
        const test = await Test.findById(req.params.id)
            .populate('questionId', 'question options correctAnswer')
            .populate('createdBy', 'username email');
        
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch test" });
    }
}));

// Create new test
router.post('/', wrapAsync(async (req, res) => {
    try {
        const {
            seriesId,
            title,
            description,
            subjects,
            mode,
            durationMin,
            totalMarks,
            availability,
            questions,
            isPublished
        } = req.body;

        // Verify series exists
        const series = await Series.findById(seriesId);
        if (!series) {
            return res.status(404).json({ error: "Series not found" });
        }

        const test = new Test({
            seriesId,
            title,
            description,
            subjects,
            mode,
            durationMin,
            totalMarks,
            availability,
            questions,
            isPublished,
        });

        await test.save();
        res.status(201).json({ message: "Test created successfully", test });
    } catch (error) {
        res.status(500).json({ error: "Failed to create test" });
    }
}));

// Update test
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const {
            title,
            description,
            subjects,
            mode,
            durationMin,
            totalMarks,
            availability,
            questions,
            isPublished
        } = req.body;

        const test = await Test.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                subjects,
                mode,
                durationMin,
                totalMarks,
                availability,
                questions,
                isPublished
            },
            { new: true }
        );

        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        res.status(200).json({ message: "Test updated successfully", test });
    } catch (error) {
        res.status(500).json({ error: "Failed to update test" });
    }
}));

// Delete test
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const test = await Test.findByIdAndDelete(req.params.id);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        res.status(200).json({ message: "Test deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete test" });
    }
}));

// Publish/Unpublish test
router.patch('/:id/publish', wrapAsync(async (req, res) => {
    try {
        const { isPublished } = req.body;
        const test = await Test.findByIdAndUpdate(
            req.params.id,
            { isPublished },
            { new: true }
        );

        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        res.status(200).json({ 
            message: `Test ${isPublished ? 'published' : 'unpublished'} successfully`, 
            test 
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to update test status" });
    }
}));

// Get test statistics
router.get('/:id/stats', wrapAsync(async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Here you would typically get test attempt statistics
        // For now, returning basic test info
        res.status(200).json({
            testId: test._id,
            title: test.title,
            totalQuestions: test.questions.length,
            totalMarks: test.totalMarks,
            duration: test.durationMin,
            isPublished: test.isPublished,
            mode: test.mode,
            subjects: test.subjects
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch test statistics" });
    }
}));

module.exports = router;
