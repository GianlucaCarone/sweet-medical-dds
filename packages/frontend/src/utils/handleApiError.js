export function handleApiError(error, navigate) {
    switch (error.status) {
        case 403:
            navigate("/403");
            return true;

        default:
            if (error.status >= 500) {
                navigate("/500");
                return true;
            }
            return false;
    }
}