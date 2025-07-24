import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  IconButton,
  Alert,
} from "@mui/material";
import "./profile.scss";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/authSlice";
import { closeSnackbar, useSnackbar } from 'notistack';
import { Close, CloseOutlined } from "@mui/icons-material";
import { motion } from 'framer-motion'
import axiosInstance from "../../../baseUrl";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { user = "" } = useSelector((state) => state.auth?.user?.user || "");
  const [imageUrl, setImageUrl] = useState(user.profileUrl || "");

  const isOpen = (user.aggPercentage < 1 || user.domicalCity == '')
  const [alertOpen, setAlertOpen] = useState(isOpen);

  const { enqueueSnackbar } = useSnackbar();
  const showCenteredSnackbar = (message, variant) => {
    enqueueSnackbar(message, {
      variant: variant,
      autoHideDuration: 2200,
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



  const [formData, setFormData] = useState({
    fullName: user.fullname || "",
    fName: user.fathername || "",
    email: user.email || "",
    city: user.city || "",
    contact: user.contact || "",
    course: user.course || "",
    domicalCity: user?.domicalCity || "",
    aggPercentage: user?.aggPercentage || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Prepare data for updating user profile
      const userData = {
        id: user._id,
      };
      // Check if other data is updated and include it in the request
      if (formData.fullName !== user.fullname) {
        userData.fullname = formData.fullName;
      }
      if (formData.fName !== user.fathername) {
        userData.fathername = formData.fName;
      }
      if (formData.email !== user.email) {
        userData.email = formData.email;
      }
      if (formData.city !== user.city) {
        userData.city = formData.city;
      }
      if (formData.contact !== user.contact) {
        userData.contact = formData.contact;
      }
      if (formData.domicalCity !== user.domicalCity) {
        userData.domicalCity = formData.domicalCity;
      }
      if (formData.aggPercentage !== user.aggPercentage) {
        userData.aggPercentage = formData.aggPercentage;
      }

      // If image is present, upload it to the server
      let imageUrl = user.profileUrl; // Initialize imageUrl with existing profileUrl
      if (image) {
        const formImgData = new FormData();
        formImgData.append("image", image);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const imgResponse = await axiosInstance.post(
          "/upload/img",
          formImgData,
          config
        );
        if (imgResponse.status === 200) {
          imageUrl = imgResponse.data.fileURL; // Set imageUrl if upload is successful
        } else {
          throw new Error("Failed to upload image"); // Throw error if upload fails
        }
      }

      userData.profileUrl = imageUrl; // Set imageUrl in userData

      // Send request to update user profile
      try {
        const res = await axiosInstance.post("/user/update", userData);
        if (res.data.user != null) {
          localStorage.setItem("user", JSON.stringify(res.data));
          dispatch(setUser(res.data));
          window.location.reload();

        } else if (res.data.code == 11000) {
          showCenteredSnackbar("Email Already Registered", 'error')
        }
      } catch (error) {

      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    setImage(file);
  };

  return (
    <Container maxWidth="xl">
      <div className="container text-center py-2 mt-md-1 mt-4 rounded-5 shadow text-white fw-bold custom-bg">
        <Typography variant="h5" className="mt-2 d-inline" align="center" gutterBottom>
          Profile Settings
        </Typography>
      </div>
      {
        alertOpen &&
        <motion.div
          initial={{ opacity: 0, x: 50, }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: 0, }}
        >
          <Alert
            className="mt-4"
            variant="filled"
            severity="info"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                <CloseOutlined fontSize="inherit" />
              </IconButton>
            }
          >
            <p>Please provide the following details:</p>
            <ol>
              {user?.domicalCity == '' && <li>Domicile City</li>}
              {(user?.aggPercentage < 1||user?.aggPercentage==undefined )&&
                <li>Aggregate Marks Percentage</li>}
            </ol>
          </Alert>
        </motion.div>
      }

      <div className="row py-5">
        <div className="col-md-4 col-12 mb-4">
          <Grid
            container
            justifyContent={"center"}
            className="custom-shodow rounded-5"
          >
            <div className="p-5">
              {/* <Avatar sx={{ width: 170, height: 170, marginBottom: 2 }} src={image} alt="Profile Image" /> */}
                <Avatar
                  sx={{ width: 170, height: 170, marginBottom: 2 }}
                  src={imageUrl?.replace('/upload/', '/upload/w_200,h_200,c_fill/')}
                  alt="Profile Image"
                ></Avatar>
              <div className="row justify-content-center">
                <input
                  id="file"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file"
                  name="file"
                  className="d-flex justify-content-center"
                >
                  <span className="btn btn-primary btn-sm w-75 ">
                    Change Image
                  </span>
                </label>
              </div>
              <Typography className="mt-4 text-center fw-bold text-primary">
                Username:
                <span className="d-block bg-light py-1 rounded-2 text-gray-600 fw">
                  @ {user.username}
                </span>
              </Typography>
            </div>
          </Grid>
        </div>

        <div className="col-md-8 col-12 shadow rounded-4 px-5 py-5">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* //Full name */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              {/* Father Name */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Father Name"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  inputMode="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              {/* city */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              {/* contact */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </Grid>
              {/* domical and aggPercentage */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Aggregate Percentage"
                  name="aggPercentage"
                  inputMode="numeric"
                  type="number"
                  value={formData.aggPercentage}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Domical City"
                  name="domicalCity"
                  value={formData.domicalCity}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  {" "}
                  Update {isLoading && <Spinner className="ms-1" size="sm" />}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
