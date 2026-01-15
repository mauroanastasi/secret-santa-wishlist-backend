import express from 'express';
import {
    createGift,
    updateGift,
    deleteGift,
    reserveGift
} from '../controllers/giftController.js';

const router = express.Router();

// Crea nuovo regalo
router.post('/', createGift);

// Modifica regalo
router.put('/:id', updateGift);

// Elimina regalo
router.delete('/:id', deleteGift);

// Prenota regalo
router.patch('/:id/reserve', reserveGift);

export default router;
