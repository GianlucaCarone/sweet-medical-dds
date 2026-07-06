import React from 'react';
import { Plus, Clock, MapPin, Trash2, Edit } from 'lucide-react';
import { Button, IconButton } from '@mui/material';

export default function DisponibilidadesTab({ disponibilidades, onAdd, onEdit, onEliminar }) {
  const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="font-weight-bold text-default m-0">Horario Semanal de Atención</h4>
        <Button 
          variant="contained"
          color="success"
          onClick={onAdd} 
          startIcon={<Plus size={18} />}
          sx={{ borderRadius: '10px', fontWeight: 'bold', px: 3, py: 1, textTransform: 'none', color: 'white' }}
          aria-label="Agregar Horario"
        >
          Agregar Horario
        </Button>
      </div>

      <div className="semana-grid">
        {diasSemana.map(dia => {

          const turnosDiaOriginales = disponibilidades.filter(d => d.diaSemana === dia);
          //los ordenamos
          const turnosDia = [...turnosDiaOriginales].sort((a, b) => a.horaDesde.localeCompare(b.horaDesde));

          const diaLabel = dia === 'MIERCOLES' ? 'MIÉRCOLES' : dia === 'SABADO' ? 'SÁBADO' : dia;
          return (
            <div key={dia} className="dia-columna shadow-sm">
              <div className="dia-header">
                {diaLabel}
              </div>
              <div className="dia-body">
                {turnosDia.length > 0 ? (
                  turnosDia.map(disp => (
                    <div key={disp.id} className="disp-slot-card">
                      <div className="d-flex align-items-center gap-1 mb-1 font-weight-bold text-primary" style={{ fontSize: '11px' }}>
                        <Clock size={11} /> {disp.horaDesde} - {disp.horaHasta}
                      </div>
                      <div 
                        className="text-default font-weight-bold text-truncate mb-1" 
                        style={{ fontSize: '11px', lineHeight: '1.2' }} 
                        title={disp.servicio.nombre}
                      >
                        {disp.servicio.nombre}
                      </div>
                      <div className="d-flex justify-content-between align-items-start mt-2 pt-1">
                        <div 
                          className="text-muted d-flex align-items-start gap-1" 
                          style={{ fontSize: '9px', lineHeight: '1.2', flex: 1, minWidth: 0, wordBreak: 'break-word', paddingRight: '4px' }} 
                          title={disp.sede.nombre}
                        >
                          <MapPin size={9} className="flex-shrink-0" style={{ marginTop: '2px' }} /> 
                          <span>{disp.sede.nombre}</span>
                        </div>
                        <div className="d-flex gap-1">
                          <IconButton 
                            onClick={() => onEdit(disp)} 
                            size="small"
                            color="primary"
                            title="Editar Horario"
                            aria-label="Editar Horario"
                            sx={{ p: 0.5 }}
                          >
                            <Edit size={14} />
                          </IconButton>
                          <IconButton 
                            onClick={() => onEliminar(disp.id)} 
                            size="small"
                            color="error"
                            title="Eliminar Horario"
                            aria-label="Eliminar Horario"
                            sx={{ p: 0.5 }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </div>
                      </div>
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
