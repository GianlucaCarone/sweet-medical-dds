import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    Box,
    Button,
    Typography,
    TextField,
    Stack
} from '@mui/material';
import { useFilters } from '../../context/FilterContext.jsx';
import FiltroSelect from './FiltroSelect.jsx';

export default function SidebarFiltros({ direction = 'vertical', onSearch }) {
    const {
        doctors, specialities, practices, branches,
        doctorFilter, specialityFilter, practiceFilter, branchFilter, fromDate, untilDate,
        setDoctorFilter, setSpecialityFilter, setPracticeFilter, setBranchFilter, setFromDate, setUntilDate,
        updateFilters, resetFilters
    } = useFilters();

    const isSpecialitySelected = specialityFilter && specialityFilter !== 'Todas';

    const isHorizontal = direction === 'horizontal';
    const selectWidth = isHorizontal ? { minWidth: 160 } : {};

    const handleDoctorChange = (e) => {
        const selected = e.target.value === 'Todos'
            ? 'Todos'
            : doctors.find(d => d.id === e.target.value);
        setDoctorFilter(selected);
        updateFilters({ doctor: selected });
    };

    const handleSpecialityChange = (e) => {
        const selected = e.target.value === 'Todas'
            ? 'Todas'
            : specialities.find(s => s.id === e.target.value);
        setSpecialityFilter(selected);
        setPracticeFilter('Todas');
        updateFilters({ speciality: selected, practice: 'Todas' });
    };

    const handlePracticeChange = (e) => {
        const selected = e.target.value === 'Todas'
            ? 'Todas'
            : practices.find(p => p.id === e.target.value);
        setPracticeFilter(selected);
        updateFilters({ practice: selected });
    };

    const handleBranchChange = (e) => {
        const selected = e.target.value === 'Todas'
            ? 'Todas'
            : branches.find(b => b.id === e.target.value);
        setBranchFilter(selected);
        updateFilters({ branch: selected });
    };

    const handleFromDateChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setFromDate('');
            updateFilters({ fromDate: '' });
            return;
        }
        const selectedDate = new Date(value);
        const today = new Date().setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert("La fecha desde no puede ser anterior a hoy.");
            return;
        }
        if (untilDate && value > untilDate) {
            alert("La fecha desde no puede ser posterior a la fecha hasta.");
            return;
        }
        setFromDate(value);
        updateFilters({ fromDate: value });
    };

    const handleUntilDateChange = (e) => {
        const value = e.target.value;
        if (!value) {
            setUntilDate('');
            updateFilters({ untilDate: '' });
            return;
        }
        const selectedDate = new Date(value);
        const today = new Date().setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            alert("La fecha hasta no puede ser anterior a hoy.");
            return;
        }
        if (fromDate && value < fromDate) {
            alert("La fecha hasta no puede ser anterior a la fecha desde.");
            return;
        }
        setUntilDate(value);
        updateFilters({ untilDate: value });
    };

    return (
        <Box
            component="aside"
            sx={{
                width: isHorizontal ? '100%' : 280,
                display: isHorizontal ? 'flex' : null,
                backgroundColor: 'background.default',
                borderRadius: 3,
                padding: 3,
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px rgba(0,0,0,0.01)',
                height: 'auto',
                ...(isHorizontal ? {
                    flexWrap: 'wrap',
                    alignItems: 'flex-start',
                    gap: 2,
                    justifyContent: 'space-between',
                    mt: 2
                } : {}),
            }}
        >
            {!isHorizontal && (
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 3 }}
                >
                    <FilterAltIcon sx={{ color: '#475569', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
                        Búsqueda de Turnos
                    </Typography>
                </Stack>
            )}

            <Stack direction={isHorizontal ? 'row' : 'column'} spacing={isHorizontal ? 1.5 : 2.5} flexWrap={isHorizontal ? 'wrap' : undefined} useFlexGap={isHorizontal}>
                {/* Especialidad (Siempre visible, obligatorio) */}
                <FiltroSelect
                    label="Especialidad"
                    value={specialityFilter?.id ?? 'Todas'}
                    onChange={handleSpecialityChange}
                    options={specialities}
                    emptyValue="Todas"
                    emptyLabel="Todas"
                    fullWidth={!isHorizontal}
                    sx={selectWidth}
                />

                {/* Práctica (Siempre visible, depende de Especialidad) */}
                <FiltroSelect
                    label="Práctica"
                    value={practiceFilter?.id ?? 'Todas'}
                    onChange={handlePracticeChange}
                    options={practices.filter(
                        (p) => p.especialidadPadreId === specialityFilter?.id || p.especialidadPadre === null
                    )}
                    disabled={!isSpecialitySelected}
                    emptyValue="Todas"
                    emptyLabel="Consulta general"
                    fullWidth={!isHorizontal}
                    sx={selectWidth}
                />

                {/* Filtros secundarios solo cuando no es horizontal */}
                {!isHorizontal && (
                    <>
                        {/* Profesional */}
                        <FiltroSelect
                            label="Profesional"
                            value={doctorFilter?.id ?? 'Todos'}
                            onChange={handleDoctorChange}
                            options={doctors}
                            disabled={!isSpecialitySelected}
                            emptyValue="Todos"
                            emptyLabel="Todos"
                            sx={selectWidth}
                        />

                        {/* Sede de atención */}
                        <FiltroSelect
                            label="Sede de atención"
                            value={branchFilter?.id ?? 'Todas'}
                            onChange={handleBranchChange}
                            options={branches}
                            disabled={!isSpecialitySelected}
                            emptyValue="Todas"
                            emptyLabel="Todas"
                            sx={selectWidth}
                        />

                        {/* Rango de fechas */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
                            <TextField
                                size="small"
                                type="date"
                                helperText="Desde"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                disabled={!isSpecialitySelected}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="date"
                                helperText="Hasta"
                                value={untilDate}
                                onChange={handleUntilDateChange}
                                disabled={!isSpecialitySelected}
                                fullWidth
                            />
                        </Box>
                    </>
                )}
            </Stack>

            <Stack 
                direction={isHorizontal ? 'row' : 'column'} 
                spacing={1.5} 
                sx={{ 
                    mt: isHorizontal ? 0 : 2.5, 
                    width: isHorizontal ? 'auto' : '100%' 
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => onSearch?.()}
                    disabled={!isSpecialitySelected}
                    sx={{
                        backgroundColor: 'primary',
                        color: 'background',
                        height: 40,
                        minWidth: 120,
                        whiteSpace: 'nowrap',
                        '&:hover': { backgroundColor: 'primary.dark' },
                        ...(!isHorizontal ? { width: '100%' } : {})
                    }}
                >
                    Buscar
                </Button>
                {!isHorizontal && (
                    <Button
                        variant="outlined"
                        onClick={resetFilters}
                        sx={{
                            height: 40,
                            width: '100%',
                            borderColor: '#cbd5e1',
                            color: '#475569',
                            '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' }
                        }}
                    >
                        Limpiar filtros
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
