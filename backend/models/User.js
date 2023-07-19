const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10 ;
const jwt = require('jsonwebtoken');
//111

const userSchema = mongoose.Schema({
name: { type : String,
    maxlength: 50
}
,
email: {
    type :String,
    trim :true,
    unique: 1
},
password:{
    type: String,
    minlength :5
},
lastname:{
    type:String,
    maxlength:50

},
role:{
    type: Number,
    default:0
},
image:String,
token:{
    type:String
},
tokenExp:{
    type:Number
}
}) 

userSchema.pre('save',function(next){
  let user = this; 
  if(user.isModified('password')){

  
    bcrypt.genSalt(saltRounds, function(err,salt){
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function(err,hash){

        if(err) return next(err)
        user.password = hash
 
        next() })
     })}
    else next()
})

userSchema.methods.comparePassword = function (plainPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) {
          return reject(err);
        }
        resolve(isMatch);
      });
    });
  };

  userSchema.methods.generateToken = function () {
    let user = this;
    let token = jwt.sign(user._id.toString(), "secretToken");
    user.token = token;
    return user.save().then((user) => user);
  };
  
  userSchema.statics.findByToken =async function(token){
    
    const user = this;
    try{ const decoded = jwt.verify(token, "secretToken");

       return founduser = await  user.findOne({"_id": decoded,"token":token})

        }catch(err){
            throw(err); }
  };

const User = mongoose.model('user',userSchema)
module.exports={User}