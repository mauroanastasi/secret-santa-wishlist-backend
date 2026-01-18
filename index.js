import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wishlistRoutes from './routes/wishlistRoutes.js';
import giftRoutes from './routes/giftRoutes.js';
import errorHandler from './middleware/errorHandler.js';


dotenv.config();


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


// Routes
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/gifts', giftRoutes);


// Error handler
app.use(errorHandler);


// Solo per sviluppo locale
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Frontend allowed from: ${process.env.FE_APP}`);
    });
}


// Esporta per Vercel
export default app;
