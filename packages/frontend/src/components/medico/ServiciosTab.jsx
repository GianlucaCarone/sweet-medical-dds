import React from 'react';
import { Plus, User, Activity } from 'lucide-react';
import ServicioCard from './ServicioCard';
import { Button } from '@mui/material';

export default function ServiciosTab({ especialidades = [], practicas = [], onAdd, onEliminar }) {

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="font-weight-bold text-default m-0">Mis Servicios Activos</h4>
        <Button 
          variant="contained"
          color="success"
          onClick={onAdd} 
          startIcon={<Plus size={18} />}
          sx={{ borderRadius: '10px', fontWeight: 'bold', px: 3, py: 1, textTransform: 'none', color: 'white' }}
          aria-label="Agregar Servicio"
        >
          Agregar Servicio
        </Button>
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
              <div key={srv.id} className="col-12 col-md-6 col-lg-4">
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
              <div key={srv.id || srv._id} className="col-12 col-md-6 col-lg-4">
                <ServicioCard servicio={srv} onEliminar={onEliminar} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
