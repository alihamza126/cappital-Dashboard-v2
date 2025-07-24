import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from '../../hooks/use-responsive';

import { bgBlur } from '/src/theme/css';

import { NAV, HEADER } from './config-layout';
import { Apps } from '@mui/icons-material';
import Navbar from '../../components/navbar/Navbar';


// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton onClick={onOpenNav} className='shadow-sm dashboard-nav-btn' sx={{bgcolor: '#1757AB',color:'whitesmoke',pl:2,py:1.3,borderRadius:0}}>
          <Apps fontSize='90px'/>
        </IconButton>
      )}



      {/* <Box sx={{ flexGrow: 1 }} /> */}
      {/* <Stack direction="row" alignItems="center" spacing={1}>
        <AccountPopover />
      </Stack> */}
    </>
  );

  return (
    <>

      <AppBar
        sx={{
          boxShadow: 'none',
          height: HEADER.H_MOBILE,
          zIndex: theme.zIndex.appBar + 1,
         
          bgcolor:'transparent',
          transition: theme.transitions.create(['height'], {
            duration: theme.transitions.duration.shorter,
          }),
          ...(lgUp && {
            width: `calc(100% - ${NAV.WIDTH + 1}px)`,
            height: HEADER.H_DESKTOP,
            // position:"sticky",
            // top:"1rem"
          }),
        }}
      >
        <Toolbar
        className='p-0 tolbar-transition'
          sx={{
            // height: 1.9,
            // px: { lg: 5 },
            borderRadius:5,
            paddingX:0,
            // marginX:1,
            // marginLeft:'-10'
            
          }}
        >
         {renderContent}
        </Toolbar>
      </AppBar>
    </>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
