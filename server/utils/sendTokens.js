export const sendToken = (user, res, message, statusCode = 200) =>{
    const token = user.generateJWTToken();

    return res.status(statusCode).json({
        success: true,
        message,
        user,
        token
    })
}