import { Card } from "@mui/material";
import "./CardBase.css"

export default function CardBase({children, className=""}) {
    return (
        <>
            <Card className={`tarjeta-turno ${className}`} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                {children}
            </Card>
        </>
    )
}