import express from 'express';
import {
    createWishlist,
    getWishlistBySecretLink,
    publishWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// Crea nuova wishlist
router.post('/', createWishlist);

// Ottieni wishlist tramite link segreto (pubblico)
router.get('/public/:secret_link', getWishlistBySecretLink);

// Pubblica wishlist
router.patch('/:id/publish', publishWishlist);

export default router;
