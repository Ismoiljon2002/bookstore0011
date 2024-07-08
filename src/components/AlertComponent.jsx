import { Alert } from "react-bootstrap";
import { Check, XCircleFill } from "react-bootstrap-icons";

export const AlertComponent = ({ variant, message, show }) => {
    const style = {
        position: 'fixed',
        bottom: 50,
        right: 50,
        display: show ? 'block' : 'none',
        width: 320,
        fontSize: 16,
        fontWeight: 600,
        backgroundColor: variant === 'success' ? '#52C41A' : "red",
        borderRadius: 6,
        padding: '14px 10px',
        color: '#fff',
    }
    return (
        <Alert key={variant} variant={variant} style={style}>
            {variant === "success" ? <Check size={20} className="mx-2"/> : ""} {message}
        </Alert>
    );
}