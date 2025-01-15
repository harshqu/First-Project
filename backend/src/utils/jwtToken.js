const sendToken = (user,statusCode,res) => {
    const token = user.getJWTToken();

    const options = {
        expires : new Date(
            Date.now() + 1*24*60*60*1000
        ),
        httpOnly: true,
        secure: false,
    };

    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        user,
        token,
    })
}

export default sendToken