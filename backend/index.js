require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const {User} = require('./models/User'); 
const config = require('./config/key' );
const cookieParser = require('cookie-parser');
const {auth} =require('./middleware/auth'); 
const mongoose = require('mongoose') ;
mongoose.connect (config.mongoURI)
    .then(()=>console.log('mongodb connceted'))
    .catch(err=>console.log(err))

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

  app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000'); // frontend의 도메인 및 포트
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   next();
 });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);
  
    user.save()
      .then((userInfo) => {
        return res.status(200).json({ success: true });
      })
      .catch((err) => {
        return res.json({ success: false, err });
      });
  });

  app.post('/api/users/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
    
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다.",
        });
      }
      console.log(req.body.password);
      const isMatch = await user.comparePassword(req.body.password);
    
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
    
      const generatedUser = await user.generateToken();
    
      res.cookie("x_auth", generatedUser.token)
        .status(200)
        .json({
          loginSuccess: true,
          userId: generatedUser._id,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        loginSuccess: false,
        message: "로그인 중 오류가 발생했습니다.",
      });
    }
  });

  app.get('/api/users/auth',auth, (req,res)=>{
        res.status(200).json({
            _id: req.user._id,
            isAdmin: req.user.role === 0 ? false : true ,
            isAuth : true,
            email : req.user.email,
            name : req.user.name,
            lastname : req.user.lastname,
            role : req.user.role,
            image: req.user.image
        })
  })

app.get('/api/users/logout',auth,async (req,res) =>{
try{await User.findOneAndUpdate({_id: req.user._id}, {token:""})
    
    res.status(200).send({success:true})   }
catch(err){
    res.json({success:false , err})
}


})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})