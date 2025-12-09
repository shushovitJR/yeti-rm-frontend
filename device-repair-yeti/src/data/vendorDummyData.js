let repairs = [
    {
        id: 1,
        deviceName: "Keyboard",
        inDate: "2025-12-01",
        problem: "Keys are not responding",
        endDate: "2025-12-06",
        remarks: "Cleaned and fixed key connections",
        vendorName: "TechFixer pvt ltd"
    },
    {
        id: 2,
        deviceName: "Laptop",
        inDate: "2025-12-03",
        problem: "Broken screen",
        endDate: "2025-12-15",
        remarks: "Under Diagnosis",
        vendorName: "Smart Repairs Inc"
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
}

export default repairs;
