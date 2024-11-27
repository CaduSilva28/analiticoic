require("dotenv").config({ path: './config/homolog.env' });
const apikey = process.env.UUID;

const authetication = (req, res, next) => {
    const deUUID = req.header('UUID');

    if(deUUID != apikey){
        return res.status(403).json({
            success: false,
            message: "Chave de acesso inválida!"
        });
    };

    next();
};

export default authetication;