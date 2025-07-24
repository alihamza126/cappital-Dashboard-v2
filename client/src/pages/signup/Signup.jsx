import React, { Suspense, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import TopBar from '../../components/topbar/TopBar'
import Preloader from '../../components/preloader/Preloader'
const SignUp = React.lazy(() => import('../../components/register/Signup'));
import { useSelector, useDispatch } from 'react-redux'
import { setError, setLoading, setUser } from '../../redux/authSlice'
import './signup.scss'

const Signup = () => {
  const [loading, setLoad] = useState(true);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth);

  useEffect(() => {
    const handleLoad = () => {
      setLoad(false);
    }
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
      setLoad(false);
    };
  }, [isLoading]);

  return (
    <div style={{ position: "relative" }} className="signup-page">
      <div className="position-relative bg-light">
        <TopBar />
        <Navbar />
      </div>
      <Suspense fallback={<Preloader />}>
        <SignUp />
      </Suspense>
    </div>
  )
}

export default Signup
