import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router';

const LecturersTable = ({ lecturers }) => {
    const navigate = useNavigate();
    if (!lecturers) {
        return <div>No lecturers data available</div>;
    }
    const handleViewClick = (lecturer) => {
        const formattedLecturerName = lecturer.lecturerName
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .toLowerCase(); // Convert to lowercase
        navigate(`/lecturers/${formattedLecturerName}/groups`, {
            state: { lecturer },
        });
    };

    const columns = [
        { id: 'serial-number', label: 'S/N', minWidth: 50 },
        { id: 'lecturer-name', label: 'Lecturer Name', minWidth: 250 },
        { id: 'groups-joined', label: 'No of Groups joined', minWidth: 100 },
        { id: "option", label: "Option", minWidth: 150 }
    ];

    const rows = lecturers.map((lecturer, index) => {

        return {
            'serial-number': index + 1,
            'lecturer-name': lecturer.lecturerName,
            'groups-joined': lecturer.groupsJoined,
            'option': (
                <button
                    onClick={() => { handleViewClick(lecturer) }}
                    className='bg-[#1835B3] cursor-pointer w-[120px] h-11 gap-2 text-white flex items-center justify-center font-inter font-semibold text-base rounded-md px-4 hover:ring-2'
                >
                    View
                </button>
            )
        };
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <div className='w-full'>
                <Paper sx={{ width: '100%', overflow: 'hidden', fontFamily: 'Inter' }}>
                    <TableContainer >
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, color: "#C2C2C2" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row['serial-number']}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>

        </>
    )
}

export default LecturersTable