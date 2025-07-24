import React from 'react';
import { useState, useEffect } from 'react';
import StickyNav from '../../pages/stickyNav/StickyNav';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../baseUrl.js';
import { useSnackbar } from 'notistack';
import { Spinner } from 'react-bootstrap';

const SetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [isForgot, setForgot] = useState(false);
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const token = useParams().token;
    console.log(token);

    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            setLoading(true);
            const isValid = await axiosInstance.get(`/auth/forgot-password/${token}`);
            console.log(isValid.status);
            if (isValid.status == 200) {
                enqueueSnackbar("Reset Your Password", { variant: "info",autoHideDuration:1300 });
            }
            setLoading(false);
        } catch (error) {
            enqueueSnackbar("Token Expire Try Again", { variant: "Error",autoHideDuration:1300 });
            navigate('/forgot-password');
            setLoading(false);
        }
    }
    const handleSubmit = async(e) => {
        setLoading(true);
        e.preventDefault();
            if(pass != confirmPass && pass!='' && confirmPass!=''){
                enqueueSnackbar("Password not match", { variant: "error",autoHideDuration:1000 });
                setLoading(false)
                return;
            }
            else{
                const res=await axiosInstance.put(`/auth/forgot-password/${token}`, {password: pass});
                enqueueSnackbar("Password Reset Successfully", { variant: "success" });
                navigate('/signin');
            }
            setLoading(false);
    }
    return (
        <>
            <StickyNav />
            <div className="forgot">
                <div class="popup">
                    <form class="form">
                        <div class="icon text-center m-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="156px" height="156px"><path fill="#6c19ff" d="M38,23h-4v-7c0-5.514-4.486-10-10-10s-10,4.486-10,10v7h-4v-7c0-7.72,6.28-14,14-14s14,6.28,14,14 V23z" /><rect width="36" height="26" x="6" y="17" fill="#f5bc00" /><rect width="4" height="4" x="10" y="17" fill="#eb7900" /><rect width="4" height="4" x="34" y="17" fill="#eb7900" /><g><circle cx="16" cy="31" r="2" fill="#6c19ff" /><circle cx="32" cy="31" r="2" fill="#6c19ff" /><circle cx="24" cy="31" r="2" fill="#6c19ff" /></g></svg>
                        </div>
                        <div class="note">
                            <label class="title">Set New Password</label>
                        </div>
                        {
                            !isForgot &&
                            <>
                                <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="New Password" title="set new password" name="email" type="email" class="input_field shadow-lg" />
                                <input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Re-type password" title="set new password" name="email" type="email" class="shadow-lg input_field" />
                                <button class="submit fs-5" onClick={handleSubmit}>
                                    Submit
                                    {loading && <Spinner  animation="border" className='mx-1 mt-1 mb-1' size="sm" />}
                                </button>
                            </>
                        }
                        <div className="done-forgot text-center m-auto">
                            {isForgot &&
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="140px" height="140px"><linearGradient id="HoiJCu43QtshzIrYCxOfCa" x1="21.241" x2="3.541" y1="39.241" y2="21.541" gradientUnits="userSpaceOnUse"><stop offset=".108" stop-color="#0d7044" /><stop offset=".433" stop-color="#11945a" /></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCa)" d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z" /><linearGradient id="HoiJCu43QtshzIrYCxOfCb" x1="-15.77" x2="26.403" y1="43.228" y2="43.228" gradientTransform="rotate(134.999 21.287 38.873)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2ac782" /><stop offset="1" stop-color="#21b876" /></linearGradient><path fill="url(#HoiJCu43QtshzIrYCxOfCb)" d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z" /></svg>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SetPassword