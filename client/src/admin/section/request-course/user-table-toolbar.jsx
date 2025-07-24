import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Close, DataUsageSharp, Delete, DeleteForever, DoneAll, Search, VerifiedUserSharp, Warning } from '@mui/icons-material';
import axios from 'axios';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Divider } from '@mui/material';
import { useState } from 'react';
import axiosInstance from '../../../baseUrl';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, selectedId, handleReload }) {
  const { enqueueSnackbar } = useSnackbar();
  const [days, setDays] = useState(null);  //state for days

  //snackbar
  const showCenteredSnackbar = (message, variant) => {
    enqueueSnackbar(message, {
      variant: variant,
      autoHideDuration: 4000,
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



  //handle delete 
  const handleDelete = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete?");
      if (confirmed) {
        const response = await axiosInstance.put(`/purchase/select/delete`, {
          status: "rejected",
          collectionsId: selectedId
        });
        handleReload();
        showCenteredSnackbar(response.data.message, 'warning');
      }
    } catch (error) {
      showCenteredSnackbar("something went wrong", 'error');
    }
  }

  //handle delete 
  const handleApprove = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to Approve All Selected ?");
      if (confirmed) {
        const response = await axiosInstance.put(`/purchase/select/update`, {
          status: "approved",
          collectionsId: selectedId
        });
        handleReload();
        showCenteredSnackbar(response.data.message, 'success');
        window.location.reload();
      }
    } catch (error) {
      showCenteredSnackbar("something went wrong", 'error');
    }
  }

  //handle reject
  const handleReject = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to Reject All Selected Purchases ?");
      if (confirmed) {
        const response = await axiosInstance.put(`/purchase/select/update`, {
          status: "rejected",
          collectionsId: selectedId
        });
        showCenteredSnackbar(response.data.message, 'success');
        handleReload();
        window.location.reload();
      }
    } catch (error) {
      showCenteredSnackbar("something went wrong", 'error');
    }
  }

  //handle date
  const handleDate = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to Extend Days ?");
      if (confirmed) {
        const response = await axiosInstance.put(`/purchase/select/extendDate`, {
          status: "approved",
          collectionsId: selectedId,
          days: days
        });
        showCenteredSnackbar(response.data.message, 'success');
        handleReload();
        window.location.reload();
      }
    } catch (error) {
      showCenteredSnackbar("something went wrong", 'error');
    }
  }



  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 && (
        <div className='mt-3 d-flex align-item-center gx-2'>

          <Tooltip title="Delete All Selected ">
            <IconButton onClick={handleDelete}>
              <DeleteForever className='bg-danger p-1 text-white fs-3 rounded-4' />
            </IconButton>
          </Tooltip>

          <Tooltip title="Approve All">
            <IconButton onClick={handleApprove}>
              <DoneAll className='bg-success p-1 text-white fs-3 rounded-4' />
            </IconButton>
          </Tooltip>

          <Tooltip title="Rejected All">
            <IconButton onClick={handleReject}>
              <Warning className='bg-warning p-1 text-white fs-3 rounded-4' />
            </IconButton>
          </Tooltip>
          <Divider />
          <Tooltip title="Enter No of Day ">
            <div className="input-group mt-1 d-flex">
              <input type="number" className="form-control" value={days} onChange={(e)=>setDays(e.target.value)}  placeholder="Extend Days" aria-label="" aria-describedby="basic-addon1" />
              <div className="input-group-prepend">
                <button className="btn btn-sm btn-info mt-2 ms-auto" type="button rounded" onClick={handleDate}>Update Days</button>
              </div>
            </div>

          </Tooltip>
        </div>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
