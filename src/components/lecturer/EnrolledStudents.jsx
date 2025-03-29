import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiUpload } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TiDeleteOutline } from "react-icons/ti";

const EnrolledStudents = () => {
    const location = useLocation();
    const group = location.state?.group;

    if (!group) {
        return <div>No group data available</div>;
    }

    const columns = [
        { id: 'serial-number', label: 'S/N', minWidth: 50 },
        { id: 'name', label: 'Name', minWidth: 200 },
        { id: 'matric-number', label: 'Matric Number', minWidth: 200 },
        { id: "options", label: "Options", minWidth: 200 }
    ];

    const rows = group.students.map((student, index) => {
        return {
            'serial-number': index + 1,
            'name': student.name,
            'matric-number': student.matricNumber ? student.matricNumber : "N/A",
            'options': <span className='text-[#EA4335] flex flex-row gap-2 cursor-pointer'>Remove
                <TiDeleteOutline className='text-[#EA4335] text-2xl' />
            </span>
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
        <div className='p-4 bg-[#F9F9F9] min-h-screen'>
            <div className='flex flex-row max-md:flex-col justify-between items-end'>
                <div className='p-4 flex flex-col gap-4'>
                    <h1 className='text-[32px] font-inter font-medium leading-8'>Student Groups</h1>
                    <p className='text-[#667085] font-inter text-sm'>
                        An examination room helps you organize different groups of students taking the subject(s) you teach
                    </p>
                </div>
                <div className='flex flex-row gap-4 p-4 mr-8 max-md:mr-2'>
                    <button className='bg-[#FFFFFF] gap-2 border shadow-[0_1px_2px_rgba(16,24,40,0.05)] text-[black] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4'>
                        Share
                        <FiUpload />
                    </button>
                    <button className='bg-[#1835B3] gap-2 text-[white] h-[44px] flex items-center justify-center font-inter font-medium text-sm rounded-lg px-4'>
                        Add New Student
                        <FaPlus />
                    </button>
                </div>
            </div>
            <hr className='text-[#98A2B3] border-1' />
            <div className='flex flex-row justify-between items-center my-4'>
                <h1 className='text-[32px] font-inter font-normal leading-8 p-4'>{group.name}</h1>
                <div className='flex items-end justify-end gap-4 mr-8 max-md:mr-2 p-4'>
                    <button className='bg-[#EAECF0] text-[black] h-[44px] font-inter text-base rounded-lg w-[133px]'>
                        View Results
                    </button>
                    <button className='rounded-lg bg-[#EAECF0] flex items-center justify-center h-[44px] w-[43px]'>
                        <MoreHorizIcon className='text-[#667085]' />
                    </button>
                </div>
            </div>
            {/*Enrolled Students */}
            <Paper sx={{ width: '100%', overflow: 'hidden', fontFamily: 'Inter' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table aria-label="table">
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
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
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
                                    );
                                })}
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
    );
};

export default EnrolledStudents;
