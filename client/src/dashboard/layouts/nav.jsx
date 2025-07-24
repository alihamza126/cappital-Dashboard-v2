import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { alpha } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

import { useResponsive } from '/src/hooks/use-responsive';
import Scrollbar from '../components/scrollbar';
import { NAV } from './config-layout';
import { NavLink, useLocation } from 'react-router-dom';
import { AdminPanelSettings, AutoGraph, BarChart, BookmarkAdd, Calculate, CalendarMonth, Home, ManageHistory } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import './style.scss'
import AccountPopover from './common/account-popover';
// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const { user = '' } = useSelector(state => state.auth?.user?.user || '');
  const pathname = useLocation().pathname;
  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);


  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      <div className="mt-2"></div>
      <Box
        sx={{
          my: 3,
          mx: 2.5,
          py: 2,
          px: 2.5,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          bgcolor: (theme) => alpha(theme.palette.grey[700], 0.12),
        }}
        className=""
      >
        {/* <Avatar src={user?.profileUrl} alt="photoURL" /> */}
        <AccountPopover />

        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2" fontWeight={"bold"} color={"burlywood"} fontSize={"18px"}>{user.username}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} fontWeight={"500"}>
            Welcome Back
          </Typography>
        </Box>
      </Box>

      {/* //Home */}
      <NavLink to={'/'} className="navlink nav-shoadow rounded-4 overflow-hidden text-decoration-none shadow-lg mt-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "21px", mb: "4px" }}>
            <Home />
          </Box>
          <Box component="span" fontWeight={"bold"}>Home</Box>
        </ListItemButton>
      </NavLink>
      {/* //dashboard */}
      <NavLink to={'/dashboard'} className="navlink nav-shoadow rounded-4 overflow-hidden text-decoration-none shadow-lg mt-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "21px", mb: "4px" }}>
            <AutoGraph />
          </Box>
          <Box component="span" fontWeight={"bold"}>My Courses</Box>
        </ListItemButton>
      </NavLink>

      {/* //mystats */}
      <NavLink to={'/dashboard/stats'} className="navlink nav-shoadow rounded-4 overflow-hidden  text-decoration-none shadow-lg mt-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            // padding: "10px",
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "px", }}>
            <BarChart />
          </Box>
          <Box component="span" fontWeight={"bold"}>  My Statistics </Box>
        </ListItemButton>
      </NavLink>

      {/* study planner */}
      <NavLink to={'/dashboard/planner'} className="navlink nav-shoadow rounded-4 overflow-hidden  text-decoration-none shadow-lg mt-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "px", }}>
            <CalendarMonth />
          </Box>
          <Box component="span" fontWeight={"bold"}>Study Planner</Box>
        </ListItemButton>
      </NavLink>

      {/* Saved MCQs*/}
      <NavLink to={'/dashboard/saved-mcqs'} className="navlink nav-shoadow rounded-4 overflow-hidden  text-decoration-none shadow-lg mt-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "23px", mb: "5px" }}>
            <BookmarkAdd />
          </Box>
          <Box component="span" fontWeight={"bold"}>Saved MCQS</Box>
        </ListItemButton>
      </NavLink>

      {/*Calculator*/}
      <NavLink to={'/dashboard/calculator'} className="navlink nav-shoadow rounded-4 overflow-hidden  text-decoration-none shadow-lg mt-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            // padding: "10px",
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "21px", mb: "4px" }}>
            <Calculate />
          </Box>
          <Box component="span" fontWeight={"bold"}>Aggregate Calculator</Box>
        </ListItemButton>
      </NavLink>

      {/*Course Details*/}
      <NavLink to={'/dashboard/course-details'} className="navlink nav-shoadow rounded-4 overflow-hidden  text-decoration-none shadow-lg my-2">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            // padding: "10px",
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "21px", mb: "4px" }}>
            <ManageHistory />
          </Box>
          <Box component="span" fontWeight={"bold"}>Course Details</Box>
        </ListItemButton>
      </NavLink>


      {/* //profile Settings */}
      <hr />
      <NavLink to={'/dashboard/Profile'} className="navlink nav-shoadow rounded-4 overflow-hidden  text-decoration-none shadow-lg mb-3">
        <ListItemButton
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            textAlign: "center",
            padding: "14px 10%",
            ...(true && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2, fontSize: "21px", mb: "4px" }}>
            <AdminPanelSettings />
          </Box>
          <Box component="span" fontWeight={"bold"}>Profile Setting</Box>
        </ListItemButton>
      </NavLink>
    </Stack>
  );



  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >

      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
