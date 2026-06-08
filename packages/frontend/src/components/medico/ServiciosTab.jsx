import React from 'react';
import { Plus, User, Activity } from 'lucide-react';
import ServicioCard from './ServicioCard';

export default function ServiciosTab({ servicios, onAdd, onEliminar }) {
  const especialidades = servicios.filter(s => s.tipo === 'ESPECIALIDAD');
  const practicas = servicios.filter(s => s.tipo === 'PRACTICA');

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="font-weight-bold text-dark m-0">Mis Servicios Activos</h4>
        <button 
          onClick={onAdd} 
          className="btn btn-success d-flex align-items-center gap-2 font-weight-bold px-3 py-2"
          style={{ borderRadius: '10px' }}
        >
          <Plus size={18} /> Agregar Servicio
        </button>
      </div>

      <div className="mb-5">
        <h5 className="font-weight-bold text-primary border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
          <User size={20} /> Especialidades
        </h5>
        {especialidades.length === 0 ? (
          <p className="text-muted italic small">No hay especialidades asignadas.</p>
        ) : (
          <div className="row g-3">
            {especialidades.map(srv => (
              <div key={srv._id} className="col-12 col-md-6 col-lg-4">
                <ServicioCard servicio={srv} onEliminar={onEliminar} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h5 className="font-weight-bold text-primary border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
          <Activity size={20} /> Prácticas Médicas
        </h5>
        {practicas.length === 0 ? (
          <p className="text-muted italic small">No hay prácticas asignadas.</p>
        ) : (
          <div className="row g-3">
            {practicas.map(srv => (
              <div key={srv._id} className="col-12 col-md-6 col-lg-4">
                <ServicioCard servicio={srv} onEliminar={onEliminar} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
