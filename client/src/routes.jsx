import React, { Suspense, lazy, useRef, useState } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, TextField, Button, IconButton } from '@mui/material';
import Home from './pages/home/Home.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import Signup from './pages/signup/Signup.jsx';
import ErrorPage from './pages/error/ErrorPage.jsx';
import Aggerate from './pages/aggerate/Aggerate.jsx';
import SignIn from './pages/signin/SignIn.jsx';
import Checkout from './components/checkout/Checkout.jsx';
import Forgot from './components/reset-password/Forgot.jsx';
import SetPassword from './components/reset-password/SetPassword.jsx';
import Calculator from './components/calculator/Calculator.jsx';
const Mcq = lazy(() => import('./pages/mcq/Mcq.jsx'))

// admin pages
const AdminHome = lazy(() => import('./admin/pages/home/AdminHome.jsx'));
const Reviews = lazy(() => import('./admin/components/reviews/Reviews.jsx'));
const Topbar = lazy(() => import('./admin/components/topbar/Topbar.jsx'));
const Courses = lazy(() => import('./admin/components/courses/Courses.jsx'));
const RefCode = lazy(() => import('./admin/components/refCode/RefCode.jsx'));
const Dashboard = lazy(() => import('./admin/components/dashboard/Dashboard.jsx'));
import { CoursePayRequest } from './admin/section/request-course/view/index.js';
const McqAdmin = lazy(() => import('./admin/section/mcq/McqAdmin.jsx'));
const ReportMcq = lazy(() => import('./admin/components/report/ReportMcq.jsx'));
import { McqView } from './admin/section/mcq-view/view/index.js';
const Settings = lazy(() => import('./admin/components/settings/Settings.jsx'))
const SeriesManagement = lazy(() => import('./admin/components/series/SeriesManagement.jsx'));
const TestManagement = lazy(() => import('./admin/components/series/TestManagement.jsx'));
const EnrollmentManagement = lazy(() => import('./admin/components/series/EnrollmentManagement.jsx'));
const PaymentManagement = lazy(() => import('./admin/components/series/PaymentManagement.jsx'));

// dashboard pages
const DashboardLayout = lazy(() => import('./dashboard/layouts/index.jsx'));
const AppView = lazy(() => import('./dashboard/section/overview/view/app-view.jsx'));
const Profile = lazy(() => import('./dashboard/section/profile/Profile.jsx'));
const SubjectPage = lazy(() => import('./dashboard/section/subjects/SubjectPage.jsx'))
import Chapters from './dashboard/section/Chapters/Chapters.jsx';
import SelectSubject from './dashboard/section/selectSubject/SelectSubject.jsx';
const Topic = lazy(() => import('./dashboard/components/topic/Topic.jsx'))
const CourseDetails = lazy(() => import('./dashboard/section/course-details/CourseDetails.jsx'))
const Planner = lazy(() => import('./dashboard/section/planner/Planner.jsx'));
const SavedMcqs = lazy(() => import('./dashboard/section/savedmcq/SavedMcq.jsx'));

import axios from 'axios';
import { useEffect } from 'react';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Close } from '@mui/icons-material';
import { logout } from './redux/authSlice.js';
import { Users } from './admin/section/users/view/index.js';
import PrivacyPolicy from './pages/privacy/Privacy-policy.jsx';
import axiosInstance from './baseUrl.js';
import CrashError from './pages/crash/CrashError.jsx';





