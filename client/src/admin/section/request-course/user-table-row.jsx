import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { closeSnackbar, useSnackbar } from 'notistack';

import Label from '/src/dashboard/components/label';
import { Close, Delete, Edit, MoreVert, Pending, Security, Try, WarningRounded } from '@mui/icons-material';
import FsLightbox from 'fslightbox-react';
import { FormControlLabel } from '@mui/material';
import axiosInstance from '../../../baseUrl';

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  course,
  price,
  date,
  expiryDate,
  status,
  paymentImg,
  handleClick,
  index,
  userId,
  handleReload
}) {
  const [open, setOpen] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [daysLeft, setDaysLeft] = useState(0);

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

  useEffect(() => {
    const expireDateObject = new Date(expiryDate);
    const differenceInMilliseconds = expireDateObject.getTime() - new Date().getTime();
    const days = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  }, []);

  // 'pending', 'approved', 'rejected'
  const handleApprove = async () => {
    try {
      setOpen(null);
      const status = 'approved';
      const response = await axiosInstance.put(`/purchase/${userId}`, { status });
      showCenteredSnackbar('Customer Purchase Approved', 'success');
      handleReload()
    } catch (error) {
      showCenteredSnackbar('Error Approving Purchase', 'error');
    }
  };
  const handleReject = async () => {
    try {
      setOpen(null);
      const status = 'rejected';
      const response = await axiosInstance.put(`/purchase/${userId}`, { status });
      showCenteredSnackbar('Customer Purchase Rejected', 'error');
      handleReload()
    } catch (error) {
      showCenteredSnackbar('Error Rejecting Purchase', 'error');
    }
  };
  const handlePending = async () => {
    try {
      setOpen(null);
      const status = 'pending';
      const response = await axiosInstance.put(`/purchase/${userId}`, { status });
      showCenteredSnackbar(' Customer Purchase Pending', 'warning');
      handleReload()
    } catch (error) {
      showCenteredSnackbar('Error Pending Purchase', 'error');
    }
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <div style={{ display: 'flex',marginRight:"13px", alignItems: 'center' }}>
            <span style={{marginLeft:"7px"}}>{index+1}</span>
            <Checkbox
              checked={selected}
              onClick={(event) => handleClick(event, userId)}
              style={{ marginLeft: 'auto' }} // Move Checkbox to the end
            />
          </div>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl?.replace('/upload/', '/upload/w_50,h_50,c_fill/')} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{course}</TableCell>

        <TableCell>{price}</TableCell>

        <TableCell align="center">{new Date(date)?.toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</TableCell>

        <TableCell align="center">{daysLeft}</TableCell>
        <TableCell>
          <Label color={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
            {status}
          </Label>
        </TableCell>

        {/* PaymentImg with Lightbox */}
        <TableCell onClick={() => setIsLightboxOpen(!isLightboxOpen)}>
          <img
            src={paymentImg}
            height={30}
            className='rounded-3'
            alt="Payment icon"
            style={{ cursor: 'pointer' }}
          />
          <FsLightbox
            toggler={isLightboxOpen}
            sources={[paymentImg]}
            onClose={() => setIsLightboxOpen(false)}
            zoomIncrement={.3}
            sourcesAction="zoom"
          />
        </TableCell>



        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <MoreVert />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handlePending} sx={{ color: 'warning.main' }}>
          <Pending className='me-1 h-50 ' />
          Pending
        </MenuItem>
        <MenuItem onClick={handleApprove} sx={{ color: 'success.main' }}>
          <Security className='me-1' />
          Approve
        </MenuItem>
        <MenuItem onClick={handleReject} sx={{ color: 'error.main' }}>
          <WarningRounded className='me-1' />
          Rejected
        </MenuItem>
      </Popover>
    </>
  );
}
