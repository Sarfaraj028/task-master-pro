import { ErrorHandler } from "../utils/asyncHandler.js"

export const errorMiddleware = (err, req, res, next) =>{
    err.message = err.message || "Internal Server Error!"
    err.statusCode = err.statusCode || 500

    //If already registered with an email, and again trying to register with same email, username then this error happen
    if(err.code === 11000){
        const statusCode = 400
        const message = "Duplicate field value Entered!"
        err = new ErrorHandler(message, statusCode)
    }

    //occurs when the token is malformed, tampered, not signed correctly
    if(err.name === "JsonWebTokenError"){
        const statusCode = 400;
        const message = "JsonWebToken is not valid. Try Again!";
        err = new ErrorHandler(message, statusCode)
    }
    // token is expired
    if(err.name === "TokenExpiredError"){
        const statusCode = 400;
        const message = "Json Web Token is Expired. Please Login";
        err = new ErrorHandler(message, statusCode)
    }

    //invalid id or wrong datatype entered || the value not entered as expected.
    if(err.name === "CastError"){
        const statusCode = 400;
        const message = `Resources Not Found! ${err.path}`;
        err = new ErrorHandler(message, statusCode) 
    }

    //mongoose validation error
    const errorMessage = err.errors 
    ? Object.values(err.errors)
    .map(error => error.message)
    .join(" ") 
    : err.message;

    //custom error response
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    })

}
export default ErrorHandler