import { Backdrop, Box, Button, CircularProgress, IconButton, InputAdornment, MenuItem, Modal, Snackbar, Stack, TextField, Typography } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react";
import { EmissionContext } from "../context/EmissionContext";
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const EmissionForm = (props) => {
    const { addEmission, updateEmission, fetchEmissions } = useContext(EmissionContext);
    const { openModal, handleModalChange, entryToEdit } = props;
    const [openSnackbar, setOpenSnackbar] = useState({ state: false, msg: '' });

    // states for managing backdrop loader
    const [loading, setLoading] = useState(false);
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    const [emissionData, setEmissionData] = useState({
        description: "",
        scope: 'Scope 1',
        emission: 0,
        date: ''
    });

    // Updates the emission data state dynamically
    const handleChange = (key, event) => {
        let value = event.target.value;
        setEmissionData((prevState) => ({
            ...prevState,
            [key]: key === 'emission' ? +value : value
        }))
    }

    // updating the emission data in case of edit
    useEffect(() => {
        if (entryToEdit != null) {
            setEmissionData({ ...entryToEdit?.emission })
        }
    }, [entryToEdit])

    // Handling addition a new emission entry
    const handleAddEmission = () => {
        startLoading();
        const tempEmissionData = { ...emissionData };
        addEmission(tempEmissionData);
        handleModalChange();

        setTimeout(() => {
            stopLoading();
            setEmissionData({
                description: "",
                scope: "Scope 1",
                emission: 0,
                date: "",
            }); // Reset form
            fetchEmissions();
            setOpenSnackbar({ state: true, msg: 'New emission entry added!' });
        }, 2000);
    };

    const handleEditEmission = (index) => {
        startLoading(); // Start loading
        const tempEmissionData = { ...emissionData };
        updateEmission(index, tempEmissionData);
        handleModalChange();

        setTimeout(() => {
            stopLoading();
            setEmissionData({
                description: "",
                scope: "Scope 1",
                emission: 0,
                date: "",
            }); // Reset form
            fetchEmissions();
            setOpenSnackbar({ state: true, msg: 'Emission entry updated!' });
        }, 2000);
    }

    return (
        <Fragment>
            <Modal
                open={openModal}
                onClose={handleModalChange}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" align='center' variant="h6" component="h2">
                        {entryToEdit == null ? "Add Emission Data" : 'Edit Emission Data'}
                    </Typography>

                    <Box component="form" mt={2}>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={emissionData.description}
                                onChange={(event) => {
                                    handleChange('description', event)
                                }}
                                required
                            />

                            <TextField
                                select
                                label="Scope"
                                value={emissionData.scope}
                                onChange={(e) => handleChange('scope', e)}
                            >
                                <MenuItem key="Scope 1" value="Scope 1">Scope 1</MenuItem>
                                <MenuItem key="Scope 2" value="Scope 2">Scope 2</MenuItem>
                                <MenuItem key="Scope 3" value="Scope 3">Scope 3</MenuItem>
                            </TextField>

                            <TextField
                                label="Emission (kg CO2-e)"
                                variant="outlined"
                                type="number"
                                value={emissionData.emission}
                                onChange={(e) => handleChange("emission", e)}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                                }}
                            />

                            <TextField
                                label="Date"
                                variant="outlined"
                                type="date"
                                value={emissionData.date}

                                onChange={(e) => handleChange("date", e)}
                                fullWidth
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => entryToEdit == null ? handleAddEmission() : handleEditEmission(entryToEdit?.index)}
                                fullWidth
                                disabled={emissionData.description == '' || emissionData.emission == '' || emissionData.date == ''}
                            >
                                {loading ? "Processing..." : entryToEdit == null ? "Add Emission" : 'Edit Emission'}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>

            {/* Back-drop Loader */}
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* Snackbar for notification */}
            <Snackbar
                open={openSnackbar.state}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar({ state: false, msg: '' })}
                message={openSnackbar.msg || "New emission entry added!"}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setOpenSnackbar({ state: false, msg: '' })}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </Fragment>
    )
}

export default EmissionForm;
