import pool from '../config/db.js';

// Crea un nuovo regalo
export const createGift = async (req, res, next) => {
    try {
        const { wishlist_id, gift_name, image_url, link, price, priority_gift, notes } = req.body;

        if (!wishlist_id || !gift_name || !image_url || !link || !price || !priority_gift) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        if (priority_gift < 1 || priority_gift > 5) {
            return res.status(400).json({ error: 'Priority must be between 1 and 5' });
        }

        const [wishlistCheck] = await pool.query(
            'SELECT is_published FROM wishlists WHERE id = ?',
            [wishlist_id]
        );

        if (wishlistCheck.length === 0) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        if (wishlistCheck[0].is_published) {
            return res.status(403).json({ error: 'Cannot add gifts to published wishlist' });
        }

        const [result] = await pool.query(
            'INSERT INTO gifts (wishlist_id, gift_name, image_url, link, price, priority_gift, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [wishlist_id, gift_name, image_url, link, price, priority_gift, notes]
        );

        const [gift] = await pool.query(
            'SELECT * FROM gifts WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(gift[0]);
    } catch (error) {
        next(error);
    }
};

// Modifica un regalo esistente
export const updateGift = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { gift_name, image_url, link, price, priority_gift, notes } = req.body;

        if (!gift_name || !image_url || !link || !price || !priority_gift) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        if (priority_gift < 1 || priority_gift > 5) {
            return res.status(400).json({ error: 'Priority must be between 1 and 5' });
        }

        const [giftCheck] = await pool.query(
            'SELECT g.*, w.is_published FROM gifts g JOIN wishlists w ON g.wishlist_id = w.id WHERE g.id = ?',
            [id]
        );

        if (giftCheck.length === 0) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        if (giftCheck[0].is_published) {
            return res.status(403).json({ error: 'Cannot update gifts in published wishlist' });
        }

        await pool.query(
            'UPDATE gifts SET gift_name = ?, image_url = ?, link = ?, price = ?, priority_gift = ?, notes = ? WHERE id = ?',
            [gift_name, image_url, link, price, priority_gift, notes, id]
        );

        const [gift] = await pool.query(
            'SELECT * FROM gifts WHERE id = ?',
            [id]
        );

        res.json(gift[0]);
    } catch (error) {
        next(error);
    }
};

// Elimina un regalo
export const deleteGift = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [giftCheck] = await pool.query(
            'SELECT g.*, w.is_published FROM gifts g JOIN wishlists w ON g.wishlist_id = w.id WHERE g.id = ?',
            [id]
        );

        if (giftCheck.length === 0) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        if (giftCheck[0].is_published) {
            return res.status(403).json({ error: 'Cannot delete gifts from published wishlist' });
        }

        await pool.query('DELETE FROM gifts WHERE id = ?', [id]);

        res.json({ message: 'Gift deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Prenota un regalo (solo su wishlist pubblicata)
export const reserveGift = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reservation_message } = req.body;

        const [result] = await pool.query(
            'UPDATE gifts SET is_reserved = TRUE, reservation_message = ? WHERE id = ? AND is_reserved = FALSE',
            [reservation_message || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Gift not found or already reserved' });
        }

        const [gift] = await pool.query(
            'SELECT * FROM gifts WHERE id = ?',
            [id]
        );

        res.json(gift[0]);
    } catch (error) {
        next(error);
    }
};
