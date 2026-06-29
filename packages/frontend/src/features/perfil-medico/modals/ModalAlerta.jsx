import React from 'react';
import Modal from './Modal';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ModalAlerta({ isOpen, onClose, title, message, type = 'info' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="p-4 text-center">
        <div className={`d-inline-flex p-3 rounded-circle mb-3 ${
          type === 'success' ? 'bg-success bg-opacity-10 text-success' :
          type === 'error' ? 'bg-danger bg-opacity-10 text-danger' :
          'bg-warning bg-opacity-10 text-warning'
        }`}>
          {type === 'success' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
        </div>
        <h5 className="font-weight-bold text-default mb-2">{title}</h5>
        <p className="text-muted mb-4" style={{ fontSize: '13.5px' }}>{message}</p>
        <button
          className={`btn px-4 py-2 font-weight-bold ${
            type === 'success' ? 'btn-success' :
            type === 'error' ? 'btn-danger' :
            'btn-primary'
          }`}
          style={{ borderRadius: '8px', fontSize: '13px' }}
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </Modal>
  );
}
