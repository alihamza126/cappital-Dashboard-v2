import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout, setError, setLoading, setProfileData, setUser } from "../../redux/authSlice";
import axios from "axios";
import { useSnackbar } from "notistack";
import Spinner from "react-bootstrap/Spinner";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import axiosInstance from "../../baseUrl";
import { useEffect } from "react";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link to={"/"}>The Capital Academy </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isLoading = useSelector((state) => state.auth.isLoading);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      enqueueSnackbar("fetching data ...", {
        variant: "info",
        autoHideDuration: 1500,
      });
      dispatch(setLoading(true));
      const response = await axiosInstance.post("/auth/login", {
        username: data.get("username"),
        password: data.get("password"),
      });
      dispatch(setUser(response.data));
      // console.log(response.data)

      // Set user data in cooki
      localStorage.setItem("user", JSON.stringify(response.data));

      enqueueSnackbar("You are logged in Successfully", {
        variant: "success",
        autoHideDuration: 3500,
      });
      dispatch(setLoading(false));
      enqueueSnackbar("Redirecting to home page ...", {
        variant: "info",
        autoHideDuration: 1500,
      });
      setTimeout(() => {
        navigate("/");
        window.location.reload()
      }, 100);
    } catch (error) {
      enqueueSnackbar(error?.response?.data || "Network Error", {
        variant: "error",
        autoHideDuration: 2500,
      });
      dispatch(setLoading(false));
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await axiosInstance.get('/auth/logout');
        localStorage.removeItem('user');
        dispatch(logout());
        console.warn("logout")
      } catch (error) {
      }
    }

    handleLogout();
  },[]);


  return (
    <div className="login py-5 shadow-lg">
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="xs"
          className="login-box overflow-hidden shadow"
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="d-flex align-items-center justify-content-between">
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <small className="ms-5">
                  <Link to={"/forgot-password"}>Forgot password</Link>
                </small>
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In{" "}
                {isLoading && (
                  <Spinner
                    animation="border"
                    variant="light"
                    size="sm"
                    className="ms-1"
                  />
                )}
              </Button>
              <Grid container>
                {/* <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid> */}
                <Grid item>
                  Don't have an account?
                  <Link to={"/signup"} variant="body2">
                    {" Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
