// The controller is the person who takes the request, figures out what to do, talks to
//the database or other parts, and then sends back a response.
import { sendWelcomeEmail } from "../helpers/email.js";
import validator from "email-validator";
import {hashPassword, comparePassword} from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import jwt from 'jsonwebtoken';
export const api = (req,res) => {
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
