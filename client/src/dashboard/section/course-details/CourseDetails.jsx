import { Alert, AlertTitle, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import axiosInstance from '../../../baseUrl';
import { useSelector } from 'react-redux';

const CourseDetails = () => {
    const [rowData, setRowData] = useState([
        { Course: '', price: '', Status: "", Purchase_Date: '', Remaining_Days: '' },
    ]);
    const [columnDefs, setColumnDefs] = useState([
        { field: 'Course', flex: 1, },
        {
            field: 'price',
            valueFormatter: (p) => 'PKR ' + Math.floor(p.value).toLocaleString(),
            flex: 1,
        },
        { field: 'Status', flex: 1 },
        { field: 'Purchase_Date', flex: 1 },
        { field: 'Remaining_Days', flex: 1 },
    ]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get('/purchase/dashboard');
                const currentDate = new Date();
                const newData = res.data.map((e) => {
                    const purchaseDate = new Date(e.purchaseDate);
                    const expiryDate = new Date(e.expiryDate);
                    const remainingDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24)); // Calculate remaining days
                    return {
                        Course: e.course,
                        price: e.price,
                        Status: e.status,
                        Purchase_Date: purchaseDate.toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
                        Remaining_Days: remainingDays
                    };
                });
                setRowData(newData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const [user, setUser] = useState(useSelector((state) => state.auth?.user?.user?.user));
    const isMdcat = user?.isMdcat || false;
    const isNums = user?.isNums || false;
    const isMdcatNums = user?.isMdcatNums || false;
    const isTrial = user?.isTrialActive || false;


    const getCourseStatus = () => {
        if (isMdcat && isNums) return 'Mdcat & Nums Course Active';
        if (isMdcat) return 'Mdcat Course Active';
        if (isNums) return 'Nums Course Active';
        if (isMdcatNums) return 'Mdcat & Nums Course Active';
        if (isTrial && !isMdcat && !isNums && !isMdcatNums) return 'Free Trial Active';
        return 'No Active Course';
    };


    return (
        <div className="container-fluid">


            <div className="container text-center py-4 rounded-4 mt-md-1 mt-4 shadow fw-bold ">
                <Typography variant="h4" style={{ color: '#1976D2' }} fontWeight={'bold'} className="mt-2 d-inline" align="center" gutterBottom>
                    Course Details
                </Typography>
            </div>
            <div className="row mt-md-5 mt-3 px-3">
                <Alert
                    severity="info"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <AlertTitle style={{ fontSize: '1rem', marginTop: '5px' }}>{getCourseStatus()}</AlertTitle>
                </Alert>
            </div>

            <div style={{ width: '100%', height: '27vh' }} className='mt-3 px-md-1'>
                <div
                    style={{ width: '100%', height: '100%' }}
                    className="ag-theme-quartz "
                >
                    <AgGridReact rowData={rowData} columnDefs={columnDefs} />
                </div>
            </div>
        </div>
    )
}

export default CourseDetails
