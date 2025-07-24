import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import axiosInstance from '../../../baseUrl.js';

const Settings = () => {
    const [value, setValue] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await axiosInstance.post('/admin', { password: value });
            enqueueSnackbar("updated successfully", { variant: 'success', autoHideDuration: 1500 });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar("error updating", { variant: 'error', autoHideDuration: 1500 });
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className="admin-topbar">
            <div className="container">
                <div className="row py-2">
                    <div className="col-md-12 text-primary d-flex justify-content-between align-items-center">
                        <h1 className='fw-bold'>Admin Settings</h1>
                        <Button variant="contained" style={{ height: "38px" }} className='pt-2' color="primary" onClick={handleUpdate}>
                            Save
                            {loading && <Spinner animation="border" size="sm" className='ms-2' />}
                        </Button>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-12">
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setValue(e.target.value)}
                            className='form-control'
                            placeholder='Change Admin password'
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
