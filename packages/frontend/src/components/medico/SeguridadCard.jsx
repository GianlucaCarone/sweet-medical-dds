import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

export default function SeguridadCard({ setAlertConfig }) {
  const [passwords, setPasswords] = useState({ anterior: '', nueva: '', confirmar: '' });
  const [error, setError] = useState('');

  const handleCambioContrasena = (e) => {
    e.preventDefault();

    if (passwords.nueva !== passwords.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (passwords.nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwords.nueva === passwords.anterior) {
      setError('La nueva contraseña no puede ser igual a la contraseña anterior.');
      return;
    }

    setError('');
    setAlertConfig({
      isOpen: true,
      title: 'Contraseña Actualizada',
      message: '¡La contraseña ha sido actualizada con éxito!',
      type: 'success'
    });
    setPasswords({ anterior: '', nueva: '', confirmar: '' });
  };

  return (
    <div className="col-12 col-lg-4 d-flex flex-column justify-content-center px-4">
      <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
        <KeyRound size={16} className="text-primary" />
        <h5 className="font-weight-bold text-dark m-0" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>SEGURIDAD</h5>
      </div>

      <form onSubmit={handleCambioContrasena} className="d-flex flex-column gap-3">

        {/* Contraseña Anterior */}
        <div>
          <input
            type="password"
            placeholder="Contraseña Anterior"
            className="form-control"
            style={{ fontSize: '13px', borderRadius: '6px' }}
            value={passwords.anterior}
            onChange={e => {
              setError('');
              setPasswords({ ...passwords, anterior: e.target.value });
            }}
            required={passwords.nueva.length > 0}
          />
        </div>

        {/* Nueva Contraseña */}
        <div>
          <input
            type="password"
            placeholder="Nueva Contraseña"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            style={{ fontSize: '13px', borderRadius: '6px' }}
            value={passwords.nueva}
            onChange={e => {
              setError('');
              setPasswords({ ...passwords, nueva: e.target.value });
            }}
            required={passwords.anterior.length > 0}
          />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            style={{ fontSize: '13px', borderRadius: '6px' }}
            value={passwords.confirmar}
            onChange={e => {
              setError('');
              setPasswords({ ...passwords, confirmar: e.target.value });
            }}
            required={passwords.anterior.length > 0}
          />

          {/* Mensaje de error visible */}
          {error && (
            <div className="error-message text-center w-100 d-block mt-1" style={{ fontSize: '12px' }}>
              {error}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-outline-primary btn-sm w-100 font-weight-bold mt-2"
          style={{ borderRadius: '8px', padding: '8px 0', fontSize: '13px' }}
        >
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
}
