import { Label } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import axiosInstance from '../../../baseUrl.js';

//notify
import { useSnackbar } from 'notistack';
import Spinner from 'react-bootstrap/Spinner';

const Reviews = () => {
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const { enqueueSnackbar } = useSnackbar();



    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', comment: '', city: '', id: '' });

    const handleAddReview = async () => {
        setReviews([...reviews, newReview]);
        setNewReview({ name: '', comment: '', city: '' });
        setShowModal(false);
        try {
            setLoading(true);
            await axiosInstance.post('/reviews/new', newReview);
            enqueueSnackbar("Review added successfully", { variant: "success", autoHideDuration: 1500 });
            setLoading(false);
            setReload(!reload);
        } catch (error) {
            enqueueSnackbar("Something went Wrong", { variant: "error", autoHideDuration: 1500 });
            setLoading(false);
            setReload(!reload);
        }
    };

    const handleDeleteReview = async (id) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/reviews/${id}`);
            enqueueSnackbar("Review Deleted successfully", { variant: "warning", autoHideDuration: 1500 });
            setLoading(false);
            setReload(!reload);
        } catch (error) {
            enqueueSnackbar("Something went Wrong", { variant: "error", autoHideDuration: 1500 });
            setLoading(false);
            setReload(!reload);
        }
    };

    const handleEditReview = async () => {
        try {
            setLoading(true);
            await axiosInstance.put(`/reviews/${newReview.id}`, newReview);
            enqueueSnackbar("Review Updated successfully", { variant: "success", autoHideDuration: 1500 });
            setLoading(false);
            setReload(!reload);
        } catch (error) {
            enqueueSnackbar("Something went Wrong", { variant: "error", autoHideDuration: 1500 });
            setLoading(false);
            setReload(!reload);
        }
        setNewReview({ name: '', comment: '', city: '' });
        setEditShowModal(false);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get('/reviews');
                setReviews(response.data);
                setLoading(false);
            } catch (error) {
                enqueueSnackbar("Something went Wrong", { variant: "error", autoHideDuration: 1500 });
            }
        };
        fetchReviews();

    }, [reload]);

    return (
        <div className="admin-reviews ">
            <div className="container d-flex justify-content-between my-3">
                <h3 className='fw-bold text-primary'>Reviews({reviews.length})</h3>
                <Button variant="success" style={{ height: "80%", fontWeight: "bold" }} size='sm' onClick={() => setShowModal(true)}>
                    Add Review
                </Button>
            </div>
            <div className="admin-reviews__container p-4" style={{ height: "90vh", overflow: "scroll" }}>
                {reviews.map((review, index) => (
                    <div className="admin-reviews__container__review shadow-lg border border-primary rounded-2 my-4 py-2" key={index}>
                        <div className="container">
                            <Label style={{ color: 'skyblue' }} /> <strong>{index + 1}</strong>
                            <div className="admin-reviews__container__review__name">
                                <label htmlFor="name" className='fw-bold text-success mt-2 me-2'>Name :</label>
                                <strong>{review.name}</strong>
                            </div>
                            <div className="admin-reviews__container__review__name">
                                <label htmlFor="comment" className='fw-bold text-primary mt-2 me-2'>Review:</label>
                                <textarea readOnly cols="30" rows='3' className='form-control' style={{resize:"none"}}>{review.comment}</textarea>
                            </div>
                            <div className="admin-reviews__container__review__name">
                                <label htmlFor="comment" className='fw-bold text-info mt-2 me-2'>City:</label>
                                <strong>{review.city}</strong>
                            </div>
                            <div className="admin-reviews__container__review__city mb-3"></div>
                            <div className="admin-reviews__container__review__edit">
                            </div>
                            <Button variant="primary" size='sm'
                                onClick={() => {
                                    setEditShowModal(true);
                                    setNewReview({ name: review.name, comment: review.comment, city: review.city, id: review._id });

                                }}>
                                Edit
                            </Button>
                            <Modal show={showEditModal} onHide={() => setEditShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Review</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newReview.name}
                                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="comment">
                                            <Form.Label>Comment</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="city">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newReview.city}
                                                onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setEditShowModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={() => handleEditReview()}>
                                        Save Changes
                                        {loading && <Spinner animation="border" size='sm' variant="light" className='ms-1' />}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <div className="admin-reviews__container__review__delete d-inline ms-3">
                                <Button variant="danger" size='sm' onClick={() => handleDeleteReview(review._id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="name" className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newReview.name}
                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="comment" className='my-2'>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="city" className='my-2'>
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={newReview.city}
                                onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddReview}>
                        Add Review
                        {loading && <Spinner animation="border" size='sm' variant="light"  className='ms-1' />}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Reviews;