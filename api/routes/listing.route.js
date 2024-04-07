import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, getListingWithUser, updateRentedField, updateRentedFieldFalse } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

 const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.get('/get-with-user/:id', getListingWithUser);
router.put('/update/rented/:id', verifyToken, updateRentedField);
router.put('/update/rentedFalse/:id', verifyToken, updateRentedFieldFalse);


export default router;