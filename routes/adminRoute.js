const express = require('express');
const route = express();
const admin = require('../controllers/adminController')
const bodyParser = require('body-parser');
const session = require('express-session');

route.use(bodyParser.urlencoded({ extended: true }));
route.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});
route.use(session({
    secret:"admin-secret",
    resave:false,
    saveUninitialized:false
}))

function adminLogged(req,res,next){
    if(req.session.auth){
        next();
    }else{
        res.redirect('/')
    }
}

route.get('/logout',admin.adminExit)

route.get('/',(req,res)=>{
    if(req.session.auth){
        res.redirect(`/admin/adminPanel/${req.session.adminName}`)
    }else{
        const emptyName = req.query.message
        const emptyPass = req.query.noPass
        const wrongName = req.query.invalidName
        const wrongPass = req.query.wrongPass
        res.render('adminLogin.ejs',{emptyName,wrongName,wrongPass,emptyPass});
    }
})

route.post('/',admin.authAdmin)

route.get('/adminPanel/:adminName',adminLogged,async (req,res)=>{
    const allUsers = await admin.showUsers();
    res.render('adminPanel.ejs',{name:req.params.adminName,allUsers});
})

route.post('/adminPanel/:adminName',admin.searchedUser)

// route.post('/adminPanel/:adminName',adminLogged,async (req,res)=>{
//     const allUsers = await admin.searchedUser();
//     console.log(allUsers);
//     res.render('adminPanel.ejs',{allUsers,name:req.params.adminName})
// })

route.post('/removeUser',admin.deleteUser);

route.get('/updateUser',(req,res)=>{
    const oldName = req.query.username;
    res.render('updateUser.ejs',{oldName})
})

route.post('/updateUser',admin.editUser);

route.get('/navigateAwayFromAdminPanel', (req, res) => {
    res.redirect('/admin');
});

route.get('/error',(req,res)=>{
    const errorMessage = req.query.message
    res.render('error.ejs',{errorMessage})
})

module.exports = route;