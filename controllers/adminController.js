const bcrypt = require('bcrypt');
const admin = require('../models/adminModel');
const user = require('../models/userModel');


const authAdmin = async (req,res)=>{
    try {
        if(req.body.adminName){
            const findAdmin = await admin.findOne({adminName:req.body.adminName})
            if(findAdmin){
                if(req.body.adminPassword){
                    const checkPassword = await bcrypt.compare(req.body.adminPassword,findAdmin.adminPassword)
                    if(checkPassword){
                        req.session.auth = true
                        req.session.adminName = req.body.adminName
                        res.redirect(`/admin/adminPanel/${req.body.adminName}`)
                    }else{
                       res.redirect('/admin?wrongPass= invalid password') 
                    }
                }else{
                    res.redirect('/admin?noPass= enter a password')
                }
            }else{
                res.redirect('/admin?invalidName= invalid name')
            }
        }else{
            res.redirect('/admin?message= please enter a name')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/error?message= something went wrong!')
    }
}

const adminExit = async (req,res)=>{
    await req.session.destroy()
    res.redirect('/admin')
}

const showUsers = async(req,res)=>{
    try {
        const returnUsers = await user.find()
        if(returnUsers){
            return returnUsers 
        }else{
            console.log('could not find')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/error?message = cant retrieve users')
    }
}

const deleteUser = async(req,res)=>{
    console.log(req.body.username)
    try {
        await user.deleteOne({username:req.body.username})
        res.redirect('/admin')
    } catch (error) {
        console.error(error.message)
        res.redirect('/admin/error?message= some error occured')
    }
}

const editUser = async(req,res)=>{
    try {
        const userName = req.body.oldUsername;
        const newName = req.body.newUsername;
        await user.updateOne({username: userName},{$set:{username:newName}});
        res.redirect('/admin')
    } catch (error) {
        res.redirect('/admin/error');
        console.log(error.message)
    }
}

const searchedUser = async(req,res)=>{
    try {
        console.log(req.body.filterUser)
        if(req.body.filterUser){
            const filterUser = req.body.filterUser;
            const regex = new RegExp(`^${filterUser}$`)
            const filteredUser = await user.find({username:{$regex: regex}})
            // return filteredUser;
            res.render('adminPanel.ejs',{allUsers:filteredUser,name:req.session.adminName})
            
       }else{
        res.redirect(`/admin/adminPanel/${req.session.adminName}`)
       } 
    } catch (error) {
        // res.redirect('/admin/error')
        console.log(error.message)
    }
}
module.exports = {
    authAdmin,
    adminExit,
    showUsers,
    deleteUser,
    editUser,
    searchedUser
}

