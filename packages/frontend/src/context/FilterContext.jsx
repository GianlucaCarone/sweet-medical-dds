import { createContext, useContext, useEffect, useState } from "react";
import { getListadoMedicos, getListadoServicios, getListadoSedes } from '../api/apiBusquedaTurnos.js';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [doctorFilter, setDoctorFilter] = useState('Todos');
  const [specialityFilter, setSpecialityFilter] = useState('Todas');
  const [practiceFilter, setPracticeFilter] = useState('Todas');
  const [branchFilter, setBranchFilter] = useState('Todas');
  const [fromDate, setFromDate] = useState('');
  const [untilDate, setUntilDate] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [practices, setPractices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Single load when the provider mounts
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [doctorsList, servicesList, branchesList] = await Promise.all([
          getListadoMedicos(),
          getListadoServicios(),
          getListadoSedes()
        ]);
        setDoctors(doctorsList);
        setSpecialities(servicesList.filter(s => s.tipo === 'Especialidad'));
        setPractices(servicesList.filter(s => s.tipo === 'Practica'));
        setBranches(branchesList);
      } catch (e) {
        console.error("Error loading filter options:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadOptions();
  }, []);

  const updateFilters = (overrides = {}) => {
    if (overrides.doctor !== undefined) setDoctorFilter(overrides.doctor);
    if (overrides.speciality !== undefined) setSpecialityFilter(overrides.speciality);
    if (overrides.practice !== undefined) setPracticeFilter(overrides.practice);
    if (overrides.branch !== undefined) setBranchFilter(overrides.branch);
    if (overrides.fromDate !== undefined) setFromDate(overrides.fromDate);
    if (overrides.untilDate !== undefined) setUntilDate(overrides.untilDate);
  };

  const buildApiFilters = () => {
    let service = null;
    if (specialityFilter !== 'Todas') {
      service = practiceFilter !== 'Todas' ? practiceFilter : specialityFilter;
    }

    const filters = {
      medicoId: doctorFilter !== 'Todos' ? doctorFilter?.id : null,
      servicioId: service?.id ?? null,
      sedeId: branchFilter !== 'Todas' ? branchFilter?.id : null,
      fechaHoraInicio: fromDate || null,
      fechaHoraFin: untilDate || null,
    };

    return Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );
  };

  const resetFilters = () => {
    setDoctorFilter('Todos');
    setSpecialityFilter('Todas');
    setPracticeFilter('Todas');
    setBranchFilter('Todas');
    setFromDate('');
    setUntilDate('');
  };

  return (
    <FilterContext.Provider value={{
      // filters
      doctorFilter, specialityFilter, practiceFilter, branchFilter, fromDate, untilDate,
      // setters
      setDoctorFilter, setSpecialityFilter, setPracticeFilter, setBranchFilter, setFromDate, setUntilDate,
      // options
      doctors, specialities, practices, branches, isLoading,
      // helpers
      updateFilters,
      buildApiFilters,
      resetFilters
    }}>{children}</FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
