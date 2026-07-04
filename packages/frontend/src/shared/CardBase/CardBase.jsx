import { Card } from "@mui/material";

export default function CardBase({children, className=""}) {
    return (
        <Card className={`tarjeta-turno ${className}`} sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: '16px'
        })}>
            {children}
        </Card>
    )
}