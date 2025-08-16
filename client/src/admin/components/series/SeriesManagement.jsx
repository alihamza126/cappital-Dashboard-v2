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
    Switch,
    FormControlLabel,
    Box,
    Alert
} from '@mui/material';
import { 
    Add, 
    Edit, 
    Delete, 
    Visibility, 
    School, 
    Assessment,
    People,
    Payment
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl';

const SeriesManagement = () => {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingSeries, setEditingSeries] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        coverImageUrl: '',
        description: '',
        subjects: [],
        difficulty: 'Beginner',
        price: '',
        originalPrice: '',
        tags: [],
        totalTests: '',
        totalDurationMin: '',
        isActive: true,
        expiresAt: ''
    });

    const [errors, setErrors] = useState({});

    const subjects = ['Biology', 'Chemistry', 'Physics', 'English', 'Mathematics', 'Logic'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        fetchSeries();
    }, []);

    const fetchSeries = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/series/all');
            setSeries(response.data);
        } catch (error) {
            enqueueSnackbar('Failed to fetch series', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (series = null) => {
        if (series) {
            setEditingSeries(series);
            setFormData({
                slug: series.slug,
                title: series.title,
                coverImageUrl: series.coverImageUrl || '',
                description: series.description,
                subjects: series.subjects,
                difficulty: series.difficulty,
                price: series.price,
                originalPrice: series.originalPrice || '',
                tags: series.tags || [],
                totalTests: series.totalTests,
                totalDurationMin: series.totalDurationMin || '',
                isActive: series.isActive,
                expiresAt: series.expiresAt ? new Date(series.expiresAt).toISOString().split('T')[0] : ''
            });
        } else {
            setEditingSeries(null);
            setFormData({
                slug: '',
                title: '',
                coverImageUrl: '',
                description: '',
                subjects: [],
                difficulty: 'Beginner',
                price: '',
                originalPrice: '',
                tags: [],
                totalTests: '',
                totalDurationMin: '',
                isActive: true,
                expiresAt: ''
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSeries(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.slug) newErrors.slug = 'Slug is required';
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.totalTests) newErrors.totalTests = 'Total tests is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const submitData = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                totalTests: Number(formData.totalTests),
                totalDurationMin: formData.totalDurationMin ? Number(formData.totalDurationMin) : undefined,
                expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
            };

            if (editingSeries) {
                await axiosInstance.put(`/series/${editingSeries._id}`, submitData);
                enqueueSnackbar('Series updated successfully', { variant: 'success' });
            } else {
                await axiosInstance.post('/series', submitData);
                enqueueSnackbar('Series created successfully', { variant: 'success' });
            }

            handleCloseDialog();
            fetchSeries();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Operation failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (seriesId) => {
        if (window.confirm('Are you sure you want to delete this series? This action cannot be undone.')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/series/${seriesId}`);
                enqueueSnackbar('Series deleted successfully', { variant: 'success' });
                fetchSeries();
            } catch (error) {
                enqueueSnackbar('Failed to delete series', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubjectChange = (event) => {
        setFormData({ ...formData, subjects: event.target.value });
    };

    const handleTagChange = (event) => {
        const value = event.target.value;
        setFormData({ ...formData, tags: typeof value === 'string' ? value.split(',') : value });
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

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Series Management</h1>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#4e73df' }}
                >
                    Add New Series
                </Button>
            </div>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Total Series', series.length, <School />, '#4e73df')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Active Series', series.filter(s => s.isActive).length, <Assessment />, '#1cc88a')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Total Tests', series.reduce((sum, s) => sum + s.totalTests, 0), <Assessment />, '#f6c23e')}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    {getStatsCard('Total Revenue', `PKR ${series.reduce((sum, s) => sum + s.price, 0).toLocaleString()}`, <Payment />, '#e74a3b')}
                </Grid>
            </Grid>

            {/* Series Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        All Series
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Slug</TableCell>
                                    <TableCell>Subjects</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Tests</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {series.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                {item.coverImageUrl && (
                                                    <img 
                                                        src={item.coverImageUrl} 
                                                        alt={item.title}
                                                        style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
                                                    />
                                                )}
                                                <Typography variant="body2">{item.title}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{item.slug}</TableCell>
                                        <TableCell>
                                            {item.subjects.map((subject, index) => (
                                                <Chip 
                                                    key={index} 
                                                    label={subject} 
                                                    size="small" 
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </TableCell>
                                        <TableCell>PKR {item.price}</TableCell>
                                        <TableCell>{item.totalTests}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={item.isActive ? 'Active' : 'Inactive'} 
                                                color={item.isActive ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => setSelectedSeries(item)}
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
                    {editingSeries ? 'Edit Series' : 'Add New Series'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                error={!!errors.slug}
                                helperText={errors.slug}
                                placeholder="e.g., mdcat-series-2025"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Cover Image URL"
                                value={formData.coverImageUrl}
                                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                multiline
                                rows={3}
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.subjects}>
                                <InputLabel>Subjects</InputLabel>
                                <Select
                                    multiple
                                    value={formData.subjects}
                                    onChange={handleSubjectChange}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.subjects && (
                                    <Typography variant="caption" color="error">
                                        {errors.subjects}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Difficulty</InputLabel>
                                <Select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                >
                                    {difficulties.map((difficulty) => (
                                        <MenuItem key={difficulty} value={difficulty}>
                                            {difficulty}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price (PKR)"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Original Price (PKR)"
                                type="number"
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Total Tests"
                                type="number"
                                value={formData.totalTests}
                                onChange={(e) => setFormData({ ...formData, totalTests: e.target.value })}
                                error={!!errors.totalTests}
                                helperText={errors.totalTests}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Total Duration (minutes)"
                                type="number"
                                value={formData.totalDurationMin}
                                onChange={(e) => setFormData({ ...formData, totalDurationMin: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tags (comma-separated)"
                                value={formData.tags.join(',')}
                                onChange={handleTagChange}
                                placeholder="mdcat, medical, exam"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Expires At"
                                type="date"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                }
                                label="Active"
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
                        {loading ? 'Saving...' : (editingSeries ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Series Details Dialog */}
            <Dialog open={!!selectedSeries} onClose={() => setSelectedSeries(null)} maxWidth="md" fullWidth>
                {selectedSeries && (
                    <>
                        <DialogTitle>Series Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{selectedSeries.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedSeries.slug}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1">{selectedSeries.description}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Subjects:</Typography>
                                    {selectedSeries.subjects.map((subject, index) => (
                                        <Chip key={index} label={subject} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Difficulty: {selectedSeries.difficulty}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Price: PKR {selectedSeries.price}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Total Tests: {selectedSeries.totalTests}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">Tags:</Typography>
                                    {selectedSeries.tags?.map((tag, index) => (
                                        <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedSeries(null)}>Close</Button>
                            <Button 
                                onClick={() => {
                                    setSelectedSeries(null);
                                    handleOpenDialog(selectedSeries);
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

export default SeriesManagement;
