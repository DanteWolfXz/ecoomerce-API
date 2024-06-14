import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import userRoute from './routes/user.mjs';
import authRoute from './routes/auth.mjs';
import productRoute from './routes/product.mjs';
import cartRoute from './routes/cart.mjs';
import orderRoute from './routes/order.mjs';
import verifyAuthRoute from './routes/verifyAuth.mjs';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import debug from 'debug';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { obtenerUserIdDesdeToken } from './routes/verifyToken.mjs';

dotenv.config();

const appDebug = debug('app');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: 'https://ecoomerce-api-v7wq.onrender.com',
  optionsSuccessStatus: 200,
};

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DBConnection Successfull!'))
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', join(__dirname, 'CIENFUEGOS2'));
app.set('view engine', 'ejs');

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/auth', verifyAuthRoute);

const staticDir = join(__dirname, 'CIENFUEGOS2');
app.use(express.static(staticDir));

const views = ['index', 'shop', 'cart', 'about', 'registro', 'Acceder', 'Mi-Cuenta', 'pago-denegado', 'pago-confirmado', 'pago-pendiente', 'Ordenes'];

views.forEach(view => {
  app.get(`/${view === 'index' ? '' : view}`, (req, res) => {
    res.render(view);
  });
});

app.get('/products/:id', (req, res) => {
  res.json({ msg: 'This is CORS-enabled for all origins!' });
});

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preferences = {};
const userTokens = {};

app.post('/create_preference', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'];
    const orderDataList = req.body;
    const userIdObject = orderDataList.find(item => item.userId);
    const userId = userIdObject ? userIdObject.userId : 'unknown_user';
    const userAccessTokenObject = orderDataList.find(item => item.userAccessToken);
    const userAccessToken = userAccessTokenObject ? userAccessTokenObject.userAccessToken : null;

    if (!userAccessToken) {
      console.error('Error: No se pudo obtener el accessToken del usuario');
      return res.status(400).json({ error: 'No se pudo obtener el accessToken del usuario' });
    }

    const items = orderDataList.filter(item => !item.userId && !item.userAccessToken).map(orderData => ({
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

    preferences[result.id] = { userId, userAccessToken };

    res.json({
      id: result.id,
      init_point: result.init_point,
      userId: userId,
    });
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    res.status(500).json({ error: 'Error al crear la preferencia :(' });
  }
});

const createOrder = async (orderData, userAccessToken) => {
  try {
    console.log('Creating order with data:', orderData);
    const response = await fetch('https://ecoomerce-api-v7wq.onrender.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userAccessToken}`
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating order:', errorText);
      throw new Error('Error creating order');
    }

    const createdOrder = await response.json();
    console.log('Order created successfully in the database:', createdOrder);
    return createdOrder;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

app.post('/webhook', async (req, res) => {
  try {
      const { resource, topic } = req.body;

      if (topic === 'merchant_order') {
          // Fetch the merchant order details
          const response = await axios.get(resource);
          const merchantOrder = response.data;

          // Process the merchant order data
          if (merchantOrder.order_status === 'paid') {
              // Create order logic here
              const order = {
                  id: merchantOrder.id,
                  status: merchantOrder.status,
                  total_amount: merchantOrder.total_amount,
                  items: merchantOrder.items.map(item => ({
                      title: item.title,
                      quantity: item.quantity,
                      unit_price: item.unit_price,
                  })),
                  payment: merchantOrder.payments.map(payment => ({
                      id: payment.id,
                      transaction_amount: payment.transaction_amount,
                      status: payment.status,
                      date_approved: payment.date_approved,
                  })),
              };

              // You can save this order to your database or perform other actions as needed
              console.log('Order created:', order);
          } else {
              console.log('Order not paid yet:', merchantOrder);
          }

      } else if (topic === 'payment') {
          // Fetch the payment details
          const response = await axios.get(resource);
          const payment = response.data;

          // Handle payment details if necessary
          console.log('Payment received:', payment);

      } else {
          console.log('Unhandled topic:', topic);
      }

      res.status(200).send('Webhook received and processed successfully.');
  } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).send('Error processing webhook.');
  }
});



app.listen(port, () => {
  console.log(`Backend server is running on port ${port}!`);
});
