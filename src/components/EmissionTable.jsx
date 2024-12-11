import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Box, Stack, Button, Tooltip, IconButton, Snackbar, Dialog, DialogTitle, DialogActions, Backdrop, CircularProgress } from '@mui/material';
import { Fragment, useContext, useEffect, useState } from 'react';
import { EmissionContext } from '../context/EmissionContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import EmissionForm from './emissionForm';

const EmissionTable = (props) => {
    const { filterScope } = props;
    const { emissions, deleteEmission } = useContext(EmissionContext);

    const rowsPerPage = 10; // setting rows per page to 10 by default

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [openSnackbar, setOpenSnackbar] = useState({ state: false, message: '' });
    const [entryToEdit, setEntryToEdit] = useState(null);

    // state for managing delete entry modal
    const [deleteModal, setDeleteModal] = useState({ state: false, index: null });

    // states for managing backdrop loader
    const [loading, setLoading] = useState(false);
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);


    // states for opening-closing Form modal
    const [openModal, setOpenModal] = useState(false);
    const handleModalChange = () => {
        setOpenModal(!openModal);
    }

    // Handle Page Change
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    // setting page to 0, when filter scope is applied
    useEffect(() => {
        setPage(0);
    }, [emissions, filterScope])

    // filtering data based on filterscope
    const emissionData = filterScope === 'All Scopes'
        ? emissions
        : emissions.filter((entry) => entry.scope === filterScope);

    // handling paginated data
    const paginatedData = emissionData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        setTotalPages(filterScope === 'All Scopes' ? Math.ceil(emissions.length) : Math.ceil(emissionData.length));
    }, [emissionData]);

    // handle delete emission entry
    const handleDeleteEmission = (index) => {
        startLoading();
        deleteEmission(index);
        setDeleteModal({ state: false, index: null })

        setTimeout(() => {
            stopLoading(); // Stop loading
            setOpenSnackbar({ state: true, message: "Item deleted successfully!" });
            fetchEmissions();
        }, 2000); // Delay of 3 seconds
    }
    
    // handle edit emission entry
    const handleEditEmission = (emission, index) => {
        let temp = { ...emission };
        setEntryToEdit({ emission: temp, index });
        handleModalChange()
    }

    return (
        <Fragment>
            <Paper sx={{ mt: 4 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell variant='head' align='center'>Description</TableCell>
                                <TableCell variant='head' align='center'>Scope</TableCell>
                                <TableCell variant='head' align='center'>Emission (kg CO2-e)</TableCell>
                                <TableCell variant='head' align='center'>Date</TableCell>
                                <TableCell variant='head' align='center'>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((emission, index) => (
                                <TableRow key={index}>
                                    <TableCell align='center'>{emission.description}</TableCell>
                                    <TableCell align='center'>{emission.scope}</TableCell>
                                    <TableCell align='center'>{emission.emission}</TableCell>
                                    <TableCell align='center'>{emission.date}</TableCell>
                                    <TableCell align='center'>
                                        <Stack direction="row" spacing={1} justifyContent='center'>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleEditEmission(emission, index)}>
                                                    <EditIcon fontSize='small' />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => setDeleteModal({ state: true, index: index })}>
                                                    <DeleteIcon fontSize='small' />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <TablePagination
                        component="div"
                        count={totalPages}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={10}
                        rowsPerPageOptions={[10]}
                    />
                </Box>
            </Paper>

            {/* Edit Emission Form */}
            <EmissionForm openModal={openModal} handleModalChange={handleModalChange} entryToEdit={entryToEdit} />

            {/* Snackbar for notification */}
            <Snackbar
                open={openSnackbar.state}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar({ state: false, message: '' })}
                message={openSnackbar.message || "New emission entry added!"}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setOpenSnackbar({ state: false, message: '' })}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />

            {/* Loader */}
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            <Dialog
                open={deleteModal.state}
                onClose={() => setDeleteModal({ state: false, index: null })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Do you want to delete this entry?
                </DialogTitle>
                <DialogActions>
                    <Button color='error' onClick={() => setDeleteModal({ state: false, index: null })}>Cancel</Button>
                    <Button onClick={() => handleDeleteEmission(deleteModal.index)} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default EmissionTable;
