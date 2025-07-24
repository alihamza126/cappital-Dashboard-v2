import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './board.scss';
import img1 from '/boards/img1.png';
import img2 from '/boards/img2.png';
import img3 from '/boards/img3.png';
import img4 from '/boards/img4.jpg';
import img5 from '/boards/img5.png';
import img6 from '/boards/img6.png';

const Boards = () => {
    const data = [img1, img2, img3, img4, img5, img6];

    // Use useInView to detect when the component is in view
    const { ref, inView } = useInView({
        triggerOnce: true, // Trigger animation only once
        threshold: 0.4, // Trigger animation when component is 20% in view
    });

    return (
        <div className="boards mt-4" ref={ref}>
            <div className="board-container container">
                <h2 className="mt-5 board-title text-center fw-bold text-dark ">Best For</h2>
                <div className="row">
                    {data.map((img, index) => (
                        <motion.div
                            key={index}
                            className="col-md-3 col-6"
                            initial={{ opacity: 0, y: 50 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="city-card mt-3">
                                <img src={img} alt="" style={{ overflow: 'hidden' }}/>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Boards;
