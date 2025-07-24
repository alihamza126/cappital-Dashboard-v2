import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from '/src/dashboard/components/label';
import FsLightbox from 'fslightbox-react';

export default function UserTableRow({
  selected,

  avatarUrl,
  userName,
  fullName,
  fatherName,
  email,
  contact,
  city,
  isMdcat,
  isNums,
  aggPercentage,
  domicalCity,


  handleClick,
  index,
  userId,
  handleReload
}) {
  const [open, setOpen] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <div style={{ display: 'flex', marginRight: "13px", alignItems: 'center' }}>
            <span style={{ marginLeft: "7px" }}>{index + 1}</span>
            <Checkbox
              checked={selected}
              onClick={(event) => handleClick(event, userId)}
              style={{ marginLeft: 'auto' }} // Move Checkbox to the end
            />
          </div>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={userName} src={avatarUrl?.replace('/upload/', '/upload/w_50,h_50,c_fill/')} />
            <Typography variant="subtitle2" noWrap>
              {userName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{fullName}</TableCell>

        <TableCell>{fatherName}</TableCell>

        <TableCell>{email}</TableCell>
        {/* <TableCell align="center">{new Date(date)?.toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}</TableCell> */}

        <TableCell align="center">{contact}</TableCell>
        <TableCell align="center">{city}</TableCell>
        <TableCell>
          <Label color={isMdcat ? 'primary' : 'warning'}>
            {isMdcat ? 'Yes' : 'No'}
          </Label>
        </TableCell>
        <TableCell>
          <Label color={isNums ? 'primary' : 'warning'}>
            {isNums ? 'Yes' : 'No'}
          </Label>
        </TableCell>
        <TableCell align="center">{aggPercentage}{aggPercentage&&"%"}</TableCell>
        <TableCell align="center">{domicalCity}</TableCell>

        {/* PaymentImg with Lightbox */}
        {/* <TableCell onClick={() => setIsLightboxOpen(!isLightboxOpen)}>
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
        </TableCell> */}



      </TableRow>
    </>
  );
}
