import express from 'express';
import {
    createWishlist,
    getWishlistBySecretLink,
    publishWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// Rotte specifiche PRIMA delle generiche
// Ottieni wishlist tramite link segreto (pubblico)
router.get('/public/:secret_link', getWishlistBySecretLink);

// Crea nuova wishlist
router.post('/', createWishlist);

// Pubblica wishlist
router.patch('/:id/publish', publishWishlist);

export default router;
