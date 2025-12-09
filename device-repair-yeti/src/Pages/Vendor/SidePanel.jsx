import { addRepair } from "../../data/vendorDummyData";

export const SidePanel = ({ isOpen, onClose, onSuccess, title = "Panel"}) => {

     const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newRepair = {
            deviceName: formData.get("deviceName"),
            inDate: formData.get("inDate"),
            problem: formData.get("problem"),
            endDate: formData.get("endDate"),
            remarks: formData.get("remarks"),
            vendorName: formData.get("vendorName")
        };

        addRepair(newRepair);

        onSuccess();
        onClose();
        e.target.reset();
    };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-3xl text-gray-500 hover:text-red-600 transition"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label className="block text-sm font-medium mb-1">Device Name</label>
            <select
              name="deviceName"
              required
              className="w-full border rounded px-3 py-2"
            >
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="CPU">CPU</option>
                <option value="Printer">Printer</option>
                <option value="Keyboard">Keyboard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">In Date</label>
            <input
              type="date"
              name="inDate"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Problem Description</label>
            <textarea
              name="problem"
              required
              rows="3"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Expected End Date (Optional)</label>
            <input
              type="date"
              name="endDate"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Remarks (Optional)</label>
            <textarea
              name="remarks"
              rows="3"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vendor Name </label>
            <input
            type="text"
              name="vendorName"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-3 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};


