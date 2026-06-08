import React, { useState } from 'react';

// Hooks
import useDoctorProfile from './hooks/useDoctorProfile';
import useTurnos from './hooks/useTurnos';

// Componentes
import CabeceraPerfil from '../../components/medico/CabeceraPerfil';
import ServiciosTab from '../../components/medico/ServiciosTab';
import DisponibilidadesTab from '../../components/medico/DisponibilidadesTab';
import SedesTab from '../../components/medico/SedesTab';
import TurnosTab from '../../components/medico/TurnosTab';

// Modales
import ModalAgregarServicio from './modals/ModalAgregarServicio';
import ModalDisponibilidad from './modals/ModalDisponibilidad';
import ModalConfirmacion from './modals/ModalConfirmacion';
import ModalAlerta from './modals/ModalAlerta';

// Estilos
import './PerfilMedico.css';

export default function PerfilMedico() {
  const [activeTab, setActiveTab] = useState('servicios');
  const [modalOpen, setModalOpen] = useState(null);
  
  // Estado para alertas y confirmaciones
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const triggerConfirm = (title, message, onConfirmAction) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Custom Hooks
  const {
    doctor,
    handleAgregarServicio,
    handleEliminarServicio,
    handleAgregarDisponibilidad,
    handleEliminarDisponibilidad,
    handleAsociarSede,
    handleDesvincularSede,
    handleGuardarDatosPersonales
  } = useDoctorProfile(triggerConfirm, setAlertConfig);

  const turnosHook = useTurnos(doctor, activeTab);

  // Estados para ModalDisponibilidad (editar)
  const [editingDispId, setEditingDispId] = useState(null);
  const [dispInitialData, setDispInitialData] = useState(null);

  const handleEditDisponibilidad = (disp) => {
    setEditingDispId(disp._id);
    setDispInitialData(disp);
    setModalOpen('disponibilidad');
  };

  const handleOpenDispModalNew = () => {
    setEditingDispId(null);
    setDispInitialData(null);
    setModalOpen('disponibilidad');
  };

  return (
    <main className="container-perfil">
      <div className="row">
        <div className="col-12">
          
          <CabeceraPerfil
            doctor={doctor}
            handleGuardarDatosPersonales={handleGuardarDatosPersonales}
            setAlertConfig={setAlertConfig}
          />

          <section className="perfil-card p-0 overflow-hidden mb-4">
            <nav className="tabs-header-container">
              {['servicios', 'disponibilidades', 'sedes', 'turnos'].map(tab => {
                const label = tab === 'servicios' ? 'Mis Servicios'
                  : tab === 'disponibilidades' ? 'Mis Horarios'
                    : tab === 'sedes' ? 'Mis Sedes'
                      : 'Mis Turnos';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                );
              })}
            </nav>

            <article className="tab-content-container p-4">
              {activeTab === 'servicios' && (
                <ServiciosTab
                  servicios={doctor.serviciosAsignados}
                  onAdd={() => setModalOpen('servicio')}
                  onEliminar={handleEliminarServicio}
                />
              )}

              {activeTab === 'disponibilidades' && (
                <DisponibilidadesTab
                  disponibilidades={doctor.disponibilidadHoraria}
                  onAdd={handleOpenDispModalNew}
                  onEdit={handleEditDisponibilidad}
                  onEliminar={handleEliminarDisponibilidad}
                />
              )}

              {activeTab === 'sedes' && (
                <SedesTab
                  sedesAsignadas={doctor.sedesAsignadas}
                  onAsociar={handleAsociarSede}
                  onDesvincular={handleDesvincularSede}
                />
              )}

              {activeTab === 'turnos' && (
                <TurnosTab
                  turnos={turnosHook.turnosFiltrados}
                  subTab={turnosHook.turnosSubTab}
                  setSubTab={turnosHook.setTurnosSubTab}
                  loading={turnosHook.loadingTurnos}
                  page={turnosHook.turnosPage}
                  totalPages={turnosHook.totalTurnosPaginas}
                  totalItems={turnosHook.totalTurnosCount}
                  counts={turnosHook.counts}
                  onPageChange={turnosHook.setTurnosPage}
                  onActualizarEstado={turnosHook.handleActualizarEstadoTurno}
                  onProponerCambio={turnosHook.handleProponerCambioTurno}
                  onObtenerHistorialPaciente={turnosHook.handleObtenerHistorialPaciente}
                />
              )}
            </article>
          </section>
        </div>
      </div>

      <ModalAgregarServicio
        isOpen={modalOpen === 'servicio'}
        onClose={() => setModalOpen(null)}
        doctor={doctor}
        handleAgregarServicio={handleAgregarServicio}
      />

      <ModalDisponibilidad
        isOpen={modalOpen === 'disponibilidad'}
        onClose={() => setModalOpen(null)}
        doctor={doctor}
        handleAgregarDisponibilidad={handleAgregarDisponibilidad}
        initialData={dispInitialData}
        editingDispId={editingDispId}
      />

      <ModalConfirmacion
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
      />

      <ModalAlerta
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

    </main>
  );
}
