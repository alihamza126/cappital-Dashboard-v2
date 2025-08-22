const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const SeriesMCQ = require('../../models/series/seriesMcq');
const Test = require('../../models/series/test');
const Series = require('../../models/series/series');

// Get all MCQs for a series
router.get('/series/:seriesId', wrapAsync(async (req, res) => {
    try {
        const { page = 1, limit = 200, subject, chapter, topic, difficulty, testId } = req.query;
        
        let query = { seriesId: req.params.seriesId };
        
        // Apply filters
        if (subject) {
            // Handle subject filtering for arrays
            if (Array.isArray(subject)) {
                query.subject = { $in: subject };
            } else {
                query.subject = subject;
            }
        }
        if (chapter) query.chapter = { $regex: chapter, $options: 'i' };
        if (topic) query.topic = { $regex: topic, $options: 'i' };
        if (difficulty) query.difficulty = difficulty;
        
        // If testId is provided, filter MCQs that are assigned to this test
        if (testId) {
            // Find the test and get its question IDs
            const test = await Test.findById(testId);
            if (test) {
                const questionIds = test.questions.map(q => q.questionId);
                query._id = { $in: questionIds };
            }
        }
        
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

// Get all MCQs for a specific test (using the Test's questions array)
router.get('/test/:testId', wrapAsync(async (req, res) => {
    try {
        const { page = 1, limit = 200, subject, chapter, topic, difficulty } = req.query;
        
        // Find the test and get its question IDs
        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }
        
        const questionIds = test.questions.map(q => q.questionId);
        
        let query = { _id: { $in: questionIds } };
        
        // Apply filters
        if (subject) {
            if (Array.isArray(subject)) {
                query.subject = { $in: subject };
            } else {
                query.subject = subject;
            }
        }
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
            questionImg,
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

        // Normalize subjects to lowercase and validate
        const validSubjects = ['physics', 'chemistry', 'biology', 'english', 'mathematics', 'logic', 'others'];
        
        // Ensure subject is always an array
        let subjectArray = subject;
        if (!Array.isArray(subject)) {
            subjectArray = [subject];
        }
        
        // Validate and normalize each subject
        const normalizedSubjects = subjectArray.map(s => {
            if (typeof s !== 'string') {
                throw new Error(`Invalid subject type: ${typeof s}. Subject must be a string.`);
            }
            const normalized = s.toLowerCase();
            if (!validSubjects.includes(normalized)) {
                throw new Error(`Invalid subject: ${s}. Valid subjects are: ${validSubjects.join(', ')}`);
            }
            return normalized;
        });

        const mcq = new SeriesMCQ({
            question,
            options,
            correctOption,
            subject: normalizedSubjects,
            chapter,
            topic,
            difficulty: difficulty || 'easy',
            category: category || 'normal',
            course: course || 'mdcat',
            info: info || '',
            explain: explain || '',
            imageUrl: imageUrl || '',
            questionImg: questionImg || '',
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
        const mcq = await SeriesMCQ.findById(req.params.id);
        if (!mcq) {
            return res.status(404).json({ error: "MCQ not found" });
        }

        // Update fields
        Object.assign(mcq, req.body);
        await mcq.save();

        const updatedMcq = await SeriesMCQ.findById(mcq._id)
            .populate('testId', 'title')
            .populate('createdBy', 'username');

        res.status(200).json({ message: "MCQ updated successfully", mcq: updatedMcq });
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

// Bulk assign MCQs to test
router.post('/assign', wrapAsync(async (req, res) => {
    try {
        const { mcqIds, testId } = req.body;

        if (!Array.isArray(mcqIds) || mcqIds.length === 0) {
            return res.status(400).json({ error: "No MCQs selected" });
        }

        // Verify test exists
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Get existing question IDs in the test to avoid duplicates
        const existingQuestionIds = test.questions.map(q => q.questionId.toString());

        // Filter out MCQs that are already in the test
        const newMcqIds = mcqIds.filter(mcqId => !existingQuestionIds.includes(mcqId));

        if (newMcqIds.length === 0) {
            return res.status(400).json({ error: "All selected MCQs are already assigned to this test" });
        }

        // Add new MCQs to test's questions array
        const newQuestions = newMcqIds.map(mcqId => ({
            questionId: mcqId,
            marks: 1 // Default marks
        }));

        test.questions.push(...newQuestions);
        await test.save();

        // Note: We don't update the testId field in SeriesMCQ anymore
        // since MCQs can be assigned to multiple tests through the Test's questions array
        // The testId field in SeriesMCQ is kept for backward compatibility
        // but the primary relationship is now through the Test's questions array

        res.status(200).json({ 
            message: `${newMcqIds.length} MCQs assigned successfully to test`,
            addedCount: newMcqIds.length,
            totalQuestions: test.questions.length
        });
    } catch (error) {
        console.log('Error assigning MCQs:', error);
        res.status(500).json({ error: "Failed to assign MCQs" });
    }
}));

// Remove MCQs from test
router.delete('/test/:testId/mcqs', wrapAsync(async (req, res) => {
    try {
        const { mcqIds } = req.body;
        const { testId } = req.params;

        if (!Array.isArray(mcqIds) || mcqIds.length === 0) {
            return res.status(400).json({ error: "No MCQs selected for removal" });
        }

        // Verify test exists
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Remove MCQs from test's questions array
        const initialCount = test.questions.length;
        test.questions = test.questions.filter(q => !mcqIds.includes(q.questionId.toString()));
        await test.save();

        const removedCount = initialCount - test.questions.length;

        // Note: We don't update the testId field in SeriesMCQ anymore
        // since MCQs can be assigned to multiple tests through the Test's questions array
        // The testId field in SeriesMCQ is kept for backward compatibility
        // but the primary relationship is now through the Test's questions array

        res.status(200).json({ 
            message: `${removedCount} MCQs removed from test`,
            removedCount,
            totalQuestions: test.questions.length
        });
    } catch (error) {
        console.log('Error removing MCQs from test:', error);
        res.status(500).json({ error: "Failed to remove MCQs from test" });
    }
}));

module.exports = router;