import React from 'react'
import Login from '../../components/login/Login'
import Navbar from '../../components/navbar/Navbar'
import TopBar from '../../components/topbar/TopBar'
import './signin.scss'

const SignIn = () => {
	return (
		<div className='signin-page'>
			<div className='position-relative' style={{ background: '#f4f4f4', zIndex: '11' }}>
				<TopBar />
				<Navbar />
			</div>
			<Login/>
		</div>
	)
}

export default SignIn