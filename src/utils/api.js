const simulateNetworkDelay = (response, delay = 1000) =>
    new Promise((resolve) => setTimeout(() => resolve(response), delay));

const localStorageKey = 'emissionData';

export const api = {
    get: () => {
        const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        return simulateNetworkDelay(data);
    },

    post: (newEntry) => {
        const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const updatedData = [newEntry, ...data];
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        return simulateNetworkDelay(newEntry);
    },

    put: (id, updatedEntry) => {
        const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const updatedData = data.map((entry, i) => (i === id ? updatedEntry : entry));
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        return simulateNetworkDelay(updatedEntry);
    },

    delete: (id) => {
        const data = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const updatedData = data.filter((_, i) => i !== id);
        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        return simulateNetworkDelay({ success: true });
    },
};
