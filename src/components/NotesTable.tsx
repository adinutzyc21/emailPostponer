import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { NotesType } from '../types';

export default function NotesTable({ notes }: { notes: NotesType[] }) {
    if(!notes || notes.length===0){
        return null;
    }
    return (
        <TableContainer component={Paper} sx={{ maxHeight: 230 }}>
            <Table stickyHeader aria-label="notes table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Notes List</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notes.map((note, idx) => (
                        <TableRow
                            key={idx}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <div dangerouslySetInnerHTML={{ __html: note.content }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}