import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Alert,
    Avatar
} from '@mui/material';
import { 
    Add, 
    Edit, 
    Delete, 
    Visibility, 
    Payment,
    TrendingUp,
    Schedule,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [series, setSeries] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedSeriesId, setSelectedSeriesId] = useState('');
    const [stats, setStats] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        userId: '',
        seriesId: '',
        currency: 'PKR',
        amount: '',
        couponCode: '',
        discountApplied: '',
        status: 'created',
        provider: 'manual',
        providerRef: ''
    });

    const [errors, setErrors] = useState({});

    const statuses = ['created', 'processing', 'paid', 'failed', 'canceled', 'refunded'];
    const providers = ['stripe', 'manual'];

    useEffect(() => {
        fetchSeries();
        fetchUsers();
        fetchStats();
    }, []);

    useEffect(() => {
        if (selectedSeriesId) {
            fetchPayments(selectedSeriesId);
        } else {
            fetchAllPayments();
        }
    }, [selectedSeriesId]);

    const fetchSeries = async () => {
        try {
            const response = await axiosInstance.get('/series/all');
            setSeries(response.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch series', { variant: 'error' });
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/user');
            setUsers(response.data||[]);
        } catch (error) {
            enqueueSnackbar('Failed to fetch users', { variant: 'error' });
        }
    };

    const fetchPayments = async (seriesId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/payments/series/${seriesId}`);
            setPayments(response.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch payments', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllPayments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/payments/all');
            setPayments(response.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch payments', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/payments/stats/overview');
            setStats(response.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch statistics', { variant: 'error' });
        }
    };

    const handleOpenDialog = (payment = null) => {
        if (payment) {
            setEditingPayment(payment);
            setFormData({
                userId: payment.userId._id || payment.userId,
                seriesId: payment.seriesId._id || payment.seriesId,
                currency: payment.currency,
                amount: payment.amount,
                couponCode: payment.couponCode || '',
                discountApplied: payment.discountApplied || '',
                status: payment.status,
                provider: payment.provider,
                providerRef: payment.providerRef || ''
            });
        } else {
            setEditingPayment(null);
            setFormData({
                userId: '',
                seriesId: selectedSeriesId || '',
                currency: 'PKR',
                amount: '',
                couponCode: '',
                discountApplied: '',
                status: 'created',
                provider: 'manual',
                providerRef: ''
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPayment(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.userId) newErrors.userId = 'User is required';
        if (!formData.seriesId) newErrors.seriesId = 'Series is required';
        if (!formData.amount) newErrors.amount = 'Amount is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const submitData = {
                ...formData,
                amount: Number(formData.amount),
                discountApplied: formData.discountApplied ? Number(formData.discountApplied) : 0
            };

            if (editingPayment) {
                await axiosInstance.put(`/payments/${editingPayment._id}`, submitData);
                enqueueSnackbar('Payment updated successfully', { variant: 'success' });
            } else {
                await axiosInstance.post('/payments', submitData);
                enqueueSnackbar('Payment created successfully', { variant: 'success' });
            }

            handleCloseDialog();
            if (selectedSeriesId) {
                fetchPayments(selectedSeriesId);
            } else {
                fetchAllPayments();
            }
            fetchStats();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Operation failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (paymentId) => {
        if (window.confirm('Are you sure you want to delete this payment? This action cannot be undone.')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/payments/${paymentId}`);
                enqueueSnackbar('Payment deleted successfully', { variant: 'success' });
                if (selectedSeriesId) {
                    fetchPayments(selectedSeriesId);
                } else {
                    fetchAllPayments();
                }
                fetchStats();
            } catch (error) {
                enqueueSnackbar('Failed to delete payment', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            setLoading(true);
            await axiosInstance.patch(`/payments/${paymentId}/status`, { status: newStatus });
            enqueueSnackbar(`Payment status updated to ${newStatus}`, { variant: 'success' });
            if (selectedSeriesId) {
                fetchPayments(selectedSeriesId);
            } else {
                fetchAllPayments();
            }
            fetchStats();
        } catch (error) {
            enqueueSnackbar('Failed to update payment status', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatsCard = (title, value, icon, color) => (
        <Card sx={{ minWidth: 275, bgcolor: color }}>
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" component="div" color="white">
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" color="white">
                            {value}
                        </Typography>
                    </Box>
                    <Box color="white">
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'success';
            case 'processing': return 'warning';
            case 'failed': return 'error';
            case 'canceled': return 'default';
            case 'refunded': return 'info';
            default: return 'default';
        }
    };

    const getUserName = (userId) => {
        const user = users.find(u => u._id === userId);
        return user ? user.username : 'Unknown User';
    };

    const getUserEmail = (userId) => {
        const user = users.find(u => u._id === userId);
        return user ? user.email : 'Unknown Email';
    };

    const getSeriesTitle = (seriesId) => {
        const seriesItem = series.find(s => s._id === seriesId);
        return seriesItem ? seriesItem.title : 'Unknown Series';
    };

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Payment Management</h1>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#4e73df' }}
                >
                    Add New Payment
                </Button>
            </div>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Total Payments', stats.totalPayments || 0, <Payment />, '#4e73df')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Paid Payments', stats.paidPayments || 0, <CheckCircle />, '#1cc88a')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Pending Payments', stats.pendingPayments || 0, <Schedule />, '#f6c23e')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Total Revenue', `PKR ${(stats.totalRevenue || 0).toLocaleString()}`, <TrendingUp />, '#e74a3b')}
                </Grid>
            </Grid>

            {/* Series Filter */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Filter by Series
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Choose Series</InputLabel>
                        <Select
                            value={selectedSeriesId}
                            onChange={(e) => setSelectedSeriesId(e.target.value)}
                        >
                            <MenuItem value="">All Series</MenuItem>
                            {series?.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {selectedSeriesId ? `Payments for ${getSeriesTitle(selectedSeriesId)}` : 'All Payments'}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Series</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments?.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                                                    {getUserName(item.userId._id || item.userId).charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2">
                                                        {getUserName(item.userId._id || item.userId)}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {getUserEmail(item.userId._id || item.userId)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {getSeriesTitle(item.seriesId._id || item.seriesId)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                PKR {item.amount.toLocaleString()}
                                            </Typography>
                                            {item.discountApplied > 0 && (
                                                <Typography variant="caption" color="textSecondary">
                                                    Discount: PKR {item.discountApplied}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.status} 
                                                color={getStatusColor(item.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.provider} 
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => setSelectedPayment(item)}
                                                color="primary"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpenDialog(item)}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDelete(item._id)}
                                                color="error"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingPayment ? 'Edit Payment' : 'Add New Payment'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.userId}>
                                <InputLabel>User</InputLabel>
                                <Select
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                >
                                    {users?.map((user) => (
                                        <MenuItem key={user._id} value={user._id}>
                                            {user.username} ({user.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.userId && (
                                    <Typography variant="caption" color="error">
                                        {errors.userId}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.seriesId}>
                                <InputLabel>Series</InputLabel>
                                <Select
                                    value={formData.seriesId}
                                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                                >
                                    {series?.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>
                                            {item.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.seriesId && (
                                    <Typography variant="caption" color="error">
                                        {errors.seriesId}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount (PKR)"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                error={!!errors.amount}
                                helperText={errors.amount}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Discount Applied (PKR)"
                                type="number"
                                value={formData.discountApplied}
                                onChange={(e) => setFormData({ ...formData, discountApplied: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Coupon Code"
                                value={formData.couponCode}
                                onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    {statuses?.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Provider</InputLabel>
                                <Select
                                    value={formData.provider}
                                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                >
                                    {providers?.map((provider) => (
                                        <MenuItem key={provider} value={provider}>
                                            {provider.charAt(0).toUpperCase() + provider.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Provider Reference"
                                value={formData.providerRef}
                                onChange={(e) => setFormData({ ...formData, providerRef: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={loading}
                        sx={{ bgcolor: '#4e73df' }}
                    >
                        {loading ? 'Saving...' : (editingPayment ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Payment Details Dialog */}
            <Dialog open={!!selectedPayment} onClose={() => setSelectedPayment(null)} maxWidth="md" fullWidth>
                {selectedPayment && (
                    <>
                        <DialogTitle>Payment Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Customer Information</Typography>
                                    <Typography variant="body2">
                                        Name: {getUserName(selectedPayment.userId._id || selectedPayment.userId)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Email: {getUserEmail(selectedPayment.userId._id || selectedPayment.userId)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Series Information</Typography>
                                    <Typography variant="body2">
                                        Series: {getSeriesTitle(selectedPayment.seriesId._id || selectedPayment.seriesId)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">
                                        Amount: PKR {selectedPayment.amount.toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">
                                        Status: {selectedPayment.status}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">
                                        Provider: {selectedPayment.provider}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">
                                        Date: {new Date(selectedPayment.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                {selectedPayment.couponCode && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            Coupon: {selectedPayment.couponCode}
                                        </Typography>
                                    </Grid>
                                )}
                                {selectedPayment.discountApplied > 0 && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            Discount: PKR {selectedPayment.discountApplied}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedPayment(null)}>Close</Button>
                            <Button 
                                onClick={() => {
                                    setSelectedPayment(null);
                                    handleOpenDialog(selectedPayment);
                                }}
                                variant="contained"
                                sx={{ bgcolor: '#4e73df' }}
                            >
                                Edit
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default PaymentManagement;
