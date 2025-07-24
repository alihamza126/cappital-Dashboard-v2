import React, { useEffect } from 'react'
import './topic.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { bioTopicsNamesNums, chemistryTopicsNamesNums, physicsTopicsNamesNums } from '../../../utils/CourseTopic/nums';
import { bioTopicsNamesMdcat, chemistryTopicsNamesMdcat, physicsTopicsNamesMdcat } from '../../../utils/CourseTopic/mdcat';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import { Cached, Close, Done, DoneAll, Error, ErrorOutline, ExpandMore } from '@mui/icons-material';
import axios from 'axios';
import axiosInstance from '../../../baseUrl.js';
import { useSelector } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import doneImg from '/public/done.gif'

const Topic = () => {
    const navigate = useNavigate()
    let subject = useParams()?.subject.trim(); //mdcat ,nums
    let chapter = useParams()?.chapter.trim(); //chapter name
    let chapterName = useParams()?.name.trim(); //topics name
    const [user, setUser] = useState(useSelector((state) => state.auth?.user?.user?.user));

    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [catagory, setCatagory] = useState('unsolved');
    const [mcqCout, setMcqCout] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [isMcqAvailable, setIsMcqAvailable] = useState(false);

    //topic selection use effect
    useEffect(() => {
        if (subject == 'mdcat') {
            switch (chapter) {
                case 'biology':
                    setTopics(bioTopicsNamesMdcat[chapterName] || [])
                    break;
                case 'chemistry':
                    setTopics(chemistryTopicsNamesMdcat[chapterName] || [])
                    break;
                case 'physics':
                    setTopics(physicsTopicsNamesMdcat[chapterName] || [])
                    break;
                case 'english':
                    setTopics((prev => [chapterName]))
                    break;
                case 'logic':
                    setTopics((prev => [chapterName]))
                    break;
                case 'mock':
                    setTopics(['Mock Test']);
                    break;
                default:
                    setTopics([]);
                    break;
            }
        } else if (subject == 'nums') {
            switch (chapter) {
                case 'biology':
                    setTopics(bioTopicsNamesNums[chapterName] || [])
                    break;
                case 'chemistry':
                    setTopics(chemistryTopicsNamesNums[chapterName] || [])
                    break;
                case 'physics':
                    setTopics(physicsTopicsNamesNums[chapterName] || [])
                    break;
                case 'english':
                    setTopics((prev => [chapterName]))
                    break;
                case 'logic':
                    setTopics((prev => [chapterName]))
                    break;
                case 'mock':
                    setTopics(['Mock Test']);
                    break;
                default:
                    setTopics([]);
                    break;
            }
        }
    }, []);


    const handleNextClick = () => {
        if (isMcqAvailable) {
            if (subject && chapter && chapterName && selectedTopic && catagory) {
                navigate('/mcq', { state: { course: subject, subject: chapter, chapter: chapterName, topic: selectedTopic, catagory } });
            } else {
                alert("something Wrong")
            }
        }
        else {
            setShowAlert(true)
        }
        if (chapter === 'mock')
            navigate('/mcq', { state: { course: subject, subject: chapter, chapter: chapterName, topic: selectedTopic, catagory } });
    };

    ///cout data api
    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosInstance.post('/mcq/cout', {
                course: subject,
                subject: chapter,
                chapter: chapterName,
                topic: topics,
                catagory,
                userId: user._id
            })
            setMcqCout(res.data)
        }
        fetchData()
    }, [catagory, topics])

    useEffect(() => {
        mcqCout.filter((e) => {
            if (e.topic == selectedTopic) {
                if (e.count > 0) {
                    setIsMcqAvailable(true)
                } else {
                    setIsMcqAvailable(false)
                }
            } else if (e.subject == 'english' || e.subject == 'logic') {
                if (e.count > 0) {
                    setIsMcqAvailable(true)
                } else {
                    setIsMcqAvailable(false)
                }
            }
        });
    }, [selectedTopic, mcqCout]);

    return (
        <>
            <div className="container-fluid p-0 p-md-1">
                <div className="row p-3 p-md-0  ">
                    <div className="col-md-8 col-12 offset-md-2 text-center">
                        <h1 className="subjectpage-heading p-3 fw-bold text-white rounded-5 mb-5">SELECT YOUR TOPIC</h1>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="">
                        <div className="topic-box offset-md-2 col-md-8 col-12 p-3 rounded-3">
                            {/* //chapter name */}
                            <div className="row justify-content-center">
                                <span className='bg-info fs-5 w-auto p-2 text-light fw-bold mb-3 rounded-5 px-4 text-capitalize'>{chapterName=='test'?"Mock Test":chapterName}</span>
                            </div>
                            {/* //Advance Features */}
                            <div className="row justify-content-center">
                                {
                                    chapterName != 'test' &&
                                    <div class="radio-inputs w-auto mt-3 flex-wrap justify-content-center">
                                        <label>
                                            <input class="radio-input" defaultChecked onChange={(e) => setCatagory(e.target.value)} type="radio" name="catagory" value={'unsolved'} />
                                            <span class="radio-tile">
                                                <span class="radio-icon">
                                                    <ErrorOutline />
                                                </span>
                                                <span class="radio-label">Unsolved MCQ</span>
                                            </span>
                                        </label>
                                        <label>
                                            <input class="radio-input" onChange={(e) => setCatagory(e.target.value)} type="radio" name="catagory" value={'wrong'} />
                                            <span class="radio-tile">
                                                <span class="radio-icon">
                                                    <Close />
                                                </span>
                                                <span class="radio-label">Wrong MCQ</span>
                                            </span>
                                        </label>
                                        <label>
                                            <input class="radio-input" onChange={(e) => setCatagory(e.target.value)} type="radio" name="catagory" value={'solved'} />
                                            <span class="radio-tile">
                                                <span class="radio-icon">
                                                    <Done />
                                                </span>
                                                <span class="radio-label">Solved MCQ</span>
                                            </span>
                                        </label>
                                        <label>
                                            <input class="radio-input" onChange={(e) => setCatagory(e.target.value)} type="radio" name="catagory" value={'past'} />
                                            <span class="radio-tile">
                                                <span class="radio-icon">
                                                    <Cached />
                                                </span>
                                                <span class="radio-label">Past MCQ</span>
                                            </span>
                                        </label>
                                        <label>
                                            <input class="radio-input" onChange={(e) => setCatagory(e.target.value)} type="radio" name="catagory" value={'all'} />
                                            <span class="radio-tile">
                                                <span class="radio-icon">
                                                    <DoneAll />
                                                </span>
                                                <span class="radio-label">Select All MCQ</span>
                                            </span>
                                        </label>
                                    </div>
                                }
                            </div>

                            <hr />
                            {/* //topic data */}
                            <div className="row bg-light bg-danger p-0">
                                <span className='text-center fw-bold fs-3' style={{ color: '#310B7B', fontFamily: "inter" }}>Select Topic</span>
                            </div>
                            <ul>
                                <Accordion
                                    className='rounded-3 overflow-hidden'
                                    defaultExpanded
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                        sx={{
                                            bgcolor: 'wheat',
                                            borderRadius: 1
                                        }}
                                        className='shadow-xl fw-bold text-dark'
                                    >
                                        Expand Topics
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {topics.map((topic, index) => (
                                            <li key={index}>
                                                <label className='w-100 h-100' htmlFor={`topic-${index}`} name="topic">{topic}</label>
                                                <span className='text-dark'>{chapter !== 'mock' && (mcqCout[index]?.count || 0)}</span>
                                                <input
                                                    type="radio"
                                                    name="topic"
                                                    id={`topic-${index}`}
                                                    value={topic}
                                                    onChange={(e) => setSelectedTopic(e.target.value.trim())}
                                                />
                                            </li>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                                <div className="row justify-content-end me-4" title={!(selectedTopic && catagory) && "First Choose Topic"}>
                                    <Button
                                        variant="contained"
                                        className="mt-5 w-auto"
                                        disabled={!(selectedTopic && catagory)}
                                        style={{ background: '#371085ea' }}
                                        onClick={handleNextClick}
                                    >
                                        Next
                                    </Button>

                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <SweetAlert
                custom
                show={showAlert}
                confirmBtnText="Try Another"
                confirmBtnBsStyle="primary"
                cancelBtnBsStyle="light"
                customIcon={<div><img src={doneImg} alt="Custom Icon" height={155} width={155} /></div>}
                title={`${catagory} MCQ's not available yet! 🌟`}
                onConfirm={() => setShowAlert(false)}
            >
            </SweetAlert>

        </>
    )
}

export default Topic