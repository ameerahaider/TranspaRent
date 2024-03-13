import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
let currentIndex = 0;


export const signup = async (req,res, next) => {
    const { username, email, password } = req.body;
    const hashedPass = bcryptjs.hashSync(password, 10);
//    const newUser = new User ({ username, email, password: hashedPass});
    const newUser = new User ({ username, email, password: hashedPass, index: currentIndex});
    try {
        await newUser.save()
        res.status(201).json("User created successfully");  
        currentIndex++;
    } catch (error) {
        next(errorHandler(550, 'error from function'));
    }
      
};



export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!' ));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    } catch (error) {
        next (error)
    }
}