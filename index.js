import express from 'express';
import cors from 'cors';
import wishlistRoutes from './routes/wishlistRoutes.js';
import giftRoutes from './routes/giftRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configurazione CORS
const corsOptions = {
    origin: process.env.FE_APP || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint (root)
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend is running',
        environment: process.env.NODE_ENV || 'development'
    });
});

// API base endpoint (per test frontend)
app.get('/api', (req, res) => {
    res.json({
        message: 'Secret Santa Wishlist API',
        version: '1.0.0'
    });
});

// Routes
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/gifts', giftRoutes);

// Error handler (deve essere DOPO tutte le routes)
app.use(errorHandler);

// Avvia il server SOLO in development locale
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Frontend allowed from: ${process.env.FE_APP}`);
    });
}

// Esporto per Vercel
export default app;