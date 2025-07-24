import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Close, DeleteForever, Search } from '@mui/icons-material';
import axios from 'axios';
import axiosInstance from '../../../baseUrl';
import { closeSnackbar, useSnackbar } from 'notistack';
import { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  selectedId,
  handleReload,
  totalPages,
  setFetchpage,
  fetchPage
}) {
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
        const response = await axiosInstance.delete('/mcq/delete', { data: { ids: selectedId } });
        showCenteredSnackbar(response.data.message, 'success');
        return handleReload();
      }
      showCenteredSnackbar("Mcq Deletion Cancel", 'info');
    }
    catch (error) {
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
          placeholder="Search MCQs by any field..."
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      )}

      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel id="page-select">Select Page</InputLabel>
        <Select
          value={fetchPage}
          label="Select Page"
          onChange={(e)=>setFetchpage(e.target.value)}
        >
          {Array.from({ length: totalPages }, (_, index) => (
            <MenuItem key={index} value={index+1}>
              Page {index + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {numSelected > 0 && (
        <div className='mt-3 d-flex align-item-center gx-2'>

          <Tooltip title="Delete All Selected ">
            <IconButton onClick={handleDelete}>
              <DeleteForever className='bg-danger p-1 text-white fs-3 rounded-4' />
            </IconButton>
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
