import React from 'react';
import AppBar from '@mui/material/AppBar';
import './stickynav.scss'; // Import your CSS file for additional styling
import TopBar from '../../components/topbar/TopBar';
import Navbar from '../../components/navbar/Navbar';
import { useState } from 'react';
import { useEffect } from 'react';

const StickyNav = () => {
    const [isSmall, setIsSmall] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 100) {
                setIsSmall(true);
            } else {
                setIsSmall(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`sticky-navbar ${isSmall ? 'stickynavsmall' : ''}`}>
            <AppBar position="static" style={{ background: "#ffffff", boxShadow: "0px 0px 10px #00000021" }}>
                <TopBar />
                <Navbar />
            </AppBar>
        </div>
    );
};

export default StickyNav;
