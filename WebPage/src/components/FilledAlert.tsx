import { Alert, Snackbar } from "@mui/material";
import { useContext, useEffect } from 'react';
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { OpenAlert } from "../App";

type FilledAlertProps = {
    success: boolean,
    message: string,
}

function FilledAlert({ success, message }: FilledAlertProps) {
    const { open, setOpen } = useContext(OpenAlert);
    const location = useLocation()

    useEffect(() => {
        setOpen(false)
    }, [location])

    const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {createPortal(
                message && (
                        <div>
                            <Snackbar
                                sx={{ zIndex: 10, width: 'fit-content' }}
                                open={open}
                                autoHideDuration={3500}
                                onClose={handleClose}
                            >
                                <Alert
                                    variant="filled"
                                    severity={success ? 'success' : 'error'}
                                >
                                    {message}
                                </Alert>
                            </Snackbar>
                        </div>
                ),
                document.body as HTMLElement
            )}
        </>
    )
}

export default FilledAlert;