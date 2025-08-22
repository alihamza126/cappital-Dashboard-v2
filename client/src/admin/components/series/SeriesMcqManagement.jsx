"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  Tabs,
  Tab,
  Checkbox,
  Alert,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CloudUpload,
  Image,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import { useSnackbar } from "notistack"
import axiosInstance from "../../../baseUrl"
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const SeriesMcqManagement = () => {
  const [mcqs, setMcqs] = useState([])
  const [allMcqs, setAllMcqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [editingMcq, setEditingMcq] = useState(null)
  const [series, setSeries] = useState([])
  const [tests, setTests] = useState([])
  const [selectedSeries, setSelectedSeries] = useState("")
  const [selectedTest, setSelectedTest] = useState("")
  const [selectedMcqs, setSelectedMcqs] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(200)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    subject: [],
    chapter: "",
    topic: "",
    difficulty: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [questionImage, setQuestionImage] = useState(null)
  const [questionImageUrl, setQuestionImageUrl] = useState("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImages, setLightboxImages] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: 1,
    subject: [],
    chapter: "",
    topic: "",
    difficulty: "easy",
    category: "normal",
    course: "mdcat",
    info: "",
    explain: "",
    imageUrl: "",
    questionImg: "",
    seriesId: "",
    testId: "",
  })

  useEffect(() => {
    fetchSeries()
  }, [])

  useEffect(() => {
    if (selectedSeries) {
      fetchMcqs()
    } else {
      setMcqs([])
      setAllMcqs([])
      setTotal(0)
    }
  }, [selectedSeries, selectedTest, page, rowsPerPage])

  useEffect(() => {
    if (selectedSeries) {
      fetchTests(selectedSeries)
    } else {
      setTests([])
      setSelectedTest("")
    }
  }, [selectedSeries])

  useEffect(() => {
    applyFilters()
  }, [filters, searchTerm, allMcqs])

  const fetchSeries = async () => {
    try {
      const response = await axiosInstance.get("/series/all")
      console.log(response.data)
      setSeries(response.data || [])
    } catch (error) {
      console.error("Error fetching series:", error)
      enqueueSnackbar("Failed to fetch series", { variant: "error" })
    }
  }

  const fetchTests = async (seriesId) => {
    try {
      const response = await axiosInstance.get(`/tests/series/${seriesId}`)
      setTests(response.data || [])
    } catch (error) {
      console.error("Error fetching tests:", error)
      enqueueSnackbar("Failed to fetch tests", { variant: "error" })
    }
  }

  const fetchMcqs = async () => {
    if (!selectedSeries) {
      setMcqs([])
      setAllMcqs([])
      setTotal(0)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
      })

      // Add testId to params if a test is selected
      if (selectedTest) {
        params.append('testId', selectedTest)
      }

      const response = await axiosInstance.get(`/series-mcqs/series/${selectedSeries}?${params}`)
      setMcqs(response.data.mcqs || [])
      setAllMcqs(response.data.mcqs || [])
      setTotal(response.data.total || 0)
    } catch (error) {
      console.error("Error fetching MCQs:", error)
      enqueueSnackbar("Failed to fetch MCQs", { variant: "error" })
      setMcqs([])
      setAllMcqs([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allMcqs]

    if (searchTerm) {
      filtered = filtered.filter(
        (mcq) =>
          mcq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mcq.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mcq.topic.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filters.subject && filters.subject.length > 0) {
      filtered = filtered.filter((mcq) => {
        const mcqSubjects = Array.isArray(mcq.subject) ? mcq.subject : [mcq.subject];
        return filters.subject.some(filterSubject => mcqSubjects.includes(filterSubject));
      });
    }
    if (filters.chapter) {
      filtered = filtered.filter((mcq) => mcq.chapter.toLowerCase().includes(filters.chapter.toLowerCase()))
    }
    if (filters.topic) {
      filtered = filtered.filter((mcq) => mcq.topic.toLowerCase().includes(filters.topic.toLowerCase()))
    }
    if (filters.difficulty) {
      filtered = filtered.filter((mcq) => mcq.difficulty === filters.difficulty)
    }

    setMcqs(filtered)
    setTotal(filtered.length)
  }

  const handleSelectAllMcqs = (event) => {
    if (event.target.checked) {
      setSelectedMcqs(mcqs.map(mcq => mcq._id))
    } else {
      setSelectedMcqs([])
    }
  }

  const handleSelectMcq = (mcqId) => {
    setSelectedMcqs(prev => {
      if (prev.includes(mcqId)) {
        return prev.filter(id => id !== mcqId)
      } else {
        return [...prev, mcqId]
      }
    })
  }

  const handleOpenAssignDialog = () => {
    if (selectedMcqs.length === 0) {
      enqueueSnackbar("Please select MCQs to assign", { variant: "warning" })
      return
    }
    setOpenAssignDialog(true)
  }

  const handleCloseAssignDialog = () => {
    setOpenAssignDialog(false)
  }

  const handleAssignToTest = async () => {
    if (!selectedTest) {
      enqueueSnackbar("Please select a test", { variant: "warning" })
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post(`/series-mcqs/assign`, {
        mcqIds: selectedMcqs,
        testId: selectedTest
      })
      
      const { message, addedCount, totalQuestions } = response.data
      enqueueSnackbar(message, { variant: "success" })
      
      if (addedCount < selectedMcqs.length) {
        enqueueSnackbar(`${selectedMcqs.length - addedCount} MCQs were already assigned to this test`, { variant: "info" })
      }
      
      setSelectedMcqs([])
      setOpenAssignDialog(false)
      fetchMcqs()
    } catch (error) {
      console.error("Error assigning MCQs:", error)
      const errorMessage = error.response?.data?.error || "Failed to assign MCQs"
      enqueueSnackbar(errorMessage, { variant: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromTest = async () => {
    if (!selectedTest) {
      enqueueSnackbar("Please select a test", { variant: "warning" })
      return
    }

    if (selectedMcqs.length === 0) {
      enqueueSnackbar("Please select MCQs to remove", { variant: "warning" })
      return
    }

    if (window.confirm(`Are you sure you want to remove ${selectedMcqs.length} MCQs from this test?`)) {
      setLoading(true)
      try {
        const response = await axiosInstance.delete(`/series-mcqs/test/${selectedTest}/mcqs`, {
          data: { mcqIds: selectedMcqs }
        })
        
        const { message, removedCount } = response.data
        enqueueSnackbar(message, { variant: "success" })
        
        setSelectedMcqs([])
        fetchMcqs()
      } catch (error) {
        console.error("Error removing MCQs from test:", error)
        const errorMessage = error.response?.data?.error || "Failed to remove MCQs from test"
        enqueueSnackbar(errorMessage, { variant: "error" })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleOpenDialog = (mcq = null) => {
    if (mcq) {
      setEditingMcq(mcq)
      setFormData({
        question: mcq.question,
        options: mcq.options,
        correctOption: mcq.correctOption,
        subject: Array.isArray(mcq.subject) ? mcq.subject : [mcq.subject],
        chapter: mcq.chapter,
        topic: mcq.topic,
        difficulty: mcq.difficulty,
        category: mcq.category,
        course: mcq.course,
        info: mcq.info || "",
        explain: mcq.explain || "",
        imageUrl: mcq.imageUrl || "",
        questionImg: mcq.questionImg || "",
        seriesId: mcq.seriesId,
        testId: mcq.testId || "",
      })
      setImageUrl(mcq.imageUrl || "")
      setQuestionImageUrl(mcq.questionImg || "")
    } else {
      setEditingMcq(null)
      setFormData({
        question: "",
        options: ["", "", "", ""],
        correctOption: 1,
        subject: [],
        chapter: "",
        topic: "",
        difficulty: "easy",
        category: "normal",
        course: "mdcat",
        info: "",
        explain: "",
        imageUrl: "",
        questionImg: "",
        seriesId: selectedSeries,
        testId: selectedTest,
      })
      setImageUrl("")
      setQuestionImageUrl("")
    }
    setTabValue(0)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMcq(null)
    setImage(null)
    setImageUrl("")
    setQuestionImage(null)
    setQuestionImageUrl("")
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctOption: 1,
      subject: [],
      chapter: "",
      topic: "",
      difficulty: "easy",
      category: "normal",
      course: "mdcat",
      info: "",
      explain: "",
      imageUrl: "",
      questionImg: "",
      seriesId: "",
      testId: "",
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setQuestionImage(file)
      setQuestionImageUrl(URL.createObjectURL(file))
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const openLightbox = (images, startIndex = 0) => {
    setLightboxImages(images)
    setLightboxOpen(true)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      let finalFormData = { ...formData }

      // Upload MCQ image if selected
      if (image) {
        const formImgData = new FormData()
        formImgData.append('image', image)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
        const imgResponse = await axiosInstance.post('/upload/img', formImgData, config)
        if (imgResponse.status === 200) {
          finalFormData.imageUrl = imgResponse.data.fileURL
        } else {
          enqueueSnackbar('Failed to upload MCQ image', { variant: 'error' })
          return
        }
      }

      // Upload question image if selected
      if (questionImage) {
        const formImgData = new FormData()
        formImgData.append('image', questionImage)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
        const imgResponse = await axiosInstance.post('/upload/img', formImgData, config)
        if (imgResponse.status === 200) {
          finalFormData.questionImg = imgResponse.data.fileURL
        } else {
          enqueueSnackbar('Failed to upload question image', { variant: 'error' })
          return
        }
      }

      if (editingMcq) {
        await axiosInstance.put(`/series-mcqs/${editingMcq._id}`, finalFormData)
        enqueueSnackbar("MCQ updated successfully", { variant: "success" })
      } else {
        await axiosInstance.post("/series-mcqs", finalFormData)
        enqueueSnackbar("MCQ created successfully", { variant: "success" })
      }
      handleCloseDialog()
      fetchMcqs()
    } catch (error) {
      console.error("Error saving MCQ:", error)
      enqueueSnackbar("Failed to save MCQ", { variant: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (mcqId) => {
    if (window.confirm("Are you sure you want to delete this MCQ?")) {
      try {
        await axiosInstance.delete(`/series-mcqs/${mcqId}`)
        enqueueSnackbar("MCQ deleted successfully", { variant: "success" })
        fetchMcqs()
      } catch (error) {
        console.error("Error deleting MCQ:", error)
        enqueueSnackbar("Failed to delete MCQ", { variant: "error" })
      }
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const clearFilters = () => {
    setFilters({
      subject: [],
      chapter: "",
      topic: "",
      difficulty: "",
    })
    setSearchTerm("")
    setSelectedTest("")
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Series MCQ Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Series</InputLabel>
                <Select
                  value={selectedSeries}
                  onChange={(e) => setSelectedSeries(e.target.value)}
                  label="Select Series"
                >
                  {series &&
                    series?.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Test (Optional)</InputLabel>
                <Select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  label="Filter by Test (Optional)"
                >
                  <MenuItem value="">All Tests</MenuItem>
                  {tests?.map((t) => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Subject</InputLabel>
                <Select
                  multiple
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  label="Subject"
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="physics">Physics</MenuItem>
                  <MenuItem value="chemistry">Chemistry</MenuItem>
                  <MenuItem value="biology">Biology</MenuItem>
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="mathematics">Mathematics</MenuItem>
                  <MenuItem value="logic">Logic</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                placeholder="Chapter"
                value={filters.chapter}
                onChange={(e) => setFilters({ ...filters, chapter: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                placeholder="Topic"
                value={filters.topic}
                onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  label="Difficulty"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />}>
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6">
            MCQs: {mcqs.length}{" "}
            {selectedSeries &&
              series.find((s) => s._id === selectedSeries) &&
              `(${series.find((s) => s._id === selectedSeries).title})`}
            {selectedTest &&
              tests.find((t) => t._id === selectedTest) &&
              ` - Test: ${tests.find((t) => t._id === selectedTest).title}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedMcqs.length} MCQs selected
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={handleOpenAssignDialog}
            disabled={!selectedSeries || selectedMcqs.length === 0}
            sx={{ mr: 1 }}
          >
            Assign to Test
          </Button>
          {selectedTest && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveFromTest}
              disabled={!selectedSeries || selectedMcqs.length === 0}
              sx={{ mr: 1 }}
            >
              Remove from Test
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={!selectedSeries}
          >
            Add MCQ
          </Button>
        </Box>
      </Box>

      {!selectedSeries ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Please select a series to view MCQs
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedMcqs.length > 0 && selectedMcqs.length < mcqs.length}
                    checked={mcqs.length > 0 && selectedMcqs.length === mcqs.length}
                    onChange={handleSelectAllMcqs}
                  />
                </TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Chapter</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>Explanation Image</TableCell>
                <TableCell>Question Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>Loading MCQs...</Typography>
                  </TableCell>
                </TableRow>
              ) : mcqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">No MCQs found for this series</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                mcqs?.map((mcq) => (
                  <TableRow 
                    key={mcq._id}
                    selected={selectedMcqs.includes(mcq._id)}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedMcqs.includes(mcq._id)}
                        onChange={() => handleSelectMcq(mcq._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {mcq.question}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(mcq.subject) ? (
                        mcq.subject.map((subj, index) => (
                          <Chip
                            key={index}
                            label={subj.charAt(0).toUpperCase() + subj.slice(1)}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))
                      ) : (
                        <Chip
                          label={mcq.subject.charAt(0).toUpperCase() + mcq.subject.slice(1)}
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{mcq.chapter}</TableCell>
                    <TableCell>{mcq.topic}</TableCell>
                    <TableCell>
                      <Chip
                        label={mcq.difficulty}
                        size="small"
                        color={
                          mcq.difficulty === "easy" ? "success" : mcq.difficulty === "medium" ? "warning" : "error"
                        }
                      />
                    </TableCell>
                    <TableCell>{mcq.testId?.title || "Not assigned"}</TableCell>
                    <TableCell>
                      {mcq.imageUrl ? (
                        <img
                          src={mcq.imageUrl}
                          alt="MCQ"
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                          onClick={() => openLightbox([{ src: mcq.imageUrl }], 0)}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">No image</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {mcq.questionImg ? (
                        <img
                          src={mcq.questionImg}
                          alt="Question"
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                          onClick={() => openLightbox([{ src: mcq.questionImg }], 0)}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">No image</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(mcq)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(mcq._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[50, 100, 200]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingMcq ? "Edit MCQ" : "Add New MCQ"}</DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="MCQ Details" />
            <Tab label="Explanation Image" />
            <Tab label="Question Image" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Question"
                  multiline
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </Grid>

              {formData?.options?.map((option, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <TextField
                    fullWidth
                    label={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <Chip
                          label={formData.correctOption === (index + 1) ? "Correct" : ""}
                          color={formData.correctOption === (index + 1) ? "success" : "default"}
                          size="small"
                        />
                      ),
                    }}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Correct Option</InputLabel>
                  <Select
                    value={formData.correctOption}
                    onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                    label="Correct Option"
                  >
                    {formData?.options?.map((_, index) => (
                      <MenuItem key={index} value={index + 1}>
                        Option {index + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    multiple
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    label="Subject"
                    renderValue={(selected) => selected.join(', ')}
                  >
                    <MenuItem value="physics">Physics</MenuItem>
                    <MenuItem value="chemistry">Chemistry</MenuItem>
                    <MenuItem value="biology">Biology</MenuItem>
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="mathematics">Mathematics</MenuItem>
                    <MenuItem value="logic">Logic</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Chapter"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    label="Difficulty"
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Series</InputLabel>
                  <Select
                    value={formData.seriesId}
                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                    label="Series"
                    disabled={!!selectedSeries}
                  >
                    {series?.map((s) => (
                      <MenuItem key={s._id} value={s._id}>
                        {s.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Test (Optional)</InputLabel>
                  <Select
                    value={formData.testId}
                    onChange={(e) => setFormData({ ...formData, testId: e.target.value })}
                    label="Test (Optional)"
                    disabled={!selectedSeries}
                  >
                    <MenuItem value="">No Test</MenuItem>
                    {tests?.map((test) => (
                      <MenuItem key={test._id} value={test._id}>
                        {test.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Explanation Image URL (Optional)"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  disabled={!!image}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Question Image URL (Optional)"
                  value={formData.questionImg}
                  onChange={(e) => setFormData({ ...formData, questionImg: e.target.value })}
                  disabled={!!questionImage}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Info (Optional)"
                  multiline
                  rows={2}
                  value={formData.info}
                  onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Explanation (Optional)"
                  multiline
                  rows={3}
                  value={formData.explain}
                  onChange={(e) => setFormData({ ...formData, explain: e.target.value })}
                />
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Explanation Image
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="mcq-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="mcq-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload Explanation Image
                </Button>
              </label>
              {imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imageUrl}
                    alt="MCQ"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => openLightbox([{ src: imageUrl }], 0)}
                  />
                </Box>
              )}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Question Image
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="question-image-upload"
                type="file"
                onChange={handleQuestionImageChange}
              />
              <label htmlFor="question-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Upload Question Image
                </Button>
              </label>
              {questionImageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={questionImageUrl}
                    alt="Question"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, cursor: 'pointer' }}
                    onClick={() => openLightbox([{ src: questionImageUrl }], 0)}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {editingMcq ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign MCQs to Test</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>
              Selected MCQs: {selectedMcqs.length}
            </Typography>
            {selectedTest && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Target Test: {tests.find(t => t._id === selectedTest)?.title}
              </Typography>
            )}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Test</InputLabel>
              <Select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                label="Select Test"
              >
                {tests?.map((test) => (
                  <MenuItem key={test._id} value={test._id}>
                    {test.title} ({test.questions?.length || 0} questions)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button 
            onClick={handleAssignToTest} 
            variant="contained" 
            disabled={loading || !selectedTest}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lightbox for image viewing */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxImages}
      />
    </Box>
  )
}

export default SeriesMcqManagement
