import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom bg-neutral-light">
          <h5 className="modal-title font-weight-bold text-default m-0">{title}</h5>
          <button 
            onClick={onClose} 
            className="btn btn-link text-muted p-1 border-0" 
            style={{ textDecoration: 'none' }}
          >
            <X size={22} />
          </button>
        </div>
        <div className="modal-body-custom">
          {children}
        </div>
      </div>
    </div>
  );
}
