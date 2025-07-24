import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import axiosInstance from '../../../baseUrl.js';

const columns = [
    { id: 'name', label: 'Username', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'msg', label: 'Message', minWidth: 170 },
    { id: 'question', label: 'Question', minWidth: 170 },
    { id: 'read', label: 'Read', minWidth: 100, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
];

export default function ReportMcq() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState('');
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [readMessages, setReadMessages] = useState([]);
    const [reload, setReload] = useState(false);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = (msg) => {
        setSelectedMsg(msg);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMsg('');
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axiosInstance.get(`/report/${id}`);
            setReload(!reload);
        } catch (error) {

        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            await axiosInstance.delete(`/report/${id}`);
            setReload(!reload);
        } catch (error) {
            console.log(error)
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/report');
                const data = response.data;
                setUnreadMessages(data.filter(msg => msg.isRead == false));
                setReadMessages(data.filter(msg => msg.isRead == true));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [reload]);


    return (
        <div className="p-2">
            <h1 className="text-primary fw-bold px-3 py-1">Unread Messages</h1>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {unreadMessages
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.email}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'read' ? (
                                                        <Button variant="contained" onClick={() => handleMarkAsRead(row._id)}>
                                                            Read
                                                        </Button>
                                                    ) : column.id === 'msg' ? (
                                                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(row.msg)}>
                                                            {value.split(' ').slice(0, 5).join(' ')}...
                                                        </Typography>
                                                    ) : column.id === 'actions' ? (
                                                        <Button variant="contained" color="error" onClick={() => handleDeleteMessage(row._id)}>
                                                            Delete
                                                        </Button>
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={unreadMessages.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <h1 className="text-primary fw-bold px-3 py-2 mt-5">Read Messages</h1>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {readMessages
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.email}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.id === 'read' ? (
                                                        <Typography variant="body2" color="textSecondary">
                                                            Read
                                                        </Typography>
                                                    ) : column.id === 'msg' ? (
                                                        <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen(row.msg)}>
                                                            {value.split(' ').slice(0, 5).join(' ')}...
                                                        </Typography>
                                                    ) : column.id === 'actions' ? (
                                                        <Button variant="contained" color="error" onClick={() => handleDeleteMessage(row._id)}>
                                                            Delete
                                                        </Button>
                                                    ) : (
                                                        value
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={readMessages.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className='fw-bold text-primary'>Message Details</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {selectedMsg}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );


}