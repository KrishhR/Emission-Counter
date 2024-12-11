import React, { useContext, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Container, FormControlLabel, Paper, Switch } from '@mui/material';
import { EmissionContext } from '../context/EmissionContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmissionChart = ({ filterScope }) => {
    const { emissions } = useContext(EmissionContext);
	const [stacked, setStacked] = useState(false);

    // Initialize an object to hold monthly aggregated data
    const monthlyData = {};

    // Filter emissions based on the selected scope
    const filteredEmissions = filterScope === 'All Scopes' 
        ? emissions 
        : emissions.filter((entry) => entry.scope === filterScope);

    // Populate monthly data
    filteredEmissions.forEach((entry) => {
        const month = new Date(entry.date).getMonth(); 
        if (!monthlyData[month]) {
            monthlyData[month] = { 'Scope 1': 0, 'Scope 2': 0, 'Scope 3': 0 };
        }
        monthlyData[month][entry.scope] += entry.emission;
    });

    // Generate chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = months;
    const data = {
        labels,
        datasets: [
            {
                label: 'Scope 1',
                data: Object.values(monthlyData).map((data) => data['Scope 1'] || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Scope 2',
                data: Object.values(monthlyData).map((data) => data['Scope 2'] || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
                label: 'Scope 3',
                data: Object.values(monthlyData).map((data) => data['Scope 3'] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return (
        <Paper style={{ padding: 20 }}>
             <Box display="flex" justifyContent="flex-end" alignItems="center">
                <FormControlLabel
                    control={
                        <Switch
                            checked={stacked}
                            onChange={(e) => setStacked(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Stacked View"
                />
            </Box>
            <Container>
            <Bar
                data={data}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: `Emissions Chart (${filterScope})`,
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                    // responsive: true,
                    // maintainAspectRatio: true,
                    aspectRatio: 2,
                    scales: {
                        x: {
                            stacked: stacked,
                            title: {
                                display: true,
                                text: 'Months',
                            },
                        },
                        y: {
                            stacked: stacked,
                            title: {
                                display: true,
                                text: 'Emissions (kg CO2-e)',
                            },
                        },
                    },
                }}
            />
            </Container>
        </Paper>
    );
};

export default EmissionChart;
