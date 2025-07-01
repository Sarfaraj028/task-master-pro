import React from "react";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
          >
            Yes, Delete
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
