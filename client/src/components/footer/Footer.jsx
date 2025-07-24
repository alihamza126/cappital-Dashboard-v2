import React, { useEffect } from 'react';
import './footer.scss';
import { motion, useAnimation } from 'framer-motion';
import { Facebook, Instagram } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import logo from '/favicon.png';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.7 },
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial={{ opacity: 0, y: 50 }}
            className="footer"
        >
            {/* Remove the container if you want to extend the Footer to full width. */}
            <div className="" style={{ padding: 0, margin: 0 }}>
                {/* Footer */}
                <footer className="text-center text-lg-start text-white" style={{ background: '#eeeeee' }}>
                    {/* Section: Social media */}
                    <section className="d-flex justify-content-between p-4" style={{ background: '#1757ab' }}>
                        {/* Left */}
                        <div className="me-5 flex-1">
                            <span>Get connected with us on social networks:</span>
                        </div>
                        {/* Right */}
                        <div className='flex-2'>
                            <a href="https://www.facebook.com/profile.php?id=61552018766463&mibextid=ZbWKwL" target='_blank' className="text-white me-4 text-white"><Facebook /></a>
                            <a href="https://www.instagram.com/thecapitalacademy.online?igsh=MWF6eGgzcnZyYTNjNw%3D%3D" target='_blank' className="text-white me-4"><Instagram /></a>
                        </div>
                    </section>
                    {/* Section: Social media */}
                    <section className="">
                        <div className="container text-center text-secondary text-md-start mt-5">
                            <div className="row mt-3">
                                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto">
                                    <motion.img
                                        src={logo} alt="" height={120} className=''
                                    />
                                    <p className='text-capatlize text-center mt-2 text-succes fw-bold' style={{ color: "#A464B6" }}>Capitalize Your Concepts With The Capital Academy</p>
                                </div>
                                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                                    <h6 className="text-uppercase fw-bold" style={{color:'#1F63BE'}}>Our Vision</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '#7c4dff', height: '2px' }} />
                                    <p style={{color:"#454545"}}>
                                        To enhance the learning procedure of a student through our accessible, personalized, and innovative online education platform. 
                                    </p>
                                </div>
                                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                    <h6 className="text-uppercase fw-bold" style={{color:'#1F63BE'}}>Useful links</h6>
                                    <hr className="mb-4 mt-0 d-inline-block mx-auto" style={{ width: '60px', backgroundColor: '', height: '2px' }} />
                                    <p><Link style={{color:"#454545"}} to={'/contact'}>Contact</Link></p>
                                    <p><Link style={{color:"#454545"}} to={'/about'}>About us</Link></p>
                                    <p><Link  style={{color:"#454545"}} to={'/privacy-policy'}>Privacy Policy</Link></p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Copyright */}
                    <div className="text-center p-3 text-black">
                        © {new Date().getFullYear()} Copyright reserved The Capital Academy
                    </div>
                    {/* Copyright */}
                </footer>
                {/* Footer */}
            </div>
        </motion.div>
    )
}

export default Footer;
