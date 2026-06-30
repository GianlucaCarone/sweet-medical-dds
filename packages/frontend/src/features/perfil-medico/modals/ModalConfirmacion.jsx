import React from 'react';
import Modal from './Modal';

export default function ModalConfirmacion({ isOpen, onClose, title, message, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="p-3">
        <p className="mb-4 text-muted">{message}</p>
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-light btn-sm font-weight-bold text-muted"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="btn btn-danger btn-sm font-weight-bold"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}
