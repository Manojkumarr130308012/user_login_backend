const router = require('express').Router();
const userController = require('../controller/user');


router.post('/register', async (req, res) => {
    res.send(await userController.register(req.body));
});


router.post('/login', async (req, res) => {
    let userLogin = await userController.login(req.body);
    if(userLogin.message == 'Wrong Password'){
        res.status(400).json({ status: false, message: "Wrong Password" });
    }else if(userLogin.message == 'User not found'){
        res.status(401).json({ status: false, message: "User not found" });
    }else{
        res.send(userLogin);
    }  
});

module.exports = router;