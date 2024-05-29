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
  import debug from 'debug';

  dotenv.config();

  const appDebug = debug('app');
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

  app.use(express.static(path.join(__dirname, 'CIENFUEGOS2')));

  app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
  });


  const client = new MercadoPagoConfig({ accessToken: "APP_USR-6277177060337111-050214-5becb05e5acc25f7070263ae0e1544ac-243071885"});

  
  app.use(cors());
  app.use(express.json());
  
  

    app.post("/create_preference", async (req, res) => {
      try {
          const idempotencyKey = req.headers['x-idempotency-key'];
          console.log("Idempotency Key:", idempotencyKey);
  
          const orderData = {
              title: req.body.title,
              price: req.body.price,
              quantity: req.body.quantity,
          };
          console.log("Datos recibidos del frontend:", orderData);
  
          const body = {
              items: [{
                  title: orderData.title,
                  unit_price: Number(orderData.price),
                  quantity: Number(orderData.quantity),
                  currency_id: "ARS",
              }],
              back_urls: {
                success: "https://ecoomerce-api-v7wq.onrender.com/pago-confirmado",
                failure: "https://ecoomerce-api-v7wq.onrender.com/pago-denegado",
                pending: "https://ecoomerce-api-v7wq.onrender.com/pago-pendiente",
            },
            autor_return: "approved",
            notification_url: "https://ecoomerce-api-v7wq.onrender.com/webhook", //cambiar luego
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
  
  app.post("/webhook", async (req, res) => {
      try {
          const paymentId = req.query.id;
          console.log("ID del pago recibido en el webhook:", paymentId);
  
          const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
              method: "GET",
              headers: {
                  'Authorization': `Bearer  ${client.accessToken}`
              }
          });
  
          if (response.ok) {
              const data = await response.json();
              console.log("Datos del pago:", data);
              // Puedes realizar más acciones con los datos del pago aquí si es necesario
              res.sendStatus(200);
          } else {
              console.error("Error al obtener datos del pago:", response.statusText);
              res.sendStatus(500);
          }
      } catch (error) {
          console.error('Error:', error);
          res.sendStatus(500);
      }
  });


  app.listen(process.env.PORT || 8000, () => {
    console.log('Backend server is running!');
  });




  