import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import axios from "axios";

//logo
import logo from "/favicon.png"
import { useSnackbar } from "notistack";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect } from "react";
import axiosInstance from "../../baseUrl";

//component copyright
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to={"/"}>
        The Capital Academy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const defaultTheme = createTheme();

//Signup actaul component
export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [randomnumber1, setRandomNo1] = useState(0);
  const [randomnumber2, setRandomNo2] = useState(0);
  const [randomNumberAns, setRandomNumberAns] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newErrors = {};
    // Check if any field is empty
    for (let [key, value] of data.entries()) {
      if (!value.trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    }
    setErrors(newErrors);

    let formDataObject = {};
    for (let [key, value] of data.entries()) {
      formDataObject[key] = value.trim();
    }
    // Now formDataObject contains the form data

    if (Object.keys(newErrors).length === 0) {
      if (randomnumber1 + randomnumber2 == randomNumberAns) {
        try {
          setLoading(true);
          const response = await axiosInstance.post(
            "/auth/register",
            formDataObject
          );
          enqueueSnackbar(response.data.message, { variant: "success" });
          setTimeout(() => {
            enqueueSnackbar("redirecting to login page", { variant: "info" });
          }, 1000);
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        }
      } else {
        enqueueSnackbar("Please Fill Right Captcha Answer", { variant: "warning" });
      }
    }
  };

  const randomnumber = () => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    setRandomNo1(n1);
    setRandomNo2(n2);
  };

  useEffect(() => {
    randomnumber();
  }, [errors]);

  // handle and state of show password
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="signup overflow-hidden">
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="xs"
          className="bg-white py- rounded-4 shadow-lg"
          style={{ position: "relative" }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              className="mt-3 text-secondary fw-bold"
            >
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="User Name"
                    autoFocus
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="fathername"
                    label="Father Name"
                    name="fathername"
                    autoComplete="family-name"
                    error={!!errors.fathername}
                    helperText={errors.fathername}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email" // Set type to email
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="city"
                    label="Enter city"
                    name="city"
                    autoComplete="city"
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="contact"
                    label="Contact No"
                    name="contact"
                    autoComplete="contact"
                    error={!!errors.contact}
                    helperText={errors.contact}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* ========captcha btn=========== */}
                <Grid container spacing={3} justifyContent="center" mt={1}>
                  <Grid item xs={2} textAlign="center" marginRight={"-20px"}>
                    <TextField
                      id="captcha-input1"
                      variant="outlined"
                      value={randomnumber1}
                      inputProps={{ style: { height: "8px" } }} // Decrease height of text field
                    />
                  </Grid>
                  <Grid item fontSize={20} p={1} mt={0.7} marginLeft={1}>
                    +
                  </Grid>
                  <Grid item xs={2} marginLeft={"-20px"} textAlign="center">
                    <TextField
                      readonly="true"
                      id="captcha-input1"
                      variant="outlined"
                      value={randomnumber2}
                      inputProps={{ style: { height: "8px" } }} // Decrease height of text field
                    />
                  </Grid>

                  <Grid item fontSize={20} mt={0.7}>
                    =
                  </Grid>
                  <Grid item xs={3} textAlign="center">
                    <TextField
                      value={randomNumberAns}
                      onChange={(e) => setRandomNumberAns(e.target.value)}
                      id="captcha-input1"
                      variant="outlined"
                      inputProps={{ style: { height: "8px" } }} // Decrease height of text field
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up{" "}
                {loading && (
                  <Spinner animation="border" className="mx-2 mb-1" size="sm" />
                )}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  Already have an account?
                  <Link to={"/signin"}> Sign in</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
