import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
const Footer = React.lazy(() => import('../footer/Footer'));
import vison from '/png/vison.png';
import mission from '/png/mission.png';
import Preloader from '../preloader/Preloader';

const About_Us = () => {
    return (
        <div>
            <div className="about-us">
                <section className="py-5">
                    <div className="container py-3">
                        <div className="row align-items-center gx-4">
                            <motion.div
                                className="col-md-6 offset-md-1"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="ms-md-2 ms-lg-5">
                                    <h2 className="display-5 fw-bold mb-5 text-center py-3" style={{ fontFamily: 'fredoka' }}>Our Vision</h2>
                                    <p className="lead">To enhance the learning procedure of a student through our accessible, personalized, and innovative online education platform. </p>
                                </div>
                            </motion.div>
                            <motion.div
                                className="col-md-5"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="ms-md-2 ms-lg-5">
                                    <img className="img-fluid rounded-4 shadow" src={vison} alt="Vision" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-5">
                    <div className="container">
                        <div className="row align-items-center gx-4">
                            <motion.div
                                className="col-md-5"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="ms-md-2 ms-lg-5">
                                    <img className="img-fluid rounded-4 shadow" src={mission} alt="Mission" />
                                </div>
                            </motion.div>
                            <motion.div
                                className="col-md-6 offset-md-1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="ms-md-1 ms-lg-2">
                                    <h2 className="display-5 fw-bold my-5 text-center" style={{ fontFamily: 'fredoka' }}>Our Mission</h2>
                                    <p className="lead">Our mission is to provide a diverse range of high-quality courses, taught by industry experts, leveraging cutting-edge technology to deliver engaging and interactive learning experiences. We aim to remove barriers to education by offering flexible, affordable, and convenient access to knowledge anytime, anywhere.</p>
                                    <p className="lead">Through continuous improvement and collaboration with learners and educators, we strive to cultivate a supportive community where individuals can thrive academically, professionally, and personally, unlocking their full potential and contributing positively to society.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>
            <Suspense fallback={<Preloader />}>
                <Footer />
            </Suspense>
        </div>
    );
}

export default About_Us;
