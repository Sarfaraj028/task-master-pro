export class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

export const asyncHandler = (fun) =>{
    (req, res, next) =>{
        Promise.resolve(fun(req, res, next)).catch(next)
    }
}