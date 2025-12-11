
let requests = [{
    id:1,
    name: "Ram Joshi",
    deviceName: "Laptop",
    requestFrom: "Call Center",
    description: "Screen flickering issue"
},
{
    id:2,
    name: "Sita Shrestha",
    deviceName: "Monitor",
    requestFrom: "HR",
    description: "Screen Cracked"
}
];

const loadFromStorage = () => {
    const saved = localStorage.getItem("requestData");
    if (saved) {
        requests = JSON.parse(saved);
    }
};
loadFromStorage();

const saveToStorage = () => {
    localStorage.setItem("requestData", JSON.stringify(requests));
};

export const getRequests = () => [...requests];

export const addRequest = (newRequest) => {
    const request = {
        id: Date.now(),
        ...newRequest
    };
    requests.push(request);
    saveToStorage();
    return request;
};

export default requests;