const mongoose = require('mongoose');
const wrapAsync = require('../../utils/wrapAsync.js');
const MCQ = require('../../models/mcq.js');
const userModel = require('../../models/user.js');
const { isBuyCourse, checkTrialStatus } = require('../../utils/middleware.js');
const router = require('express').Router();



// Add all MCQs
router.post('/add', (req, res) => {
    const mcq = new MCQ(req.body);
    mcq.save().then(() => {
        res.send(mcq);
    }).catch((err) => {
        res.send(err);
    })
});


router.post('/get', checkTrialStatus, wrapAsync(async (req, res) => {
    const course = req.body.course?.trim();
    const subject = req.body.subject?.trim();
    const chapter = req.body.chapter?.trim();
    const topic = req.body.topic?.trim();
    const category = req.body.catagory?.trim(); // past, normal, solved, unsolved
    const userId = req.body?.userId;

    const isTrialActive = req?.user?.isTrialActive;
    const isNums = req?.user?.isNums;
    const isMdcat = req?.user?.isMdcat;


    let limit = 100;
    if (isTrialActive && !isNums && !isMdcat) {
        limit = 5;
    }


    try {
        let mcqs = [];

        if (subject !== 'mock') {
            let queryCriteria = { course, subject, chapter };
            if (subject !== 'english' && subject !== 'logic') {
                queryCriteria.topic = topic;
            }
            try {
                let mcqs;
                let pipeline = [
                    { $match: queryCriteria },
                    { $sample: { size: limit } } // Sample 'limit' number of documents randomly
                ];
                if (category === 'past') {
                    pipeline.unshift({ $match: { ...queryCriteria, category: category } });
                } else if (category === 'unsolved') {
                    const userSolvedMCQs = await userModel.findById(userId).select(['solved_mcqs', 'wrong_mcqs']);
                    const solvedMCQIds = userSolvedMCQs.solved_mcqs;
                    const wrongMCQIds = userSolvedMCQs.wrong_mcqs;
                    pipeline.unshift({ $match: { ...queryCriteria, _id: { $nin: [...solvedMCQIds, ...wrongMCQIds] } } });
                } else if (category === 'solved') {
                    const userSolvedId = await userModel.findById(userId).select('solved_mcqs');
                    pipeline.unshift({ $match: { ...queryCriteria, _id: { $in: userSolvedId.solved_mcqs } } });
                } else if (category === 'wrong') {
                    const userWrongId = await userModel.findById(userId).select('wrong_mcqs');
                    pipeline.unshift({ $match: { ...queryCriteria, _id: { $in: userWrongId.wrong_mcqs } } });
                } else if (category === 'all') {
                    // No additional match needed, the pipeline already handles this
                }
                mcqs = await MCQ.aggregate(pipeline);
                return res.json(mcqs);
            } catch (error) {
                return res.status(500).json({ message: 'An error occurred while retrieving MCQs', error });
            }
        }

        //for mock test
        else if (subject === 'mock') {
            let queryCriteria = { course };
            const sampleSizes = {
                biology: 68,
                chemistry: 54,
                physics: 54,
                english: 18,
                logic: 6
            };

            try {
                for (const [subject, size] of Object.entries(sampleSizes)) {
                    const subjectMCQs = await MCQ.aggregate([
                        { $match: { ...queryCriteria, subject } },
                        { $sample: { size } }
                    ]);
                    mcqs.push(...subjectMCQs);
                }
                return res.status(200).json(mcqs);
            } catch (error) {
                return res.status(500).json({ error: 'Failed to fetch MCQs', details: error });
            }
        }


        res.json(mcqs);
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
}));


//delete mcqs data form model database
router.delete('/delete', wrapAsync(async (req, res) => {
    const ids = req.body.ids; // Assuming the request body contains an array of IDs
    if (!Array.isArray(ids)) {
        return res.status(400).json({ message: 'Invalid input: ids should be an array' });
    }
    try {
        const result = await MCQ.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No MCQs found to delete' });
        }
        res.json({ message: `${result.deletedCount} MCQs deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}));

//update mcq data
router.put('/update', wrapAsync(async (req, res) => {
    try {
        await MCQ.findByIdAndUpdate(req.body.id,
            {
                question: req.body.formData.question,
                options: req.body.formData.options,
                correctOption: req.body.formData.correctOption,
                difficulty: req.body.formData.difficulty,
                subject: req.body.formData.subject,
                chapter: req.body.formData.chapter,
                category: req.body.formData.category,
                topic: req.body.formData.topic,
                course: req.body.formData.course,
                info: req.body.formData.info,
                explain: req.body.formData.explain,
                imageUrl: req.body.formData.imageUrl,
                isSeries: req.body.formData.isSeries,
                seriesId: req.body.formData.seriesId,
            },
        )
        res.send("updated");
    } catch (error) {
        res.send(error)
    }
}));

//get pages mcqs
router.get('/pages', wrapAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 500;
    try {
        const mcqs = await MCQ.find()
            .sort({ subject: 1 })  // Static sort order: descending by createdAt
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCount = await MCQ.countDocuments();
        res.json({
            mcqs,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}));

// Admin endpoint to get all MCQs for management
router.get('/admin/all', wrapAsync(async (req, res) => {
    try {
        const mcqs = await MCQ.find().sort({ createdAt: -1 });
        res.json(mcqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}));

//get specifc search mcqs
router.get('/search', wrapAsync(async (req, res) => {
    const question = req.query.question;
    try {
        // Use a regular expression to match the question partially
        const mcqs = await MCQ.find({ question: { $regex: question, $options: 'i' } });
        res.json({ mcqs });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}));



router.put('/solved', wrapAsync(async (req, res) => {
    const correctMcqIds = req.body?.correctMcq || [];
    const wrongMcqIds = req.body?.wrongMcq || [];
    const userId = req.body?.userId;

    if (userId) {
        try {
            // First update: Pull correct MCQs from wrong_mcqs and wrong MCQs from solved_mcqs arrays
            const pullResult = await userModel.updateOne(
                { _id: userId },
                {
                    $pull: {
                        wrong_mcqs: { $in: correctMcqIds },
                        solved_mcqs: { $in: wrongMcqIds }
                    }
                }
            );

            if (pullResult.matchedCount === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Second update: Add correct MCQs to solved_mcqs and wrong MCQs to wrong_mcqs
            const addToSetResult = await userModel.updateOne(
                { _id: userId },
                {
                    $addToSet: {
                        solved_mcqs: { $each: correctMcqIds },
                        wrong_mcqs: { $each: wrongMcqIds }
                    }
                }
            );

            if (addToSetResult.nModified === 0) {
                return res.status(404).json({ message: 'No changes made' });
            }

            res.json(addToSetResult);
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error', error: err });
        }
    } else {
        res.status(401).json({ message: 'User Id validation Failed' });
    }
}));

//
router.post('/cout', wrapAsync(async (req, res) => {
    try {
        const course = req.body.course?.trim();
        const subject = req.body.subject?.trim();
        const chapter = req.body.chapter?.trim();
        const category = req.body.catagory?.trim(); // past, normal, solved, unsolved
        const userId = req.body?.userId; // userId
        const topics = req.body?.topic; // array of topics

        let matchCriteria = {
            course: course,
            subject: subject,
            chapter: chapter,
        };

        // Only add the topics condition if the subject is not 'english' or 'logic'
        if (subject !== 'mock') {
            if (subject !== 'english' && subject !== 'logic') {
                matchCriteria.topic = {
                    $in: topics
                };
            }

            // Add category condition based on category type
            if (category === "past") {
                matchCriteria.category = category;

            } else if (category === "solved") {
                const userSolvedMCQs = await userModel.findById(userId).select('solved_mcqs');
                const solvedMCQIds = userSolvedMCQs.solved_mcqs;
                // Add condition to match only solved MCQs
                matchCriteria._id = { $in: solvedMCQIds };

            } else if (category === "unsolved") {
                const userSolvedMCQs = await userModel.findById(userId).select(['solved_mcqs', 'wrong_mcqs']);
                const solvedMCQIds = userSolvedMCQs.solved_mcqs;
                const wrongMCQIds = userSolvedMCQs.wrong_mcqs;
                // Add condition to exclude solved MCQs
                matchCriteria._id = { $nin: [...solvedMCQIds, ...wrongMCQIds] };
            }
            else if (category === "wrong") {
                const userWrongMCQs = await userModel.findById(userId).select('wrong_mcqs');
                const wrongMCQIds = userWrongMCQs.wrong_mcqs;
                // Add condition to exclude solved MCQs
                matchCriteria._id = { $in: wrongMCQIds };
            }
            else if (category === "all") {
                // const userWrongMCQs = await userModel.findById(userId).select('wrong_mcqs');
                // const wrongMCQIds = userWrongMCQs.wrong_mcqs;
                // // Add condition to exclude solved MCQs
                // matchCriteria._id = { $in: wrongMCQIds };
            }
        }

        // ================================To check mock counts ==============
        else if (subject === 'mock') {
            matchCriteria = {
                course: course,
            }

            if (category === "past") {
                matchCriteria.category = category;

            } else if (category === "solved") {
                const userSolvedMCQs = await userModel.findById(userId).select('solved_mcqs');
                const solvedMCQIds = userSolvedMCQs.solved_mcqs;
                // Add condition to match only solved MCQs
                matchCriteria._id = { $in: solvedMCQIds };
            } else if (category === "unsolved") {
                const userSolvedMCQs = await userModel.findById(userId).select(['solved_mcqs', 'wrong_mcqs']);
                const solvedMCQIds = userSolvedMCQs.solved_mcqs;
                const wrongMCQIds = userSolvedMCQs.wrong_mcqs;
                // Add condition to exclude solved MCQs
                matchCriteria._id = { $nin: [...solvedMCQIds, ...wrongMCQIds] };
            } else if (category === "wrong") {
                const userWrongMCQs = await userModel.findById(userId).select('wrong_mcqs');
                const wrongMCQIds = userWrongMCQs.wrong_mcqs;
                // Add condition to exclude solved MCQs
                matchCriteria._id = { $in: wrongMCQIds };
            } else if (category === "all") {
                //do nothing here
            }

        }


        // ==================Aggerate counts==================
        // Aggregate data from MCQ collection
        const data = await MCQ.aggregate([
            {
                $match: matchCriteria
            },
            {
                $group: {
                    _id: subject !== 'english' && subject !== 'logic' ? "$topic" : null,
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert aggregated data to a dictionary for easier lookup
        const topicCounts = data.reduce((acc, item) => {
            if (subject !== 'english' && subject !== 'logic') {
                acc[item._id] = item.count;
            } else {
                acc.total = (acc.total || 0) + item.count;
            }
            return acc;
        }, {});

        // Prepare the final result ensuring all topics are included
        const result = subject !== 'english' && subject !== 'logic'
            ? topics.map(topic => ({
                topic,
                count: topicCounts[topic] || 0
            }))
            : [{ subject, count: topicCounts.total || 0 }];

        res.json(result);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}));


// ===============================stats====================
router.post('/stats', wrapAsync(async (req, res) => {
    const userId = req.body?.userId;

    try {
        // Fetch user's solved and wrong MCQs
        const user = await userModel.findById(userId).select('solved_mcqs wrong_mcqs');
        const solvedMCQIds = user.solved_mcqs;
        const wrongMCQIds = user.wrong_mcqs;

        // Calculate lengths
        const solvedLength = solvedMCQIds.length;
        const wrongLength = wrongMCQIds.length;

        // Aggregate unique subjects and their counts from solved MCQs
        const solvedSubjectCounts = await MCQ.aggregate([
            { $match: { _id: { $in: solvedMCQIds } } },
            { $group: { _id: "$subject", count: { $sum: 1 } } }
        ]);

        // Aggregate unique subjects and their counts from wrong MCQs
        const wrongSubjectCounts = await MCQ.aggregate([
            { $match: { _id: { $in: wrongMCQIds } } },
            { $group: { _id: "$subject", count: { $sum: 1 } } }
        ]);

        // Aggregate the total count of MCQs per subject
        const totalSubjectCounts = await MCQ.aggregate([
            { $group: { _id: "$subject", totalCount: { $sum: 1 } } }
        ]);

        // Merge the counts into a single object for each subject
        const subjectCounts = {};

        // Initialize subject counts with total MCQ counts
        totalSubjectCounts.forEach(({ _id, totalCount }) => {
            subjectCounts[_id] = { subject: _id, correctCount: 0, wrongCount: 0, totalCount };
        });

        // Add correct counts to the respective subjects
        solvedSubjectCounts.forEach(({ _id, count }) => {
            if (!subjectCounts[_id]) {
                subjectCounts[_id] = { subject: _id, correctCount: 0, wrongCount: 0, totalCount: 0 };
            }
            subjectCounts[_id].correctCount += count;
        });

        // Add wrong counts to the respective subjects
        wrongSubjectCounts.forEach(({ _id, count }) => {
            if (!subjectCounts[_id]) {
                subjectCounts[_id] = { subject: _id, correctCount: 0, wrongCount: 0, totalCount: 0 };
            }
            subjectCounts[_id].wrongCount += count;
        });

        // Convert the object to an array
        const combinedSubjectCounts = Object.values(subjectCounts);

        // Prepare the final result
        const result = {
            solvedLength,
            wrongLength,
            combinedSubjectCounts
        };

        res.json(result);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}));


//mcq group by topics 
router.get('/topics', wrapAsync(async (req, res) => {
    course = 'nums';
    const data = await MCQ.aggregate([
        {
            $group: {
                _id: {
                    topic: "$topic",
                    chapter: "$chapter",
                    subject: "$subject"
                }
            }
        },
        {
            $project: {
                _id: 0,
                topic: "$_id.topic",
                chapter: "$_id.chapter",
                subject: "$_id.subject"
            }
        }
    ])

    res.send("okkk")

}));


router.put('/bookmark', wrapAsync(async (req, res) => {
    try {
        const { mcqId } = req.body;
        const user = await userModel.updateOne(
            { _id: req.user._id },
            {
                $addToSet: { bookmarked_mcqs: mcqId }
            }
        );
        res.json(user);
    } catch (error) {
        console.log(error)
    }
}));

router.put('/unbookmark', wrapAsync(async (req, res) => {
    try {
        const { mcqId } = req.body;
        console.log(mcqId)
        const user = await userModel.updateOne(
            { _id: req.user._id },
            {
                $pull: { bookmarked_mcqs:mcqId }
            }
        );
        console.log(user)
        res.json(user);
    } catch (error) {
        console.log(error)
    }
}));

router.get('/bookmarks', wrapAsync(async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('bookmarked_mcqs');
        const mcqs= await MCQ.find({_id:{$in:user.bookmarked_mcqs}});
        res.json(mcqs);
    } catch (error) {
        console.log(error)
    }
}));

		

module.exports = router;