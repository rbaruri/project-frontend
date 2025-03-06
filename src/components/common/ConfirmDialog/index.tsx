import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}) => {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const getButtonColors = () => {
    switch (type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700',
          cancel: 'bg-gray-300 hover:bg-gray-400'
        };
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700',
          cancel: 'bg-gray-300 hover:bg-gray-400'
        };
      default:
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700',
          cancel: 'bg-gray-300 hover:bg-gray-400'
        };
    }
  };

  const buttonColors = getButtonColors();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className={`px-4 py-2 text-white rounded-md ${buttonColors.cancel}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md ${buttonColors.confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 