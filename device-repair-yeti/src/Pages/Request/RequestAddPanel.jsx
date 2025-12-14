import React from 'react';

const RequestAddPanel = ({ isOpen, onClose, onAdd }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRequest = {
      name: formData.get('name'),
      deviceName: formData.get('deviceName'),
      requestDate: formData.get('requestDate'),
      requestFrom: formData.get('requestFrom'),
      description: formData.get('description')
    };
    onAdd(newRequest);
    e.target.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
      />
      <div
        className="fixed right-0 top-0 w-96 bg-white shadow-2xl z-50 p-6 overflow-y-auto"
        style={{ position: 'fixed', right: 0, top: 0, height: '100%', zIndex: 1100 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Request</h2>
          <button
            onClick={onClose}
            className="text-3xl font-light hover:text-red-600"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your name"
            />
          </div>



          <div>
            <label className="block text-sm font-medium mb-1">Device Name</label>
            <select
              name="deviceName"
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Device</option>
              <option value="Laptop">Laptop</option>
              <option value="CPU">CPU</option>
              <option value="Printer">Printer</option>
              <option value="Monitor">Monitor</option>
              <option value="Keyboard">Keyboard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="requestDate"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Request From</label>
            <input
              type="text"
              name="requestFrom"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              required
              rows="3"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter reason for request"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RequestAddPanel;
