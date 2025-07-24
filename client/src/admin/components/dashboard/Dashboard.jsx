import {LinearProgress } from '@mui/material'
import React from 'react'
import AppCurrentVisits from '../../../dashboard/section/overview/app-current-visits'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react';
import CountUp from 'react-countup';
import axiosInstance from '../../../baseUrl.js';


const Dashboard = () => {
    const [simpleDate, setSimpleDate] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [annualData, setAnnualData] = useState([]);

    const [totalEarningData, setTotalEarningData] = useState(0);

    const [totalEarning, setTotalEarning] = useState(0);
    const [totalEarningMonthly, setTotalEarningMonthly] = useState(0);
    const [totalEarningAnnual, setTotalEarningAnnual] = useState(0);

    const [numsTotalEarning, setNumsTotalEarning] = useState(0);
    const [mdcatTotalEarning, setMdcatTotalEarning] = useState(0);
    const [numsMdcatTotalEarning, setNumsMdcatTotalEarning] = useState(0);

    const [mdcatApproved, setMdcatApproved] = useState(0);
    const [mdcatRejected, setMdcatRejected] = useState(0);
    const [mdcatPending, setMdcatPending] = useState(0);

    const [numsApproved, setNumsApproved] = useState(0);
    const [numsRejected, setNumsRejected] = useState(0);
    const [numsPending, setNumsPending] = useState(0);

    const [numsMdcatApproved, setNumsMdcatApproved] = useState(0);
    const [numsMdcatRejected, setNumsMdcatRejected] = useState(0);
    const [numsMdcatPending, setNumsMdcatPending] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosInstance.get('/adminDashboard');
            console.log(res.data)
            setSimpleDate(res.data.simpleDate);
            setMonthlyData(res.data.lastMonth);
            setAnnualData(res.data.lastYear);
            setTotalEarningData(res.data.totalEarning)
        }


        fetchData();
    }, []);

    // Calculate total monthly earning 
    useEffect(() => {
        if (monthlyData.length > 0) {
            const totalEarning = monthlyData.reduce((total, data) => {
                return total + data.lastMonthPrice;
            }, 0);
            setTotalEarningMonthly(totalEarning);
        }
    }, [monthlyData]);

    // Calculate total Annual earning 
    useEffect(() => {
        if (annualData.length > 0) {
            const totalEarning = annualData.reduce((total, data) => {
                return total + data.lastYearPrice;
            }, 0);
            setTotalEarningAnnual(totalEarning);
        }
    }, [annualData]);

    //calculate total earning
    useEffect(() => {
        console.log(totalEarning)
        //Nums total earning
        if (totalEarningData.length > 0) {
            totalEarningData.map((ele) => {
                if (ele._id == 'mdcat') {
                    setMdcatTotalEarning(ele.totalEarnings)
                }
                else if (ele._id == 'nums') {
                    setNumsTotalEarning(ele.totalEarnings)
                }
                else if (ele._id == 'mdcat+nums') {
                    setNumsMdcatTotalEarning(ele.totalEarnings)
                }
            })
        }

        setTotalEarning(mdcatTotalEarning + numsTotalEarning + numsMdcatTotalEarning);

    }, [totalEarningData])


    useEffect(() => {

        //Mdcat Nums  Approved Rejected Pending counts
        if (simpleDate.length > 0) {
            simpleDate.map((data) => {
                if (data.course === 'mdcat' && data.status === 'approved') {
                    setMdcatApproved(data.purchases.length)
                }
                else if (data.course === 'mdcat' && data.status === 'rejected') {
                    setMdcatRejected(data.purchases.length)
                }
                else if (data.course === 'mdcat' && data.status === 'pending') {
                    setMdcatPending(data.purchases.length)
                }

                else if (data.course === 'nums' && data.status === 'approved') {
                    setNumsApproved(data.purchases.length)
                }
                else if (data.course === 'nums' && data.status === 'rejected') {
                    setNumsRejected(data.purchases.length)
                }
                else if (data.course === 'nums' && data.status === 'pending') {
                    setNumsPending(data.purchases.length)
                }

                else if (data.course === 'mdcat+nums' && data.status === 'approved') {
                    setNumsMdcatApproved(data.purchases.length)
                }
                else if (data.course === 'mdcat+nums' && data.status === 'rejected') {
                    setNumsMdcatRejected(data.purchases.length)
                }
                else if (data.course === 'mdcat+nums' && data.status === 'pending') {
                    setNumsMdcatPending(data.purchases.length)
                }

            });
        }
    }, [simpleDate]);



    return (
        <>
            <div className="container-fluid">
                {/* <!-- Page Heading --> */}
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                </div>
                {/* <!-- Content Row --> */}
                <div className="row">
                    {/* <!-- Earnings (Monthly) Card Example --> */}
                    <div className="col-xl-4 col-md-6 mb-4">
                        <div className="card border-left-primary shadow h-100 py-2" >
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 fs-5">
                                            Earnings (Monthly)</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">PKR  <CountUp end={totalEarningMonthly} duration={2} /></div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Earnings (Annual) Card Example --> */}
                    <div className="col-xl-4 col-md-6 mb-4">
                        <div className="card border-left-success shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1 fs-5">
                                            Earnings (Annual)</div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">PKR  <CountUp end={totalEarningAnnual} duration={2}/></div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Earnings (Monthly) Card Example --> */}
                    <div className="col-xl-4 col-md-6 mb-4">
                        <div className="card border-left-info shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1 fs-5">Total Earning
                                        </div>
                                        <div className="row no-gutters align-items-center">
                                            <div className="col-auto">
                                                <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">PKR  <CountUp end={totalEarning} duration={3}/></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* <!-- Chart --> */}
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12">
                        <div className="card shadow mb-4">
                            <div>
                                <AppCurrentVisits
                                    title="Earning From Courses"
                                    chart={{
                                        series: [
                                            { label: 'MDCAT', value: mdcatTotalEarning },
                                            { label: 'NUMS', value: numsTotalEarning },
                                            { label: 'MDCAT + NUMS', value: numsMdcatTotalEarning },
                                        ]
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr />
                <h4 className='fw-bold text-gray-600 mb-3'>Course Purchasing Info</h4>
                <div className="row justify-content-around">

                    <div className="card shadow-lg mb-4 col-xl-6 col-lg-5 col-md-6 col-12 ">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">MDCAT - INFO</h6>
                        </div>

                        {/* /MDCAT Purchases Approved/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">MDCAT Purchases Approved <span className="badge badge-success rounded-4" style={{ fontSize: "13px" }}>{mdcatApproved}
                            </span><span className="float-right">{Math.round((mdcatApproved / (mdcatApproved + mdcatPending + mdcatRejected)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "green" }} variant="determinate" color="inherit" value={(mdcatApproved / (mdcatApproved + mdcatPending + mdcatRejected)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>

                        {/* /MDCAT Purchases Approved/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">MDCAT Purchases Rejected <span className="badge badge-danger rounded-4" style={{ fontSize: "13px" }}>{mdcatRejected}</span> <span className="float-right">{Math.round(((mdcatRejected / (mdcatApproved + mdcatPending + mdcatRejected)) * 100))}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "red" }} variant="determinate" color="inherit" value={(mdcatRejected / (mdcatApproved + mdcatPending + mdcatRejected)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>

                        {/* /MDCAT Purchases Pending/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">MDCAT Purchases Pending <span className="badge badge-warning rounded-4" style={{ fontSize: "13px" }}>{mdcatPending}</span><span className="float-right">{Math.round((mdcatPending / (mdcatApproved + mdcatPending + mdcatRejected)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "orange" }} variant="determinate" color="inherit" value={(mdcatPending / (mdcatApproved + mdcatPending + mdcatRejected)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-lg mb-4 col-xl-5 col-lg-6 col-md-6 col-12 ">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-info">NUMS - INFO</h6>
                        </div>

                        {/* /NUMS Purchases Approved/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">NUMS Purchases Approved <span className="badge badge-success rounded-4" style={{ fontSize: "13px" }}>{numsApproved}</span>
                                <span className="float-right">{Math.round((numsApproved / (numsApproved + numsRejected + numsPending)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "green" }} variant="determinate" color="inherit" value={(numsApproved / (numsApproved + numsRejected + numsPending)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>

                        {/* /NUMS Purchases Approved/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">NUMS Purchases Rejected <span className="badge badge-danger rounded-4" style={{ fontSize: "13px" }}>{numsRejected}</span>
                                <span className="float-right">{Math.round((numsRejected / (numsApproved + numsRejected + numsPending)) * 100)}%</span>
                            </h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "red" }} variant="determinate" color="inherit" value={(numsRejected / (numsApproved + numsRejected + numsPending)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>

                        {/* /MDCAT Purchases Pending/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">NUMS Purchases Pending <span className="badge badge-warning rounded-4" style={{ fontSize: "13px" }}>{numsPending}</span>
                                <span className="float-right">{Math.floor((numsPending / (numsApproved + numsRejected + numsPending)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "orange" }} variant="determinate" color="inherit" value={(numsPending / (numsApproved + numsRejected + numsPending)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-lg mb-4 col-xl-12 col-lg-12 col-md-12 col-12 ">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">MDCAT+NUMS - INFO</h6>
                        </div>

                        {/* /MDCAT Purchases Approved/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">MDCAT+NUMS Purchases Approved <span className="badge badge-success rounded-4" style={{ fontSize: "13px" }}>{numsMdcatApproved}</span>
                                <span className="float-right">{Math.round((numsMdcatApproved / (numsMdcatRejected + numsMdcatApproved + numsMdcatPending)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "green" }} variant="determinate" color="inherit" value={(numsMdcatApproved / (numsMdcatRejected + numsMdcatApproved + numsMdcatPending)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>

                        {/* /MDCAT+NUMS Purchases Approved/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">MDCAT+NUMS Purchases Rejected  <span className="badge badge-danger rounded-4" style={{ fontSize: "13px" }}>{numsMdcatRejected}</span>
                                <span className="float-right">{Math.round((numsMdcatRejected / (numsMdcatRejected + numsMdcatApproved + numsMdcatPending)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "red" }} variant="determinate" color="inherit" value={(numsMdcatRejected / (numsMdcatRejected + numsMdcatApproved + numsMdcatPending)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>

                        {/* /MDCAT+NUMS Purchases Pending/ */}
                        <div className="card-body">
                            <h4 className="small font-weight-bold">MDCAT+NUMS Purchases Pending <span className="badge badge-warning rounded-4" style={{ fontSize: "13px" }}>{numsMdcatPending}</span>
                                <span className="float-right">{Math.round((numsMdcatPending / (numsMdcatRejected + numsMdcatApproved + numsMdcatPending)) * 100)}%</span></h4>
                            <div className="info d-flex justify-content-between">
                                <LinearProgress style={{ height: '10px', color: "orange" }} variant="determinate" color="inherit" value={(numsMdcatPending / (numsMdcatRejected + numsMdcatApproved + numsMdcatPending)) * 100} className='w-100 rounded-5' />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Dashboard