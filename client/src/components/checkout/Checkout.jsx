import React, { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './checkout.scss'
import StickyNav from '../../pages/stickyNav/StickyNav'

import { closeSnackbar, useSnackbar } from 'notistack';

import mdcat from '/courses/1.png'
import nums from '/courses/2.png'
import mdcat_nums from '/courses/3.png'
import axios from 'axios'
import { useState } from 'react'
import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Radio, RadioGroup, Stack, Step, StepLabel, Stepper, } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { MoneyOffCsredRounded, UploadFile } from '@mui/icons-material';
import { Modal, Tab, Tabs } from 'react-bootstrap';

import jazzcash from '/src/assets/jazzcash.png'
import easypaisa from '/src/assets/easypaisa.png'
import bank from '/src/assets/bank.png'
import receipt from '/src/assets/receipt.png'
import { useSelector } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import axiosInstance from '../../baseUrl.js'


const Checkout = (props) => {
	const [key, setKey] = useState('home');
	const [payMethod, setPayMethod] = useState('jazzcash');
	const [imageUrl, setImageUrl] = useState(receipt);
	const [image, setImage] = useState(null);
	const { user } = useSelector((state) => state.auth.user?.user) || {};
	const navigate = useNavigate();
	const [showAlert, setShowAlert] = useState(false);
	const [loading,setLoading]=useState(false);

	const accounts = {
		jazzcash: {
			name: "Muhammad Taimoor Hafeez",
			ac: "03479598144",
			iban: "PK47JCMA2605923479598144"
		},
		easypaisa: {
			name: "Muhammad Taimoor Hafeez",
			ac: "03479598144",
			iban: "PK38TMFB0000000058917550"
		},
		bank: {
			name: "Muhammad Taimoor Hafeez",
			ac: "22010109673135",
			iban: "PK03MEZN0022010109673135"
		}
	}

	const { enqueueSnackbar } = useSnackbar();
	const [cData, setcData] = useState({});
	const [promoPrice, setPromoPrice] = useState(0);
	const [promoCode, setPromoCode] = useState('');
	const ref = useRef();

	const { search } = useLocation();
	const course = search.split('?')[1] || "mdcat";
	let img;

	if (course == 'mdcat') {
		img = mdcat
	}
	else if (course == 'nums') {
		img = nums;
	}
	else if (course == 'mdcat+nums') {
		img = mdcat_nums
	}
	else {
		img = mdcat;
	}
	//
	const showCenteredSnackbar = (message, variant) => {
		enqueueSnackbar(message, {
			variant: variant,
			autoHideDuration: 2500,
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

	const handleRedeem = async () => {
		const promoCodeValue = ref.current.value;
		setPromoCode(promoCodeValue);

		try {
			if (!promoCodeValue) {
				setPromoPrice(0)
				throw new Error("Please provide a promo code");
			}
			const res = await axiosInstance.get(`/referal/${promoCodeValue}`);

			if (res.status === 200 && res.data.statusCode == 404) {
				showCenteredSnackbar(res.data.status, "error");
				setPromoPrice(0)
				setPromoCode('');
				
			} else if (res.status === 200 && res.data.statusCode == 401) {
				showCenteredSnackbar(res.data.status, "warning");
				setPromoPrice(0)
				setPromoCode('');
			}
			else {
				showCenteredSnackbar("Applied Successfully", "success");
				const percentage = res.data.priceDiscount; //10
				const originalPrice = cData.cprice; //100*10/100
				const totalPrice = (originalPrice * percentage / 100);
				setPromoPrice(totalPrice)
			}
		} catch (error) {
			showCenteredSnackbar(error.message, "error");
			setPromoCode('');
		}
	};


	//useeffect handle
	useEffect(() => {
		const fetch = async () => {
			let res;
			if (course == 'mdcat') {
				img = mdcat
				res = await axiosInstance.get('/course/mdcat');
			}
			else if (course == 'nums') {
				img = nums;
				res = await axiosInstance.get('/course/nums');
			}
			else if (course == 'mdcat+nums') {
				img = mdcat_nums
				res = await axiosInstance.get('/course/mdcat+nums');
			}
			else {
				img = mdcat;
			}
			setcData(res.data);
		}
		fetch();
	}, [promoPrice, course]);

	// =========image file system==========
	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			if (file.type.startsWith('image/')) {
				const url = URL.createObjectURL(file);
				setImageUrl(url);
				setImage(file);
			} else {
				showCenteredSnackbar("Please upload Image Type Paid Screenshot", "error");
			}
		}
	};

	// handlePurchase
	const handlePurchase = async () => {
		setLoading(true)
		const finalPrice = cData.cprice - promoPrice;
		if (!image) {
			showCenteredSnackbar("Please upload payment screenshot.", "warning");
			setLoading(false)
			return;
		}
		try {
			if (!user) {
				showCenteredSnackbar("please login first", "error");
				showCenteredSnackbar("Redirecting to Login Page", "info");
				setTimeout(() => {
					return navigate('/signin')
				}, 1500);
			}
			else {
				const formData = new FormData();
				formData.append('screenshot', image); // Append the image to FormData
				formData.append('finalPrice', finalPrice); // Append the final price to FormData
				formData.append('course', course); // Append the final price to FormData
				formData.append('userid', user._id); // Append the final price to FormData
				formData.append('refCode', promoCode); // Append the final price to FormData
				const config = {
					headers: {
						'Content-Type': 'multipart/form-data',
						// 'userid	': user._id,
					}
				};
				const response = await axiosInstance.post('/purchase/upload-screenshot', formData, config);
				showCenteredSnackbar("Payment Screenshot Sended Please wait for response", "success");
				setShowAlert(true);
			}
		} catch (error) {
			showCenteredSnackbar("Something Wrong Reload Page ! ", "error");
			setLoading(false)
		}
	};

	return (
		<>
			<StickyNav />
			<Box>
				<div className="checkout glassy-background ">
					<div className="container bg-light rounded-5 shadow-lg p-3 px-2 mt-2">
						<div className="py-1 text-center">
							<h2 className='text-primary fw-bold'>{course && course.toUpperCase()} MCQ BANK</h2>
							<p className="lead">Pay to get McQs Bank </p>
						</div>

						<div className="row d-flex justify-item-center">
							<Tabs
								id="controlled-tab-example"
								activeKey={key}
								onSelect={(k) => setKey(k)}
								className="mb-3 d-flex justify-content-center"
							>
								{/* //	home tab course info */}
								<Tab eventKey="home">
									<div className="row">
										<div className="col-md-4 order-md-2 mb-4">
											<h4 className="d-flex justify-content-between align-items-center mb-3">
												<span className="text-muted fw-bold h3">Your cart</span>
												<span className="badge badge-primary badge-pill">1</span>
											</h4>
											<ul className="list-group mb-3 shadow">
												<li className="list-group-item d-flex justify-content-between lh-condensed">
													<div>
														<h6 className="my-0">Product Price</h6>
														<small className="text-muted">{course.toUpperCase()}</small>
													</div>
													<span className="text-dark fw-bold">{cData?.cprice} </span>
												</li>
												<li className="list-group-item d-flex justify-content-between bg-light">
													<div className="text-success">
														<h6 className="my-0">Discount Price</h6>
													</div>
													<span className="text-success">{promoPrice > 0 && "-"}{parseInt(promoPrice)}</span>
												</li>
												<li className="list-group-item d-flex justify-content-between">
													<span>Total (PKR)</span>
													<strong>{parseInt(cData.cprice - promoPrice)}</strong>
												</li>
											</ul>

											<div className="card h-auto p-1 shadow">
												<div className="input-group-redeem mb-1">
													<input ref={ref} type="email" className='form-control' name="refcode" placeholder="Refferal code" />
												</div>

												<Button variant="contained" color="primary" onClick={handleRedeem}>Redeem</Button>

											</div>
										</div>
										<div className="col-md-8 order-md-1 ">
											<h4 className="mb-3 fw-bold text-primary">Course details</h4>
											<div className="mb-3 shadow rounded-2">
												<img src={img} alt="" style={{ width: "100%", height: "242px", objectFit:'contain',background:'#FAF6FF' }} className='rounded shadow-sm' />
											</div>
											<div className="row mt-3 ps-3 text-dark">
												<p style={{whiteSpace:'pre-line', fontSize:'17px',fontFamily:'inter'}}>{cData.cdesc}</p>
											</div>
											<div className="container">
												<h4 className="mt-5 text-primary fw-bold">Payment Options</h4>
												<Button variant="contained" color="primary" className="w-100 ms-auto mt-3 fw-bold" onClick={() => setKey('payment')}>next</Button>
											</div>

										</div>
									</div>
								</Tab>

								{/* //	Payment Tab course */}
								<Tab eventKey="payment">
									<Grid container spacing={.2}>
										<Grid xs={12} sm={12} md={4} display={'flex'} justifyContent={'center'}>
											<FormControl >
												<FormLabel id="demo-radio-buttons-group-label fw-bold fs-3"><h5 className='fw-bold'>Select Payment Method</h5></FormLabel>
												<RadioGroup
													aria-labelledby="demo-radio-buttons-group-label"
													defaultValue="female"
													name="radio-buttons-group"

												>
													<div className="payopt jazzcash bg-light rounded-3 px-4 py-2 mb-3 d-flex align-items-center">
														<FormControlLabel value="jazzcash" defaultChecked='true' control={<Radio />} label="JazzCash" onClick={(e) => setPayMethod(e.target.value)} />
														<img src={jazzcash} alt="jazzcash" height={55} />
													</div>
													<div className="payopt easypaisa bg-light rounded-3  px-4 py-2 mb-3 d-flex align-items-center">
														<FormControlLabel value="easypaisa" control={<Radio />} label="EasyPaisa" onClick={(e) => setPayMethod(e.target.value)} />
														<img src={easypaisa} alt="easypaisa" height={55} />
													</div>
													<div className="payopt bank bg-light rounded-3  px-4 py-2 mb-3 d-flex align-items-center">
														<FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" onClick={(e) => setPayMethod(e.target.value)} />
														<img src={bank} alt="bank" height={55} />
													</div>

												</RadioGroup>
											</FormControl>
										</Grid>
										<Grid xs={12} sm={12} md={8} >
											<div className="payment-section">
												<div className="row top-row">
													<div className="col-md-7 col-12 pay-details-col">
														{payMethod === 'jazzcash' && <img src={jazzcash} height={44} alt="" />}
														{payMethod === 'easypaisa' && <img src={easypaisa} height={44} alt="" />}
														{payMethod === 'bank' && <img src={bank} height={44} alt="" />}

														<p>Transfer the amount to these accounts and upload the screenshot of the receipt</p>
														<div className="row payment-details">
															<strong>Account Title: {accounts[payMethod]?.name}</strong>
															<strong className='py-1'>Account No: {accounts[payMethod]?.ac}</strong>
															<strong>IBAN: {accounts[payMethod]?.iban}</strong>
														</div>
													</div>
													<div className="col-md-5 col-12 pay-ss-col">
														<img src={imageUrl} alt="" />
														<div className="img-upload-input">
															<input type="file" name="payimg" accept="image/*" id="payimg" hidden onChange={(e) => handleImageChange(e)} />
															<label htmlFor="payimg">Upload<UploadFile /></label>
														</div>
													</div>
												</div>
												{/* //sub price */}
												<div className="row mt-4 py-3 border-bottom">
													<div className="container d-flex justify-content-between">
														<div className="left fw-bold" style={{ fontSize: "19px", color: "#1F305E", fontFamily: "inter" }}>Subtotal</div>
														<div className="right fw-bold" style={{ fontSize: "19px", color: "#1F305E", fontFamily: "inter" }}>{cData?.cprice}</div>
													</div>
													<div className="container d-flex justify-content-between">
														<div className="left fw-bold" style={{ fontSize: "19px", color: "#FA2A55" }}>Discount Price</div>
														<div className="right fw-bold" style={{ fontSize: "19px", color: "#FA2A55" }}>{promoPrice > 0 && "-"}{parseInt(promoPrice)}</div>
													</div>
												</div>
												{/* total price */}
												<div className="row border-top py-3">
													<div className="container d-flex justify-content-between">
														<div className="left">
															<strong style={{ fontSize: "22px", color: "#4e73df", fontFamily: "fredoka" }}>Total</strong>
														</div>
														<div className="right fs-3 text-primary fw-bold" style={{ color: "#4e73df", fontFamily: "fredoka" }}>{parseInt(cData.cprice - promoPrice)}</div>
													</div>
												</div>
												<Grid mt={6} px={3} width={'100%'} >
													<Button variant="contained" color='success' className='px-5 py-2 fw-bold px-3 ms-auto' style={{ fontSize: "20px" }} onClick={handlePurchase} disabled={loading}>Place Order <MoneyOffCsredRounded /></Button>
												</Grid>
											</div>
										</Grid>
									</Grid>

									<Grid mt={6} px={3}>
										<Button variant="contained" color='error' className='fw-bold' onClick={() => setKey('home')}>Back</Button>
									</Grid>
								</Tab>
							</Tabs>
						</div>


						<footer className="my-5 pt-5 text-muted text-center text-small">
							<div className="text-center p-3 text-black">
								© {new Date().getFullYear()} Copyright reserved The Capital Academy
							</div>
							<ul className="list-inline">
								<Link to={'/privacy-policy'}>Privacy</Link>
								
								<li className="list-inline-item ms-2"><a href="#">Support</a></li>
							</ul>
						</footer>
					</div>
				</div>

			</Box>
			<SweetAlert
				show={showAlert}
				success
				title="Thanks For Placing Order"
				onConfirm={() => setShowAlert(false)}
				onCancel={() => setShowAlert(false)}
				showConfirm={false}
				timeout={4000}
			>
				<Link to={'/dashboard/course-details'}><Button className='fw-bold' variant="contained">Check Course Details</Button></Link>
			</SweetAlert>
		</>
	)

}
export default Checkout;