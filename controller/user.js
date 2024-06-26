const user = require('./../model/user');
const userSchema = require('./../model/user');
const errorHandler = require('./../utils/error.handler');
require('dotenv').config();
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');


class UserController {

  
    async register(newGender){
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

            if(!emailRegex.test(newGender.email)){
                return {
                    status:false,
                    message :"Email is not Valid"
                }
            }

            const minPasswordLength =  4 ;

            if(newGender.password < minPasswordLength){
                return {
                    status:false,
                    message :"Password should be at least " + minPasswordLength +" characters long"
                }
            }
        try{

            const emailExist = await userSchema.findOne({email:newGender.email});
            if(emailExist){
                return {
                    status:false,
                    message :"Email already exists"
                }
            }
            const newUser = new user({
                email : newGender.email,
                password : CryptoJS.AES.encrypt(newGender.password,process.env.SECRET).toString(),
            })
            let createUser = await newUser.save();

            let response = await userSchema.find({_id: createUser._id});

            return { status: "success",   msg:"data Created successfully", result: response };

        } catch(err){
            return {
				status: false,
				message: errorHandler.parseMongoError(err)
			};
        }
    }


    async login(responce){
         const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

            if(!emailRegex.test(responce.email)){
                return {
                    status:false,
                    message :"Email is not Valid"
                }
            }

            const minPasswordLength =  4 ;

            if(responce.password < minPasswordLength){
                return {
                    status:false,
                    message :"Password should be at least " + minPasswordLength +" characters long"
                }
            }

        try{
            let user = await userSchema.findOne({
                email: responce.email
            });

            if(!user){
                return {
                    status:false,
                    message :"User not found"
                }
            }

            const decryptpassword = CryptoJS.AES.decrypt(user.password,process.env.SECRET);
            const depassword =  decryptpassword.toString(CryptoJS.enc.Utf8);

            if(depassword !==  responce.password){
                return {
                    status:false,
                    message :"Wrong Password"
                }
            }

            const userToken = jwt.sign({id:user._id,userType:user.userType,email:user.email},process.env.JWT_SECRET,{expiresIn:"21d"});

            const {password,otp,createdAt,updatedAt,__v,...others} =  user._doc;

            return {
                status: "1",
                msg: "Login Sucessfully",
                ...others,
                userToken
            };

        } catch(error){
            return {
				status: false,
				message: errorHandler.parseMongoError(error)
			};
        }
    }

	

    async login1(username,password){
       
        try{
            let user = await userSchema.findOne({
                username: username,
                password: password,
            });

            if(!user){
                throw new Error('invalid creds');
            }

            return {
                status: "1",
                msg: "Login Sucessfully",
                user
            };

        } catch(error){
            return {
                status: '0',
                msg: 'username or password invalid'
            }
        }
    }



    async add(user){
		try{
			let addResponse = await userSchema.create(user);
            let response = await userSchema.find({_id: addResponse._id});
            return { status: "success",   msg:"data Created successfully", result: response };
		} catch(error){
            return {
				status: false,
				message: errorHandler.parseMongoError(error)
			};
		}
	}
	
	async fetch(body){
		try{
			let response = await userSchema.find({});
			let count=Object.keys(response).length;
            return { status: "success",   msg:"data get successfully", result: response };
		} catch(error){
            return {
				status: false,
				message: errorHandler.parseMongoError(error)
			};
		}
	}
   

	async fetchdata(id){
		try{
			let response = await userSchema.find({_id:id});
			return response;	
		} catch(error){
            return {
				status: false,
				message: errorHandler.parseMongoError(error)
			};
		}
	}

	async delete(id){
		try{
			let response = await userSchema.deleteOne({_id: id});
            return { status: "success",   msg:"data Deleted successfully", result: response };
		} catch(error){
            return {
				status: false,
				message: errorHandler.parseMongoError(error)
			};
		}
	}

	async update(id, body) {
        try {
            let updateRes = await userSchema.update({_id: id}, body);
            let response = await userSchema.find({_id: id});
            return { status: "success",   msg:"data Updated successfully", result: response };
        } catch (error) {
            return {
				status: false,
				message: errorHandler.parseMongoError(error)
			};
        }

    }

	
}

       

module.exports=new UserController();