// The controller is the person who takes the request, figures out what to do, talks to
//the database or other parts, and then sends back a response.
import { sendWelcomeEmail } from "../helpers/email.js";
import validator from "email-validator";
import {hashPassword, comparePassword} from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken';
export const api = (req,res) => {
    // res.json({ user: req.user });
    res.send(`The current time is ${new Date().toLocaleTimeString()}`);
} 

export const login = async (req, res) =>{
    //Email and password of user
    // res.json({...req.body, message: "Login success"});
    const { email, password } = req.body;

    //validating email
    if(!validator.validate(email)){
        return res.json({error: "A valid email is required"});
    }
    if(!email?.trim()){
        return res.json({error: "Email is required"});
    }
    if(!password?.trim()){
        return res.json({error: "Password is required"});
    }
    if(password?.length < 6){
        return res.json({error: "Password must be at least 6 characters long"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            try{
                await sendWelcomeEmail(email);
                const createdUser = await User.create({
                    email, password: await hashPassword(password), 
                    username: nanoid(6),
                });
                const token = jwt.sign(
                    {_id: createdUser._id},
                     process.env.JWT_SECRET,
                    {expiresIn: "7d"});
                createdUser.password = undefined;
                res.json({
                    token,
                    user: createdUser,
                });
            }catch (err) {
                console.error("User creation error:", err);
                return res.json({ error: "User creation failed. Check email or try again." });
            }
        }
        else{
            // compare password then login
            const match = await comparePassword(password, user.password);
            
            if(!match){
                return res.json({
                    error: "Wrong password",
                });
            }
            const token = jwt.sign(
                {_id: user._id},
                 process.env.JWT_SECRET,
                {expiresIn: "7d"});
            user.password = undefined;

            res.json({
                token,
                user,
            });
        }
    }
    catch(err){
        console.log("Login error", err);
        res.json({
            error: "Something went wrong. Try again",
        });
    }
    // if (!email) {
    //  return res.status(400).json({ message: "Email is required" });
    // }

    // try {
    //  await sendWelcomeEmail(email, name || "User");
    //  return res.json({ message: `Welcome email sent to ${email}` });
    // } catch (error) {
    //  console.error("Error sending email:", error);
    //  res.status(500).json({ message: "Email sending failed" });
    // }
};
export const forgotPassword = async (req,res) => {
    try{
        const {email} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return res.json({
                error:"If we find your account, you will receive an email from us shortly",
            })
        }
        const password = nanoid(6);
        user.password = await hashPassword(password);
        await user.save();

        try{
            await sendResetEmail(email, newPassword);
            return res.json({ success: 'Password reset email sent' });
        }catch(err){
            console.log("Error sending password reset email => ", err);
            return res.json({
                error:
                "If we find your account, you will receive an email from us shortly",
            });
        }
    }
    catch(err){
        console.log("Forgot password error", err);
        res.json({
            error: "Something went wrong. Try again.",
        });
    }
}

export const currentUser = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        user.password = undefined;
        res.jon({ user });
    }catch(err){
        console.log("Current user error", err);
        res.json({
            error: "Something went wrong. Try again.",
        });
    }
};

export const updatePassword = async (req, res) => {
    try{
        let {password} = req.body;
        //trim password
        password = password ? password.trim() : "";
        if(!password){
            return res.json({error: "Password is required"});
        }
        if(password.length < 6){
            return res.json({error: "Password must be at least 6 characters long"});
        }

        const user = await User.findById(req.user._id);
        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        user.save();

        res.json({ok: true});
    }catch(err){
        console.log("Update password error", err);
        res.json({
            error: "Something went wrong. Try again.",
        });
    }
}

export const updateUsername = async (req, res) =>{
    try{
        const {username} = req.body;
        if(!username || !username.trim()){
            return res.json({ error: "Username is required"});
        }

        const trimmedUsername = username.trim();

        const existingUser = await User.findOne({ username: trimmedUsername});
        if(existingUser){
            return res.json({
                error:"Username is already taken. Try another one",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            username: trimmedUsername,
        }, {new: true});

        updatedUser.password = undefined;
        res.json(updatedUser);
    }catch(err){
        console.log(err);
        res.json({
            error:"Username is already taken. Try another one",
        })
    }
}