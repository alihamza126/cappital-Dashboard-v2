import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // Import the CSS

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  course,
  price,
  date,
  status,
  paymentImg,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [isOpen, setIsOpen] = useState(false);//light image box conditions

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
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{course}</TableCell>

        <TableCell>{price}</TableCell>

        <TableCell align="center">{date}</TableCell>
        <TableCell>
          <Label color={status === 'approve' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
            {status}
          </Label>
        </TableCell>

        {/* //paymentImg */}
        <TableCell>
          <img src={paymentImg} height={30} className='rounded-3 bg-success' alt="Payment Image" onClick={() => setIsOpen(true)} />
          {isOpen && (
            <Lightbox
              mainSrc={paymentImg}
              onCloseRequest={() => setIsOpen(false)}
              style={{ zIndex: 999999999 }} // Set the z-index higher
            />
          )}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
           right icon
          </IconButton>
        </TableCell>
      </TableRow >

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
        <MenuItem onClick={handleCloseMenu}>
          close icon
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          Delete icon 
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

// UserTableRow.propTypes = {
//   avatarUrl: PropTypes.any,
//   company: PropTypes.any,
//   handleClick: PropTypes.func,
//   isVerified: PropTypes.any,
//   name: PropTypes.any,
//   role: PropTypes.any,
//   selected: PropTypes.any,
//   status: PropTypes.string,
// };
