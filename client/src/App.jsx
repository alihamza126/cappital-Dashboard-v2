import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes.jsx';
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Routes from './routes.jsx';
import { logout, setUser } from './redux/authSlice.js';
import axiosInstance from './baseUrl.js';

const App = ({ props }) => {
  const dispatch = useDispatch();
  const [reduxUser, setReduxUser] = useState(useSelector((state) => state.auth?.user?.user?.user));

  // Function component ScrollTop
  function ScrollTop(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    // Scroll to top handler
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

  // Effect to check session validity only on window load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axiosInstance.get('/verify-session');
        if (response.data.user && reduxUser.updatedAt !== response.data.user.updatedAt) {
          dispatch(setUser(response.data));
          window.location.reload(); // Reload the page
        } else {
        }
      } catch (error) {
        localStorage.removeItem('user');
        dispatch(logout());
      }
    };

    // Add event listener
    window.addEventListener('load', verifySession);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('load', verifySession);
    };
  }, [dispatch,reduxUser?.updatedAt]);

  return (
    <>
      <Routes />

      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top" style={{ position: "fixed", left: "20px", bottom: "20px" }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
};

export default App;
