  import express from 'express';
  import mongoose from 'mongoose';
  import dotenv from 'dotenv';
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';
  import userRoute from './routes/user.mjs';
  import authRoute from './routes/auth.mjs';
  import productRoute from './routes/product.mjs';
  import cartRoute from './routes/cart.mjs';
  import orderRoute from './routes/order.mjs';
  import verifyAuthRoute from './routes/verifyAuth.mjs';
  import path from 'path';
  import cors from 'cors';
  import { MercadoPagoConfig, Preference } from 'mercadopago';
  import bodyParser from 'body-parser';

  dotenv.config();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const port = process.env.PORT || 8000;

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DBConnection Successfull!'))
    .catch((err) => {
      console.log(err);
    });

  const app = express();

  app.use(cors({}));
  app.use(bodyParser.json());


  const corsOptions = {
    origin: 'https://ecoomerce-api-v7wq.onrender.com/',
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  app.set('views', path.join(__dirname, 'CIENFUEGOS2'));
  app.set('view engine', 'ejs');

  app.use('/api/auth', authRoute);
  app.use('/api/users', userRoute);
  app.use('/api/products', productRoute);
  app.use('/api/carts', cartRoute);
  app.use('/api/orders', orderRoute);
  app.use('/api/auth', verifyAuthRoute);

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/shop', (req, res) => {
    res.render('shop');
  });

  app.get('/cart', (req, res) => {
    res.render('cart');
  });

  app.get('/registro', (req, res) => {
    res.render('registro');
  });

  app.get('/Acceder', (req, res) => {
    res.render('Acceder');
  });

  app.get('/Mi-Cuenta', (req, res) => {
    res.render('Mi-Cuenta');
  });

  app.get('/pago-denegado', (req, res) => {
    res.render('pago-denegado');
  });

  app.get('/pago-confirmado', (req, res) => {
    res.render('pago-confirmado');
  });

  app.get('/pago-pendiente', (req, res) => {
    res.render('pago-pendiente');
  });

  app.use(express.static(path.join(__dirname, 'CIENFUEGOS2')));

  app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  });


  const client = new MercadoPagoConfig({ accessToken: 'TEST-2227087115833139-050214-7d52f2a73126e6c23299d31e4ff7c366-1796258286' });

  app.post("/create_preference", async (req, res) => {
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];
        console.log("Idempotency Key:", idempotencyKey);

        const orderData = {
            title: req.body.items[0].nombre,
            price: req.body.items[0].precio,
            quantity: req.body.items[0].cantidad,
        };
        

        const body = {
            items: [{
                title: orderData.title,
                unit_price: Number(orderData.price),
                quantity: Number(orderData.quantity),
                currency_id: "ARS",
            }],
            back_urls: {
                success: "http://www.google.com",
                failure: "http://www.google.com",
                pending: "http://www.google.com",
            },
            auto_return: "approved",
            notification_url: "https://localhost:5000/webhook", //cambiar luego
        };

        const preference = new Preference(client);
        const result = await preference.create({ body, idempotencyKey });
        console.log("Preferencia creada:", result);
        
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        });
    }
});


  app.listen(process.env.PORT || 8000, () => {
    console.log('Backend server is running!');
  });

