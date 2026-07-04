import React from 'react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
    Box,
    Button,
    Typography,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack
} from '@mui/material';
import { useFilters } from '../../context/FilterContext.jsx';

export default function SidebarFiltros({ direction = 'vertical', onSearch }) {
    const {
        doctors, specialities, practices, branches,
        doctorFilter, specialityFilter, practiceFilter, branchFilter, fromDate, untilDate,
        setDoctorFilter, setSpecialityFilter, setPracticeFilter, setBranchFilter, setFromDate, setUntilDate,
        updateFilters
    } = useFilters();

    const isHorizontal = direction === 'horizontal';
    const selectWidth = isHorizontal ? { minWidth: 160 } : {};

    const handleDoctorChange = (e) => {
        const selected = e.target.value === 'Todos'
            ? 'Todos'
            : doctors.find(d => d.id === e.target.value);
        setDoctorFilter(selected);
        updateFilters({ doctor: selected, speciality: 'Todas', practice: 'Todas' });
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

                {!isHorizontal && (
                    <FormControl fullWidth size="small" sx={selectWidth}>
                        <InputLabel id="doctor-label">Profesional</InputLabel>
                        <Select
                            labelId="doctor-label"
                            value={doctorFilter?.id ?? 'Todos'}
                            label="Profesional"
                            onChange={handleDoctorChange}
                        >
                            <MenuItem value='Todos'>Todos</MenuItem>
                            {doctors.map((d) => (
                                <MenuItem key={d.id} value={d.id}>
                                    {d.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <FormControl fullWidth={!isHorizontal} size="small" sx={selectWidth}>
                    <InputLabel id="speciality-label">Especialidad</InputLabel>
                    <Select
                        labelId="speciality-label"
                        value={specialityFilter?.id ?? 'Todas'}
                        label="Especialidad"
                        onChange={handleSpecialityChange}
                    >
                        <MenuItem value='Todas'>Todas</MenuItem>
                        {specialities.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth={!isHorizontal} size="small" sx={selectWidth}>
                    <InputLabel id="practice-label">Práctica</InputLabel>
                    <Select
                        labelId="practice-label"
                        value={practiceFilter?.id ?? 'Todas'}
                        label="Práctica"
                        onChange={handlePracticeChange}
                    >
                        <MenuItem value='Todas'>Todas</MenuItem>
                        {practices
                            .filter((p) => p.especialidadPadreId === specialityFilter?.id || p.especialidadPadre === null)
                            .map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.nombre}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {!isHorizontal && (
                    <>
                        <FormControl fullWidth size="small" sx={selectWidth}>
                            <InputLabel id="branch-label">Sede de atención</InputLabel>
                            <Select
                                labelId="branch-label"
                                value={branchFilter?.id ?? 'Todas'}
                                label="Sede de atención"
                                onChange={handleBranchChange}
                            >
                                <MenuItem value='Todas'>Todas</MenuItem>
                                {branches.map((b) => (
                                    <MenuItem key={b.id} value={b.id}>
                                        {b.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>
                            <TextField
                                size="small"
                                type="date"
                                helperText="Desde"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                fullWidth
                            />
                            <TextField
                                size="small"
                                type="date"
                                helperText="Hasta"
                                value={untilDate}
                                onChange={handleUntilDateChange}
                                fullWidth
                            />
                        </Box>
                    </>
                )}
            </Stack>

            <Button
                variant="contained"
                onClick={() => onSearch?.()}
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
        </Box>
    );
}
