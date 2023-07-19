const {User} = require("../models/User");

const auth = async (req,res,next) =>{
    console.log("1")
    try{
    let token = req.cookies.x_auth;
    console.log("2")
    if (!token) {
        return res.send("로그인 되지않은 상태입니다");
      }
      console.log("3")
    const user = await User.findByToken(token);
    
    if(!user) return res.json({isAuth:false, error: true});
    req.token= token;
    req.user= user;
    console.log("4")
    next();
}catch(err){ throw(err);
}}

module.exports = {auth}; 