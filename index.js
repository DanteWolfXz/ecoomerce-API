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

        // Extraer el userId de orderDataList
        const userIdObject = orderDataList.find(item => item.userId);
        const userId = userIdObject ? userIdObject.userId : 'unknown_user';

        // Filtrar orderDataList para eliminar el objeto userId
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
        console.log('Preferencia creada:', result);

        res.json({
            id: result.id,
            userId: userId, // Devolver el userId en la respuesta
        });
    } catch (error) {
        console.error('Error al crear la preferencia:', error);
        res.status(500).json({
            error: 'Error al crear la preferencia :(',
        });
    }
});

// Ruta para manejar la creación de preferencias de pago
app.post('/create_preference', async (req, res) => {
  try {
      const idempotencyKey = req.headers['x-idempotency-key'];
      const orderDataList = req.body;

      // Extraer el userId de orderDataList
      const userIdObject = orderDataList.find(item => item.userId);
      const userId = userIdObject ? userIdObject.userId : 'unknown_user';

      // Filtrar orderDataList para eliminar el objeto userId
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

      res.json({
          id: result.id,
          init_point: result.init_point,
          userId: userId, // Devolver el userId en la respuesta
      });
  } catch (error) {
      res.status(500).json({
          error: 'Error al crear la preferencia :(',
      });
  }
});

// Ruta para manejar el webhook de MercadoPago
app.post('/webhook', async (req, res) => {
  try {
      const body = req.body;
      const resourceUrl = body.resource;

      // Obtener los detalles del merchant_order desde MercadoPago
      const response = await fetch(resourceUrl, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          },
      });

      const data = await response.json();

      // Verifica que la orden haya sido pagada antes de continuar
      if (data.order_status === 'paid') {
          const products = data.items.map(item => ({
              title: item.title,
              quantity: item.quantity,
              price: item.unit_price,
          }));

          const orderData = {
              userId: data.payer.id || 'unknown_user', // Usar el userId recibido en el webhook
              preferenceId: data.preference_id,
              merchantOrderId: data.id,
              status: data.order_status,
              totalAmount: data.total_amount,
              products: products,
              payer: {
                  email: data.payer.email
              }
          };

          // Guardar la orden en tu base de datos
          const orderCreationResponse = await fetch('https://ecoomerce-api-v7wq.onrender.com/api/orders', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: req.headers['authorization'], // Utilizar el accessToken del usuario
              },
              body: JSON.stringify(orderData),
          });

          if (orderCreationResponse.ok) {
              res.sendStatus(200);
          } else {
              const errorText = await orderCreationResponse.text();
              res.status(500).json({ error: 'Error al crear la orden.', details: errorText });
          }
      } else {
          // Si la orden no está pagada, responde con un 200 OK para que MercadoPago no reintente la notificación
          res.sendStatus(200);
      }
  } catch (error) {
      console.error('Error handling webhook:', error);
      res.sendStatus(500);
  }
});


  app.listen(process.env.PORT || 8000, () => {
    console.log('Backend server is running!');
  });

  