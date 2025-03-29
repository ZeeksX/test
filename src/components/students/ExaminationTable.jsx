import React, { useState, useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';

const ExaminationTable = ({ examinations }) => {
    const [timeStatus, setTimeStatus] = useState({});

    useEffect(() => {
        const interval = setInterval(() => {
            const newStatus = {};
            examinations.forEach(exam => {
                const examDateTime = new Date(exam.date);
                const now = new Date();
                newStatus[exam.id] = {
                    isToday: examDateTime.toDateString() === now.toDateString(),
                    isNow: examDateTime <= now
                };
            });
            setTimeStatus(newStatus);
        }, 1000);

        return () => clearInterval(interval);
    }, [examinations]);

    if (!examinations) {
        return <div>No examinations data available</div>;
    }

    const columns = [
        { id: 'serial-number', label: 'S/N', minWidth: 50 },
        { id: 'exam-name', label: 'Examination Name', minWidth: 220 },
        { id: 'lecturer', label: 'Lecturer', minWidth: 200 },
        { id: 'course', label: 'Course', minWidth: 100 },
        { id: 'date', label: 'Scheduled Date & Time', minWidth: 180 },
        { id: "option", label: "Option", minWidth: 100 }
    ];

    const rows = examinations.map((exam, index) => {
        const examDateTime = new Date(exam.date);
        const now = new Date();
        const isToday = examDateTime.toDateString() === now.toDateString();
        const isNow = examDateTime <= now;

        // Compute if the exam is tomorrow.
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = examDateTime.toDateString() === tomorrow.toDateString();

        let timeString;
        if (isNow) {
            timeString = `Now`;
        } else if (isToday) {
            timeString = `Today ${examDateTime.toLocaleTimeString()}`;
        } else if (isTomorrow) {
            timeString = `Tomorrow ${examDateTime.toLocaleTimeString()}`;
        } else {
            timeString = examDateTime.toLocaleString();
        }

        // Set text color: green for now or today, blue for tomorrow, default otherwise.
        const textColor = (isNow || isToday) ? 'green' : isTomorrow ? 'blue' : 'inherit';

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
                        opacity: isToday ? (isNow ? 1 : 0.4) : 0.4,
                        cursor: isNow ? 'pointer' : 'not-allowed'
                    }}
                    className='bg-[#1835B3] w-[120px] h-11 gap-2 text-white flex items-center justify-center font-inter font-semibold text-base rounded-md px-4 hover:ring-2'
                    disabled={!isNow}
                >
                    Take Exam
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

export default ExaminationTable;
