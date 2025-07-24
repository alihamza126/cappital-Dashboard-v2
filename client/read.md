##this is the property of the capital academy



//query for mcqs mock test
else if (subject === 'mock') {
            let queryCriteria = { course };
            const sampleSize = 200; // Number of random documents to retrieve

            if (category === 'past') {
                queryCriteria.category = category;
                mcqs = await MCQ.aggregate([
                    { $match: queryCriteria },
                    { $sample: { size: sampleSize } }
                ]);

            } else if (category === 'solved') {
                try {
                    const userSolvedId = await userModel.findById(userId).select('solved_mcqs');
                    queryCriteria._id = { $in: userSolvedId.solved_mcqs };
                    mcqs = await MCQ.aggregate([
                        { $match: queryCriteria },
                        { $sample: { size: sampleSize } }
                    ]);
                } catch (error) {
                    return res.status(201).json(mcqs);
                }
            }
            else if (category === 'unsolved') {
                const userSolvedMCQs = await userModel.findById(userId).select(['solved_mcqs', 'wrong_mcqs']);
                const solvedMCQIds = userSolvedMCQs.solved_mcqs;
                const wrongMCQIds = userSolvedMCQs.wrong_mcqs;

                queryCriteria._id = { $nin: [...solvedMCQIds, ...wrongMCQIds] };
                mcqs = await MCQ.aggregate([
                    { $match: queryCriteria },
                    { $sample: { size: sampleSize } }
                ]);
            }
            else if (category === 'wrong') {
                try {
                    const userWrongId = await userModel.findById(userId).select('wrong_mcqs');
                    queryCriteria._id = { $in: userWrongId.wrong_mcqs };
                    mcqs = await MCQ.aggregate([
                        { $match: queryCriteria },
                        { $sample: { size: sampleSize } }
                    ]);
                } catch (error) {
                    return res.status(201).json(mcqs);
                }
            }
            else if (category === 'all') {
                try {
                    mcqs = await MCQ.aggregate([
                        { $match: queryCriteria },
                        { $sample: { size: sampleSize } }
                    ]);
                } catch (error) {
                    return res.status(201).json(mcqs);
                }
            }

        }



""I want to fetch mcqs for mock in percentage and sequence of subject that I will provide I want to show percentage in front end 
can you write a aggeratage query in this way there is no restriction from solved or not 
just fetch 200 question from course that mention in variable and percentage of mcqs :

1-subject:"biology"  fetch random mcqs 68
1-subject:"chemistry" fetch random mcqs 54
3-subject:"physics" fetch random mcqs 54
4-subject:"english" fetch random mcqs 18
5-1-subject:"logic" fetch random mcqs 6

""

"""make sure all mcqs fetch in subject wise as i have provide"""