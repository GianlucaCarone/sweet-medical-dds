import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function FiltroSelect({
    label,
    value,
    onChange,
    options,
    disabled = false,
    emptyValue = 'Todas',
    emptyLabel = 'Todas',
    fullWidth = true,
    sx = {}
}) {
    const labelId = `${label.toLowerCase().replace(/\s+/g, '-')}-label`;

    return (
        <FormControl fullWidth={fullWidth} size="small" sx={sx} disabled={disabled}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                value={value}
                label={label}
                onChange={onChange}
            >
                <MenuItem value={emptyValue}>{emptyLabel}</MenuItem>
                {options.map((opt) => (
                    <MenuItem key={opt.id} value={opt.id}>
                        {opt.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
