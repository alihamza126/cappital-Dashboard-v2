import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Close, DeleteForever, Search } from '@mui/icons-material';
import axiosInstance from '../../../baseUrl';
import { closeSnackbar, useSnackbar } from 'notistack';
import { Divider } from '@mui/material';
// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName, selectedId, handleReload }) {
  const { enqueueSnackbar } = useSnackbar();

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
    console.log(selectedId)
    try {
      const confirmed = window.confirm("Are you sure you want to delete?");
      if (confirmed) {
        const response = await axiosInstance.delete('/user', {
          data:{userIds: selectedId}
        });
        console.log(response)
        handleReload();
        showCenteredSnackbar(`${response.data.deletedCount} users deleted`, 'warning');
      }
    } catch (error) {
      console.log(error)
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
          <Divider />
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
