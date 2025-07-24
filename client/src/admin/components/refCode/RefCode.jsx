import { FormControl, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl.js';

const RefCode = () => {
    const [refCode, setRefCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [refData, setRefData] = useState([]);
    const [reload, setReload] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const calculateDaysLeft = (expireDate) => {
        const currentDate = new Date();
        const targetDate = new Date(expireDate);
        const differenceMs = targetDate - currentDate;
        const daysLeft = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    const handleSubmit = async () => {
        try {
            const res = await axiosInstance.post('/referal', { code: refCode, priceDiscount: discountPercentage, expireDate: expirationDate });
            setReload(!reload);
            enqueueSnackbar('Referral code added successfully', { variant: 'success', autoHideDuration: 2000 });
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = (id) => async () => {
        try {
            const res = await axiosInstance.delete(`/referal/${id}`);
            setReload(!reload);
            enqueueSnackbar('Referral code removed successfully', { variant: 'warning', autoHideDuration: 2000 });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosInstance.get('/referal');
            setRefData(res.data);
            console.log(res.data)
        };
        fetchData();
    }, [reload]);

    return (
        <div className="refrell-code">
            <div className="container">
                <div className="row my-3">
                    <div className="h2 text-primary fw-bold">Referrals code</div>
                </div>
                <div className="row gy-4">
                    <div className="col-md-4">
                        <FormControl fullWidth>
                            <TextField label="Referral Code" onChange={(e) => setRefCode(e.target.value)} />
                        </FormControl>
                    </div>
                    <div className="col-md-4">
                        <FormControl fullWidth>
                            <TextField label="Discount Percentage" type="number" onChange={(e) => setDiscountPercentage(e.target.value)} />
                        </FormControl>
                    </div>
                    <div className="col-md-4">
                        <FormControl fullWidth>
                            <TextField
                                label="Expiration Date"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setExpirationDate(e.target.value)}
                            />
                        </FormControl>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 py-4">
                        <button className="btn btn-primary" onClick={handleSubmit}>Add Referral</button>
                    </div>
                </div>
            </div>

            {/* table of courses */}
            <div className="container table-responsive mt-5 pt-1">
                <table className="table table-striped table-hover table-secondary rounded-4 shadow">
                    <thead>
                        <tr className='bg-warning'>
                            <th scope="col">Referral Code</th>
                            <th scope="col">Discount</th>
                            <th scope="col">Expiration Date</th>
                            <th scope="col">Total Purchases</th>
                            <th scope="col">Days Left</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refData.map((ref, index) => (
                            <tr key={index}>
                                <td>{ref.code}</td>
                                <td>{ref.priceDiscount}%</td>
                                <td>{new Date(ref.expireDate).toLocaleDateString()}</td>
                                <td>{ref?.purchaseCount}</td>
                                <td>{calculateDaysLeft(ref.expireDate)}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm rounded-2" onClick={handleDelete(ref._id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefCode;
