import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";


export const test = (req,res) => {
    res.json({
        message: 'hello wassup',
    });
};

export const updateUser = async (req, res, next) => {
    ///////
//    console.log('update user id:', req.params.id);
    //  console.log('update params:', req.params)

        /////

    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"));
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, {new: true})

        const {password, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
        

    } catch (error) {
        next (error)
        
    }
};


export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only edit your own account!' )) 
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({ userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }else{
        return next(errorHandler(401, 'You can only view your own listings!' ));
    }
}



export const getUserById = async (req, res, next) => {
  try {
    console.log('user id:', req.params.id);
    const userId = req.params.id;

    // Use findById method to find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      // If user is not found, return 404 status with error message
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If user is found, remove password field and send user data in response
    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    // If any error occurs, pass it to the error handling middleware
    next(error);
  }
};

  
      


export const getUserListingsById = async (req, res, next) => {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  