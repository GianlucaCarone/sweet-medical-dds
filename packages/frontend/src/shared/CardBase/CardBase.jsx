import { Card } from "@mui/material";

export default function CardBase({children, className=""}) {
    return (
        <>
            <Card className={`tarjeta-turno ${className}`} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: '5px solid secondary.light'}}>
                {children}
            </Card>
        </>
    )
}