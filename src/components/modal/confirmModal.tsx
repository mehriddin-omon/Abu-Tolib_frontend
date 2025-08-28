import React from 'react';
import { Modal } from './modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ha",
  cancelText = "Bekor qilish",
  confirmButtonClass = "bg-blue-600 hover:bg-blue-700"
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">
        {message}
      </p>
      <div className="flex gap-3">
        <button 
          onClick={onConfirm}
          className={`flex-1 text-white py-2 rounded-lg transition-colors ${confirmButtonClass}`}
        >
          {confirmText}
        </button>
        <button 
          onClick={onClose}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};