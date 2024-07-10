import Product from ' ../models/sqlproducts.mjs';

export const createProduct = async (req, res) => {
    const { nombre, descripcion, imagen, categoria, precio, estrellas } = req.body;
    try {
        const newProduct = await Product.create({
            nombre,
            descripcion,
            imagen,
            categoria,
            precio,
            estrellas
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ error : 'error al crear el producto' });
    }
}