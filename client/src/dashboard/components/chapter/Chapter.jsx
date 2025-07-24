import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LazyLoad from 'react-lazyload';
import loadingGif from '/loading.gif'; // Path to your loading spinner GIF
import './chapter.scss'; // Ensure your SCSS is correctly imported
import LockIcon from '@mui/icons-material/Lock';

const Chapter = ({ name, img, isLocked }) => {
    const { subject, chapter } = useParams();
    const [loaded, setLoaded] = useState(false);

    const handleImageLoad = () => {
        setLoaded(true);
    };

    return (
        <div className={`subject-page col-lg-3 col-md-4 col-6 ${isLocked ? 'locked' : ''}`}>
            <Link to={isLocked?"#":`/dashboard/subject/${subject}/${chapter}/${name?.toLowerCase()}`} className='text-decoration-none'>
                <div className="subject-card">
                    <div className="image-box rounded overflow-hidden">
                        <LazyLoad height={200} offset={100} once={true}
                            placeholder={<img src={loadingGif} alt="Loading..." />}
                        >
                            <motion.img
                                src={img}
                                alt={name}
                                className={`lazyload ${loaded ? 'lazyloaded' : ''}`}
                                initial={{ opacity: 0, scale: 1.06 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.13 }}
                                onLoad={handleImageLoad}
                            />
                        </LazyLoad>
                        {!loaded && <div className="placeholder" style={{ backgroundImage: `url(${loadingGif})` }}></div>}
                        {isLocked && (
                            <div className="lock-overlay">
                                <LockIcon fontSize='large' sx={{background:'#1757AB',padding:'2px',borderRadius:'22px'}}/>
                            </div>
                        )}
                    </div>
                    <div className="title text-center py-2">
                        <p>{name}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Chapter;
