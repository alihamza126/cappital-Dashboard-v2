import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { bioChapterNames, englishChapterNames, chemistryChapterNames, physicsChapterNames, logicChapterNames } from '../../../utils/chaptername';
import { Avatar, IconButton } from '@mui/material';
import axios from 'axios';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Close } from '@mui/icons-material';
import { bioTopicsNames, chemistryTopicsNames, physicsTopicsNames } from '../../../utils/topics';
import axiosInstance from '../../../baseUrl';

const MCQForm = () => {
    const [errors, setErrors] = useState({});
    const [chapter, setChapter] = useState(englishChapterNames);
    const [subject, setSubject] = useState('english');
    const [topic, setTopic] = useState([]);
    const [selectChapter, setSelectChapter] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading,setIsLoading]=useState(false);

    const { enqueueSnackbar } = useSnackbar();

    // Snackbar
    const showCenteredSnackbar = (message, variant) => {
        enqueueSnackbar(message, {
            variant: variant,
            autoHideDuration: 4000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            action: (
                <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar()}>
                    <Close fontSize="small" />
                </IconButton>
            )
        });
    };

    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctOption: '',
        difficulty: 'easy',
        category: 'normal',
        subject: 'english',
        chapter: '',
        topic: '',
        course: 'nums',
        info: '',
        explain: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        
        const { name, value } = e.target;
        if (name.startsWith('option')) {
            const index = parseInt(name.slice(-1)) - 1; // Extract index from option name (e.g., option1 -> 0)
            const updatedOptions = [...formData.options];
            updatedOptions[index] = value;
            setFormData({ ...formData, options: updatedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        // Validation
        const errors = {};
        if (!formData.question.trim()) {
            errors.question = 'Question is required';
        }
        if (formData.options.some(option => !option.trim())) {
            errors.options = 'All options are required';
        }
        if (!formData.correctOption) {
            errors.correctOption = 'Correct Option is required';
        }
        if (!formData.chapter.trim()) {
            errors.chapter = 'Chapter is required';
        }
        if (subject !== 'logic' && subject !== 'english') {
            if (!formData.topic.trim())
                errors.topic = 'Topic is required';
        }
        // if (formData.info.length < 9) {
        //     errors.info = 'Info should be atleast 9 characters long';
        // }
        if (Object.keys(errors).length === 0) {
            // Submit form if no errors
            // Send data to API
            if (image) {
                try {
                    const formImgData = new FormData();
                    formImgData.append('image', image);
                    const config = {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    };
                    const imgResponse = await axiosInstance.post('/upload/img', formImgData, config);
                    if (imgResponse.status === 200) {
                        try {
                            const formDataCopy = { ...formData, imageUrl: imgResponse.data.fileURL };
                            const mcqResponse = await axiosInstance.post('/mcq/add', formDataCopy);
                            showCenteredSnackbar('MCQ added successfully with Image', 'success');
                            setIsLoading(false)
                            // Clear form fields on successful submission
                            setImage(null);
                            setImageUrl('');
                            setErrors({});
                            setSelectChapter('');
                            setTopic([]);
                            
                            setFormData({
                                ...formData,
                                question: '',
                                options: ['', '', '', ''],
                                correctOption: '',
                                difficulty: 'easy',
                                category: 'normal',
                                topic: '',
                                chapter: "",  // You might not want to reset the chapter after submission
                                explain: '',
                                imageUrl: '',
                                info: '',
                            });
                        } catch (error) {
                            showCenteredSnackbar(error.message, 'error');
                        }
                    } else {
                        showCenteredSnackbar('Failed to upload image', 'error');
                    }
                } catch (error) {
                    showCenteredSnackbar('Failed to upload image', 'error');
                    setIsLoading(false)
                }
            } else {
                try {
                    await axiosInstance.post('/mcq/add', formData);
                    showCenteredSnackbar('MCQ added successfully without Image', 'success');
                    setImage(null);
                    setImageUrl('');
                    setErrors({});
                    setFormData({
                        ...formData,
                        question: '',
                        options: ['', '', '', ''],
                        correctOption: '',
                        difficulty: 'easy',
                        category: 'normal',
                        topic: '',
                        chapter: "",  // You might not want to reset the chapter after submission
                        explain: '',
                        imageUrl: '',
                        info: '',
                    });
                } catch (error) {
                    showCenteredSnackbar('Failed to add MCQ', 'error');
                }
            }
        } else {
            setErrors(errors);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        if (subject === 'biology') {
            setChapter(bioChapterNames);
            setTopic([]);
        } else if (subject === 'chemistry') {
            setChapter(chemistryChapterNames);
            setTopic([]);
        } else if (subject === 'physics') {
            setChapter(physicsChapterNames);
            setTopic([]);
        } else if (subject === 'logic') {
            setChapter(logicChapterNames);
            setTopic([]);
        } else if (subject === 'english') {
            setChapter(englishChapterNames);
            setTopic([]);
        }
    }, [subject]);

    useEffect(() => {
        if (subject === 'biology') {
            const data = bioTopicsNames[selectChapter];
            setTopic(data);
        } else if (subject === 'chemistry') {
            const data = chemistryTopicsNames[selectChapter];
            setTopic(data);
        } else if (subject === 'physics') {
            const data = physicsTopicsNames[selectChapter];
            setTopic(data);
        } else if (subject === 'logic' || subject === 'english') {
            setTopic([]);
        }
    }, [selectChapter]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
        setImage(file);
    };

    const handleSubjectChange = (e) => {
        const { name, value } = e.target;
        setTopic([]);
        setFormData({ ...formData,[name]: value ,topic:'',chapter:''});
        setSubject(e.target.value);
    }


    return (
        <Container>
            <h1 className="text-primary fw-bold py-2 px-4">MCQ Form</h1>
            <Form>
                <Form.Group controlId="question">
                    <Form.Label className="fw-bold">Question</Form.Label>
                    <Form.Control type="text" name="question" value={formData.question} onChange={handleChange} isInvalid={!!errors.question} />
                    <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
                </Form.Group>

                {/* Options */}
                <div className="card p-3 my-2 border-primary">
                    {[1, 2, 3, 4]?.map((optionNum) => (
                        <Form.Group key={optionNum} controlId={`option${optionNum}`} className='py-1'>
                            <Form.Label>Option {optionNum}</Form.Label>
                            <Form.Control type="text" name={`option${optionNum}`} value={formData.options[optionNum - 1]} onChange={handleChange} isInvalid={!!errors.options} />
                            <Form.Control.Feedback type="invalid">{errors.options}</Form.Control.Feedback>
                        </Form.Group>
                    ))}
                </div>

                {/* Correct Option */}
                <Row className='py-2'>
                    <Col>
                        <Form.Group controlId="correctOption">
                            <Form.Label className="fw-bold">Correct Option No</Form.Label>
                            <Form.Control type="number" min={1} max={4} name="correctOption" value={formData.correctOption} onChange={handleChange} isInvalid={!!errors.correctOption} />
                            <Form.Control.Feedback type="invalid">{errors.correctOption}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Difficulty, Category, Subject, Chapter */}
                <Row className='py-3'>
                    <Col md={2}>
                        <Form.Group controlId="difficulty">
                            <Form.Label>Difficulty</Form.Label>
                            <Form.Control as="select" name="difficulty" value={formData.difficulty} onChange={handleChange}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" name="category" value={formData.category} onChange={handleChange}>
                                <option value="normal">Normal</option>
                                <option value="past">Past</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="info">
                            <Form.Label className="fw-bold">MCQ Info</Form.Label>
                            <Form.Control type="text" maxLength={9} name="info" placeholder='For Example Bwp-2021' value={formData.info} onChange={handleChange} isInvalid={!!errors.info} />
                            <Form.Control.Feedback type="invalid">{errors.info}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group controlId="subject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control as="select" name="subject" value={formData.subject} onChange={handleSubjectChange}>
                                <option value="english">English</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="physics">Physics</option>
                                <option value="logic">Logic</option>
                                <option value="biology">Biology</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Chapter and Topics row */}
                <Row className='py-3'>
                    <Col md={2}>
                        <Form.Group controlId="course">
                            <Form.Label>Course</Form.Label>
                            <Form.Control as="select" name="course" value={formData.course} onChange={handleChange}>
                                <option value="nums">Nums</option>
                                <option value="mdcat">Mdcat</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group controlId="chapter">
                            <Form.Label>Chapter</Form.Label>
                            <Form.Control as="select" placeholder='Select Chapter' name="chapter" value={formData.chapter} onChange={(e) => setSelectChapter(e.target.value)} onChangeCapture={handleChange} isInvalid={!!errors.chapter}>
                            <option value={''}>Select Chapter</option>
                                {chapter?.map((e, index) => (
                                    <option key={index} value={e}>{e}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.chapter}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={5}>
                        <Form.Group controlId="topic">
                            <Form.Label>Topic</Form.Label>
                            <Form.Control as="select" name="topic" value={formData.topic} onChange={handleChange} isInvalid={!!errors.topic}>
                            <option value={''}>Select Topic</option>
                                {topic?.map((e, index) => (
                                    <option key={index} value={e}>{e}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.topic}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Explanation */}
                <Form.Group controlId="explain">
                    <Form.Label>Explanation</Form.Label>
                    <Form.Control as="textarea" name="explain" value={formData.explain} onChange={handleChange} />
                </Form.Group>

                {/* Image URL */}
                <div className="row py-1 my-3">
                    <div className="col-md-12 col-12 mb-4">
                        <div className="p-1 d-flex gap-2">
                            <div className="row justify-content-center">
                                <input id='file' type="file" hidden accept="image/*" onChange={handleFileChange} />
                                <label htmlFor="file" name="file" className='d-flex justify-content-center'>
                                    <span className='btn btn-secondary btn-sm w-100 px-5 mt- h-25'>Select Image</span>
                                </label>
                            </div>
                            <img height={150} src={imageUrl} alt="Image not selected" className='border border-primary rounded-2 overflow-hidden' />
                        </div>
                    </div>
                </div>

                <Button variant="primary" className='px-5 fw-bold' type="submit" onClick={handleSubmit}>Submit {isLoading&&<Spinner className='ms-1' size='sm'/>}</Button>
            </Form>
        </Container>
    );
};

export default MCQForm;
