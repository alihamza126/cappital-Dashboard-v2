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

const TestManagement = () => {
    const [tests, setTests] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingTest, setEditingTest] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedSeriesId, setSelectedSeriesId] = useState('');
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

    const subjects = ['biology', 'chemistry', 'physics', 'english', 'mathematics', 'logic'];
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
                questions: test.questions ? test.questions.map(q => ({
                    _id: q.questionId._id,
                    question: q.questionId.question,
                    options: q.questionId.options,
                    correctOption: q.questionId.correctOption,
                    subject: q.questionId.subject,
                    chapter: q.questionId.chapter,
                    topic: q.questionId.topic,
                    difficulty: q.questionId.difficulty,
                    category: q.questionId.category,
                    course: q.questionId.course,
                    info: q.questionId.info || '',
                    explain: q.questionId.explain || '',
                    imageUrl: q.questionId.imageUrl || '',
                    marks: q.marks
                })) : [],
                isPublished: test.isPublished
            });
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
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingTest(null);
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.seriesId) newErrors.seriesId = 'Series is required';
        if (!formData.title) newErrors.title = 'Title is required';
        if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';
        if (!formData.durationMin) newErrors.durationMin = 'Duration is required';
        if (!formData.totalMarks) newErrors.totalMarks = 'Total marks is required';
        if (formData.questions.length === 0) newErrors.questions = 'At least one MCQ is required';
        
        // Validate each MCQ
        formData.questions.forEach((mcq, index) => {
            if (!mcq.question) {
                newErrors[`mcq_${index}_question`] = 'Question is required';
            }
            if (!mcq.options || mcq.options.length !== 4 || mcq.options.some(opt => !opt)) {
                newErrors[`mcq_${index}_options`] = 'All 4 options are required';
            }
            if (mcq.correctOption < 0 || mcq.correctOption > 4) {
                newErrors[`mcq_${index}_correctOption`] = 'Correct option must be A, B, C, or D';
            }
            if (!mcq.subject) {
                newErrors[`mcq_${index}_subject`] = 'Subject is required';
            }
            if (!mcq.chapter) {
                newErrors[`mcq_${index}_chapter`] = 'Chapter is required';
            }
            if (!mcq.topic) {
                newErrors[`mcq_${index}_topic`] = 'Topic is required';
            }
        });
        
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
                }
            };

            console.log('Submitting test data:', {
                editing: !!editingTest,
                testId: editingTest?._id,
                questionsCount: submitData.questions?.length,
                questions: submitData.questions?.map(q => ({
                    id: q._id,
                    question: q.question?.substring(0, 30) + '...',
                    options: q.options?.length
                }))
            });

            if (editingTest) {
                const response = await axiosInstance.put(`/tests/${editingTest._id}`, submitData);
                console.log('Test update response:', response.data);
                enqueueSnackbar('Test updated successfully', { variant: 'success' });
            } else {
                const response = await axiosInstance.post('/tests', submitData);
                console.log('Test create response:', response.data);
                enqueueSnackbar('Test created successfully', { variant: 'success' });
            }

            handleCloseDialog();
            fetchTests(selectedSeriesId);
        } catch (error) {
            console.error('Test operation error:', error.response?.data || error);
            enqueueSnackbar(error.response?.data?.error || error.response?.data?.details || 'Operation failed', { variant: 'error' });
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

    // MCQ Management Functions
    const addMcq = () => {
        const newMcq = {
            _id: Date.now().toString(), // Temporary ID for new MCQ
            question: '',
            options: ['', '', '', ''],
            correctOption: 0,
            subject: '',
            chapter: '',
            topic: '',
            difficulty: 'easy',
            category: 'normal',
            course: 'mdcat',
            info: '',
            explain: '',
            imageUrl: '',
            marks: 1
        };
        setFormData({
            ...formData,
            questions: [...formData.questions, newMcq]
        });
    };

    const updateMcq = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        if (field.startsWith('option')) {
            const optionIndex = parseInt(field.slice(-1)) - 1;
            updatedQuestions[index].options[optionIndex] = value;
        } else {
            updatedQuestions[index][field] = value;
        }
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
    };

    const removeMcq = (index) => {
        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            questions: updatedQuestions
        });
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
                        <Tab label="MCQ Management" />
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
                                    MCQs: {formData.questions.length}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={addMcq}
                                >
                                    Add MCQ
                                </Button>
                            </Box>
                            
                            {errors.questions && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errors.questions}
                                </Alert>
                            )}

                            {formData.questions.length > 0 ? (
                                <List>
                                    {formData.questions.map((mcq, index) => (
                                        <Accordion key={mcq._id || index}>
                                            <AccordionSummary expandIcon={<ExpandMore />}>
                                                <Typography>
                                                    MCQ {index + 1}: {mcq.question || 'New Question'}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            label="Question"
                                                            value={mcq.question}
                                                            onChange={(e) => updateMcq(index, 'question', e.target.value)}
                                                            multiline
                                                            rows={3}
                                                            error={!!errors[`mcq_${index}_question`]}
                                                            helperText={errors[`mcq_${index}_question`]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Option A"
                                                            value={mcq.options[0]}
                                                            onChange={(e) => updateMcq(index, 'option1', e.target.value)}
                                                            error={!!errors[`mcq_${index}_options`]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Option B"
                                                            value={mcq.options[1]}
                                                            onChange={(e) => updateMcq(index, 'option2', e.target.value)}
                                                            error={!!errors[`mcq_${index}_options`]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Option C"
                                                            value={mcq.options[2]}
                                                            onChange={(e) => updateMcq(index, 'option3', e.target.value)}
                                                            error={!!errors[`mcq_${index}_options`]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Option D"
                                                            value={mcq.options[3]}
                                                            onChange={(e) => updateMcq(index, 'option4', e.target.value)}
                                                            error={!!errors[`mcq_${index}_options`]}
                                                        />
                                                    </Grid>
                                                    {errors[`mcq_${index}_options`] && (
                                                        <Grid item xs={12}>
                                                            <Alert severity="error" sx={{ mt: 1 }}>
                                                                {errors[`mcq_${index}_options`]}
                                                            </Alert>
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth error={!!errors[`mcq_${index}_correctOption`]}>
                                                            <InputLabel>Correct Option</InputLabel>
                                                            <Select
                                                                value={mcq.correctOption}
                                                                onChange={(e) => updateMcq(index, 'correctOption', e.target.value)}
                                                            >
                                                                <MenuItem value={1}>A</MenuItem>
                                                                <MenuItem value={2}>B</MenuItem>
                                                                <MenuItem value={3}>C</MenuItem>
                                                                <MenuItem value={4}>D</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    {errors[`mcq_${index}_correctOption`] && (
                                                        <Grid item xs={12}>
                                                            <Alert severity="error" sx={{ mt: 1 }}>
                                                                {errors[`mcq_${index}_correctOption`]}
                                                            </Alert>
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth error={!!errors[`mcq_${index}_subject`]}>
                                                            <InputLabel>Subject</InputLabel>
                                                            <Select
                                                                value={mcq.subject}
                                                                onChange={(e) => updateMcq(index, 'subject', e.target.value)}
                                                            >
                                                                {subjects.map((subject) => (
                                                                    <MenuItem key={subject} value={subject}>
                                                                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    {errors[`mcq_${index}_subject`] && (
                                                        <Grid item xs={12}>
                                                            <Alert severity="error" sx={{ mt: 1 }}>
                                                                {errors[`mcq_${index}_subject`]}
                                                            </Alert>
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Chapter"
                                                            value={mcq.chapter}
                                                            onChange={(e) => updateMcq(index, 'chapter', e.target.value)}
                                                            error={!!errors[`mcq_${index}_chapter`]}
                                                            helperText={errors[`mcq_${index}_chapter`]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Topic"
                                                            value={mcq.topic}
                                                            onChange={(e) => updateMcq(index, 'topic', e.target.value)}
                                                            error={!!errors[`mcq_${index}_topic`]}
                                                            helperText={errors[`mcq_${index}_topic`]}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <FormControl fullWidth>
                                                            <InputLabel>Difficulty</InputLabel>
                                                            <Select
                                                                value={mcq.difficulty}
                                                                onChange={(e) => updateMcq(index, 'difficulty', e.target.value)}
                                                            >
                                                                <MenuItem value="easy">Easy</MenuItem>
                                                                <MenuItem value="medium">Medium</MenuItem>
                                                                <MenuItem value="hard">Hard</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Marks"
                                                            type="number"
                                                            value={mcq.marks}
                                                            onChange={(e) => updateMcq(index, 'marks', Number(e.target.value))}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            label="Explanation"
                                                            value={mcq.explain}
                                                            onChange={(e) => updateMcq(index, 'explain', e.target.value)}
                                                            multiline
                                                            rows={2}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => removeMcq(index)}
                                                            startIcon={<Delete />}
                                                        >
                                                            Remove MCQ
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </List>
                            ) : (
                                <Alert severity="info">
                                    No MCQs added yet. Click "Add MCQ" to create questions for this test.
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
