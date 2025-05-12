export function logger(status, message) {
    switch (status) {
        case 'success':
            console.log(`[SUCCESS] ${message}`);
            break;
        case 'error':
            console.error(`[ERROR] ${message}`);
            break;
        case 'info':
            console.log(`[INFO] ${message}`);
            break;
        default:
            console.log(`[LOG] ${message}`);
            break;
    }
}