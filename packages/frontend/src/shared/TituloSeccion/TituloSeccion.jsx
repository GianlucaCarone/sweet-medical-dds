import { Typography } from "@mui/material";
import "./TituloSeccion.css"

export default function TituloSeccion({children}) {
    return (
        <>
            <Typography className="seccion-titulo" variant="h1" sx={{ mb: 2 }}>{children}</Typography>
        </>
    )
}