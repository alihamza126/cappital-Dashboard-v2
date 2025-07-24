import { Book, BookTwoTone,  Bookmark,  Info, NearMe, Payment, PriceChange } from '@mui/icons-material';
import { Button, FormControl,  MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'

//notify
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import axiosInstance from '../../../baseUrl.js';

const Courses = () => {
    const [reload, setReload] = useState(false);
    const { enqueueSnackbar } = useSnackbar();


    const [courseName, setCourseName] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseNameError, setCourseNameError] = useState('');
    const [coursePriceError, setCoursePriceError] = useState('');
    const [courseDescriptionError, setCourseDescriptionError] = useState('');
    const [cData, setcData] = useState([]);

    const handleSubmit = async () => {
        if (!courseName || !coursePrice || !courseDescription) {
            if (!courseName) {
                setCourseNameError('Please enter a course name');
            } else {
                setCourseNameError('');
            }
            if (!coursePrice) {
                setCoursePriceError('Please enter a course price');
            } else {
                setCoursePriceError('');
            }
            if (!courseDescription) {
                setCourseDescriptionError('Please enter a course description');
            } else {
                setCourseDescriptionError('');
            }
            return;
        }
        // Submit the form
        try {
            const res = await axiosInstance.post('/course', { courseName, coursePrice, courseDescription })
            enqueueSnackbar(res.data.message, { variant: "success", autoHideDuration: 1500 });
            setReload(!reload)
        } catch (error) {
            enqueueSnackbar("something went Wrong", { variant: 'error', autoHideDuration: 1400 })
            setReload(!reload)
        }
    }

    const handleCourseChange = async (e) => {
        await setCourseName(e.target.value);
        const res = await axiosInstance.get(`/course/${e.target.value}`);
        console.log(res)
        setCoursePrice(res.data.cprice)
        setCourseDescription(res.data.cdesc)
    }

    useEffect(() => {
        const fetch = async () => {
            let res = await axiosInstance.get('/course/all');
            console.log(res);
            setcData(res.data)
        }
        fetch();
    },[reload])

    return (
        <div className="admin-courses">
            <div className="container">
                <div className="row my-3 col-md-6">
                    <FormControl error={!!courseNameError}>
                        <strong className='my-2 text-primary fw-bold'>Course Name <Bookmark style={{ color: "blueviolet" }} /></strong>
                        <Select labelId="course-type-label" id="course-type-select" placeholder='Select Course' onChange={(e) => handleCourseChange(e)}>
                            <MenuItem value="nums">Nums</MenuItem>
                            <MenuItem value="mdcat">MdCat</MenuItem>
                            <MenuItem value="mdcat+nums">MdCat + Nums</MenuItem>
                        </Select>
                        {courseNameError && <span className='text-danger'>{courseNameError}</span>}
                    </FormControl>
                </div>
                <div className="row col-md-6 my-2">
                    <FormControl error={!!coursePriceError}>
                        <strong className='my-2 text-primary fw-bold'>Course Price <Payment style={{ color: "goldenrod" }} /></strong>
                        <TextField type="number" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} />
                        {coursePriceError && <span className='text-danger'>{coursePriceError}</span>}
                    </FormControl>
                </div>
                <div className="mx-2">
                    <div className="row my-4">
                        <FormControl error={!!courseDescriptionError}>
                            <strong className='my-2 text-primary fw-bold'>Course description <Info style={{ color: "teal" }} /></strong>
                            <TextField value={courseDescription} multiline rows={4} onChange={(e) => setCourseDescription(e.target.value)} />
                            {courseDescriptionError && <span className='text-danger'>{courseDescriptionError}</span>}
                        </FormControl>
                    </div>
                    <div className=" my-4">
                        <Button className='pt-2' variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
            </div>

            {/* table of courses */}
            <div className="container table-responsive mt-5 pt-1">
                <table className="table table-striped table-hover table-primary rounded-4 shadow">
                    <thead>
                        <tr >
                            <th scope="col">No</th>
                            <th scope="col">Course Name</th>
                            <th scope="col">Course Price</th>
                            <th scope="col">Course description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cData.map((e, index) => (
                            <tr key={index}>
                                <th scope="row">{index+1}</th>
                                <td>{e?.cname}</td>
                                <td>{e?.cprice}</td>
                                <td><textarea style={{resize:"none"}} readOnly className='form-control resize-none'>{e?.cdesc}</textarea></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Courses