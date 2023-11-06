const express = require('express');
const session = require('express-session');

const route = express()
const bodyParser = require('body-parser');
const user = require("../controllers/userController")

route.use(bodyParser.json());
route.use(bodyParser.urlencoded({extended:true}));

route.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

route.use(session({
    secret:'idk',
    resave:false,
    saveUninitialized:false
}))

function signedIn(req,res,next){
    if(req.session.authenticated){
        next();
    }else{
        res.redirect('/')
    }
}

route.get('/signOut',user.checkoutUser);

route.get('/',(req,res)=>{
    if(req.session.authenticated){
        res.redirect(`userPanel/${req.session.username}`)
    }else if(req.session.auth){
        res.redirect(`/admin/adminPanel/${req.session.adminName}`)
    }else{
        const errUsername = req.query.errUsername
        const errPassword = req.query.errPassword
        const empty = req.query.emptyName
        res.render('login.ejs',{errUsername, errPassword, empty});
    }
});

route.post('/',user.checkInUser)

route.get('/signup',(req,res)=>{
    if(req.session.authenticated){
        res.redirect(`userPanel/${req.session.username}`)
    }else{
        const message = req.query.message;
        res.render('signup.ejs',{message})
    }
})

route.post('/signup',user.addUser)

route.get('/userPanel/:username',signedIn,(req,res)=>{
   res.render('userPanel.ejs',{welcomeUser: req.params.username})
})

route.get('/navigateAwayFromUserPanel', (req, res) => {
    res.redirect('/');
});

route.get('/error',(req,res)=>{
    const message = req.query.errorMessage;
    res.render('error.ejs',{errorMessage : message});
})

route.get('**',(req,res)=>{
    res.status(400).render('error.ejs',{errorMessage:"oops invalid request"})
})





module.exports = route;