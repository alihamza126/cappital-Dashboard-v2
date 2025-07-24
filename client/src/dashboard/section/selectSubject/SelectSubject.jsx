import React from 'react'
import './selectsubject.scss';
import mdcat from '../../../assets/mdcat.png';
import nums from '../../../assets/nums.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axiosInstance from '../../../baseUrl';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Alert, IconButton } from '@mui/material';
import { Close, CloseOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import notFoundImg from '/notfound.png'
import { motion } from 'framer-motion'
import CourseSkeleton from '../../../skeleton/Course-skeletion';

const SelectSubject = () => {
    const [user, setuser] = useState({});
    const [isNums, setIsNums] = useState(false);
    const [isMdcat, setIsMdcat] = useState(false);
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [isTrialActive, setIsTrailActive] = useState(false);
    const [loading, setLoading] = useState(false)

    const userState = useSelector((state) => state.auth?.user?.user?.user || "");
    const isOpen = (userState.aggPercentage < 1 || userState.domicalCity == '')
    const [alertOpen, setAlertOpen] = useState(isOpen);

    const { enqueueSnackbar } = useSnackbar();
    const showCenteredSnackbar = (message, variant) => {
        enqueueSnackbar(message, {
            variant: variant,
            autoHideDuration: 3000,
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
    const handleLogout = async () => {
        try {
            const res = await axiosInstance.get('/auth/logout');
            localStorage.removeItem('user');
            dispatch(logout());
            Navigate('/signin')
            showCenteredSnackbar("Session Expire Login Again", "warning");
        } catch (error) {
        }
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const res = await axiosInstance.get('/userinfo');
                setuser(res.data.user)
                setIsMdcat(res?.data?.user?.isMdcat);
                setIsNums(res?.data?.user?.isNums);
                setIsTrailActive(res?.data?.user?.isTrialActive || false)
                setLoading(false)
            } catch (error) {
                handleLogout()
                setIsFetching(false)
                setLoading(false)
            }
            setIsFetching(false)
        }
        fetchData();
    }, []);

    return (
        <div className="select-subject">
            {
                loading ? <CourseSkeleton /> :
                    <div className="container">
                        <div className="col-md-8 col-12 offset-md-2 text-center">
                            <h1 className="subjectpage-heading p-3 fw-bold text-white rounded-5 mb-4">SELECT YOUR COURSE</h1>
                        </div>
                        <div className="row">
                            {
                                alertOpen &&
                                <motion.div
                                    initial={{ opacity: 0, x: 50, }}
                                    transition={{ duration: 1 }}
                                    whileInView={{ opacity: 1, x: 0, }}
                                >
                                    <Alert
                                        className="mt-0 mb-3"
                                        variant="filled"
                                        severity="info"
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setAlertOpen(false);
                                                }}
                                            >
                                                <CloseOutlined />
                                            </IconButton>
                                        }
                                    >
                                        <p>Please provide the following details:</p>
                                        <ol>
                                            {userState?.domicalCity == '' && <li>Domicile City</li>}
                                            {(userState?.aggPercentage == undefined || userState?.aggPercentage < 1)
                                                && <li>Aggregate Marks Percentage</li>}
                                        </ol>
                                    </Alert>
                                </motion.div>
                            }
                        </div>
                        <div className="row gy-3">
                            {
                                isNums &&
                                <div className="col-md-6">
                                    <Link to='/dashboard/subject/nums' state={{ from: 'nums' }} className='text-decoration-none'>
                                        <div className="subject-card">
                                            <div className="left">
                                                <img src={mdcat} alt="" />
                                            </div>
                                            <div className="right">
                                                <h4>NUMS</h4>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            }
                            {
                                isMdcat &&
                                <div className="col-md-6">
                                    <Link to='/dashboard/subject/mdcat' state={{ from: 'mdcat' }} className='text-decoration-none'>
                                        <div className="subject-card glassy-bg-nums">
                                            <div className="left">
                                                <img src={nums} alt="" />
                                            </div>
                                            <div className="right">
                                                <h4>MDCAT </h4>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            }
                            {
                                ((isNums == false && isMdcat == false) && isTrialActive) &&
                                <div className="col-md-6">
                                    <Link to='/dashboard/subject/mdcat' state={{ from: 'trial' }} className='text-decoration-none'>
                                        <div className="subject-card glassy-bg-nums">
                                            <div className="left">
                                                <img src={nums} alt="" />
                                            </div>
                                            <div className="right">
                                                <h4>MDCAT Trial</h4>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            }


                            {
                                (!(isNums || isMdcat || isTrialActive) && (!isFetching)) &&
                                <div className="col-md-12">
                                    <div className="nav-shoadow py-3     rounded-5">
                                        <div className="row justify-content-center">
                                            <span className='w-auto'>
                                                <img loading='lazy' src={notFoundImg} height="170" alt="" />
                                            </span>
                                        </div>
                                        <p className='text-center fw-bold fs-5 text-dark' style={{ fontFamily: 'inter' }}>No Course Found</p>
                                        <div className="row justify-content-center">
                                            <Link to='/checkout?mdcat' className='text-decoration-none w-auto'>
                                                <button className="button w-auto">
                                                    Goto Store
                                                    <div className="hoverEffect">
                                                        <div>
                                                        </div>
                                                    </div>
                                                </button>
                                            </Link>

                                        </div>
                                    </div>


                                </div>
                            }


                        </div>
                    </div>
            }
        </div>
    )
}

export default SelectSubject