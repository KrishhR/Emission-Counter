const generateMockData = () => {
    const scopes = ['Scope 1', 'Scope 2', 'Scope 3'];
    const descriptions = ['Manufacturing', 'Transport', 'Energy Consumption', 'Waste Management', 'Business Operation'];
    const data = [];

    for (let i = 0; i < 10000; i++) {
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      const randomScope = scopes[Math.floor(Math.random() * scopes.length)];
      const randomEmission = Math.floor(Math.random() * 1000);
      const randomDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 30)).toISOString().split('T')[0];
      data.push({ description: randomDescription, scope: randomScope, emission: randomEmission, date: randomDate });
    }

    return data;
  };

const mockEmissions = generateMockData();
// const mockEmissions = [
//   { description: "Business Operation 1", scope: "Scope 1", emission: 120, date: "2024-01-15" },
//   { description: "Business Operation 2", scope: "Scope 2", emission: 250, date: "2024-02-20" },
//   { description: "Business Operation 3", scope: "Scope 3", emission: 90, date: "2024-03-10" },
//   { description: "Business Operation 4", scope: "Scope 1", emission: 100, date: "2024-01-16" },
//   // Add more mock entries here
// ];

export default mockEmissions;
