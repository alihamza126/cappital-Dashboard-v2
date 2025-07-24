import React, { useEffect, useState } from 'react';
import './header.scss';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import student from '/student.png';
import { useSelector } from 'react-redux';
import { ReactTyped } from "react-typed";
import { Button, CircularProgress, IconButton } from '@mui/material';
import axiosInstance from "../../baseUrl";
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import Close from '@mui/icons-material/Close';
import SweetAlert from 'react-bootstrap-sweetalert';
import successGif from '/success.gif'

const Header = () => {
   const user = useSelector((state) => state.auth?.user?.user?.user);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const [showAlert, setShowAlert] = useState(false);

   const headerVariants = {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
   };
   const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.5 // Trigger animation when component is 50% in view
   });
   const showCenteredSnackbar = (message, variant) => {
      enqueueSnackbar(message, {
         variant: variant,
         autoHideDuration: 2500,
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
   const handleClose = () => {
      setShowAlert(false);
      setTimeout(() => {
         window.location.reload();
      }, 100);
   }
   const handleTry = () => {
      setShowAlert(false);
      setTimeout(() => {
         window.location.replace('/dashboard');
      }, 100);
   }

   const handleTrail = async () => {
      try {
         setLoading(true);
         if (user == undefined) {
            return navigate('/signin')
         }
         const response = await axiosInstance.post('/user/free-trial');
         showCenteredSnackbar(response.data.message, 'info')
         setLoading(false);
         if (response.data.message == 'Trial activated successfully') {
            setShowAlert(true);
            // window.location.reload()
         }
      } catch (error) {
         showCenteredSnackbar(response.data.message, 'warning')
         setLoading(false)
      }
   }
   const [isClient, setIsClient] = useState(false);
   useEffect(() => {
      setTimeout(() => {
         setIsClient(true)
      }, 1200);
   }, [])


   return (
      <>
         <div className="header" ref={ref}>
            <div className="container-fluid">
               <div className="row">
                  <motion.div className="left" variants={headerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
                     <div className="content">
                        {
                           isClient &&
                           <div className="heading">
                              <span className='background-heading'>
                                 <svg width="414" height="489" viewBox="0 0 414 489" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* SVG paths */}
                                 </svg>
                              </span>
                              <h2>Boost Your <br /><span>
                                 {isClient ? <ReactTyped strings={["MdCAT", "NUMS"]} loop backDelay={2000} typeSpeed={50} backSpeed={60} /> : <>MdCAT</>}
                              </span> <br />
                                 Prep With The Capital Academy
                              </h2>
                           </div>
                        }
                        <div className="description">
                           <p style={{ color: '#9448B1', fontWeight: '550' }}>Sign up now to get 50% off on all our courses!</p>
                        </div>
                        {!(user?.isMdcat || user?.isNums || user?.isMdcatNums || user?.isTrialActive) && (
                           <div className="button">
                              <button name='trail-btn' onClick={handleTrail} className='trail-btn'>Free trial {loading && <CircularProgress size={25} sx={{ ml: '3px', mb: '-3px', mr: '-5px' }} color='inherit' />}</button>
                           </div>
                        )}
                     </div>
                  </motion.div>
                  <motion.div className="right" variants={headerVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
                     <div className="img-container">
                        <span className='question-box'></span>
                        <span className='interface-box'></span>
                        <div className="img-box">
                           <img src={student} alt="img is here" />
                        </div>
                     </div>
                     <span className='bg-circule'>
                        <svg width="400" height="492" viewBox="0 0 400 492" fill="none" xmlns="http://www.w3.org/2000/svg">
                           {/* SVG paths */}
                        </svg>
                     </span>
                  </motion.div>
               </div>
            </div>
         </div>


         <SweetAlert
            show={showAlert}
            custom
            showConfirm={false}
            cancelBtnText="No"
            confirmBtnBsStyle="primary"
            cancelBtnBsStyle="light"
            customIcon={successGif}
            title="3-day trial activated successfully"
            openAnim={{ name: 'showSweetAlert', duration: 1000 }}
            closeAnim={{ name: 'hideSweetAlert', duration: 1000 }}
         >
            <Button onClick={handleTry} className='fw-bold' variant="contained">Try now</Button>
            <Button onClick={handleClose} className='fw-bold ms-2' color='error' variant="contained">Close</Button>
         </SweetAlert>
      </>
   );
}

export default Header;
