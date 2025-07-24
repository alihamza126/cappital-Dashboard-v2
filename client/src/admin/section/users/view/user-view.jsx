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
import axiosInstance from '../../../../baseUrl';
import { Group } from '@mui/icons-material';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('/user');
      setUsers(response.data)
      console.log(response)
    }
    fetchData();
  }, [reload, setReload, setUsers])

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      console.log(newSelecteds)
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
    console.log(newSelected)
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
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered?.length && !!filterName;



  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" className='text-primary fw-bold'>Manage Users <Group fontSize='44'/></Typography>
      </Stack>

      <Card className='rounded-3'>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          selectedId={selected}
          handleReload={() => setReload(!reload)}
        />

        <TableContainer sx={{ overflowX: 'scroll' }} >
          <Table sx={{ minWidth: 800 }}  >
            <UserTableHead

              order={order}
              orderBy={orderBy}
              rowCount={users.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'username', label: 'Username' },
                { id: 'fullName', label: 'Full Name' },
                { id: 'fatherName', label: 'Father Name' },
                { id: 'email', label: 'Email', align: 'center' },
                { id: 'contact', label: 'Contact', align: 'center' },
                { id: 'city', label: 'City', align: 'center' },
                { id: 'isMdcat', label: 'isMdcat' },
                { id: 'isNums', label: 'isNums' },
                { id: 'aggPercentage', label: 'Aggregate Percentage' },
                { id: 'domicalCity', label: 'Domical City' },
                { id: '' },


              ]}
            />
            <TableBody  >
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <UserTableRow
                    key={row._id}
                    avatarUrl={row.profileUrl}
                    userName={row.username}
                    fullName={row.fullname}
                    fatherName={row.fathername}
                    email={row.email}
                    contact={row.contact}
                    city={row.city}
                    isMdcat={row.isMdcat}
                    isNums={row.isNums}
                    aggPercentage={row.aggPercentage}
                    domicalCity={row.domicalCity}

                    // isVerified={row.isVerified}
                    selected={selected.indexOf(row._id) !== -1}
                    handleClick={(event) => handleClick(event, row._id)}
                    index={index}
                    userId={row._id}
                    handleReload={() => setReload(!reload)}

                  />
                ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, users.length)}
              />

              {notFound && <TableNoData query={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10,50,100,500]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
