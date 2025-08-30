class AppError extends Error {
    constructor(message, status = 500, errorName = 'error') {
      super(message);
      this.status = status;
      this.name = errorName;
  
      
  
      Error.captureStackTrace?.(this, AppError);
    }
  }
  
  export default AppError;