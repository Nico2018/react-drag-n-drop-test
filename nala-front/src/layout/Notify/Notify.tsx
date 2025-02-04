import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { useCallback, useState } from "react";
import { NotifyContext } from "./NotifyContext";

export default function Notify(props: any) {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("info");

  const handleClose = (_: any, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const triggerNotification = useCallback(
    (message: string, severityColor: AlertColor) => {
      console.log(message, severityColor);

      setNotification(message);
      setSeverity(severityColor);
      setOpen(true);
    },
    []
  );

  return (
    <>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification}
        </Alert>
      </Snackbar>
      <NotifyContext.Provider value={triggerNotification}>
        {props.children}
      </NotifyContext.Provider>
    </>
  );
}
