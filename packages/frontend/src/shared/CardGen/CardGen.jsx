import { Card } from "@mui/material";
import "./CardGen.css"

export default function CardGen({children, className=""}) {
    return (
        <>
            <Card className={`tarjeta-turno ${className}`} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                {children}
            </Card>
        </>
    )
}