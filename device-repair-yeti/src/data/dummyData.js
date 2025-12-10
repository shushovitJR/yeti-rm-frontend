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

const loadFromStorage = () => {
  const saved = localStorage.getItem("repairData");
  if (saved) {
    repairs = JSON.parse(saved);
  }
};
loadFromStorage();

const saveToStorage = () => {
  localStorage.setItem("repairData", JSON.stringify(repairs));
};


export const getRepairs = () => [...repairs];

export const addRepair = (newRepair) => {
  const repair = {
    id: Date.now(),
    ...newRepair,
    endDate: newRepair.endDate || "",
    remarks: newRepair.remarks || ""
  };
  repairs.push(repair);
  saveToStorage();
  return repair;
};