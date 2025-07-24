import React, { useEffect, useState } from 'react'
import './topbar.scss';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from '/logo.png'
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../baseUrl.js';
import { logout } from '../../redux/authSlice';

const TopBar = () => {
    const [open, setOpen] = useState(sessionStorage.getItem('topCapitalAcademyTopBar')==='false'?false:true);
    const dispatch=useDispatch()
    const isLogin = useSelector((state) => state.auth.isAuthenticated);
    const { enqueueSnackbar } = useSnackbar();
    const [topbarContent, setTopbarContent] = useState('Welcome Dear Student! May Your Journey Be Filled With Joy & Success');

    const handleLogout = async () => {
        try {
            const res = await axiosInstance.get('/auth/logout');
            localStorage.removeItem('user');
            dispatch(logout());
            enqueueSnackbar("you are logged out", { variant: "warning" });
            window.location.reload();
        } catch (error) {
        }
    }
    useEffect(() => {
        try {
            const fetch = async () => {
                const res = await axiosInstance.get('/homepage/topbar');
                setTopbarContent(res?.data?.tcontent);
            }
            fetch()
        } catch (error) {

        }

    })

    const handleClose = () => {
        sessionStorage.setItem('topCapitalAcademyTopBar','false')
        setOpen(false);
    };
    return (
        <>

                <div>
                    {open && (
                        <AppBar position="static" style={{ background: '#1757AB' }}>
                            <Toolbar style={{ minHeight: '44px' }}>
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    <div className="marquee-container">
                                        <marquee className="marquee-text" behavior='scroll' direction="left" scrollamount="4" loop>{topbarContent}</marquee>
                                    </div>
                                </Typography>
                                <IconButton color="inherit" onClick={handleClose} aria-label="Close">
                                    <CloseIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                    )}
                </div>

            <div className="topbar">
                <div className="topbar-container">
                    <div className="brand">
                        <div className="left">
                            <Link to={'/'}><img src={logo} width={'100%'} alt="logo" /></Link>
                        </div>
                        <div className="middle contact-img bg-light rounded-4 py-1 px-3 shadow-sm">
                            <div className="icon">
                                <a href="whatsapp://send?abid=03479598144&text=Hello%2C%20World!" aria-label='whatsapp'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="44px" height="44px" clipRule="evenodd"><path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z" /><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z" /><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z" /><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z" /><path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd" /></svg>
                                </a>
                                <a href="tel:0347-9598144" aria-label='phone'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="44px" height="44px"><path fill="#1757AB" d="M13,42h22c3.866,0,7-3.134,7-7V13c0-3.866-3.134-7-7-7H13c-3.866,0-7,3.134-7,7v22	C6,38.866,9.134,42,13,42z" /><path fill="#fff" d="M35.45,31.041l-4.612-3.051c-0.563-0.341-1.267-0.347-1.836-0.017c0,0,0,0-1.978,1.153	c-0.265,0.154-0.52,0.183-0.726,0.145c-0.262-0.048-0.442-0.191-0.454-0.201c-1.087-0.797-2.357-1.852-3.711-3.205	c-1.353-1.353-2.408-2.623-3.205-3.711c-0.009-0.013-0.153-0.193-0.201-0.454c-0.037-0.206-0.009-0.46,0.145-0.726	c1.153-1.978,1.153-1.978,1.153-1.978c0.331-0.569,0.324-1.274-0.017-1.836l-3.051-4.612c-0.378-0.571-1.151-0.722-1.714-0.332	c0,0-1.445,0.989-1.922,1.325c-0.764,0.538-1.01,1.356-1.011,2.496c-0.002,1.604,1.38,6.629,7.201,12.45l0,0l0,0l0,0l0,0	c5.822,5.822,10.846,7.203,12.45,7.201c1.14-0.001,1.958-0.248,2.496-1.011c0.336-0.477,1.325-1.922,1.325-1.922	C36.172,32.192,36.022,31.419,35.45,31.041z" /></svg>
                                </a>
                                <strong className='fs-5' style={{ color: "Highlight" }}>0347-9598144</strong>
                            </div>
                        </div>
                        <div className="right">
                            {!isLogin && <Link to={'/signin'}><button className='login-btn'>Login</button></Link>}
                            {!isLogin && <Link to={'/signup'}><button className='signup-btn'>Sign Up</button></Link>}
                            {isLogin && <Link to={""}><button onClick={handleLogout} className='logout-btn'>Logout</button></Link>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopBar