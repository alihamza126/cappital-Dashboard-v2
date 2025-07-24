import React, { useState, useEffect } from 'react';
import './planner.scss';
import { bioTopicsNamesNums, chemistryTopicsNamesNums, physicsTopicsNamesNums } from '../../../utils/CourseTopic/nums';
import { mdcatBioChapters, mdcatLogicChapter, numsEnglishChapters } from '../../../utils/chaperts';
import { motion } from 'framer-motion';
import { bioTopicsNamesMdcat, chemistryTopicsNamesMdcat, physicsTopicsNamesMdcat } from '../../../utils/CourseTopic/mdcat';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Planner = () => {
    const bioTopicsNums = Object.keys(bioTopicsNamesNums);
    const chemistryTopicsNums = Object.keys(chemistryTopicsNamesNums);
    const PhysicsTopicsNums = Object.keys(physicsTopicsNamesNums);

    const physicsTopicsMdcat = Object.keys(physicsTopicsNamesMdcat);
    const chemistryTopicsMdcat = Object.keys(chemistryTopicsNamesMdcat);
    const bioTopicsMdcat = Object.keys(bioTopicsNamesMdcat);

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

    // Start date state
    const [startDate, setStartDate] = useState(new Date(userState?.createdAt));

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

    const divideTopics = (topicsArray, numParts) => {
        const partSize = Math.ceil(topicsArray.length / numParts);
        const dividedTopics = [];
        for (let i = 0; i < numParts; i++) {
            dividedTopics.push(topicsArray.slice(i * partSize, (i + 1) * partSize));
        }
        return dividedTopics;
    };

    const dividedTopics = divideTopics(course, weeks);

    const formatDate = (date) => {
        const options = { month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).toUpperCase();
    };

    const formatDay = (date) => {
        const options = { weekday: 'short' };
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
                {dividedTopics.map((topics, index) => {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(currentDate.getDate() + index * 7);

                    return (
                        <motion.div key={index} className="planner-card mt-4 row py-1 rounded-4 overflow-hidden border shadow-sm" style={{ background: '#E1C0F8' }}>
                            <div className="col-md-2 d-flex flex-column align-items-center justify-content-center">
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

                            <div className="py-2 col-md-10 px-md-3 px-2">
                                <div className="h-100 rounded-1 overflow-hidden">
                                    <div className="row planner-list h-100 d-flex justify-content-center align-items-center">
                                        <div className="row h-100 rounded-4 shadow-sm p-0 ">
                                            <div className="text-start text-white col gap-2 d-flex justify-content-between">
                                                <div style={{ background: '#fffdf0a8' }} className="col py-2 px-2 rounded-3">
                                                    <p className="fw-bold text-center bg-warning text-white rounded-2 py-1 mb-2">Chemistry</p>
                                                    <ul style={{ fontSize: '15px', color: 'orange' }} className="text-start dotted-list ps-1 text m-0">
                                                        <li className="py-1">Cell Structure and Function</li>
                                                        <li className="py-1">Genetics and Heredity</li>
                                                        <li className="py-1">Evolution and Natural Selection</li>
                                                        <li className="py-1">Human Anatomy and Physiology</li>
                                                        <li className="py-1">Photosynthesis and Plant Biology</li>
                                                        <li className="py-1">Ecology and Ecosystems</li>
                                                        <li className="py-1">Microbiology and Viruses</li>
                                                    </ul>
                                                </div>
                                                <div style={{ background: "#e9f0f7" }} className="col py-2 px-2 rounded-3">
                                                    <p className="fw-bold text-center bg-primary text-white rounded-2 py-1 mb-2">Physics</p>
                                                    <ul style={{ fontSize: '15px' }} className="text-start text-primary dotted-list ps-1 text m-0">
                                                        <li className="py-1">Cell Structure and Function</li>
                                                        <li className="py-1">Genetics and Heredity</li>
                                                        <li className="py-1">Evolution and Natural Selection</li>
                                                        <li className="py-1">Human Anatomy and Physiology</li>
                                                        <li className="py-1">Photosynthesis and Plant Biology</li>
                                                        <li className="py-1">Ecology and Ecosystems</li>
                                                        <li className="py-1">Microbiology and Viruses</li>
                                                    </ul>
                                                </div>
                                                <div style={{ background: "#e4fff1a1" }} className="col py-2 px-2 rounded-3">
                                                    <p className="fw-bold text-center bg-success text-white rounded-2 py-1 mb-2">Biology</p>
                                                    <ul style={{ fontSize: '15px', color: '#009E60' }} className="text-start dotted-list ps-1 text m-0">
                                                        <li className="py-1">Cell Structure and Function</li>
                                                        <li className="py-1">Genetics and Heredity</li>
                                                        <li className="py-1">Evolution and Natural Selection</li>
                                                        <li className="py-1">Human Anatomy and Physiology</li>
                                                        <li className="py-1">Photosynthesis and Plant Biology</li>
                                                        <li className="py-1">Ecology and Ecosystems</li>
                                                        <li className="py-1">Microbiology and Viruses</li>
                                                    </ul>
                                                </div>
                                                <div style={{ background: "#fdececb3" }} className="col py-2 px-2 rounded-3">
                                                    <p className="fw-bold text-center bg-danger text-white rounded-2 py-1 mb-2">English</p>
                                                    <ul style={{ fontSize: '15px', color: '#dd5a5a' }} className="text-start  dotted-list ps-1 text m-0">
                                                        <li className="py-1">Cell Structure and Function</li>
                                                        <li className="py-1">Genetics and Heredity</li>
                                                        <li className="py-1">Evolution and Natural Selection</li>
                                                        <li className="py-1">Human Anatomy and Physiology</li>
                                                        <li className="py-1">Photosynthesis and Plant Biology</li>
                                                        <li className="py-1">Ecology and Ecosystems</li>
                                                        <li className="py-1">Microbiology and Viruses</li>
                                                    </ul>
                                                </div>
                                                <div style={{ background: "#e9f3da" }} className="col py-2 px-2 rounded-3">
                                                    <p className="fw-bold text-center bg-secondary text-white rounded-2 py-1 mb-2">Logic</p>
                                                    <ul style={{ fontSize: '15px' }} className="text-start text-dark dotted-list ps-1 text m-0">
                                                        <li className="py-1">Cell Structure and Function</li>
                                                        <li className="py-1">Genetics and Heredity</li>
                                                        <li className="py-1">Evolution and Natural Selection</li>
                                                        <li className="py-1">Human Anatomy and Physiology</li>
                                                        <li className="py-1">Photosynthesis and Plant Biology</li>
                                                        <li className="py-1">Ecology and Ecosystems</li>
                                                        <li className="py-1">Microbiology and Viruses</li>
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Planner;
