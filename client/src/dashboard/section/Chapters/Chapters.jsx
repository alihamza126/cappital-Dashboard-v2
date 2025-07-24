import React from 'react'
import Chapter from '../../components/chapter/Chapter'
import { numsBioChapters, numsPhysicsChapters, numsEnglishChapters, numsChemistryChapters } from '../../../utils/chaperts';
import { mdcatBioChapters, mdcatChemistryChapters, mdcatPhysicsChapters, mdcatEnglishChapters, mdcatLogicChapter } from '../../../utils/chaperts';
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import '../subjects/subjectpage.scss'
import { useSelector } from 'react-redux';

const Chapters = () => {
    const subjectParam = useParams()?.subject.trim();
    const chapterParam = useParams()?.chapter.trim();

    const [user, setUser] = useState(useSelector((state) => state.auth?.user?.user?.user));
    const isMdcat = user?.isMdcat || false;
    const isNums = user?.isNums || false;
    const isMdcatNums = user?.isMdcatNums || false;
    const isTrial = user?.isTrialActive || false;
    const trialStatus=isTrial && !isMdcat && !isNums && !isMdcatNums;
    // const getTrialStatus = () => {
    //     return isTrial && !isMdcat && !isNums && !isMdcatNums;
    // };

    const [subject, setsubject] = useState(chapterParam || 'biology');
    const [selectTopic, selectSelectedTopic] = useState(numsBioChapters);

    useEffect(() => {
        if (subjectParam === 'nums') {
            if (chapterParam == 'biology') {
                selectSelectedTopic(numsBioChapters)
            } else if (chapterParam == 'chemistry') {
                selectSelectedTopic(numsChemistryChapters);
            } else if (chapterParam == 'physics') {
                selectSelectedTopic(numsPhysicsChapters);
            } else if (chapterParam == 'english') {
                selectSelectedTopic(numsEnglishChapters);
            }
        } else if (subjectParam === 'mdcat') {
            if (chapterParam == 'biology') {
                selectSelectedTopic(mdcatBioChapters)
            } else if (chapterParam == 'chemistry') {
                selectSelectedTopic(mdcatChemistryChapters);
            } else if (chapterParam == 'physics') {
                selectSelectedTopic(mdcatPhysicsChapters);
            } else if (chapterParam == 'english') {
                selectSelectedTopic(mdcatEnglishChapters);
            } else if (chapterParam == 'logic') {
                selectSelectedTopic(mdcatLogicChapter);
            }
        }
    }, [subject])


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-12 offset-md-2 text-center">
                        <h1 className="subjectpage-heading p-3 fw-bold text-white rounded-5 mb-5">SELECT YOUR CHAPTER</h1>
                    </div>
                </div>
                <div className="row">
                    {selectTopic.map((ele, index) => (
                        <Chapter key={index} name={ele.name} img={ele.image} isLocked={trialStatus && index > 0} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default Chapters