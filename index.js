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
  import debug from 'debug';
  import bodyParser from 'body-parser';
  import fetch from 'node-fetch';

  dotenv.config();

  const appDebug = debug('app');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const port = process.env.PORT || 8000;
  const corsOptions = {
    origin: 'https://ecoomerce-api-v7wq.onrender.com/',
    optionsSuccessStatus: 200,
  };

  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DBConnection Successfull!'))
    .catch((err) => {
      console.log(err);
    });

  const app = express();
  app.use(cors({}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

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

  app.get('/about', (req, res) => {
    res.render('about');
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

  app.get('/Ordenes', (req, res) => {
    res.render('Ordenes');
  });

  app.use(express.static(path.join(__dirname, 'CIENFUEGOS2')));

  app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  });


  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  

  app.post('/create_preference', async (req, res) => {
    try {
      const idempotencyKey = req.headers['x-idempotency-key'];
      console.log('Idempotency Key:', idempotencyKey);
  
      const orderDataList = req.body;
      console.log('Datos recibidos del frontend:', orderDataList);
  
      const items = orderDataList.map(orderData => ({
        title: orderData.title,
        unit_price: Number(orderData.price),
        quantity: Number(orderData.quantity),
        currency_id: 'ARS',
      }));
  
      const preferenceData = {
        items: items,
        back_urls: {
          success: 'https://ecoomerce-api-v7wq.onrender.com/pago-confirmado',
          failure: 'https://ecoomerce-api-v7wq.onrender.com/pago-denegado',
          pending: 'https://ecoomerce-api-v7wq.onrender.com/pago-pendiente',
        },
        auto_return: 'approved',
        notification_url: 'https://ecoomerce-api-v7wq.onrender.com/webhook',
      };
  
      const preference = new Preference(client);
      const result = await preference.create({ body: preferenceData, idempotencyKey });
      console.log('Preferencia creada:', result);
  
      res.json({
        id: result.id,
      });
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
      res.status(500).json({
        error: 'Error al crear la preferencia :(',
      });
    }
  });


  //WEBHOOK//
  
  app.post('/webhook', async (req, res) => {
    try {
      const body = req.body;
      console.log('Datos recibidos en el webhook:', body);
  
      // Verificar la estructura de los datos recibidos
      if (!body || !body.resource || !body.topic) {
        console.error('Datos incompletos en la solicitud webhook.');
        return res.status(400).json({ error: 'Datos incompletos en la solicitud webhook.' });
      }
  
      const resourceUrl = body.resource;
      console.log('URL del recurso recibido:', resourceUrl);
  
      // Extraer el merchant_order_id del resourceUrl
      const regex = /merchant_orders\/(\d+)/;
      const match = resourceUrl.match(regex);
      if (!match || match.length < 2) {
        console.error('No se pudo extraer el merchant_order_id del resource.');
        return res.status(400).json({ error: 'Error en la URL del resource.' });
      }
      const merchantOrderId = match[1];
      console.log('ID del merchant_order recibido en el webhook:', merchantOrderId);
  
      // Obtener los detalles del merchant_order desde MercadoPago
      const response = await fetch(`https://api.mercadolibre.com/merchant_orders/${merchantOrderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      });
  
      if (!response.ok) {
        console.error('Error al obtener datos del merchant_order desde MercadoPago:', response.statusText);
        return res.status(500).json({ error: 'Error al obtener datos del merchant_order desde MercadoPago.' });
      }
  
      const data = await response.json();
      console.log('Datos del merchant_order recibidos:', data);
  
      // Procesar los datos del merchant_order para crear una orden en tu sistema (ajusta esto según tu lógica)
      const orderData = {
        userId: data.payer && data.payer.id ? data.payer.id : 'unknown_user',
        products: data.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        amount: data.total_amount,
        address: data.shipments[0].receiver_address || 'undefined',
        status: 'paid', // Aquí puedes ajustar el estado de la orden según los datos recibidos
        delivered: false,
      };
  
      // Guardar la orden en MongoDB (ajusta esto según tu esquema de datos)
      const orderCreationResponse = await fetch('https://ecoomerce-api-v7wq.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (orderCreationResponse.ok) {
        const orderCreationResult = await orderCreationResponse.json();
        console.log('Orden creada exitosamente:', orderCreationResult);
        res.sendStatus(200);
      } else {
        const errorText = await orderCreationResponse.text();
        console.error('Error al crear la orden:', errorText);
        res.status(500).json({ error: 'Error al crear la orden.' });
      }
    } catch (error) {
      console.error('Error en el webhook:', error);
      res.sendStatus(500);
    }
  });
  
  



  app.listen(process.env.PORT || 8000, () => {
    console.log('Backend server is running!');
  });

  