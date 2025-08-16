import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Chip,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Divider
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../baseUrl';

const McqSelector = ({ open, onClose, onSelect, selectedMcqs = [], subjects = [] }) => {
    const [mcqs, setMcqs] = useState([]);
    const [filteredMcqs, setFilteredMcqs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        subject: '',
        chapter: '',
        topic: '',
        difficulty: '',
        course: 'mdcat'
    });
    const { enqueueSnackbar } = useSnackbar();

    const difficulties = ['easy', 'medium', 'hard'];
    const courses = ['mdcat', 'nums'];

    // Chapter names for different subjects
    const chapterNames = {
        biology: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Physiology'],
        chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
        physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
        english: ['Grammar', 'Vocabulary', 'Comprehension', 'Writing'],
        logic: ['Logical Reasoning', 'Critical Thinking', 'Problem Solving']
    };

    useEffect(() => {
        if (open) {
            fetchMcqs();
        }
    }, [open, filters]);

    useEffect(() => {
        filterMcqs();
    }, [mcqs, searchTerm]);

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
            
            console.log('Fetched MCQs:', allMcqs.length);
            setMcqs(allMcqs);
        } catch (error) {
            console.log('Error fetching MCQs:', error);
            enqueueSnackbar('Failed to fetch MCQs', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const filterMcqs = () => {
        let filtered = mcqs;
        
        if (searchTerm) {
            filtered = filtered.filter(mcq => 
                mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mcq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mcq.chapter.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.difficulty) {
            filtered = filtered.filter(mcq => mcq.difficulty === filters.difficulty);
        }

        setFilteredMcqs(filtered);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleMcqToggle = (mcq) => {
        const isSelected = selectedMcqs.find(m => m._id === mcq._id);
        if (isSelected) {
            onSelect(selectedMcqs.filter(m => m._id !== mcq._id));
        } else {
            onSelect([...selectedMcqs, mcq]);
        }
    };

    const handleSelectAll = () => {
        onSelect([...filteredMcqs]);
    };

    const handleDeselectAll = () => {
        onSelect([]);
    };

    const getCorrectAnswer = (mcq) => {
        return mcq.options[mcq.correctOption];
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Select MCQs</Typography>
                    <Box>
                        <Chip 
                            label={`${selectedMcqs.length} selected`} 
                            color="primary" 
                            size="small" 
                        />
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
                {/* Filters */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="Search MCQs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                        <MenuItem key={subject} value={subject.toLowerCase()}>
                                            {subject.charAt(0).toUpperCase() + subject.slice(1)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Chapter</InputLabel>
                            <Select
                                value={filters.chapter}
                                onChange={(e) => handleFilterChange('chapter', e.target.value)}
                            >
                                <MenuItem value="">All Chapters</MenuItem>
                                {filters.subject && chapterNames[filters.subject.toLowerCase()]?.map((chapter) => (
                                    <MenuItem key={chapter} value={chapter}>
                                        {chapter}
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
                        <TextField
                            fullWidth
                            label="Topic"
                            value={filters.topic}
                            onChange={(e) => handleFilterChange('topic', e.target.value)}
                        />
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={handleSelectAll}
                    >
                        Select All
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={handleDeselectAll}
                    >
                        Deselect All
                    </Button>
                    <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={fetchMcqs}
                        disabled={loading}
                    >
                        Refresh MCQs
                    </Button>
                </Box>

                {/* MCQ List */}
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="textSecondary">
                                Total MCQs: {mcqs.length} | Filtered: {filteredMcqs.length}
                            </Typography>
                        </Box>
                    )}
                    {filteredMcqs.length > 0 ? (
                        <List>
                            {filteredMcqs.map((mcq, index) => (
                                <React.Fragment key={mcq._id}>
                                    <ListItem>
                                        <Checkbox
                                            checked={selectedMcqs.find(m => m._id === mcq._id) !== undefined}
                                            onChange={() => handleMcqToggle(mcq)}
                                        />
                                        <ListItemText
                                            primary={
                                                <Box>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        <strong>Q{index + 1}:</strong> {mcq.question}
                                                    </Typography>
                                                    <Box sx={{ ml: 2 }}>
                                                        {mcq.options.map((option, optIndex) => (
                                                            <Typography 
                                                                key={optIndex} 
                                                                variant="caption" 
                                                                color={optIndex === mcq.correctOption ? 'success.main' : 'text.secondary'}
                                                                sx={{ 
                                                                    display: 'block',
                                                                    fontWeight: optIndex === mcq.correctOption ? 'bold' : 'normal'
                                                                }}
                                                            >
                                                                {String.fromCharCode(65 + optIndex)}. {option}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 1 }}>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip 
                                                            label={mcq.subject} 
                                                            size="small" 
                                                            variant="outlined"
                                                        />
                                                        <Chip 
                                                            label={mcq.chapter} 
                                                            size="small" 
                                                            variant="outlined"
                                                        />
                                                        <Chip 
                                                            label={mcq.difficulty} 
                                                            size="small" 
                                                            color={
                                                                mcq.difficulty === 'easy' ? 'success' : 
                                                                mcq.difficulty === 'medium' ? 'warning' : 'error'
                                                            }
                                                        />
                                                        {mcq.topic && (
                                                            <Chip 
                                                                label={mcq.topic} 
                                                                size="small" 
                                                                variant="outlined"
                                                            />
                                                        )}
                                                    </Box>
                                                    {mcq.explain && mcq.explain !== "Explanation Not provided" && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                            <strong>Explanation:</strong> {mcq.explain}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < filteredMcqs.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="info">
                            No MCQs found with the selected filters.
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={onClose}
                    variant="contained"
                    sx={{ bgcolor: '#4e73df' }}
                >
                    Done ({selectedMcqs.length} selected)
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default McqSelector;
