export function getDisplayErrorMessage(error, defaultMessage) {
  if (typeof error === 'string') {
    return error;
  }
  // Axios error structure where actual server response is in error.response.data
  if (error && error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === 'string') return data;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.detail === 'string') return data.detail; // Common in DRF
    if (Array.isArray(data.errors) && data.errors.length > 0) {
        if (typeof data.errors[0] === 'string') return data.errors[0];
        if (typeof data.errors[0].msg === 'string') return data.errors[0].msg; // express-validator
    }
  }
  // Direct error object (e.g., error thrown from AdminService after parsing)
  if (error && typeof error.message === 'string') {
    return error.message;
  }
  if (error && typeof error.detail === 'string') {
    return error.detail;
  }
  if (error && error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    if (typeof error.errors[0] === 'string') return error.errors[0];
    if (typeof error.errors[0].msg === 'string') return error.errors[0].msg;
  }
  // Fallback if error.message was an object itself
  if (error && typeof error.message === 'object' && error.message !== null) {
    if (typeof error.message.detail === 'string') return error.message.detail;
    return JSON.stringify(error.message); // Last resort for object messages
  }
  return defaultMessage;
}