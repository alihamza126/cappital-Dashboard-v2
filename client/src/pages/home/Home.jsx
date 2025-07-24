import React, { useEffect, useState } from 'react'
import TopBar from '../../components/topbar/TopBar'
import Home_card from '../../components/home-card/Home_card'
import './home.scss'

//material ui
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';


import Header from '../../components/header/Header';
import Pricing from '../../components/pricing/Pricing'
import Boards from '../../components/board/Boards'
import Review from '../../components/review/Review'
import Features from '../../components/features/Features'
import Accordion from '../../components/accordians/Accordion'
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import WhatsAppFloatingIcon from '../../components/whatsppFloat/Whatsapp'
import StickyNav from '../stickyNav/StickyNav';
// 
const Home = (props) => {

  //scroll effect
  function ScrollTop(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        '#back-to-top-anchor'
      );

      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999999 }}
        >
          {children}
        </Box>
      </Fade>
    );
  }
  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
  };
  //scroll effect navbar
  const [isTopbarSticky, setIsTopbarSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 110) {
        setIsTopbarSticky(true);
      } else {
        setIsTopbarSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div id='back-to-top-anchor' style={{ position: 'relative' }}></div>
      <WhatsAppFloatingIcon />

      <StickyNav/>
      
      <Header />
      <Home_card />
      <Boards />
      <Pricing />
      <Features />
      <div className='mt-2'> <Review /></div>
      <Accordion />
      <Footer />
    </div>
  )
}

export default Home