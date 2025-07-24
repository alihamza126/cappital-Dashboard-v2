import React from 'react';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { closeSnackbar, useSnackbar } from 'notistack';

const CenteredSnackbar = ({ message, variant }) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        closeSnackbar();
    };

    React.useEffect(() => {
        enqueueSnackbar(message, {
            variant: variant,
            autoHideDuration: 2200,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            action: (
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                    <Close fontSize="small" />
                </IconButton>
            )
        });
    }, [enqueueSnackbar, message, variant]);

    return null; // Snackbar is not directly rendered here
}

export default CenteredSnackbar;
