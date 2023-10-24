const user = require('../models/userModel')
const bcrypt = require('bcrypt')

const addUser = async(req,res)=>{
    const nameExists = await user.findOne({username:req.body.username}); 
    try{
        if(nameExists){
            res.redirect('/signup?message=user name already exists!');
        }else{
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            const newUser = new user({
                username:req.body.username,
                password:hashedPassword,
            })
            await newUser.save();
            res.redirect('/');
        }
    }catch(e){
        console.log(e.message);
        res.redirect('/error?message= something went wrong while signing up');
    }
}

const checkInUser  = async (req,res)=>{
    try {
        if(req.body.username){
            const checkUsername = await user.findOne({username: req.body.username});
            if(checkUsername){
                const checkPassword = await bcrypt.compare(req.body.password,checkUsername.password)
                if(checkPassword){
                    req.session.authenticated = true;
                    req.session.username = checkUsername.username;
                    res.redirect(`/userPanel/${req.body.username}`);
                }else{
                 res.redirect('/?errPassword= invalid password');
            }
            }else{
                res.redirect('/?errUsername= invalid username');
            }
        }else{
            res.redirect('/?emptyName= empty username');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/error?message=oops something went wrong while logging in');
    }
}

const checkoutUser = async (req,res)=>{
    await req.session.destroy();
    res.redirect('/');
}


module.exports = {
    addUser,
    checkInUser,
    checkoutUser
}


