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


  const client = new MercadoPagoConfig({ accessToken: "APP_USR-6277177060337111-050214-5becb05e5acc25f7070263ae0e1544ac-243071885" });


  app.post("/create_preference", async (req, res) => {
    try {
        const idempotencyKey = req.headers['x-idempotency-key'];
        console.log("Idempotency Key:", idempotencyKey);

        const orderDataList = req.body; 
        console.log("Datos recibidos del frontend:", orderDataList);

        // Verifica que se haya recibido una lista válida de datos del pedido
        if (!Array.isArray(orderDataList) || orderDataList.length === 0) {
            return res.status(400).json({ error: "La lista de datos del pedido es inválida o está vacía." });
        }

        // Mapea los datos del pedido para crear los items de la preferencia
        const items = orderDataList.map(orderData => ({
            title: orderData.title,
            unit_price: Number(orderData.price),
            quantity: Number(orderData.quantity),
            currency_id: "ARS",
        }));

        // Cuerpo de la preferencia
        const body = {
            items: items,
            back_urls: {
                success: "https://ecoomerce-api-v7wq.onrender.com/pago-confirmado",
                failure: "https://ecoomerce-api-v7wq.onrender.com/pago-denegado",
                pending: "https://ecoomerce-api-v7wq.onrender.com/pago-pendiente",
            },
            auto_return: "approved", // Ajuste: corregido a auto_return
            notification_url: "https://ecoomerce-api-v7wq.onrender.com/webhook",
        };

        // Crea la preferencia en MercadoPago
        const preference = new Preference(client); // Asegúrate de inicializar 'client' correctamente
        const result = await preference.create({ body, idempotencyKey });
        console.log("Preferencia creada:", result);

        res.json({
            id: result.id,
        });
    } catch (error) {
        console.error("Error al crear la preferencia:", error);
        res.status(500).json({
            error: "Error al crear la preferencia :(",
        });
    }
});

// Endpoint para recibir notificaciones de MercadoPago
app.post("/webhook", async (req, res) => {
    try {
        const paymentId = req.query.id;
        console.log("ID del pago recibido en el webhook:", paymentId);

        // Verifica que se haya recibido un ID de pago válido
        if (!paymentId) {
            console.error("ID del pago no recibido en la solicitud.");
            return res.status(400).json({ error: "ID del pago no recibido en la solicitud." });
        }

        // Obtiene los detalles del pago desde MercadoPago
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${client.accessToken}` // Asegúrate de tener 'client.accessToken' configurado
            }
        });

        if (!response.ok) {
            console.error("Error al obtener datos del pago desde MercadoPago:", response.statusText);
            return res.status(500).json({ error: "Error al obtener datos del pago desde MercadoPago." });
        }

        const data = await response.json();
        console.log("Datos del pago recibidos:", data);

        // Verifica que userId no sea nulo
        const userId = data.payer && data.payer.id ? data.payer.id : "unknown_user";
        const orderData = {
            userId: userId,
            products: data.additional_info.items.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            amount: data.transaction_details.total_paid_amount,
            address: data.payer.address || "undefined",
            status: data.status, // Ajusta esto según los datos que deseas guardar
            delivered: false
        };

        // Crea la orden en tu sistema
        const orderCreationResponse = await fetch('https://ecoomerce-api-v7wq.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${client.accessToken}` // Ajusta tuTokenDeAutenticación correctamente
            },
            body: JSON.stringify(orderData)
        });

        if (orderCreationResponse.ok) {
            const orderCreationResult = await orderCreationResponse.json();
            console.log('Orden creada exitosamente:', orderCreationResult);
            res.sendStatus(200);
        } else {
            console.error('Error al crear la orden:', await orderCreationResponse.text());
            res.sendStatus(500);
        }
    } catch (error) {
        console.error('Error en el webhook:', error);
        res.sendStatus(500);
    }
});



  app.listen(process.env.PORT || 8000, () => {
    console.log('Backend server is running!');
  });

  