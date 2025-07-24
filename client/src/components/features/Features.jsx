import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './features.scss';
import png1 from '/features/1.png';
import png2 from '/features/2.png';
import png3 from '/features/3.png';
import png4 from '/features/4.png';
import png5 from '/features/5.png';
import png6 from '/features/6.png';

const Features = () => {
    const featureData = [
        {
            img: png5,
            title: "All questions at one place",
            desc: "Get all the MdCat/NUMS McQs in one place"
        },
        {
            img: png1,
            title: "Attempt Anything, Anywhere",
            desc: "Solve the McQs using your SmartPhone, Tab or Laptop anywhere, anytime"
        },
        {
            img: png3,
            title: "Up-to-Date Content",
            desc: "Regularly updated content in accordance with the latest entry test syllabi and their pairing schemes"
        },
        {
            img: png4,
            title: "User friendly interactive interface",
            desc: "User friendly & interactive interface for the ease of students to learn in an efficient and effective way"
        },
        {
            img: png2,
            title: "Cost Effective",
            desc: "Highly cost effective platform to lower the financial burden on students"
        },
        {
            img: png6,
            title: "Scholarships Available",
            desc: "Marks based & need based scholarships available for deserving students"
        },
    ];

    // Define animation variants for left and right halves
    const cardVariants = {
        hidden: { opacity: 0, x: '-50%' },
        visible: { opacity: 1, x: '0%' },
    };

    // Use useInView to detect when the component is in view
    const { ref, inView } = useInView({
        triggerOnce: true, // Trigger animation only once
        threshold: 0.2, // Trigger animation when component is 20% in view
    });

    return (
        <div className="features mt-2" ref={ref}>
            <div className="container overflow-hidden">
                <h2 className="mt-4 mb-4 text-center fw-bold text-dark">Additional Features</h2>
                <div className="row gy-4 pb-3">
                    {featureData.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="col-12 col-md-6"
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: index * 0.11 }}
                        >
                            <div className="feature-card p-3 shadow bg-light">
                                <div className="left">
                                    <img src={feature.img} alt="" />
                                </div>
                                <div className="right">
                                    <strong>{feature.title}</strong>
                                    <p>{feature.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Features;
