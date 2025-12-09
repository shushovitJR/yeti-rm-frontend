let repairs = [
  {
    id: 1,
    deviceName: "Monitor",
    inDate: "2025-11-20",
    problem: "Screen flickering",
    endDate: "2025-11-25",
    remarks: "Replaced display assembly"
  },
  {
    id: 2,
    deviceName: "Laptop",
    inDate: "2025-12-01",
    problem: "Battery draining fast",
    endDate: "",
    remarks: "Under diagnosis"
  }
];

export const getRepairs = () => [...repairs]; // Return a copy!

export const addRepair = (newRepair) => {
  const repair = { id: Date.now(), ...newRepair };
  repairs.push(repair);
  return repair;
};