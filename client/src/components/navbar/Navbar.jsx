import React, { useEffect } from 'react'
import './navbar.scss'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { closeSnackbar, useSnackbar } from 'notistack';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import axiosInstance from '../../baseUrl.js';
import logo from '/logo.png'

const Navbar = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation()
    useEffect(() => {
        const unlisten = () => {
            try {
                document.body.style.overflow = 'auto';
                const offcanvas = document.querySelector('.offcanvas');
                if (offcanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
            } catch (error) {
                console.log(error)
            }
        };

        unlisten();

        return () => {
            unlisten();
        };
    }, [location]);



    const showCenteredSnackbar = (message, variant) => {
        enqueueSnackbar(message, {
            variant: variant,
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            action: (
                <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar()}>
                    <Close fontSize="small" />
                </IconButton>
            )
        });
    };

    const handleMdcat = async () => {
        try {
            const response = await axiosInstance.get('/userinfo');
            if (response?.data?.user?.isMdcat) {
                navigate('/dashboard/subject/mdcat');
            }
            else if (!response?.data?.user?.isMdcat) {
                showCenteredSnackbar('Checkout course to procede further !', 'info');
                navigate('/checkout?mdcat');
            } else {
                navigate('/dashboard')
            }
        } catch (error) {
            navigate('/dashboard')
            console.log(error)
        }
    }
    const handleNums = async () => {
        try {
            const response = await axiosInstance.get('/userinfo');
            if (response?.data?.user?.isNums) {
                navigate('/dashboard/subject/nums');
            }
            else if (!response?.data?.user?.isNums) {
                showCenteredSnackbar('Checkout course to procede further!', 'info');
                navigate('/checkout?nums');
            }
        } catch (error) {
            navigate('/dashboard')
            console.log(error)
        }
    }


    return (
        <div >
            <nav className="navbar navbar-expand-lg navbar-light sticky-top">
                <div className="container p-0 pt-md-1 px-4">
                    <button className="navbar-toggler outline-none border-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <span className="navbar-brand" href="#">
                        <div className="middle contact-img" style={{ fontSize: '12px' }}>
                            <div className="icon bg-light rounded-4 px-3 shadow-sm" style={{ marginRight: '-34px', paddingTop: '2px', paddingBottom: '2px' }}>
                                <a href="whatsapp://send?abid=03479598144&text=Hello%2C%20World!">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="38px" height="38px" clipRule="evenodd"><path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z" /><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z" /><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z" /><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z" /><path fill="#fff" fillRule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clipRule="evenodd" /></svg>
                                </a>
                                <a href="tel:0347-9598144" style={{ marginLeft: '-3px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="33px" height="34px">
                                        <path fill="#1757AB" d="M13,42h22c3.866,0,7-3.134,7-7V13c0-3.866-3.134-7-7-7H13c-3.866,0-7,3.134-7,7v22	C6,38.866,9.134,42,13,42z" />
                                        <path fill="#fff" d="M35.45,31.041l-4.612-3.051c-0.563-0.341-1.267-0.347-1.836-0.017c0,0,0,0-1.978,1.153	c-0.265,0.154-0.52,0.183-0.726,0.145c-0.262-0.048-0.442-0.191-0.454-0.201c-1.087-0.797-2.357-1.852-3.711-3.205	c-1.353-1.353-2.408-2.623-3.205-3.711c-0.009-0.013-0.153-0.193-0.201-0.454c-0.037-0.206-0.009-0.46,0.145-0.726	c1.153-1.978,1.153-1.978,1.153-1.978c0.331-0.569,0.324-1.274-0.017-1.836l-3.051-4.612c-0.378-0.571-1.151-0.722-1.714-0.332	c0,0-1.445,0.989-1.922,1.325c-0.764,0.538-1.01,1.356-1.011,2.496c-0.002,1.604,1.38,6.629,7.201,12.45l0,0l0,0l0,0l0,0	c5.822,5.822,10.846,7.203,12.45,7.201c1.14-0.001,1.958-0.248,2.496-1.011c0.336-0.477,1.325-1.922,1.325-1.922	C36.172,32.192,36.022,31.419,35.45,31.041z" />
                                    </svg>
                                </a>
                                <strong style={{ color: "Highlight", fontSize: '14px' }}>0347-9598144</strong>
                            </div>
                        </div>
                    </span>

                    {/* <!-- Off-Canvas Menu --> */}
                    <div className="offcanvas offcanvas-start" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                                <Link to={'/'}><img height={45} src={logo} alt="logo" /></Link>
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink to='/' className='nav-link'>Home</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to='/calculator' className='nav-link'>Aggregate Calculator</NavLink>
                                </li>
                                <li className="nav-item" onClick={handleNums}>
                                    <a href='#' className='nav-link'>NUMS MCQs</a>
                                </li>
                                <li className="nav-item" onClick={handleMdcat}>
                                    <a href='#' className='nav-link'>MDCAT MCQs</a>
                                </li>
                               
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="offcanvasDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Courses
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="offcanvasDropdown">
                                        <li><Link to={{ pathname: "/checkout", search: "mdcat" }} className="dropdown-item">MDCAT</Link></li>
                                        <li><Link to={{ pathname: "/checkout", search: "nums" }} className="dropdown-item">NUMS</Link></li>
                                        <li><Link to={{ pathname: "/checkout", search: "mdcat+nums" }} className="dropdown-item">MDCAT + NUMS</Link></li>
                                    </ul>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dashboard
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link to='/dashboard' className="dropdown-item text-decoration-none">My Courses</Link></li>
                                        <li><Link to='/dashboard/stats' className="dropdown-item text-decoration-none">Statistics</Link></li>
                                        <li><Link to='/dashboard/profile' className="dropdown-item text-decoration-none">My Account</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar









