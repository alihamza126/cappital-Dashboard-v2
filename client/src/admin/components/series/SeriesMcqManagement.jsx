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
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"
import { useSnackbar } from "notistack"
import axiosInstance from "../../../baseUrl"

const SeriesMcqManagement = () => {
  const [mcqs, setMcqs] = useState([])
  const [allMcqs, setAllMcqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMcq, setEditingMcq] = useState(null)
  const [series, setSeries] = useState([])
  const [tests, setTests] = useState([])
  const [selectedSeries, setSelectedSeries] = useState("")
  const [selectedTest, setSelectedTest] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    subject: "",
    chapter: "",
    topic: "",
    difficulty: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const { enqueueSnackbar } = useSnackbar()

  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    subject: "",
    chapter: "",
    topic: "",
    difficulty: "easy",
    category: "normal",
    course: "mdcat",
    info: "",
    explain: "",
    imageUrl: "",
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
  }, [selectedSeries, page, rowsPerPage])

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

      const response = await axiosInstance.get(`/series-mcqs/series/${selectedSeries}?${params}`)
      setMcqs(response.data.mcqs || [])
      setAllMcqs(response.data.mcqs || [])
      setTotal(response.data.total || 0)
    } catch (error) {
      console.error("Error fetching MCQs:", error)
      enqueueSnackbar("Failed to save MCQ", { variant: "error" })
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

    if (filters.subject) {
      filtered = filtered.filter((mcq) => mcq.subject === filters.subject)
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
  }

  const handleOpenDialog = (mcq = null) => {
    if (mcq) {
      setEditingMcq(mcq)
      setFormData({
        question: mcq.question,
        options: mcq.options,
        correctOption: mcq.correctOption,
        subject: mcq.subject,
        chapter: mcq.chapter,
        topic: mcq.topic,
        difficulty: mcq.difficulty,
        category: mcq.category,
        course: mcq.course,
        info: mcq.info || "",
        explain: mcq.explain || "",
        imageUrl: mcq.imageUrl || "",
        seriesId: mcq.seriesId,
        testId: mcq.testId || "",
      })
    } else {
      setEditingMcq(null)
      setFormData({
        question: "",
        options: ["", "", "", ""],
        correctOption: 0,
        subject: "",
        chapter: "",
        topic: "",
        difficulty: "easy",
        category: "normal",
        course: "mdcat",
        info: "",
        explain: "",
        imageUrl: "",
        seriesId: selectedSeries,
        testId: selectedTest,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingMcq(null)
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
      subject: "",
      chapter: "",
      topic: "",
      difficulty: "easy",
      category: "normal",
      course: "mdcat",
      info: "",
      explain: "",
      imageUrl: "",
      seriesId: "",
      testId: "",
    })
  }

  const handleSubmit = async () => {
    try {
      if (editingMcq) {
        await axiosInstance.put(`/series-mcqs/${editingMcq._id}`, formData)
        enqueueSnackbar("MCQ updated successfully", { variant: "success" })
      } else {
        await axiosInstance.post("/series-mcqs", formData)
        enqueueSnackbar("MCQ created successfully", { variant: "success" })
      }
      handleCloseDialog()
      fetchMcqs()
    } catch (error) {
      console.error("Error saving MCQ:", error)
      enqueueSnackbar("Failed to save MCQ", { variant: "error" })
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
      subject: "",
      chapter: "",
      topic: "",
      difficulty: "",
    })
    setSearchTerm("")
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
                <InputLabel>Select Test (Optional)</InputLabel>
                <Select
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  label="Select Test (Optional)"
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
                  value={filters.subject}
                  onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                  label="Subject"
                >
                  <MenuItem value="">All</MenuItem>
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
        <Typography variant="h6">
          MCQs: {mcqs.length}{" "}
          {selectedSeries &&
            series.find((s) => s._id === selectedSeries) &&
            `(${series.find((s) => s._id === selectedSeries).title})`}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!selectedSeries}
        >
          Add MCQ
        </Button>
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
                <TableCell>Question</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Chapter</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography>Loading MCQs...</Typography>
                  </TableCell>
                </TableRow>
              ) : mcqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">No MCQs found for this series</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                mcqs?.map((mcq) => (
                  <TableRow key={mcq._id}>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {mcq.question}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={mcq.subject.charAt(0).toUpperCase() + mcq.subject.slice(1)} size="small" />
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
            rowsPerPageOptions={[5, 10, 25]}
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
                        label={formData.correctOption === index ? "Correct" : ""}
                        color={formData.correctOption === index ? "success" : "default"}
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
                    <MenuItem key={index} value={index}>
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
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  label="Subject"
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
                <InputLabel>Course</InputLabel>
                <Select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  label="Course"
                >
                  <MenuItem value="mdcat">MDCAT</MenuItem>
                  <MenuItem value="ecat">ECAT</MenuItem>
                  <MenuItem value="nts">NTS</MenuItem>
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
                label="Image URL (Optional)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingMcq ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SeriesMcqManagement
