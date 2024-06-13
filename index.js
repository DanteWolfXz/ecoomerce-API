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

app.post('/create_preference', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'];
    const orderDataList = req.body;
    const userIdObject = orderDataList.find(item => item.userId);
    const userId = userIdObject ? userIdObject.userId : 'unknown_user';

    const items = orderDataList.filter(item => !item.userId).map(orderData => ({
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

    preferences[result.id] = userId;

    res.json({
      id: result.id,
      init_point: result.init_point,
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la preferencia :(' });
  }
});

const createOrder = async (orderData) => {
  try {
    console.log('Creating order with data:', orderData);
    const response = await fetch('https://ecoomerce-api-v7wq.onrender.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
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
    console.log('Webhook data received:', JSON.stringify(req.body, null, 2));

    const body = req.body;

    if (body.topic === 'payment' && body.data && body.data.id) {
      const paymentId = body.data.id;
      console.log('Fetching payment details for paymentId:', paymentId);

      const paymentResponse = await fetch(`https://api.mercadolibre.com/collections/notifications/${paymentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'x-meli-user-id': process.env.MERCADOLIBRE_USER_ID
        }
      });

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('Error fetching payment details:', errorText);
        return res.status(500).json({ error: 'Error fetching payment details.' });
      }

      const paymentData = await paymentResponse.json();
      console.log('Payment data received:', paymentData);

      if (paymentData.collection.status === 'approved') {
        const merchantOrderId = paymentData.collection.merchant_order_id;
        console.log('Fetching merchant order details for merchantOrderId:', merchantOrderId);

        const orderResponse = await fetch(`https://api.mercadolibre.com/merchant_orders/${merchantOrderId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'x-meli-user-id': process.env.MERCADOLIBRE_USER_ID
          }
        });

        if (!orderResponse.ok) {
          const errorText = await orderResponse.text();
          console.error('Error fetching merchant order:', errorText);
          return res.status(500).json({ error: 'Error fetching merchant order.' });
        }

        const orderData = await orderResponse.json();
        console.log('Merchant order data received:', orderData);

        const products = orderData.items.map(item => ({
          productName: item.title,
          quantity: item.quantity
        }));

        const preferenceId = orderData.preference_id;
        const userId = preferences[preferenceId];
        console.log('UserId associated with preferenceId:', userId);

        const address = orderData.shipping?.address || {};

        const userAccessToken = process.env.USER_ACCESS_TOKEN;

        if (!userAccessToken) {
          console.error('Error: No se pudo obtener el accessToken del usuario');
          return res.status(500).json({ error: 'No se pudo obtener el accessToken del usuario' });
        }

        const tokenUserId = obtenerUserIdDesdeToken(userAccessToken);
        if (!tokenUserId) {
          console.error('Error: No se pudo obtener el userId del token');
          return res.status(500).json({ error: 'No se pudo obtener el userId del token' });
        }

        const order = {
          userId: userId,
          products: products,
          amount: orderData.total_amount,
          address: address,
          status: 'approved',
          delivered: false
        };

        console.log('Order data to be sent to createOrder:', order);

        const createdOrder = await createOrder(order, userAccessToken);
        console.log('Order created successfully:', createdOrder);
        res.sendStatus(200);
      } else {
        console.log('Payment status not approved:', paymentData.collection.status);
        res.sendStatus(200);
      }
    } else if (body.topic === 'merchant_order' && body.resource) {
      const merchantOrderId = body.resource.split('/').pop();
      console.log('Fetching merchant order details for merchantOrderId:', merchantOrderId);

      const orderResponse = await fetch(`https://api.mercadolibre.com/merchant_orders/${merchantOrderId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'x-meli-user-id': process.env.MERCADOLIBRE_USER_ID
        }
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Error fetching merchant order:', errorText);
        return res.status(500).json({ error: 'Error fetching merchant order.' });
      }

      const orderData = await orderResponse.json();
      console.log('Merchant order data received:', orderData);

      const products = orderData.items.map(item => ({
        productName: item.title,
        quantity: item.quantity
      }));

      const preferenceId = orderData.preference_id;
      const userId = preferences[preferenceId];
      console.log('UserId associated with preferenceId:', userId);

      const address = orderData.shipping?.address || {};

      const userAccessToken = process.env.USER_ACCESS_TOKEN;

      if (!userAccessToken) {
        console.error('Error: No se pudo obtener el accessToken del usuario');
        return res.status(500).json({ error: 'No se pudo obtener el accessToken del usuario' });
      }

      const tokenUserId = obtenerUserIdDesdeToken(userAccessToken);
      if (!tokenUserId) {
        console.error('Error: No se pudo obtener el userId del token');
        return res.status(500).json({ error: 'No se pudo obtener el userId del token' });
      }

      const order = {
        userId: userId,
        products: products,
        amount: orderData.total_amount,
        address: address,
        status: 'approved',
        delivered: false
      };

      console.log('Order data to be sent to createOrder:', order);

      const createdOrder = await createOrder(order, userAccessToken);
      console.log('Order created successfully:', createdOrder);
      res.sendStatus(200);
    } else {
      console.error('Invalid resource URL or unsupported topic:', body.resource, body.topic);
      res.status(400).json({ error: 'Invalid resource URL or unsupported topic' });
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}!`);
});
