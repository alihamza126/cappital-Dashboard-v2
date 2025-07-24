import { Button } from '@mui/material';
import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import axiosInstance from '../../../baseUrl.js';

import { useSnackbar } from 'notistack';
import Spinner from 'react-bootstrap/Spinner';

const Topbar = () => {
    const msg = "Welcome Dear Student! May Your Journey Be Filled With Joy & Success";
    const [value, setValue] = useState(msg);
    const [relaod, setReload] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        try {
            setReload(true)
            setLoading(true)
            const res = await axiosInstance.post(`/homepage/topbar`, { tcontent: value });
            setReload(false);
            enqueueSnackbar("updated successfully", { variant: 'success', autoHideDuration: 1500 });
            setLoading(false)
        } catch (error) {
            setReload(false);
            enqueueSnackbar("error updating", { variant: 'error', autoHideDuration: 1500 });
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetch = async () => {
            const res = await axiosInstance.get('/homepage/topbar');
            setValue(res.data.tcontent)
        }

        fetch()
    }, [relaod]);

    return (
        <div className="admin-topbar">
            <div className="container">
                <div className="row py-2">
                    <div className="col-md-12 text-primary d-flex justify-content-between align-items-cente">
                        <h1 className='fw-bold'>Topbar</h1>
                        <Button variant="contained" style={{ height: "38px" }} className='pt-2' color="primary" onClick={handleUpdate}>
                            Save 
                            {loading && <Spinner animation="border" size="sm" className='ms-2' />}
                        </Button>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-12">
                        <textarea value={value} onChange={(e) => setValue(e.target.value)} name="topbar" id="topbar" rows="5" style={{ width: "100%", resize: "none" }} className='rounded p-2 fs-5 border-primary'>
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Topbar