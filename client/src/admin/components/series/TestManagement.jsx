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
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Divider,
    Tabs,
    Tab
} from '@mui/material';
import { 
    Add, 
    Edit, 
    Delete, 
    Visibility, 
    ExpandMore,
    Assessment,
    Schedule,
    School,
    Search,
    FilterList
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl';
import McqSelector from './McqSelector';

const TestManagement = () => {
    const [tests, setTests] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openMcqDialog, setOpenMcqDialog] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedSeriesId, setSelectedSeriesId] = useState('');
    const [selectedMcqs, setSelectedMcqs] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        seriesId: '',
        title: '',
        description: '',
        subjects: [],
        mode: 'Practice',
        durationMin: '',
        totalMarks: '',
        availability: {
            startAt: '',
            endAt: ''
        },
        questions: [],
        isPublished: false
    });

    const [errors, setErrors] = useState({});

    const subjects = ['Biology', 'Chemistry', 'Physics', 'English', 'Mathematics', 'Logic'];
    const modes = ['Exam', 'Practice'];

    useEffect(() => {
        fetchSeries();
    }, []);

    useEffect(() => {
        if (selectedSeriesId) {
            fetchTests(selectedSeriesId);
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

    const fetchTests = async (seriesId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/tests/series/${seriesId}`);
            setTests(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to fetch tests', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };



    const handleOpenDialog = (test = null) => {
        if (test) {
            setEditingTest(test);
            setFormData({
                seriesId: test.seriesId,
                title: test.title,
                description: test.description || '',
                subjects: test.subjects,
                mode: test.mode,
                durationMin: test.durationMin,
                totalMarks: test.totalMarks,
                availability: {
                    startAt: test.availability?.startAt ? new Date(test.availability.startAt).toISOString().split('T')[0] : '',
                    endAt: test.availability?.endAt ? new Date(test.availability.endAt).toISOString().split('T')[0] : ''
                },
                questions: test.questions || [],
                isPublished: test.isPublished
            });
            setSelectedMcqs(test.questions || []);
        } else {
            setEditingTest(null);
            setFormData({
                seriesId: selectedSeriesId,
                title: '',
                description: '',
                subjects: [],
                mode: 'Practice',
                durationMin: '',
                totalMarks: '',
                availability: {
                    startAt: '',
                    endAt: ''
                },
                questions: [],
                isPublished: false
            });
            setSelectedMcqs([]);
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTest(null);
        setErrors({});
        setSelectedMcqs([]);
    };

    const handleOpenMcqDialog = () => {
        setOpenMcqDialog(true);
    };

    const handleCloseMcqDialog = () => {
        setOpenMcqDialog(false);
    };

    const handleMcqSelection = (selectedMcqs) => {
        setSelectedMcqs(selectedMcqs);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.seriesId) newErrors.seriesId = 'Series is required';
        if (!formData.title) newErrors.title = 'Title is required';
        if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
        if (!formData.durationMin) newErrors.durationMin = 'Duration is required';
        if (!formData.totalMarks) newErrors.totalMarks = 'Total marks is required';
        if (selectedMcqs.length === 0) newErrors.questions = 'At least one MCQ is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const submitData = {
                ...formData,
                durationMin: Number(formData.durationMin),
                totalMarks: Number(formData.totalMarks),
                availability: {
                    startAt: formData.availability.startAt ? new Date(formData.availability.startAt) : undefined,
                    endAt: formData.availability.endAt ? new Date(formData.availability.endAt) : undefined
                },
                questions: selectedMcqs.map(mcq => ({
                    questionId: mcq._id,
                    marks: 1 // Default marks per question
                }))
            };

            if (editingTest) {
                await axiosInstance.put(`/tests/${editingTest._id}`, submitData);
                enqueueSnackbar('Test updated successfully', { variant: 'success' });
            } else {
                await axiosInstance.post('/tests', submitData);
                enqueueSnackbar('Test created successfully', { variant: 'success' });
            }

            handleCloseDialog();
            fetchTests(selectedSeriesId);
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Operation failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/tests/${testId}`);
                enqueueSnackbar('Test deleted successfully', { variant: 'success' });
                fetchTests(selectedSeriesId);
            } catch (error) {
                enqueueSnackbar('Failed to delete test', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePublishToggle = async (testId, currentStatus) => {
        try {
            setLoading(true);
            await axiosInstance.patch(`/tests/${testId}/publish`, { isPublished: !currentStatus });
            enqueueSnackbar(`Test ${!currentStatus ? 'published' : 'unpublished'} successfully`, { variant: 'success' });
            fetchTests(selectedSeriesId);
        } catch (error) {
            enqueueSnackbar('Failed to update test status', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = (event) => {
        setFormData({ ...formData, subjects: event.target.value });
    };





    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
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

    const selectedSeries = series.find(s => s._id === selectedSeriesId);

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Test Management</h1>
                {selectedSeriesId && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => handleOpenDialog()}
                        sx={{ bgcolor: '#4e73df' }}
                    >
                        Add New Test
                    </Button>
                )}
            </div>

            {/* Series Selection */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Select Series
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel>Choose Series</InputLabel>
                        <Select
                            value={selectedSeriesId}
                            onChange={(e) => setSelectedSeriesId(e.target.value)}
                        >
                            {series.map((item) => (
                                <MenuItem key={item._id} value={item._id}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {selectedSeriesId && (
                <>
                    {/* Statistics Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            {getStatsCard('Total Tests', tests.length, <Assessment />, '#4e73df')}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {getStatsCard('Published Tests', tests.filter(t => t.isPublished).length, <School />, '#1cc88a')}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {getStatsCard('Total Duration', `${tests.reduce((sum, t) => sum + t.durationMin, 0)} min`, <Schedule />, '#f6c23e')}
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {getStatsCard('Total Questions', tests.reduce((sum, t) => sum + (t.questions?.length || 0), 0), <Assessment />, '#e74a3b')}
                        </Grid>
                    </Grid>

                    {/* Series Info */}
                    {selectedSeries && (
                        <Card sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Series: {selectedSeries.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedSeries.description}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    {selectedSeries.subjects.map((subject, index) => (
                                        <Chip key={index} label={subject} size="small" sx={{ mr: 1, mb: 1 }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tests Table */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tests in Series
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Mode</TableCell>
                                            <TableCell>Subjects</TableCell>
                                            <TableCell>Duration</TableCell>
                                            <TableCell>Questions</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tests.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <Typography variant="body2">{item.title}</Typography>
                                                    {item.description && (
                                                        <Typography variant="caption" color="textSecondary">
                                                            {item.description.substring(0, 50)}...
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={item.mode} 
                                                        size="small" 
                                                        color={item.mode === 'Exam' ? 'error' : 'primary'}
                                                    />
                                                </TableCell>
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
                                                <TableCell>{item.durationMin} min</TableCell>
                                                <TableCell>{item.questions?.length || 0}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={item.isPublished ? 'Published' : 'Draft'} 
                                                        color={item.isPublished ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton 
                                                        size="small" 
                                                        onClick={() => setSelectedTest(item)}
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
                                                        onClick={() => handlePublishToggle(item._id, item.isPublished)}
                                                        color={item.isPublished ? 'warning' : 'success'}
                                                    >
                                                        {item.isPublished ? 'Unpublish' : 'Publish'}
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
                </>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {editingTest ? 'Edit Test' : 'Add New Test'}
                </DialogTitle>
                <DialogContent>
                    <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="Test Details" />
                        <Tab label="MCQ Selection" />
                    </Tabs>

                    {tabValue === 0 && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
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
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Mode</InputLabel>
                                    <Select
                                        value={formData.mode}
                                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                                    >
                                        {modes.map((mode) => (
                                            <MenuItem key={mode} value={mode}>
                                                {mode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    multiline
                                    rows={3}
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
                                <TextField
                                    fullWidth
                                    label="Duration (minutes)"
                                    type="number"
                                    value={formData.durationMin}
                                    onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                                    error={!!errors.durationMin}
                                    helperText={errors.durationMin}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Total Marks"
                                    type="number"
                                    value={formData.totalMarks}
                                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                                    error={!!errors.totalMarks}
                                    helperText={errors.totalMarks}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    type="date"
                                    value={formData.availability.startAt}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        availability: { ...formData.availability, startAt: e.target.value }
                                    })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    type="date"
                                    value={formData.availability.endAt}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        availability: { ...formData.availability, endAt: e.target.value }
                                    })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isPublished}
                                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        />
                                    }
                                    label="Published"
                                />
                            </Grid>
                        </Grid>
                    )}

                    {tabValue === 1 && (
                        <Box>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">
                                    Selected MCQs: {selectedMcqs.length}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleOpenMcqDialog}
                                >
                                    Add MCQs
                                </Button>
                            </Box>
                            
                            {errors.questions && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errors.questions}
                                </Alert>
                            )}

                            {selectedMcqs.length > 0 ? (
                                <List>
                                    {selectedMcqs.map((mcq, index) => (
                                        <React.Fragment key={mcq._id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2">
                                                            {index + 1}. {mcq.question}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="caption" color="textSecondary">
                                                                Subject: {mcq.subject} | Chapter: {mcq.chapter} | Difficulty: {mcq.difficulty}
                                                            </Typography>
                                                            <Box sx={{ mt: 1 }}>
                                                                {mcq.options.map((option, optIndex) => (
                                                                    <Typography 
                                                                        key={optIndex} 
                                                                        variant="caption" 
                                                                        color={optIndex === mcq.correctOption ? 'success.main' : 'text.secondary'}
                                                                        sx={{ display: 'block' }}
                                                                    >
                                                                        {String.fromCharCode(65 + optIndex)}. {option}
                                                                    </Typography>
                                                                ))}
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => setSelectedMcqs(selectedMcqs.filter(m => m._id !== mcq._id))}
                                                        color="error"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            {index < selectedMcqs.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            ) : (
                                <Alert severity="info">
                                    No MCQs selected. Click "Add MCQs" to select questions for this test.
                                </Alert>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={loading}
                        sx={{ bgcolor: '#4e73df' }}
                    >
                        {loading ? 'Saving...' : (editingTest ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MCQ Selection Dialog */}
            <McqSelector
                open={openMcqDialog}
                onClose={handleCloseMcqDialog}
                onSelect={handleMcqSelection}
                selectedMcqs={selectedMcqs}
                subjects={subjects}
            />

            {/* Test Details Dialog */}
            <Dialog open={!!selectedTest} onClose={() => setSelectedTest(null)} maxWidth="md" fullWidth>
                {selectedTest && (
                    <>
                        <DialogTitle>Test Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">{selectedTest.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {selectedTest.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Mode: {selectedTest.mode}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Duration: {selectedTest.durationMin} minutes</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Total Marks: {selectedTest.totalMarks}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Status: {selectedTest.isPublished ? 'Published' : 'Draft'}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">Subjects:</Typography>
                                    {selectedTest.subjects.map((subject, index) => (
                                        <Chip key={index} label={subject} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                    ))}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2">Questions: {selectedTest.questions?.length || 0}</Typography>
                                </Grid>
                                {selectedTest.availability?.startAt && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            Start Date: {new Date(selectedTest.availability.startAt).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                )}
                                {selectedTest.availability?.endAt && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">
                                            End Date: {new Date(selectedTest.availability.endAt).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedTest(null)}>Close</Button>
                            <Button 
                                onClick={() => {
                                    setSelectedTest(null);
                                    handleOpenDialog(selectedTest);
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

export default TestManagement;
