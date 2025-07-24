import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarToggle } from '../../../redux/sidebarToggle';

const Navbar = () => {
    const dispatch = useDispatch();
    const { sidebarToggle } = useSelector(state => state.sidebarToggle);
    const handleToggle = () => {
        dispatch(setSidebarToggle(!sidebarToggle));
        document.getElementsByTagName('body')[0].classList.toggle('sidebar-toggled');
    }

    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                {/* <!-- Sidebar Toggle (Topbar) --> */}
                <button onClick={handleToggle} id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"></i>
                </button>
                {/* <!-- Topbar Navbar --> */}
                <ul className="navbar-nav ml-auto">

                    {/* <!-- Nav Item - Alerts --> */}
                    {/* <li className="nav-item dropdown no-arrow mx-1" style={{ background: "transparent" }}>
                        <a className="nav-link dropdown-toggle bg-info rounded-3 h-100 py-3" href="#" id="alertsDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-bell fa-fw"></i>
                            <span className="badges badge-counter">3+</span>
                        </a>
                        <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                            aria-labelledby="alertsDropdown">
                            <h6 className="dropdown-header">
                                Alerts Center
                            </h6>
                            <a className="dropdown-item d-flex align-items-center" href="#">
                                <div className="mr-3">
                                    <div className="icon-circle bg-primary">
                                        <i className="fas fa-file-alt text-white"></i>
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-gray-500">December 12, 2019</div>
                                    <span className="font-weight-bold">A new monthly report is ready to download!</span>
                                </div>
                            </a>
                        </div>
                    </li>
                    <div className="topbar-divider d-none d-sm-block"></div> */}
                </ul>
            </nav>
        </>
    )
}

export default Navbar