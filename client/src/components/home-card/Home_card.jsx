import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './home_card.scss';

// Import card images
import card1 from '/card/card1.png';
import card2 from '/card/card2.png';
import card3 from '/card/card3.png';
import card4 from '/card/card4.png';
import card5 from '/card/card5.png';
import card6 from '/card/card6.png';
import card7 from '/card/card7.png';
import card8 from '/card/card8.png';

const HomeCard = ({ data }) => {
    // Define animation variants for each card
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    // Use useInView to detect when the component is in view
    const { ref, inView } = useInView({
        triggerOnce: true, // Keep triggering as long as it's in view
        threshold: 0.4, // Trigger animation when component is 50% in view
    });

    return (
        <div className='home-card'>
            <div className="container">
                <div className='mt-4 text-center'><h2 className='fw-bold text-dark fs-1'>Specifications</h2></div>
                <div className="row">
                    {/* Card 1 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            ref={ref} // Attach ref to the motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={card1} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Card 2 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <img src={card2} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Repeat the above pattern for other cards */}
                    {/* Card 3 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <img src={card3} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Card 4 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <img src={card4} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Card 5 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <img src={card5} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Card 6 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <img src={card6} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Card 7 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <img src={card7} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                    {/* Card 8 */}
                    <div className="col-md-3 col-6">
                        <motion.span
                            className="card"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"} // Animate when in view
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            <img src={card8} alt="" style={{ overflow: 'hidden' }} />
                        </motion.span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCard;
