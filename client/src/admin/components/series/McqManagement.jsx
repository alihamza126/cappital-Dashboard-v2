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
    Tabs,
    Tab,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Switch,
    FormControlLabel
} from '@mui/material';
import { 
    Add, 
    Edit, 
    Delete, 
    Visibility, 
    Search,
    FilterList,
    CloudUpload,
    Image
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl';
import { bioChapterNames, englishChapterNames, chemistryChapterNames, physicsChapterNames, logicChapterNames } from '../../../utils/chaptername';
import { bioTopicsNames, chemistryTopicsNames, physicsTopicsNames } from '../../../utils/topics';

const McqManagement = () => {
    const [mcqs, setMcqs] = useState([]);
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMcq, setEditingMcq] = useState(null);
    const [selectedMcq, setSelectedMcq] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [chapter, setChapter] = useState(englishChapterNames);
    const [subject, setSubject] = useState('english');
    const [topic, setTopic] = useState([]);
    const [selectChapter, setSelectChapter] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        question: '',
        options: ['', '', '', ''],
        correctOption: '',
        difficulty: 'easy',
        category: 'normal',
        subject: 'english',
        chapter: '',
        topic: '',
        course: 'mdcat',
        info: '',
        explain: '',
        imageUrl: '',
        isSeries: false,
        seriesId: ''
    });

    const [errors, setErrors] = useState({});
    const [filters, setFilters] = useState({
        subject: '',
        chapter: '',
        topic: '',
        difficulty: '',
        course: 'mdcat',
        search: '',
        isSeries: ''
    });

    const subjects = ['biology', 'chemistry', 'physics', 'english', 'logic'];
    const difficulties = ['easy', 'medium', 'hard'];
    const categories = ['past', 'normal'];
    const courses = ['mdcat', 'nums'];

    useEffect(() => {
        fetchMcqs();
        fetchSeries();
    }, []);

    useEffect(() => {
        if (subject === 'biology') {
            setChapter(bioChapterNames);
            setTopic([]);
        } else if (subject === 'chemistry') {
            setChapter(chemistryChapterNames);
            setTopic([]);
        } else if (subject === 'physics') {
            setChapter(physicsChapterNames);
            setTopic([]);
        } else if (subject === 'logic') {
            setChapter(logicChapterNames);
            setTopic([]);
        } else if (subject === 'english') {
            setChapter(englishChapterNames);
            setTopic([]);
        }
    }, [subject]);

    useEffect(() => {
        if (subject === 'biology') {
            const data = bioTopicsNames[selectChapter];
            setTopic(data || []);
        } else if (subject === 'chemistry') {
            const data = chemistryTopicsNames[selectChapter];
            setTopic(data || []);
        } else if (subject === 'physics') {
            const data = physicsTopicsNames[selectChapter];
            setTopic(data || []);
        } else if (subject === 'logic' || subject === 'english') {
            setTopic([]);
        }
    }, [selectChapter, subject]);

    const fetchMcqs = async () => {
        try {
            setLoading(true);
            // Use the admin endpoint to get all MCQs
            const response = await axiosInstance.get('/mcq/admin/all');
            let allMcqs = response.data || [];
            
            // Apply filters on the client side
            if (filters.subject) {
                allMcqs = allMcqs.filter(mcq => mcq.subject === filters.subject);
            }
            if (filters.chapter) {
                allMcqs = allMcqs.filter(mcq => mcq.chapter === filters.chapter);
            }
            if (filters.topic) {
                allMcqs = allMcqs.filter(mcq => mcq.topic === filters.topic);
            }
            if (filters.course) {
                allMcqs = allMcqs.filter(mcq => mcq.course === filters.course);
            }
            
            setMcqs(allMcqs);
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Failed to fetch MCQs', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const fetchSeries = async () => {
        try {
            const response = await axiosInstance.get('/series/all');
            setSeries(response.data || []);
        } catch (error) {
            enqueueSnackbar('Failed to fetch series', { variant: 'error' });
        }
    };

    const handleOpenDialog = (mcq = null) => {
        if (mcq) {
            setEditingMcq(mcq);
            setFormData({
                question: mcq.question,
                options: mcq.options,
                correctOption: mcq.correctOption,
                difficulty: mcq.difficulty,
                category: mcq.category,
                subject: mcq.subject,
                chapter: mcq.chapter,
                topic: mcq.topic,
                course: mcq.course,
                info: mcq.info || '',
                explain: mcq.explain || '',
                imageUrl: mcq.imageUrl || '',
                isSeries: mcq.isSeries || false,
                seriesId: mcq.seriesId || ''
            });
            setImageUrl(mcq.imageUrl || '');
            setSelectChapter(mcq.chapter);
        } else {
            setEditingMcq(null);
            setFormData({
                question: '',
                options: ['', '', '', ''],
                correctOption: '',
                difficulty: 'easy',
                category: 'normal',
                subject: 'english',
                chapter: '',
                topic: '',
                course: 'mdcat',
                info: '',
                explain: '',
                imageUrl: '',
                isSeries: false,
                seriesId: ''
            });
            setImageUrl('');
            setSelectChapter('');
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingMcq(null);
        setErrors({});
        setImage(null);
        setImageUrl('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('option')) {
            const index = parseInt(name.slice(-1)) - 1;
            const updatedOptions = [...formData.options];
            updatedOptions[index] = value;
            setFormData({ ...formData, options: updatedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.question.trim()) {
            newErrors.question = 'Question is required';
        }
        if (formData.options.some(option => !option.trim())) {
            newErrors.options = 'All options are required';
        }
        if (formData.correctOption === '') {
            newErrors.correctOption = 'Correct Option is required';
        }
        if (!formData.chapter.trim()) {
            newErrors.chapter = 'Chapter is required';
        }
        if (subject !== 'logic' && subject !== 'english') {
            if (!formData.topic.trim()) {
                newErrors.topic = 'Topic is required';
            }
        }
        if (formData.isSeries && !formData.seriesId) {
            newErrors.seriesId = 'Series is required when creating series MCQ';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            let finalFormData = { ...formData };

            if (image) {
                const formImgData = new FormData();
                formImgData.append('image', image);
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                };
                const imgResponse = await axiosInstance.post('/upload/img', formImgData, config);
                if (imgResponse.status === 200) {
                    finalFormData.imageUrl = imgResponse.data.fileURL;
                } else {
                    enqueueSnackbar('Failed to upload image', { variant: 'error' });
                    return;
                }
            }

            if (editingMcq) {
                await axiosInstance.put('/mcq/update', {
                    id: editingMcq._id,
                    formData: finalFormData
                });
                enqueueSnackbar('MCQ updated successfully', { variant: 'success' });
            } else {
                await axiosInstance.post('/mcq/add', finalFormData);
                enqueueSnackbar('MCQ created successfully', { variant: 'success' });
            }

            handleCloseDialog();
            fetchMcqs();
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Operation failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (mcqId) => {
        if (window.confirm('Are you sure you want to delete this MCQ? This action cannot be undone.')) {
            try {
                setLoading(true);
                await axiosInstance.delete('/mcq/delete', { data: { ids: [mcqId] } });
                enqueueSnackbar('MCQ deleted successfully', { variant: 'success' });
                fetchMcqs();
            } catch (error) {
                enqueueSnackbar('Failed to delete MCQ', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const filteredMcqs = mcqs.filter(mcq => {
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            if (!mcq.question.toLowerCase().includes(searchTerm) &&
                !mcq.subject.toLowerCase().includes(searchTerm) &&
                !mcq.chapter.toLowerCase().includes(searchTerm)) {
                return false;
            }
        }
        if (filters.difficulty && mcq.difficulty !== filters.difficulty) return false;
        if (filters.isSeries === 'true' && !mcq.isSeries) return false;
        if (filters.isSeries === 'false' && mcq.isSeries) return false;
        return true;
    });

    return (
        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">MCQ Management</h1>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: '#4e73df' }}
                >
                    Add New MCQ
                </Button>
            </div>

            {/* Filters */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Search MCQs"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                InputProps={{
                                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Subject</InputLabel>
                                <Select
                                    value={filters.subject}
                                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                                >
                                    <MenuItem value="">All Subjects</MenuItem>
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Difficulty</InputLabel>
                                <Select
                                    value={filters.difficulty}
                                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                                >
                                    <MenuItem value="">All Difficulties</MenuItem>
                                    {difficulties.map((difficulty) => (
                                        <MenuItem key={difficulty} value={difficulty}>
                                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Course</InputLabel>
                                <Select
                                    value={filters.course}
                                    onChange={(e) => handleFilterChange('course', e.target.value)}
                                >
                                    {courses.map((course) => (
                                        <MenuItem key={course} value={course}>
                                            {course.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Series MCQ</InputLabel>
                                <Select
                                    value={filters.isSeries}
                                    onChange={(e) => handleFilterChange('isSeries', e.target.value)}
                                >
                                    <MenuItem value="">All MCQs</MenuItem>
                                    <MenuItem value="true">Series MCQs Only</MenuItem>
                                    <MenuItem value="false">Regular MCQs Only</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* MCQs Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        MCQs ({filteredMcqs.length})
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Chapter</TableCell>
                                    <TableCell>Difficulty</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Series MCQ</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMcqs.map((mcq) => (
                                    <TableRow key={mcq._id}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                                {mcq.question.substring(0, 100)}...
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={mcq.subject} 
                                                size="small" 
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell>{mcq.chapter}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={mcq.difficulty} 
                                                size="small" 
                                                color={
                                                    mcq.difficulty === 'easy' ? 'success' : 
                                                    mcq.difficulty === 'medium' ? 'warning' : 'error'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={mcq.category} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={mcq.isSeries ? 'Yes' : 'No'} 
                                                size="small" 
                                                color={mcq.isSeries ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => setSelectedMcq(mcq)}
                                                color="primary"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleOpenDialog(mcq)}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDelete(mcq._id)}
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
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>
                    {editingMcq ? 'Edit MCQ' : 'Add New MCQ'}
                </DialogTitle>
                <DialogContent>
                    <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="MCQ Details" />
                        <Tab label="Image Upload" />
                    </Tabs>

                    {tabValue === 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    name="question"
                                    multiline
                                    rows={3}
                                    error={!!errors.question}
                                    helperText={errors.question}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Option A"
                                    value={formData.options[0]}
                                    onChange={handleChange}
                                    name="option1"
                                    error={!!errors.options}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Option B"
                                    value={formData.options[1]}
                                    onChange={handleChange}
                                    name="option2"
                                    error={!!errors.options}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Option C"
                                    value={formData.options[2]}
                                    onChange={handleChange}
                                    name="option3"
                                    error={!!errors.options}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Option D"
                                    value={formData.options[3]}
                                    onChange={handleChange}
                                    name="option4"
                                    error={!!errors.options}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.correctOption}>
                                    <InputLabel>Correct Option</InputLabel>
                                    <Select
                                        value={formData.correctOption}
                                        onChange={handleChange}
                                        name="correctOption"
                                    >
                                        <MenuItem value={1}>A</MenuItem>
                                        <MenuItem value={2}>B</MenuItem>
                                        <MenuItem value={3}>C</MenuItem>
                                        <MenuItem value={4}>D</MenuItem>
                                    </Select>
                                    {errors.correctOption && (
                                        <Typography variant="caption" color="error">
                                            {errors.correctOption}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Subject</InputLabel>
                                    <Select
                                        value={formData.subject}
                                        onChange={handleChange}
                                        name="subject"
                                    >
                                        {subjects.map((subject) => (
                                            <MenuItem key={subject} value={subject}>
                                                {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.chapter}>
                                    <InputLabel>Chapter</InputLabel>
                                    <Select
                                        value={selectChapter}
                                        onChange={(e) => {
                                            setSelectChapter(e.target.value);
                                            setFormData({ ...formData, chapter: e.target.value });
                                        }}
                                    >
                                        {chapter.map((chap) => (
                                            <MenuItem key={chap} value={chap}>
                                                {chap}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.chapter && (
                                        <Typography variant="caption" color="error">
                                            {errors.chapter}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.topic}>
                                    <InputLabel>Topic</InputLabel>
                                    <Select
                                        value={formData.topic}
                                        onChange={handleChange}
                                        name="topic"
                                        disabled={subject === 'logic' || subject === 'english'}
                                    >
                                        {topic.map((top) => (
                                            <MenuItem key={top} value={top}>
                                                {top}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.topic && (
                                        <Typography variant="caption" color="error">
                                            {errors.topic}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        name="difficulty"
                                    >
                                        {difficulties.map((difficulty) => (
                                            <MenuItem key={difficulty} value={difficulty}>
                                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={formData.category}
                                        onChange={handleChange}
                                        name="category"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Course</InputLabel>
                                    <Select
                                        value={formData.course}
                                        onChange={handleChange}
                                        name="course"
                                    >
                                        {courses.map((course) => (
                                            <MenuItem key={course} value={course}>
                                                {course.toUpperCase()}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isSeries}
                                            onChange={(e) => setFormData({ ...formData, isSeries: e.target.checked })}
                                        />
                                    }
                                    label="Series MCQ"
                                />
                            </Grid>
                            {formData.isSeries && (
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.seriesId}>
                                        <InputLabel>Series</InputLabel>
                                        <Select
                                            value={formData.seriesId}
                                            onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                                        >
                                            {series.map((s) => (
                                                <MenuItem key={s._id} value={s._id}>
                                                    {s.title}
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
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Info"
                                    value={formData.info}
                                    onChange={handleChange}
                                    name="info"
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Explanation"
                                    value={formData.explain}
                                    onChange={handleChange}
                                    name="explain"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {tabValue === 1 && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                MCQ Image
                            </Typography>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="image-upload"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUpload />}
                                    sx={{ mb: 2 }}
                                >
                                    Upload Image
                                </Button>
                            </label>
                            {imageUrl && (
                                <Box sx={{ mt: 2 }}>
                                    <img 
                                        src={imageUrl} 
                                        alt="MCQ" 
                                        style={{ maxWidth: '100%', maxHeight: 300 }}
                                    />
                                </Box>
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
                        {loading ? 'Saving...' : (editingMcq ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* MCQ Details Dialog */}
            <Dialog open={!!selectedMcq} onClose={() => setSelectedMcq(null)} maxWidth="md" fullWidth>
                {selectedMcq && (
                    <>
                        <DialogTitle>MCQ Details</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Question
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedMcq.question}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Options
                                    </Typography>
                                    {selectedMcq.options.map((option, index) => (
                                        <Typography 
                                            key={index} 
                                            variant="body1"
                                            color={index === selectedMcq.correctOption ? 'success.main' : 'text.primary'}
                                            sx={{ fontWeight: index === selectedMcq.correctOption ? 'bold' : 'normal' }}
                                        >
                                            {String.fromCharCode(65 + index)}. {option}
                                        </Typography>
                                    ))}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Subject: {selectedMcq.subject}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Chapter: {selectedMcq.chapter}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Topic: {selectedMcq.topic}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Difficulty: {selectedMcq.difficulty}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Category: {selectedMcq.category}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Course: {selectedMcq.course}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2">Series MCQ: {selectedMcq.isSeries ? 'Yes' : 'No'}</Typography>
                                </Grid>
                                {selectedMcq.isSeries && selectedMcq.seriesId && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2">Series: {series.find(s => s._id === selectedMcq.seriesId)?.title || 'Unknown Series'}</Typography>
                                    </Grid>
                                )}
                                {selectedMcq.info && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Info:</Typography>
                                        <Typography variant="body2">{selectedMcq.info}</Typography>
                                    </Grid>
                                )}
                                {selectedMcq.explain && selectedMcq.explain !== "Explanation Not provided" && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Explanation:</Typography>
                                        <Typography variant="body2">{selectedMcq.explain}</Typography>
                                    </Grid>
                                )}
                                {selectedMcq.imageUrl && (
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2">Image:</Typography>
                                        <img 
                                            src={selectedMcq.imageUrl} 
                                            alt="MCQ" 
                                            style={{ maxWidth: '100%', maxHeight: 300 }}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedMcq(null)}>Close</Button>
                            <Button 
                                onClick={() => {
                                    setSelectedMcq(null);
                                    handleOpenDialog(selectedMcq);
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

export default McqManagement;
