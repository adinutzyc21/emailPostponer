import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { NotesType } from '../types';

export default function NotesTable({ rows }: { rows: NotesType[] }) {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: 220 }}>
            <Table aria-label="notes table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.content}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.content}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}