const Routes = () => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/userinfo');
        if (res.data.user) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        setIsAuthenticated(false)
      }
    }
    fetchUser()
  }, [])
  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get('/auth/logout');
      localStorage.removeItem('user');
      dispatch(logout());
      showCenteredSnackbar("Session Expire Login Again", "warning");
    } catch (error) {
    }
  }

  const adminPasswordRef = useRef(null);

  // Lazyloader custom function 
  const LazyLoader = ({ children }) => (
    <Suspense fallback={<CircularProgress style={{ marginLeft: "20px" }} />}>
      {children}
    </Suspense>
  );
  const handleAdminPasswordSubmit = async (e) => {
    e.preventDefault();
    const enteredPassword = adminPasswordRef.current.value;
    try {
      // Attempt to fetch the password from the database
      const res = await axiosInstance.get('/admin');
      // Check if the fetched password matches the entered password
      if (res?.data?.password) {
        if (enteredPassword === res.data.password) {
          setIsAdminAuthenticated(true);
        } else {
          alert("Incorrect password. Please try again.");
        }
      } else {
        throw new Error('Password not found in the database.');
      }
    } catch (error) {
      // If there's an error fetching the password, apply the default password
      if (error.response || enteredPassword !== "a63s2cI#a") {
        alert("Something went wrong or incorrect password. Please try again.");
      } else {
        setIsAdminAuthenticated(true);
      }
    }
  };


  const ProtectedRoute = ({ children }) => {
    if (isAuthenticated === null) {
      return <CircularProgress />;
    }
    if (!isAuthenticated) {
      handleLogout();
      return <Navigate to="/signin" />;
    }
    if (isAuthenticated) {
      return children;
    }
  };

  const AdminProtectedRoute = ({ children }) => {
    if (!isAdminAuthenticated) {
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <form onSubmit={handleAdminPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField
                type="password"
                label="Admin Password"
                inputRef={adminPasswordRef}
                variant="outlined"
                style={{ marginBottom: '10px' }}
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </div>
        </>
      );
    }
    if (isAdminAuthenticated) {
      return children;
    }
  };




  // Main routes object
  const router = createBrowserRouter([
  
    // ---------------Admin page routes----------------
    {
      path: "/",
      element: <AdminProtectedRoute><LazyLoader><AdminHome /></LazyLoader></AdminProtectedRoute>,
      errorElement: <CrashError/>,
      children: [
        {
          path: "", // path relative to "/admin"
          errorElement: <CrashError />,
          element: <LazyLoader><Dashboard /></LazyLoader>,
        },
        {
          path: "users",
          errorElement: <CrashError />,
          element: <LazyLoader><Users /></LazyLoader>,
        },
        {
          path: "review",
          errorElement: <CrashError />,
          element: <LazyLoader><Reviews /></LazyLoader>,
        },
        {
          path: "topbar",
          errorElement: <CrashError />,
          element: <LazyLoader><Topbar /></LazyLoader>,
        },
        {
          path: "courses",
          errorElement: <CrashError />,
          element: <LazyLoader><Courses /></LazyLoader>,
        },
        {
          path: "referral",
          errorElement: <CrashError />,
          element: <LazyLoader><RefCode /></LazyLoader>,
        },
        {
          path: "course-request",
          errorElement: <CrashError />,
          element: <LazyLoader><CoursePayRequest /></LazyLoader>,
        },
        {
          path: "add-mcq",
          errorElement: <CrashError />,
          element: <LazyLoader><McqAdmin /></LazyLoader>
        },
        {
          path: "view-mcq",
          errorElement: <CrashError />,
          element: <LazyLoader><McqView /></LazyLoader>
        },
        {
          path: "report-mcq",
          errorElement: <CrashError />,
          element: <LazyLoader><ReportMcq /></LazyLoader>
        },
        {
          path: "settings",
          errorElement: <CrashError />,
          element: <LazyLoader><Settings /></LazyLoader>
        },
        {
          path: "series",
          errorElement: <CrashError />,
          element: <LazyLoader><SeriesManagement /></LazyLoader>
        },
        {
          path: "tests",
          errorElement: <CrashError />,
          element: <LazyLoader><TestManagement /></LazyLoader>
        },
        {
          path: "enrollments",
          errorElement: <CrashError />,
          element: <LazyLoader><EnrollmentManagement /></LazyLoader>
        },
        {
          path: "payments",
          errorElement: <CrashError />,
          element: <LazyLoader><PaymentManagement /></LazyLoader>
        }
      ],
    },
    // --------------Page not found route----------------
    {
      path: "*",
      element: <ErrorPage />,
      errorElement: <CrashError />,
    },
  ]);

  // Provider for router 
  return (
    <RouterProvider router={router} />
  );
}

export default Routes;
