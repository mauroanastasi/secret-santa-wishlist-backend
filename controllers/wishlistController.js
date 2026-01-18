import pool from '../data/db.js';
import { v4 as uuidv4 } from 'uuid';

// Creo nuova wishlist
export const createWishlist = async (req, res, next) => {
    try {
        const { owner_name, title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await pool.query(
            'INSERT INTO wishlists (owner_name, title) VALUES (?, ?)',
            [owner_name || null, title]
        );

        const [wishlist] = await pool.query(
            'SELECT * FROM wishlists WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(wishlist[0]);
    } catch (error) {
        next(error);
    }
};

// Pubblico wishlist, genero link segreto
export const publishWishlist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const secretLink = uuidv4();

        const [result] = await pool.query(
            'UPDATE wishlists SET is_published = TRUE, secret_link = ? WHERE id = ? AND is_published = FALSE',
            [secretLink, id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Wishlist not found or already published' });
        }

        const [wishlist] = await pool.query(
            'SELECT * FROM wishlists WHERE id = ?',
            [id]
        );

        res.json(wishlist[0]);
    } catch (error) {
        next(error);
    }
};

// Accesso pubblico a wishlist con link segreto
export const getWishlistBySecretLink = async (req, res, next) => {
    try {
        const { secret_link } = req.params;

        const [wishlist] = await pool.query(
            'SELECT * FROM wishlists WHERE secret_link = ? AND is_published = TRUE',
            [secret_link]
        );

        if (wishlist.length === 0) {
            return res.status(404).json({ error: 'Wishlist not found or not published' });
        }

        const [gifts] = await pool.query(
            'SELECT id, gift_name, image_url, link, price, priority_gift, notes, is_reserved, reservation_message FROM gifts WHERE wishlist_id = ? ORDER BY priority_gift DESC',
            [wishlist[0].id]
        );

        res.json({
            wishlist: wishlist[0],
            gifts: gifts
        });
    } catch (error) {
        next(error);
    }
};