import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarToggle } from '../../../redux/sidebarToggle';
import { Add, AdminPanelSettings, Book, Report, Settings, ViewAgenda } from '@mui/icons-material';
import './sidebar.scss'

const Sidebar = () => {
    const { sidebarToggle } = useSelector(state => state.sidebarToggle);
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(setSidebarToggle(!sidebarToggle));
        document.body.classList.toggle('sidebar-toggled');
    };

    useEffect(() => {
        if (window.innerWidth > 540) {
            dispatch(setSidebarToggle(true));
        }
    }, [dispatch]);

    return (
        <div className={` d-flex flex-column flex-shrink-0 ${sidebarToggle ? '' : 'sidebar-close'}`} id="sidebar">
            <ul className="w-100 nav flex-column bg-gradient-primary sidebar sidebar-dark accordion">
                {/* Sidebar - Brand */}
                <li className="nav-item">
                    <a className="nav-link d-flex align-items-center justify-content-center" href="#">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <i className="fas fs-1 text-white  fa-laugh-wink"></i>
                        </div>
                        <div className="sidebar-brand-text mx-3">Admin</div>
                    </a>
                </li>
                <hr className="my-0" />
                {/* Dashboard */}
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <hr />
                {/* Pages */}
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-toggle="collapse" href="#collapseTwo" aria-expanded="false">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Home Page</span>
                    </a>
                    <div id="collapseTwo" className="collapse" data-bs-parent="#sidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Make Changes:</h6>
                            <Link to="/topbar" className="collapse-item">Topbar</Link>
                            <Link to="/review" className="collapse-item">Student Reviews</Link>
                        </div>
                    </div>
                </li>
                {/* Courses */}
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-toggle="collapse" href="#collapseThree" aria-expanded="false">
                        <i className="fas fa-fw fa-cog"></i>
                        <span>Courses info</span>
                    </a>
                    <div id="collapseThree" className="collapse" data-bs-parent="#sidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Make Changes:</h6>
                            <Link to="/courses" className="collapse-item">Update courses</Link>
                            <Link to="/referral" className="collapse-item">Referrals</Link>
                        </div>
                    </div>
                </li>
                {/* Series Management */}
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-toggle="collapse" href="#collapseSeries" aria-expanded="false">
                        <i className="fas fa-fw fa-book"></i>
                        <span>Series Management</span>
                    </a>
                    <div id="collapseSeries" className="collapse" data-bs-parent="#sidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Series Operations:</h6>
                            <Link to="/series" className="collapse-item">Manage Series</Link>
                            <Link to="/tests" className="collapse-item">Manage Tests</Link>
                            <Link to="/enrollments" className="collapse-item">Manage Enrollments</Link>
                            <Link to="/payments" className="collapse-item">Manage Payments</Link>
                            <Link to="/mcq-management" className="collapse-item">Manage MCQs</Link>
                        </div>
                    </div>
                </li>
                <hr />
                {/* Addons */}
                <li className="nav-item">
                    <Link to="/users" className="nav-link">
                        <AdminPanelSettings />
                        <span>Manage Users</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/course-request" className="nav-link">
                        <Book />
                        <span>Course Requests</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" data-bs-toggle="collapse" href="#collapsePages" aria-expanded="false">
                        <i className="fas fa-fw fa-folder"></i>
                        <span>Manage MCQ's</span>
                    </a>
                    <div id="collapsePages" className="collapse" data-bs-parent="#sidebar">
                        <div className="bg-white py-1 collapse-inner rounded">
                            <h6 className="collapse-header">MCQS:</h6>
                            <Link to="/add-mcq" className="collapse-item">
                                <Add /> Add New MCQ
                            </Link>
                            <Link to="/view-mcq" className="collapse-item">
                                <ViewAgenda /> View MCQ's
                            </Link>
                            <Link to="/report-mcq" className="collapse-item">
                                <Report /> Reported MCQ's
                            </Link>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <Link to="/settings" className="nav-link">
                        <Settings />
                        <span>Admin Settings</span>
                    </Link>
                </li>
                <hr className="d-none d-md-block" />
                {/* Sidebar Toggler */}
                {/* <div className="text-center d-none d-md-inline">
                    <button onClick={handleToggle} className="btn btn-primary rounded-circle border-0" id="sidebarToggle"></button>
                </div> */}
            </ul>
        </div>
    );
};

export default Sidebar;
