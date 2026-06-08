import React from 'react';
import { Plus, Clock, MapPin, Trash2, Edit } from 'lucide-react';

export default function DisponibilidadesTab({ disponibilidades, onAdd, onEdit, onEliminar }) {
  const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="font-weight-bold text-dark m-0">Horario Semanal de Atención</h4>
        <button 
          onClick={onAdd} 
          className="btn btn-success d-flex align-items-center gap-2 font-weight-bold px-3 py-2"
          style={{ borderRadius: '10px' }}
        >
          <Plus size={18} /> Agregar Horario
        </button>
      </div>

      <div className="semana-grid">
        {diasSemana.map(dia => {

          const turnosDiaOriginales = disponibilidades.filter(d => d.diaSemana === dia);
          //los ordenamos
          const turnosDia = [...turnosDiaOriginales].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

          const diaLabel = dia === 'MIERCOLES' ? 'MIÉRCOLES' : dia === 'SABADO' ? 'SÁBADO' : dia;
          return (
            <div key={dia} className="dia-columna shadow-sm">
              <div className="dia-header">
                {diaLabel}
              </div>
              <div className="dia-body">
                {turnosDia.length > 0 ? (
                  turnosDia.map(disp => (
                    <div key={disp._id} className="disp-slot-card">
                      <div className="d-flex align-items-center gap-1 mb-1 font-weight-bold text-primary" style={{ fontSize: '11px' }}>
                        <Clock size={11} /> {disp.horaInicio} - {disp.horaFin}
                      </div>
                      <div 
                        className="text-dark font-weight-bold text-truncate mb-1" 
                        style={{ fontSize: '11px', lineHeight: '1.2' }} 
                        title={disp.servicio.nombre}
                      >
                        {disp.servicio.nombre}
                      </div>
                      <div 
                        className="text-secondary text-truncate d-flex align-items-center gap-0.5" 
                        style={{ fontSize: '10px' }} 
                        title={disp.sede.nombre}
                      >
                        <MapPin size={9} /> {disp.sede.nombre}
                      </div>
                      
                      <button 
                        onClick={() => onEdit(disp)} 
                        className="disp-slot-edit-btn" 
                        title="Editar Horario"
                      >
                        <Edit size={10} />
                      </button>

                      <button 
                        onClick={() => onEliminar(disp._id)} 
                        className="disp-slot-delete-btn" 
                        title="Eliminar Horario"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted text-center py-4 small italic mt-auto mb-auto">Sin asignar</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
