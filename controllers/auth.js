// The controller is the person who takes the request, figures out what to do, talks to
//the database or other parts, and then sends back a response.
import { sendWelcomeEmail } from "../helpers/email.js";
export const api = (req,res) => {
    res.send(`The current time is ${new Date().toLocaleTimeString()}`);
} 

export const login = async (req, res) =>{
    //Email and password of user
    // res.json({...req.body, message: "Login success"});
    const { email, name } = req.body;

    if (!email) {
     return res.status(400).json({ message: "Email is required" });
    }

    try {
     await sendWelcomeEmail(email, name || "User");
     return res.json({ message: `Welcome email sent to ${email}` });
    } catch (error) {
     console.error("Error sending email:", error);
     res.status(500).json({ message: "Email sending failed" });
    }
}
