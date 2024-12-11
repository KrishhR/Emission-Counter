import './App.css'
import { Box, Button, CircularProgress, Container, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import EmissionForm from './components/emissionForm';
import EmissionTable from './components/EmissionTable';
import { useContext, useEffect, useState } from 'react';
import EmissionChart from './components/EmissionChart';
import ScopeDropdown from './components/ScopeDropdown';
import { EmissionContext } from './context/EmissionContext';

function App() {
	const { emissions } = useContext(EmissionContext);
	const [openModal, setOpenModal] = useState(false);
	const handleModalChange = () => setOpenModal(!openModal);
	const [filterScope, setFilterScope] = useState('All Scopes');
	const [loader, setLoader] = useState(true);
	const [view, setView] = useState('list');

	useEffect(() => {
		if (emissions.length !== 0) {
			setLoader(false);
		}
	}, [emissions])

	return (
		<Container>
			<Typography variant="h4" align='center' fontWeight={'bold'} gutterBottom >
				Emission Counter
			</Typography>
			{
				loader ?
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: "50vh" }}>
						<CircularProgress />
					</Box> :
					<Paper style={{ padding: '20px' }}>
						<Stack spacing={2}>
							<Stack direction='row' gap={2} flexWrap={'wrap'} justifyContent='space-between'>
								<Button size='small' variant='contained' onClick={() => handleModalChange()}>Add Emission</Button>

								<ToggleButtonGroup
									color="primary"
									value={view}
									exclusive
									onChange={(_, val) => setView(val)}
									aria-label="Platform"
								>
									<ToggleButton value="list">List View</ToggleButton>
									<ToggleButton value="chart">Chart View</ToggleButton>
								</ToggleButtonGroup>

								<ScopeDropdown setFilterScope={setFilterScope} filterScope={filterScope} />
							</Stack>
							<Stack spacing={3}>
								{view == 'list' ? <EmissionTable filterScope={filterScope} /> : <EmissionChart filterScope={filterScope} />}
							</Stack>
						</Stack>
					</Paper>
			}
			<EmissionForm openModal={openModal} handleModalChange={handleModalChange} setOpenModal={setOpenModal} entryToEdit={null} />
		</Container>
	)
}

export default App