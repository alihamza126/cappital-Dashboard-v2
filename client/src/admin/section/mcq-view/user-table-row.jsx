import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Close, MoreVert, WarningRounded } from '@mui/icons-material';
import axios from 'axios';
import axiosInstance from '../../../baseUrl';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { bioTopicsNames, chemistryTopicsNames, physicsTopicsNames } from '../../../utils/topics';
import { bioChapterNames, englishChapterNames, chemistryChapterNames, physicsChapterNames, logicChapterNames } from '../../../utils/chaptername';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  maxHeight: '100vh', // Set maximum height for modal
  overflowY: 'auto' // Enable vertical scrolling
};

export default function UserTableRow({
  key,
  question,
  option1,
  option2,
  option3,
  option4,
  correct,
  course,
  subject,
  chapter,
  chapTopic,
  mcqInfo,
  mcqExplain,
  totalMcqs,

  isImage,
  selected,
  userId,
  handleClick,
  index,
  handleReload
}) {
  const [open, setOpen] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  //model states
  const [modelOpen, setModelOpen] = useState(false);
  const handleOpen = () => setModelOpen(true);
  const handleClose = () => {
    setModelOpen(false);
    handleReload();
  };
  const [mcqId, setMcqId] = useState(userId);
  const [nextIndex,setNextIndex]=useState(index);




  const showCenteredSnackbar = (message, variant) => {
    enqueueSnackbar(message, {
      variant: variant,
      autoHideDuration: 2200,
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
  //menu handler
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  // =============================edit modele============
  const [errors, setErrors] = useState({});
  const [chap, setChap] = useState(englishChapterNames);
  const [subj, setSubj] = useState('english');
  const [topic, setTopic] = useState([]);
  const [selectChapter, setSelectChapter] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctOption: '',
    difficulty: 'easy',
    category: 'normal',
    subj: 'english',
    chap: '',
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
    if (!formData.chap.trim()) {
      errors.chap = 'Chap is required';
    }
    if (subj !== 'logic' && subj !== 'english') {
      if (!formData.topic.trim())
        errors.topic = 'Topic is required';
    }
    if (Object.keys(errors).length === 0) {
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
              const mcqResponse = await axiosInstance.put('/mcq/update', { formData: formDataCopy, id: mcqId });
              showCenteredSnackbar('MCQ Update successfully with Image', 'success');
              // Clear form fields on successful submission
              setImage(null);
              setImageUrl('');
              setErrors({});
              setSelectChapter('');
              setTopic([]);
              // handleClose();
              // handleReload();

            } catch (error) {
              showCenteredSnackbar(error.message, 'error');
            }
          } else {
            showCenteredSnackbar('Failed to upload image', 'error');
          }
        } catch (error) {
          showCenteredSnackbar('Failed to upload image', 'error');
        }
      } else {
        try {
          await axiosInstance.put('/mcq/update', { formData, id: mcqId });
          showCenteredSnackbar('MCQ Update successfully without Image', 'success');
          setImage(null);
          setImageUrl('');
          setErrors({});
        } catch (error) {
          showCenteredSnackbar('Failed to Update MCQ', 'error');
        }
        // handleClose();
        // handleReload();
      }
    } else {
      setErrors(errors);
    }

  };

  useEffect(() => {
    if (subj === 'biology') {
      setChap(bioChapterNames);
      setTopic([]);
    } else if (subj === 'chemistry') {
      setChap(chemistryChapterNames);
      setTopic([]);
    } else if (subj === 'physics') {
      setChap(physicsChapterNames);
      setTopic([]);
    } else if (subj === 'logic') {
      setChap(logicChapterNames);
      setTopic([]);
    } else if (subj === 'english') {
      setChap(englishChapterNames);
      setTopic([]);
    }
  }, [subj]);

  useEffect(() => {
    if (subj === 'biology') {
      const data = bioTopicsNames[selectChapter];
      setTopic(data);
    } else if (subj === 'chemistry') {
      const data = chemistryTopicsNames[selectChapter];
      setTopic(data);
    } else if (subj === 'physics') {
      const data = physicsTopicsNames[selectChapter];
      setTopic(data);
    } else if (subj === 'logic' || subj === 'english') {
      setTopic([]);
    }
    setFormData({ ...formData, topic: '' });
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
    setFormData({ ...formData, [name]: value, topic: '', chap: '' });
    setSubj(e.target.value);
  }


  // ========================edit modele============
  const handleEdit = (key) => {
    handleOpen();
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctOption: '',
      difficulty: 'easy',
      category: 'normal',
      subj: 'english',
      chap: '',
      topic: '',
      course: 'nums',
      info: '',
      explain: '',
      imageUrl: ''
    });

    setSubj(subject)
    setImage(null);
    setImageUrl(isImage);
    setFormData({
      question,
      options: [option1, option2, option3, option4],
      correctOption: correct,
      difficulty: 'easy',
      category: 'normal',
      subj: subject,
      chap: chapter,
      topic: chapTopic,
      course: course,
      info: mcqInfo,
      explain: mcqExplain,
      imageUrl: isImage
    })
  }

  const handleNext = () => {
    if (nextIndex + 1 < totalMcqs.length) {
      showCenteredSnackbar("Next mcqs shifted",'info')
      const nextData = totalMcqs[nextIndex + 1];
      setMcqId(nextData._id);
      setNextIndex((e)=>e+1);

      handleOpen();
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctOption: '',
        difficulty: 'easy',
        category: 'normal',
        subj: 'english',
        chap: '',
        topic: '',
        course: 'nums',
        info: '',
        explain: '',
        imageUrl: ''
      });

      setSubj(nextData.subject)
      setImage(null);
      setImageUrl(nextData.imageUrl);
      setFormData({
        question: nextData.question,
        options: [nextData.options[0], nextData.options[1], nextData.options[2], nextData.options[3]],
        correctOption: nextData.correctOption,
        difficulty: nextData.difficulty,
        category: nextData.category,
        subj: nextData.subject,
        chap: nextData.chapter,
        topic: nextData.topic,
        course: nextData.course,
        info: nextData.info,
        explain: nextData.explain,
        imageUrl: nextData.imageUrl
      });
    }else{
      showCenteredSnackbar('No more MCQs available', 'warning');
    }
  }


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <div style={{ display: 'flex', marginRight: "13px", alignItems: 'center' }}>
            <span style={{ marginLeft: "7px" }}>{index + 1}</span>
            <Checkbox
              checked={selected}
              onClick={(event) => handleClick(event, mcqId)}
              style={{ marginLeft: 'auto' }} // Move Checkbox to the end
            />
          </div>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            {question}
          </Stack>
        </TableCell>

        <TableCell>{option1}</TableCell>
        <TableCell>{option2}</TableCell>
        <TableCell>{option3}</TableCell>
        <TableCell>{option4}</TableCell>
        <TableCell>{correct}</TableCell>
        <TableCell align="center">{course}</TableCell>
        <TableCell align="center">{subject}</TableCell>
        <TableCell align="center">{chapter}</TableCell>
        <TableCell align="center">{chapTopic}</TableCell>
        <TableCell align="center">{mcqInfo}</TableCell>
        <TableCell align="center">{isImage === "" ? 'No' : <a target='_blank' href={isImage}>view</a>}</TableCell>

        <TableCell align="right">
          <button className='btn btn-sm btn-warning' onClick={() => handleEdit(mcqId)}>Edit</button>
        </TableCell>
      </TableRow>



      {/* ========================model btn======= */}
      <Modal
        open={modelOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className='p-0 p-md-4'>
          <Container fluid>
            <h1 className="text-primary fw-bold py-2 px-4"> Edit MCQ Form</h1>
            <Form>
              <Form.Group controlId="question">
                <Form.Label className="fw-bold">Question ({nextIndex + 1})</Form.Label>
                <Form.Control as="textarea" rows={2} name="question" value={formData.question} onChange={handleChange} isInvalid={!!errors.question} />
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

              {/* Difficulty, Category, Subj, Chap */}
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
                  <Form.Group controlId="subj">
                    <Form.Label>Subj</Form.Label>
                    <Form.Control as="select" name="subj" value={formData.subj} onChange={handleSubjectChange}>
                      <option value="english">English</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="physics">Physics</option>
                      <option value="logic">Logic</option>
                      <option value="biology">Biology</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {/* Chap and Topics row */}
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
                  <Form.Group controlId="chap">
                    <Form.Label>Chap</Form.Label>
                    <Form.Control as="select" placeholder='Select Chap' name="chap" value={formData.chap} onChange={(e) => setSelectChapter(e.target.value)} onChangeCapture={handleChange} isInvalid={!!errors.chap}>
                      <option value={''}>Select Chap</option>
                      {chap?.map((e, index) => (
                        <option key={index} value={e}>{e}</option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{errors.chap}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group controlId="topic">
                    <Form.Label>Topic</Form.Label>
                    <Form.Control as="select" required name="topic" value={formData.topic} onChange={handleChange} isInvalid={!!errors.topic}>
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
                <Form.Control as="textarea" rows={20} name="explain" value={formData.explain} onChange={handleChange} />
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
              <div className="row">
                <Button className='col-md-5 fw-bold py-2 bg-warning text-light' type="submit" onClick={handleSubmit}>Update</Button>
                <Button className='col-md-5 ms-auto py-2 fw-bold bg-primary text-light' type="button" onClick={handleNext}>Next</Button>

              </div>
            </Form>
          </Container>
        </Box>
      </Modal>
    </>
  );
}
