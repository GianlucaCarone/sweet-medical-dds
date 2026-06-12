import React, { createContext, useState, useContext } from "react";
import { Alert, Snackbar } from "@mui/material";

const AlertContext = createContext();

export const useAlert = () => {
    return useContext(AlertContext);
};

export const AlertProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const showAlert = (mensaje, tipo = "success") => {
        setMessage(mensaje);
        setSeverity(tipo);
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };
    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                    variant="filled"
                >
                    {message}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};