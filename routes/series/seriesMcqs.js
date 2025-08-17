const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const SeriesMCQ = require('../../models/series/seriesMcq');
const Test = require('../../models/series/test');
const Series = require('../../models/series/series');

// Get all MCQs for a series
router.get('/series/:seriesId', wrapAsync(async (req, res) => {
    try {
        const { page = 1, limit = 10, subject, chapter, topic, difficulty } = req.query;
        
        let query = { seriesId: req.params.seriesId };
        
        // Apply filters
        if (subject) query.subject = subject;
        if (chapter) query.chapter = { $regex: chapter, $options: 'i' };
        if (topic) query.topic = { $regex: topic, $options: 'i' };
        if (difficulty) query.difficulty = difficulty;
        
        const skip = (page - 1) * limit;
        
        const mcqs = await SeriesMCQ.find(query)
            .populate('testId', 'title')
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await SeriesMCQ.countDocuments(query);
        
        res.status(200).json({
            mcqs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.log('Error fetching series MCQs:', error);
        res.status(500).json({ error: "Failed to fetch MCQs" });
    }
}));

// Get all MCQs for a specific test
router.get('/test/:testId', wrapAsync(async (req, res) => {
    try {
        const mcqs = await SeriesMCQ.find({ testId: req.params.testId })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 });
            
        res.status(200).json(mcqs);
    } catch (error) {
        console.log('Error fetching test MCQs:', error);
        res.status(500).json({ error: "Failed to fetch MCQs" });
    }
}));

// Get single MCQ
router.get('/:id', wrapAsync(async (req, res) => {
    try {
        const mcq = await SeriesMCQ.findById(req.params.id)
            .populate('testId', 'title')
            .populate('createdBy', 'username');
            
        if (!mcq) {
            return res.status(404).json({ error: "MCQ not found" });
        }
        
        res.status(200).json(mcq);
    } catch (error) {
        console.log('Error fetching MCQ:', error);
        res.status(500).json({ error: "Failed to fetch MCQ" });
    }
}));

// Create new MCQ
router.post('/', wrapAsync(async (req, res) => {
    try {
        const {
            question,
            options,
            correctOption,
            subject,
            chapter,
            topic,
            difficulty,
            category,
            course,
            info,
            explain,
            imageUrl,
            seriesId,
            testId
        } = req.body;

        // Verify series exists
        const series = await Series.findById(seriesId);
        if (!series) {
            return res.status(404).json({ error: "Series not found" });
        }

        // Verify test exists if testId is provided
        if (testId) {
            const test = await Test.findById(testId);
            if (!test) {
                return res.status(404).json({ error: "Test not found" });
            }
        }

        // Normalize subject to lowercase
        const normalizedSubject = subject.toLowerCase();
        const validSubjects = ['physics', 'chemistry', 'biology', 'english', 'mathematics', 'logic', 'others'];
        if (!validSubjects.includes(normalizedSubject)) {
            return res.status(400).json({ error: `Invalid subject: ${subject}. Valid subjects are: ${validSubjects.join(', ')}` });
        }

        const mcq = new SeriesMCQ({
            question,
            options,
            correctOption,
            subject: normalizedSubject,
            chapter,
            topic,
            difficulty: difficulty || 'easy',
            category: category || 'normal',
            course: course || 'mdcat',
            info: info || '',
            explain: explain || '',
            imageUrl: imageUrl || '',
            seriesId,
            testId,
            createdBy: req.user?._id
        });

        await mcq.save();
        
        const populatedMcq = await SeriesMCQ.findById(mcq._id)
            .populate('testId', 'title')
            .populate('createdBy', 'username');
            
        res.status(201).json({ message: "MCQ created successfully", mcq: populatedMcq });
    } catch (error) {
        console.log('Error creating MCQ:', error);
        res.status(500).json({ error: "Failed to create MCQ" });
    }
}));

// Update MCQ
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const {
            question,
            options,
            correctOption,
            subject,
            chapter,
            topic,
            difficulty,
            category,
            course,
            info,
            explain,
            imageUrl,
            testId
        } = req.body;

        // Verify test exists if testId is provided
        if (testId) {
            const test = await Test.findById(testId);
            if (!test) {
                return res.status(404).json({ error: "Test not found" });
            }
        }

        // Normalize subject to lowercase
        const normalizedSubject = subject.toLowerCase();
        const validSubjects = ['physics', 'chemistry', 'biology', 'english', 'mathematics', 'logic', 'others'];
        if (!validSubjects.includes(normalizedSubject)) {
            return res.status(400).json({ error: `Invalid subject: ${subject}. Valid subjects are: ${validSubjects.join(', ')}` });
        }

        const mcq = await SeriesMCQ.findByIdAndUpdate(
            req.params.id,
            {
                question,
                options,
                correctOption,
                subject: normalizedSubject,
                chapter,
                topic,
                difficulty,
                category,
                course,
                info,
                explain,
                imageUrl,
                testId
            },
            { new: true }
        ).populate('testId', 'title')
         .populate('createdBy', 'username');

        if (!mcq) {
            return res.status(404).json({ error: "MCQ not found" });
        }

        res.status(200).json({ message: "MCQ updated successfully", mcq });
    } catch (error) {
        console.log('Error updating MCQ:', error);
        res.status(500).json({ error: "Failed to update MCQ" });
    }
}));

// Delete MCQ
router.delete('/:id', wrapAsync(async (req, res) => {
    try {
        const mcq = await SeriesMCQ.findByIdAndDelete(req.params.id);
        if (!mcq) {
            return res.status(404).json({ error: "MCQ not found" });
        }

        res.status(200).json({ message: "MCQ deleted successfully" });
    } catch (error) {
        console.log('Error deleting MCQ:', error);
        res.status(500).json({ error: "Failed to delete MCQ" });
    }
}));

// Get MCQ statistics for a series
router.get('/series/:seriesId/stats', wrapAsync(async (req, res) => {
    try {
        const totalMcqs = await SeriesMCQ.countDocuments({ seriesId: req.params.seriesId });
        
        const subjectStats = await SeriesMCQ.aggregate([
            { $match: { seriesId: mongoose.Types.ObjectId(req.params.seriesId) } },
            { $group: { _id: '$subject', count: { $sum: 1 } } }
        ]);
        
        const difficultyStats = await SeriesMCQ.aggregate([
            { $match: { seriesId: mongoose.Types.ObjectId(req.params.seriesId) } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            totalMcqs,
            subjectStats,
            difficultyStats
        });
    } catch (error) {
        console.log('Error fetching MCQ stats:', error);
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
}));

module.exports = router;
