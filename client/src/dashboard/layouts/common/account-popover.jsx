import { useState } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/authSlice";
import { closeSnackbar, useSnackbar } from 'notistack';
import { Close } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from '../../../baseUrl.js';
import { Link, NavLink } from "react-router-dom";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: "eva:home-fill",
  },
  {
    label: "Profile",
    icon: "eva:person-fill",
  },
  {
    label: "Settings",
    icon: "eva:settings-2-fill",
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const user = useSelector((state) => state.auth?.user?.user?.user);
  const dispatch=useDispatch()
  
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

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      const res = await axiosInstance.get("/auth/logout");
      localStorage.removeItem("user");
      dispatch(logout());
      showCenteredSnackbar("you are logged out","warning");
      window.location.reload();
    } catch (error) {}
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.profileUrl?.replace('/upload/', '/upload/w_150,h_150,c_fill/')}
          alt="asdf"
          sx={{
            width: 46,
            height: 46,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          asdf
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        {/* //mmenu item */}
        <Divider sx={{ borderStyle: "dashed" }} />
        
        <Link className="text-decoration-none fw-bold" to={'/dashboard/Profile'}><MenuItem onClick={handleClose}>Profile</MenuItem></Link>

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
