const jwt =  require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token);
        jwt.verify(token,process.env.JWT_SECRET,async (err,user)=>{
            if(err){
                console.log(err)
                return res.status(403).json({status:false,message:"invalid token"})
            }
            req.user =  user;
            next();
        })
    }else{
        return res.status(401).json({status:false,message:"You are not authenticated"})
    }
};


const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,() => {
        console.log(req.user.userType);
        if(req.user.userType === 'Client' || req.user.userType === 'Admin'|| req.user.userType === 'Vendor' || req.user.userType === 'Driver'){
            next();
        }else{
            return res.status(403).json({status:false,message:"You are not allowed to do that"})
        }
    });
};


const verifyVendor = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.userType === 'Admin'|| req.user.userType === 'Vendor'){
            next();
        }else{
            return res.status(403).json({status:false,message:"You are not allowed to do that"})
        }
    });
};


const verifyAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.userType === 'Admin'){
            next();
        }else{
            return res.status(403).json({status:false,message:"You are not allowed to do that"})
        }
    });
};

const verifyDriver = (req,res,next) => {
    if(req.user.userType === 'Driver'){
        next();
    }else{
        return res.status(403).json({status:false,message:"You are not allowed to do that"})
    }
};


module.exports ={
    verifyToken,verifyTokenAndAuthorization,verifyVendor,verifyAdmin,verifyDriver
}