import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { Navigate, useNavigate } from 'react-router';

const CompletedExams = ({ examinations }) => {
    const [timeStatus, setTimeStatus] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            const newStatus = {};
            examinations.forEach(exam => {
                const examDateTime = new Date(exam.date);
                const now = new Date();
                newStatus[exam.id] = {
                    isToday: examDateTime.toDateString() === now.toDateString()
                };
            });
            setTimeStatus(newStatus);
        }, 1000);

        return () => clearInterval(interval);
    }, [examinations]);

    if (!examinations) {
        return <div>No examinations data available</div>;
    }

    // Filter to only include completed exams (i.e. scheduled date in the past)
    const completedExams = examinations.filter(exam => new Date(exam.date) <= new Date());

    const handleClick = (exam) => {
        const formattedCourseCode = exam.course
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .toLowerCase(); // Convert to lowercase
        navigate(`/examinations/${formattedCourseCode}/result`, {
            state: { exam },
        });
    }

    const columns = [
        { id: 'serial-number', label: 'S/N', minWidth: 50 },
        { id: 'exam-name', label: 'Examination Name', minWidth: 220 },
        { id: 'lecturer', label: 'Lecturer', minWidth: 200 },
        { id: 'course', label: 'Course', minWidth: 100 },
        { id: 'date', label: 'Scheduled Date & Time', minWidth: 180 },
        { id: "option", label: "Option", minWidth: 100 }
    ];

    const rows = completedExams.map((exam, index) => {
        const examDateTime = new Date(exam.date);
        const now = new Date();
        const isToday = examDateTime.toDateString() === now.toDateString();

        let timeString;
        if (isToday) {
            timeString = `Today ${examDateTime.toLocaleTimeString()}`;
        } else {
            timeString = examDateTime.toLocaleString();
        }

        // For completed exams, color green if completed today, default color otherwise.
        const textColor = isToday ? 'green' : 'inherit';

        return {
            'serial-number': index + 1,
            'exam-name': exam.exam_name,
            'lecturer': exam.lecturer,
            'course': exam.course,
            'date': (
                <span style={{ color: textColor }}>
                    {timeString}
                </span>
            ),
            'option': (
                <button
                    style={{
                        opacity: 1,
                        cursor: 'pointer'
                    }}
                    onClick={() => { handleClick(exam) }}
                    className='bg-[#1835B3] w-[150px] h-11 gap-2 text-white flex items-center justify-center font-inter font-semibold text-base rounded-md px-4 hover:ring-2'
                >
                    View Result
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
            <Paper sx={{ width: '100%', overflow: 'hidden', fontFamily: 'Inter' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
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
        </>
    );
};

export default CompletedExams;
