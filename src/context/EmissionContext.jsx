import React, { createContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import mockEmissions from '../data/MockData';

export const EmissionContext = createContext();

export const EmissionProvider = ({ children }) => {
    const [emissions, setEmissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initializeData();
    }, []);

    // initializing state to the initial fetched data
    const initializeData = async () => {
        const existingData = JSON.parse(localStorage.getItem('emissionData'));
        if (!existingData || existingData.length === 0) {
            localStorage.setItem('emissionData', JSON.stringify(mockEmissions));
        }
        fetchEmissions();
    };

    const fetchEmissions = async () => {
        setLoading(true);
        const data = await api.get();
        setEmissions(data);
        setLoading(false);
    };

    // handle add emission entry
    const addEmission = async (newEntry) => {
        setLoading(true);
        const entry = await api.post(newEntry);
        setEmissions((prev) => [entry, ...prev]);
        setLoading(false);
    };

    // handle update emission entry
    const updateEmission = async (id, updatedEntry) => {
        setLoading(true);
        const entry = await api.put(id, updatedEntry);
        setEmissions((prev) => prev.map((item, i) => (i === id ? entry : item)));
        setLoading(false);
    };

    // handle delete emission entry
    const deleteEmission = async (id) => {
        setLoading(true);
        await api.delete(id);
        setEmissions((prev) => prev.filter((_, i) => i !== id));
        setLoading(false);
    };

    return (
        <EmissionContext.Provider
            value={{
                emissions,
                loading,
                fetchEmissions,
                addEmission,
                updateEmission,
                deleteEmission,
            }}
        >
            {children}
        </EmissionContext.Provider>
    );
};
