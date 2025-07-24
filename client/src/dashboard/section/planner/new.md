import React, { useState, useEffect } from 'react';
import './planner.scss';
import { bioTopicsNamesNums, chemistryTopicsNamesNums, physicsTopicsNamesNums } from '../../../utils/CourseTopic/nums';
import { mdcatBioChapters, mdcatLogicChapter, numsEnglishChapters } from '../../../utils/chaperts';
import { bioTopicsNamesMdcat, chemistryTopicsNamesMdcat, physicsTopicsNamesMdcat } from '../../../utils/CourseTopic/mdcat';
import { useSelector } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

const Planner = () => {
    function renderEventContent(eventInfo) {
        return (
            <div className="custom-event">
                <h5 className='text-center'>{eventInfo.event.title}</h5>
                <p>{eventInfo.timeText}</p>
                <p>Custom HTML content here</p>
            </div>
        );
    }

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

    const handleWeeksChange = (e) => {
        setWeeks(e.target.value);
    };

    // Function to divide topics for each subject
    const divideTopicsForSubject = (topicsArray, weeks) => {
        const daysInWeek = 6;  // 6 days per week
        const totalDays = weeks * daysInWeek;
        const partSize = Math.ceil(topicsArray.length / totalDays);

        const dividedTopics = [];
        for (let i = 0; i < totalDays; i++) {
            dividedTopics.push(topicsArray.slice(i * partSize, (i + 1) * partSize));
        }
        return dividedTopics;
    };

    // Divide topics based on the selected number of weeks
    const dividedTopics = divideTopicsForSubject(course, weeks);

    // Create events from divided topics
    const eventsFromTopics = dividedTopics.flatMap((dayTopics, dayIndex) => {
        return dayTopics.map((topic, topicIndex) => {
            const startTime = new Date(startDate);
            startTime.setDate(startTime.getDate() + (dayIndex)); // Adjust the date for each day

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1); // 1 hour for each topic
            console.log( {
                title: topic,
                start: startTime.toISOString(),
                end: endTime.toISOString(),
            })
            return {
                title: topic,
                start: startTime.toISOString(),
                end: endTime.toISOString(),
            };
        });
    });







    return (
        <div className="planner">
            <div className="container-fluid px-5 gy-1 border shadow py-3 rounded">
                <div className="row">
                    <p className='text-center fs-1 fw-bold text-primary'>My Planner</p>
                </div>
            </div>

            <div className='bg-white rounded-3 px-3 py-4 shadow'>
                <div className='d-flex pb-3 justify-content-between align-items-center item-center'>
                    <h2 className='text-primary'>Syllabus</h2>
                    <div className="col-md-2 text-center d-flex gap-3">
                        <p className="fs-5 text-primary">Weeks</p>
                        <FormControl sx={{ background: "#FFFFFF", borderRadius: 2, width: '100%' }}>
                            <Select
                                labelId="weeks-label"
                                id="weeks-select"
                                value={weeks}
                                onChange={handleWeeksChange}
                                className="outline-none"
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
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView='dayGridWeek'
                    weekends={false}
                    events={eventsFromTopics}
                    eventContent={renderEventContent}
                />
            </div>
        </div>
    );
};

export default Planner;
