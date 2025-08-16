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
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Visibility,
    People,
    School,
    Schedule,
    TrendingUp
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl';

const EnrollmentManagement = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [series, setSeries] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState(null);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [selectedSeriesId, setSelectedSeriesId] = useState('');
    const [stats, setStats] = useState({});
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        userId: '',
        seriesId: '',
        activatedAt: '',
        expiresAt: '',
        sourceOrderId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchSeries();
        fetchUsers();
        fetchStats();
    }, []);

    useEffect(() => {
        if (selectedSeriesId) {
            fetchEnrollments(selectedSeriesId);
        } else {
            fetchAllEnrollments();
        }
    }, [selectedSeriesId]);

    const fetchSeries = async () => {
        try {
            const response = await axiosInstance.get('/series/all');
            setSeries(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to fetch series', { variant: 'error' });
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/user');
            setUsers(response.data || []);
            console.log(response.data);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Failed to fetch users', { variant: 'error' });
        }
    };

    const fetchEnrollments = async (seriesId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/enrollments/series/${seriesId}`);
            setEnrollments(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to fetch enrollments', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchAllEnrollments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/enrollments/all');
            setEnrollments(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to fetch enrollments', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/enrollments/stats/overview');
            setStats(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to fetch statistics', { variant: 'error' });
        }
    };

    const handleOpenDialog = (enrollment = null) => {
        if (enrollment) {
            setEditingEnrollment(enrollment);
            setFormData({
                userId: enrollment.userId._id || enrollment.userId,
                seriesId: enrollment.seriesId._id || enrollment.seriesId,
                activatedAt: enrollment.activatedAt ? new Date(enrollment.activatedAt).toISOString().split('T')[0] : '',
                expiresAt: enrollment.expiresAt ? new Date(enrollment.expiresAt).toISOString().split('T')[0] : '',
                sourceOrderId: enrollment.sourceOrderId._id || enrollment.sourceOrderId
            });
        } else {
            setEditingEnrollment(null);
            setFormData({
                userId: '',
                seriesId: selectedSeriesId || '',
                activatedAt: new Date().toISOString().split('T')[0],
                expiresAt: '',
                sourceOrderId: ''
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingEnrollment(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.userId) newErrors.userId = 'User is required';
        if (!formData.seriesId) newErrors.seriesId = 'Series is required';
        if (!formData.activatedAt) newErrors.activatedAt = 'Activation date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const submitData = {
                ...formData,
                activatedAt: new Date(formData.activatedAt),
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
            };

            if (editingEnrollment) {
                await axiosInstance.put(`/enrollments/${editingEnrollment._id}`, submitData);
                enqueueSnackbar('Enrollment updated successfully', { variant: 'success' });
            } else {
                await axiosInstance.post('/enrollments', submitData);
                enqueueSnackbar('Enrollment created successfully', { variant: 'success' });
            }

            handleCloseDialog();
            if (selectedSeriesId) {
                fetchEnrollments(selectedSeriesId);
            } else {
                fetchAllEnrollments();
            }
            fetchStats();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Operation failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (enrollmentId) => {
        if (window.confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/enrollments/${enrollmentId}`);
                enqueueSnackbar('Enrollment deleted successfully', { variant: 'success' });
                if (selectedSeriesId) {
                    fetchEnrollments(selectedSeriesId);
                } else {
                    fetchAllEnrollments();
                }
                fetchStats();
            } catch (error) {
                enqueueSnackbar('Failed to delete enrollment', { variant: 'error' });
            } finally {
                setLoading(false);
            }
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

    const isEnrollmentExpired = (enrollment) => {
        if (!enrollment.expiresAt) return false;
        return new Date(enrollment.expiresAt) < new Date();
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
                <h1 className="h3 mb-0 text-gray-800">Enrollment Management</h1>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#4e73df' }}
                >
                    Add New Enrollment
                </Button>
            </div>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Total Enrollments', stats.totalEnrollments || 0, <People />, '#4e73df')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Active Enrollments', stats.activeEnrollments || 0, <School />, '#1cc88a')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Expired Enrollments', stats.expiredEnrollments || 0, <Schedule />, '#f6c23e')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Current Enrollments', enrollments.length, <TrendingUp />, '#e74a3b')}
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
                            {series && series?.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Enrollments Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {selectedSeriesId ? `Enrollments for ${getSeriesTitle(selectedSeriesId)}` : 'All Enrollments'}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Student</TableCell>
                                    <TableCell>Series</TableCell>
                                    <TableCell>Activated</TableCell>
                                    <TableCell>Expires</TableCell>
                                    <TableCell>Progress</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {enrollments && enrollments?.map((item) => (
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
                                            {new Date(item.activatedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : 'No Expiry'}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ width: '100%' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ width: '100%', mr: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={item.progress?.testsAttempted || 0}
                                                            sx={{ height: 8, borderRadius: 5 }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ minWidth: 35 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {item.progress?.testsAttempted || 0}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Typography variant="caption" color="textSecondary">
                                                    Tests attempted
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={isEnrollmentExpired(item) ? 'Expired' : 'Active'}
                                                color={isEnrollmentExpired(item) ? 'error' : 'success'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => setSelectedEnrollment(item)}
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
                    {editingEnrollment ? 'Edit Enrollment' : 'Add New Enrollment'}
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
                                {errors?.userId && (
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
                                    {series && series?.map((item) => (
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
                                label="Activated At"
                                type="date"
                                value={formData.activatedAt}
                                onChange={(e) => setFormData({ ...formData, activatedAt: e.target.value })}
                                error={!!errors.activatedAt}
                                helperText={errors.activatedAt}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Expires At (Optional)"
                                type="date"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                InputLabelProps={{ shrink: true }}
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
                        {loading ? 'Saving...' : (editingEnrollment ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Enrollment Details Dialog */}
            <Dialog open={!!selectedEnrollment} onClose={() => setSelectedEnrollment(null)} maxWidth="md" fullWidth>
                {selectedEnrollment && (
                    <>
                        <DialogTitle>Enrollment Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Student Information</Typography>
                                    <Typography variant="body2">
                                        Name: {getUserName(selectedEnrollment.userId._id || selectedEnrollment.userId)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Email: {getUserEmail(selectedEnrollment.userId._id || selectedEnrollment.userId)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Series Information</Typography>
                                    <Typography variant="body2">
                                        Series: {getSeriesTitle(selectedEnrollment.seriesId._id || selectedEnrollment.seriesId)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">
                                        Activated: {new Date(selectedEnrollment.activatedAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">
                                        Expires: {selectedEnrollment.expiresAt ? new Date(selectedEnrollment.expiresAt).toLocaleDateString() : 'No Expiry'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Progress</Typography>
                                    <Typography variant="body2">
                                        Tests Attempted: {selectedEnrollment.progress?.testsAttempted || 0}
                                    </Typography>
                                    <Typography variant="body2">
                                        Average Score: {selectedEnrollment.progress?.avgScore || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Last Attempt: {selectedEnrollment.progress?.lastAttemptAt ? new Date(selectedEnrollment.progress.lastAttemptAt).toLocaleDateString() : 'No attempts yet'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedEnrollment(null)}>Close</Button>
                            <Button
                                onClick={() => {
                                    setSelectedEnrollment(null);
                                    handleOpenDialog(selectedEnrollment);
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

export default EnrollmentManagement;
