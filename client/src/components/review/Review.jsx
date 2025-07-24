import React, { useEffect, useState } from 'react';
import './review.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import axiosInstance from '../../baseUrl.js';

import 'swiper/css';
import 'swiper/css/pagination';
import user from '/user.png';

const Review = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    function calculateDaysAgo(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInTime = now.getTime() - createdDate.getTime();
        const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
        return `${diffInDays} days ago`;
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosInstance.get('/reviews');
                if(typeof(res.data)=='object'){
                    setReviews(res?.data||[]);
                }
            } catch (err) {
                setError('Failed to fetch reviews. Please try again later.');
                console.error(err);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className="review">
            <div className="container">
                <div className="left after-title-reviewes">
                    <h2 className='text-dark fw-bold text-center mt-5'>Student Reviews</h2>
                </div>
                <div className="row mt-4">
                    <div className="col-md-10 offset-md-1">
                        {error ? (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        ) : (
                            <Swiper
                                className='pb-5'
                                modules={[Pagination, Autoplay]}
                                pagination={{ clickable: true,dynamicBullets:true, dynamicMainBullets: 4}}
                                loop={true}
                                autoplay={{
                                    delay: 5000,
                                    disableOnInteraction: false
                                }}
                                spaceBetween={40}
                                navigation
                                slidesPerView={2}
                                breakpoints={{
                                    230: {
                                        slidesPerView: 1,
                                    },
                                    1024: {
                                        spaceBetween: 10,
                                        slidesPerView: 2,
                                    },
                                }}
                            >
                                {reviews?.map((review, index) => (
                                    <SwiperSlide key={index} className='d-flex justify-content-center rounded'>
                                        <div className="review-card shadow-sm mb-2 col-md-12 rounded">
                                            <div className="img overflow-hidden rounded-5">
                                                <img src={'https://img.icons8.com/bubbles/50/user.png'} width={50} height={50} alt="user image" />
                                            </div>
                                            <div className="name">{review?.name}</div>
                                            <div className="review">{review?.comment}</div>
                                            <div className="info">
                                                <div className="city">{review?.city}</div>
                                                <div className="date">{calculateDaysAgo(review?.createdAt)}</div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Review;