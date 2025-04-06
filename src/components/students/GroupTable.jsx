import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from '@mui/material';

const GroupTable = () => {
    // Hardcoded array of student exams
    const studentExams = [
        // {
        //     id: 1,
        //     exam_name: "Mathematics",
        //     course: "MATH101",
        //     date: "2025-03-29T13:40:00Z",
        //     duration: "30 mins"
        // },
        // {
        //     id: 2,
        //     exam_name: "Physics",
        //     course: "PHY101",
        //     date: "2025-03-29T15:00:00Z",
        //     duration: "60 mins"
        // },
        // {
        //     id: 3,
        //     exam_name: "Chemistry",
        //     course: "CHEM101",
        //     date: "2025-03-30T12:00:00Z",
        //     duration: "20 mins"
        // },
        // {
        //     id: 4,
        //     exam_name: "Biology",
        //     course: "BIO101",
        //     date: "2025-03-30T13:00:00Z",
        //     duration: "1 hour"
        // },
    ];

    // Define the columns
    const columns = [
        { id: 'serial-number', label: 'S/N', minWidth: 50 },
        { id: 'exam-name', label: 'Examination Name', minWidth: 220 },
        { id: 'course', label: 'Course', minWidth: 100 },
        { id: 'date', label: 'Scheduled Date & Time', minWidth: 180 },
        { id: 'allocated-time', label: 'Allocated Time', minWidth: 120 },
        { id: "option", label: "Option", minWidth: 100 }
    ];

    // Build the rows from studentExams
    const rows = studentExams.map((exam, index) => {
        const examDateTime = new Date(exam.date);
        const now = new Date();

        // EXACT match check (same timestamp, to the millisecond).
        // In real scenarios, you might allow a small "grace" threshold.
        const isExactNow = examDateTime.getTime() === now.getTime();

        // Is the exam scheduled for the same calendar day as now?
        const isToday = examDateTime.toDateString() === now.toDateString();

        // Is the exam date/time in the past or exactly now?
        const isNow = examDateTime <= now;

        // Check if the exam is tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = examDateTime.toDateString() === tomorrow.toDateString();

        // Generate a display string for the date/time
        let timeString;
        if (isExactNow) {
            timeString = "Now";
        } else if (isNow) {
            // If it's in the past (but not EXACT), you might show "Started" or "In progress"
            // but we'll keep it the same for demonstration.
            timeString = "Now";
        } else if (isToday) {
            timeString = `Today ${examDateTime.toLocaleTimeString()}`;
        } else if (isTomorrow) {
            timeString = `Tomorrow ${examDateTime.toLocaleTimeString()}`;
        } else {
            timeString = examDateTime.toLocaleString();
        }

        // Color the text for the scheduled date/time
        const textColor = isExactNow || isNow || isToday ? 'green' : isTomorrow ? 'blue' : 'inherit';

        // Determine button style
        // If it's EXACT now, we want a special style: full opacity, enabled, background = 'blue'
        // Otherwise, keep the existing logic for isNow / isToday, etc.
        const isButtonEnabled = isExactNow || isNow; // If exactly now or in the past, you allow it
        const buttonStyle = {
            // If it's EXACT now, full opacity and special color
            backgroundColor: isExactNow ? 'blue' : '#1835B3',
            opacity: isExactNow ? 1 : isToday ? (isNow ? 1 : 0.4) : 0.4,
            cursor: isButtonEnabled ? 'pointer' : 'not-allowed'
        };

        return {
            'serial-number': index + 1,
            'exam-name': exam.exam_name,
            'course': exam.course,
            'date': (
                <span style={{ color: textColor }}>
                    {timeString}
                </span>
            ),
            'allocated-time': exam.duration,
            'option': (
                <button
                    style={buttonStyle}
                    className='w-[120px] h-11 gap-2 text-white flex items-center justify-center font-inter font-semibold text-base rounded-md px-4 hover:ring-2'
                    disabled={!isButtonEnabled}
                >
                    Take Exam
                </button>
            )
        };
    });

    // Pagination state
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
        <div className="p-6">
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
        </div>
    );
};

export default GroupTable;
