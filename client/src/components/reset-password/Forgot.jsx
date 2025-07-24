import React, { useState } from 'react';
import './forgot.scss';
import StickyNav from '../../pages/stickyNav/StickyNav';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import axiosInstance from '../../baseUrl.js';
import { Spinner } from 'react-bootstrap';

const Forgot = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [mail, setMail] = useState('asdf');
  const [ isSend, setSend ]  = useState(false);
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mail === '') {
      enqueueSnackbar("Please enter your email", { variant: "error", autoHideDuration: 1500 });
      return;
    }
    else {
      try {
        setLoading(true);
        const res = await axiosInstance.post('/auth/forgot-password', {
          email: mail
        });
        enqueueSnackbar("Reset link send on your email", { variant: "success", autoHideDuration: 1500 });
        setSend(true);
        setLoading(false);
      } catch (error) {
        enqueueSnackbar("Enter Valid Email ", { variant: "error", autoHideDuration: 1500 });
        setLoading(false);
      }
    }
  }
  return (
    <>
      <StickyNav />
      <div className="forgot">
        <div className="popup">
          <form className="form">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 34 34" height="34" width="34">
                <path stroke-linejoin="round" stroke-width="2.5" stroke="#115DFC" d="M7.08385 9.91666L5.3572 11.0677C4.11945 11.8929 3.50056 12.3055 3.16517 12.9347C2.82977 13.564 2.83226 14.3035 2.83722 15.7825C2.84322 17.5631 2.85976 19.3774 2.90559 21.2133C3.01431 25.569 3.06868 27.7468 4.67008 29.3482C6.27148 30.9498 8.47873 31.0049 12.8932 31.1152C15.6396 31.1838 18.3616 31.1838 21.1078 31.1152C25.5224 31.0049 27.7296 30.9498 29.331 29.3482C30.9324 27.7468 30.9868 25.569 31.0954 21.2133C31.1413 19.3774 31.1578 17.5631 31.1639 15.7825C31.1688 14.3035 31.1712 13.564 30.8359 12.9347C30.5004 12.3055 29.8816 11.8929 28.6437 11.0677L26.9171 9.91666"></path>
                <path stroke-linejoin="round" stroke-width="2.5" stroke="#115DFC" d="M2.83331 14.1667L12.6268 20.0427C14.7574 21.3211 15.8227 21.9603 17 21.9603C18.1772 21.9603 19.2426 21.3211 21.3732 20.0427L31.1666 14.1667"></path>
                <path stroke-width="2.5" stroke="#115DFC" d="M7.08331 17V8.50001C7.08331 5.82872 7.08331 4.49307 7.91318 3.66321C8.74304 2.83334 10.0787 2.83334 12.75 2.83334H21.25C23.9212 2.83334 25.2569 2.83334 26.0868 3.66321C26.9166 4.49307 26.9166 5.82872 26.9166 8.50001V17"></path>
                <path stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" stroke="#115DFC" d="M14.1667 14.1667H19.8334M14.1667 8.5H19.8334"></path>
              </svg>
            </div>
            <div className="note">
              <label className="title">Enter Registered Email</label>
              <span className="subtitle">Reset Link send on your email</span>
            </div>
            {
              !isSend &&
              <>
                <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Enter your e-mail" title="Enter your e-mail" name="email" type="email" className="input_field" />
                <button className="submit " onClick={handleSubmit}>
                Send Email
                {loading && <Spinner animation="border" className='mx-2 mb-1' size="sm" />}
                </button>
              </>
            }
            <div className="done-forgot text-center m-auto">
              {isSend &&
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="140px" height="140px"><linearGradient id="HoiJCu43QtshzIrYCxOfCa" x1="21.241" x2="3.541" y1="39.241" y2="21.541" gradientUnits="userSpaceOnUse"><stop offset=".108" stop-color="#0d7044" /><stop offset=".433" stop-color="#11945a" /></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCa)" d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z" /><linearGradient id="HoiJCu43QtshzIrYCxOfCb" x1="-15.77" x2="26.403" y1="43.228" y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2ac782" /><stop offset="1" stop-color="#21b876" /></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCb)" d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z" /></svg>
              }
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Forgot