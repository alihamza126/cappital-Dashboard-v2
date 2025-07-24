import React, { useState, useEffect } from 'react';
import './planner.scss';
import { bioTopicsNamesNums, chemistryTopicsNamesNums, physicsTopicsNamesNums } from '../../../utils/CourseTopic/nums';
import { mdcatBioChapters, mdcatLogicChapter, numsEnglishChapters } from '../../../utils/chaperts';
import { motion } from 'framer-motion';
import { bioTopicsNamesMdcat, chemistryTopicsNamesMdcat, physicsTopicsNamesMdcat } from '../../../utils/CourseTopic/mdcat';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Planner = () => {
    // Extracted topic of subjects of nums
    const bioTopicsNums = Object.entries(bioTopicsNamesNums).flatMap(([chapter, topics]) =>
        topics.map(topic => (topic))
    );
    const chemistryTopicsNums = Object.entries(chemistryTopicsNamesNums).flatMap(([chapter, topics]) =>
        topics.map(topic => (topic))
    );
    const PhysicsTopicsNums = Object.entries(physicsTopicsNamesNums).flatMap(([chapter, topics]) =>
        topics.map(topic => (topic))
    );

    // Extracted topic of subjects of mdcat
    const physicsTopicsMdcat = Object.entries(physicsTopicsNamesMdcat).flatMap(([chapter, topics]) =>
        topics.map(topic => (topic))
    );
    const chemistryTopicsMdcat = Object.entries(chemistryTopicsNamesMdcat).flatMap(([chapter, topics]) =>
        topics.map(topic => (topic))
    );
    const bioTopicsMdcat = Object.entries(bioTopicsNamesMdcat).flatMap(([chapter, topics]) =>
        topics.map(topic => (topic))
    );

    // Extracted topic for english and logic
    const englishTopics = numsEnglishChapters.map((e) => e?.name?.toLowerCase());
    const logicTopics = mdcatLogicChapter.map((e) => e?.name?.toLowerCase());

    // Extracted topic of subjects
    const NumsChapters = [...PhysicsTopicsNums, ...chemistryTopicsNums, ...bioTopicsNums, ...englishTopics, ...logicTopics];
    const mdcatChapters = [...physicsTopicsMdcat, ...chemistryTopicsMdcat, ...bioTopicsMdcat, ...englishTopics, ...logicTopics];

    const userState = useSelector((state) => state.auth?.user?.user?.user || "");
    const initialWeeks = localStorage.getItem('weeks') || 12;
    const [weeks, setWeeks] = useState(initialWeeks);
    const [course, setCourse] = useState([]);
    const [isNums, setIsNums] = useState(userState.isNums || false);
    const [isMdcat, setIsMdcat] = useState(userState.isMdcat || false);
    const [completedWeeks, setCompletedWeeks] = useState(JSON.parse(localStorage.getItem('completedWeeks')) || []);
    const [dividedTopics, setDividedTopics] = useState();

    // Start date state
    const [startDate, setStartDate] = useState(new Date(userState?.createdAt));

    // Dividing topics into weeks
    function splitTopicsIntoDivs(n) {
        // Helper function to split an array into 'n' divs
        function splitArrayIntoDivs(topics, numDivs) {
            const divs = [];
            const topicsPerDiv = Math.ceil(topics.length / numDivs);

            for (let i = 0; i < numDivs; i++) {
                const start = i * topicsPerDiv;
                const end = start + topicsPerDiv;
                divs.push(topics.slice(start, end));
            }
            return divs;
        }

        // Splitting topics for each subject
        let topicsDivs = isNums ? {
            biology: splitArrayIntoDivs(bioTopicsNums, n),
            chemistry: splitArrayIntoDivs(chemistryTopicsNums, n),
            physics: splitArrayIntoDivs(PhysicsTopicsNums, n),
            english: splitArrayIntoDivs(englishTopics, n),
        } : {
            physics: splitArrayIntoDivs(physicsTopicsMdcat, n),
            chemistry: splitArrayIntoDivs(chemistryTopicsMdcat, n),
            biology: splitArrayIntoDivs(bioTopicsMdcat, n),
            english: splitArrayIntoDivs(englishTopics, n),
            logic: splitArrayIntoDivs(logicTopics, n)
        }

        return topicsDivs;
    }

    useEffect(() => {
        if (isNums) {
            setCourse(NumsChapters);
        } else if (isMdcat) {
            setCourse(mdcatChapters);
        }
        setCourse(mdcatChapters);
    }, [isNums, isMdcat]);

    useEffect(() => {
        localStorage.setItem('weeks', weeks);
        const dividedTopics = splitTopicsIntoDivs(weeks);
        setDividedTopics(dividedTopics);
    }, [weeks]);

    useEffect(() => {
        localStorage.setItem('completedWeeks', JSON.stringify(completedWeeks));
    }, [completedWeeks]);

    const handleWeeksChange = (e) => {
        setWeeks(e.target.value);
    };

    const handleCheckboxChange = (index) => {
        const newCompletedWeeks = [...completedWeeks];
        newCompletedWeeks[index] = !newCompletedWeeks[index];
        setCompletedWeeks(newCompletedWeeks);
    };

    const formatDate = (date) => {
        const options = { month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).toUpperCase();
    };


    return (
        <div className="planner">
            <div className="container-fluid px-1 gy-3 border shadow py-5 rounded-4">
                <div className="row">
                    <p className='text-center fs-1 fw-bold text-primary'>My Planner</p>
                </div>
                <div className="row mb-4">
                    <div className="col-md-12 text-center d-flex justify-content-end">
                        <FormControl sx={{ background: "#FFFFFF", borderRadius: 4, width: '100%' }}>
                            <span style={{ color: '#1F66C4', fontSize: '19px', fontWeight: '650' }}>Weeks</span>
                            <Select
                                labelId="weeks-label"
                                id="weeks-select"
                                value={weeks}
                                onChange={handleWeeksChange}
                                className="outline-none "
                                style={{ fontSize: '19px' }}
                                sx={{ height: 30, borderRadius: 4, border: 'none' }}
                            >
                                {[...Array(11).keys()].map(num => (
                                    <MenuItem style={{ fontSize: '19px' }} key={num + 6} value={num + 6}>{num + 6}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {
                    dividedTopics && Array.from({ length: weeks }, (_, index) => {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(currentDate.getDate() + index * 7);
                        console.log(dividedTopics.biology[index]);

                        return (
                            <motion.div key={index} className=" planner-card mt-4 row py-1 rounded-4 overflow-hidden border shadow-sm" style={{ background: '#e7d2f7' }}>
                                
                                {/* // week selction */}
                                <div className="position-sticky top-1 col-md-2 d-flex flex-column align-items-center justify-content-center">
                                    <div className="w-100 text-center bg-none">
                                        <p className='bg-white rounded-4 mt-2 py-2 fw-bold fs-2' style={{ color: '#AE6FD9', fontFamily: 'fredoka', lineHeight: 1 }}>
                                            {formatDate(currentDate)}<br />
                                        </p>
                                    </div>
                                    <div className="w-100 text-center">
                                        <p className='bg-white rounded-4 mt-1 py-2 fw-semibold fs-2' style={{ color: '#AE6FD9', fontFamily: 'fredoka', lineHeight: 1 }}>
                                            Week-
                                            <span className='fw-normal ms-2 fs-3 fw-bold' style={{ color: '#AE6FD9', fontFamily: 'fredoka' }}>{index + 1}</span>
                                        </p>
                                    </div>
                                    <div className="py-1 pt-2 rounded-4 mb-2 bg-white w-100 d-flex justify-content-center align-items-center">
                                        <div className="checkbox-wrapper-12 d-flex flex-column align-items-center justify-content-center">
                                            <div className="cbx">
                                                <input
                                                    id={`cbx-${index}`}
                                                    type="checkbox"
                                                    checked={completedWeeks[index] || false}
                                                    onChange={() => handleCheckboxChange(index)}
                                                />
                                                <label htmlFor={`cbx-${index}`}></label>
                                                <svg width="32" height="34" viewBox="0 0 15 14" fill="none">
                                                    <path d="M2 8.36364L6.23077 12L13 2"></path>
                                                </svg>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                                                <defs>
                                                    <filter id="goo-12">
                                                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"></feGaussianBlur>
                                                        <feColorMatrix
                                                            in="blur"
                                                            mode="matrix"
                                                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -7"
                                                            result="goo-12"></feColorMatrix>
                                                        <feBlend in="SourceGraphic" in2="goo-12"></feBlend>
                                                    </filter>
                                                </defs>
                                            </svg>
                                            <div className="row fs-3" style={{ fontFamily: 'fredoka', color: '#5F5F60' }}>
                                                Check
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* //subject topics cards */}
                                <div className="py-2 col-md-10 px-md-2 px-2">
                                    <div className="h-100 rounded-1 overflow-hidden">
                                        <div className="row planner-list h-100 d-flex justify-content-center align-items-center">
                                            <div className="row h-100 rounded-4 shadow-sm p-0 ">
                                                <div className="text-start text-white col gap-2 flex-wrap d-flex justify-content-between">
                                                    <div style={{ background: '#fffdf0a8' }} className="shadow-sm col py-2 px-2 rounded-3">
                                                        <p className="fw-bold text-center bg-warning text-white rounded-2 py-1 mb-2">Chemistry</p>
                                                        <ul style={{ fontSize: '15px', color: 'orange' }} className="text-start dotted-list ps-1 text m-0">
                                                            {
                                                                dividedTopics?.chemistry[index]?.map((topic, index) => (
                                                                    <li key={index} className="py-1 text-truncate">{index+1}- {topic}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div style={{ background: "#e9f0f7" }} className="shadow-sm col py-2 px-2 rounded-3">
                                                        <p className="fw-bold text-center bg-primary text-white rounded-2 py-1 mb-2">Physics</p>
                                                        <ul style={{ fontSize: '15px' }} className="text-start text-primary dotted-list ps-1 text m-0">
                                                            {
                                                                dividedTopics?.physics[index]?.map((topic, index) => (
                                                                    <li key={index} className="py-1 text-truncate">{index+1}- {topic}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div style={{ background: "#e4fff1a1" }} className="shadow-sm col py-2 px-2 rounded-3">
                                                        <p className="fw-bold text-center bg-success text-white rounded-2 py-1 mb-2">Biology</p>
                                                        <ul style={{ fontSize: '15px', color: '#009E60' }} className="text-start dotted-list ps-1 text m-0">
                                                            {
                                                                dividedTopics?.biology[index]?.map((topic, index) => (
                                                                    <li key={index} className="py-1 text-truncate">{index+1}- {topic}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div style={{ background: "#fdececb3" }} className="shadow-sm col py-2 px-2 rounded-3">
                                                        <p className="fw-bold text-center bg-danger text-white rounded-2 py-1 mb-2">English</p>
                                                        <ul style={{ fontSize: '15px', color: '#dd5a5a' }} className="text-start  dotted-list ps-1 text m-0">
                                                            {
                                                                dividedTopics?.english[index]?.map((topic, index) => (
                                                                    <li key={index} className="py-1 text-truncate">{index+1}- {topic}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                    {dividedTopics?.logic[index] &&
                                                        <div style={{ background: "#e9f3da" }} className="shadow-sm col py-2 px-2 rounded-3">
                                                            <p className="fw-bold text-center bg-secondary text-white rounded-2 py-1 mb-2">Logic</p>
                                                            <ul style={{ fontSize: '15px' }} className="text-start text-dark dotted-list ps-1 text m-0">
                                                                {
                                                                    dividedTopics?.logic[index]?.map((topic, index) => (
                                                                        <li key={index} className="py-1 text-truncate">{index+1}- {topic}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </motion.div>
                        )


                    })


                }
            </div>
        </div>
    );
};

export default Planner;
