import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../../../../baseUrl';
import { QuestionAnswer, SelectAll, Warning } from '@mui/icons-material';
import { Spinner } from 'react-bootstrap';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(150);
  const [mcqs, setMcqs] = useState([]);
  const [reload, setReload] = useState(false);
  const [filteredIds, setFilteredIds] = useState([]);

  const [fetchPage, setFetchpage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/mcq/pages?page=${fetchPage}`);
        setMcqs(response.data.mcqs);
        setTotalPages(response.data.totalPages);
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchData();
  }, [reload, setReload, setMcqs, fetchPage]);

  const HandleSearch = async (e) => {
    e.preventDefault();
    const searchQuestion=e.target.form[0].value;  
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/mcq/search?question=${searchQuestion}`);
      setMcqs(response?.data?.mcqs);
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = mcqs.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: mcqs,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  useEffect(() => {
    const ids = dataFiltered.map(item => item._id);
    setFilteredIds(ids);
  }, [applyFilter]);

  const notFound = !dataFiltered.length && !!filterName;



  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" className='fw-bold text-primary'>MCQ'S <QuestionAnswer fontSize='44' /></Typography>
      </Stack>
      <p>1: You can Select Option and Delete Single or Multiple Options</p>
      <p>2: Deletion Paramently <Warning color='error' /></p>
      <p>2: In every Page 500 McQ Fetch For next 500 Select Next Page in drop down<SelectAll color='success' /></p>
      <p>3: You can Search McQ's By Question from Database</p>

      <form>
      <hr />
        <input type="text" className='form-control' placeholder="Search By Question from Database"/>
        <button onClick={HandleSearch} type='submit' className='btn btn-info mt-2 ms-auto'>Search</button>
      </form>
      <br />


      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selectedId={selected}
          handleReload={() => setReload(!reload)}
          totalPages={totalPages}
          fetchPage={fetchPage}
          setFetchpage={setFetchpage}
        />

        <TableContainer sx={{ overflowX: 'scroll' }}>
          <Table sx={{ minWidth: 800 }}  >
            <UserTableHead

              order={order}
              orderBy={orderBy}
              rowCount={mcqs.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'question', label: 'Question' },
                { id: 'option 1', label: 'op 1' },
                { id: 'option 2', label: 'op 2' },
                { id: 'option 3', label: 'op 3' },
                { id: 'option 4', label: 'op 4' },
                { id: 'correct', label: 'Correct' },
                { id: 'course', label: 'Course' },
                { id: 'subject', label: 'Subject' },
                { id: 'chapter', label: 'Chapter' },
                { id: 'topic', label: 'Topic' },
                { id: 'mcqInfo', label: 'mcqInfo' },
                { id: 'isImage', label: 'Image' },
                { id: '' },
              ]}
            />
            {
              loading ? <div className="container py-5 text-center"><Spinner variant='primary' /></div> :
                <TableBody  >
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <UserTableRow
                        key={row._id}
                        question={row.question}
                        option1={row.options[0]}
                        option2={row.options[1]}
                        option3={row.options[2]}
                        option4={row.options[3]}
                        correct={row.correctOption}
                        course={row.course}
                        subject={row.subject}
                        chapter={row.chapter}
                        chapTopic={row.topic}
                        isImage={row.imageUrl}
                        mcqInfo={row.info}
                        mcqExplain={row.explain}
                        totalMcqs={dataFiltered}

                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                        index={index}
                        userId={row._id}
                        handleReload={() => setReload(!reload)}

                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, mcqs.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
            }
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={mcqs.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[50, 150, 350, 500]}
          onRowsPerPageChange={handleChangeRowsPerPage}

        />
      </Card>
    </Container>
  );
}
