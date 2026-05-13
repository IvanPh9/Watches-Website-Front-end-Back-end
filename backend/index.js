const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const bcrypt = require('bcrypt');

app.get('/api', (req, res) => {
    res.json({ message: 'Бекенд успішно працює!' });
});

app.get('/api/watches', async (req, res) => {
    try {
        const query = `
            SELECT 
                w.id, 
                w.title, 
                w.description, 
                w.price, 
                w.image_url, 
                w.stock_quantity,
                c.name AS type, 
                m.name AS material, 
                col.name AS color
            FROM watches w
            LEFT JOIN categories c ON w.category_id = c.id
            LEFT JOIN materials m ON w.material_id = m.id
            LEFT JOIN colors col ON w.color_id = col.id
            ORDER BY w.id ASC;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка сервера при отриманні годинників' });
    }
});

app.get('/api/filters', async (req, res) => {
    try {
        // Робимо три паралельні запити до бази
        const categories = await pool.query('SELECT name FROM categories ORDER BY name');
        const materials = await pool.query('SELECT name FROM materials ORDER BY name');
        const colors = await pool.query('SELECT name FROM colors ORDER BY name');

        // Віддаємо фронтенду зручний об'єкт з трьома масивами
        res.json({
            types: categories.rows.map(row => row.name),
            materials: materials.rows.map(row => row.name),
            colors: colors.rows.map(row => row.name)
        });
    } catch (err) {
        console.error("Помилка фільтрів:", err.message);
        res.status(500).json({ error: 'Помилка сервера при отриманні фільтрів' });
    }
});

app.post('/api/watches', async (req, res) => {
    try {
        const { title, description, price, image, quantity, type, material, color } = req.body;

        const catRes = await pool.query('SELECT id FROM categories WHERE name = $1', [type]);
        const matRes = await pool.query('SELECT id FROM materials WHERE name = $1', [material]);
        const colRes = await pool.query('SELECT id FROM colors WHERE name = $1', [color]);

        const category_id = catRes.rows[0]?.id || null;
        const material_id = matRes.rows[0]?.id || null;
        const color_id = colRes.rows[0]?.id || null;

        const result = await pool.query(
            `INSERT INTO watches (title, description, price, image_url, stock_quantity, category_id, material_id, color_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, image_url`,
            [title, description, price, image, quantity, category_id, material_id, color_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка додавання товару' });
    }
});

app.delete('/api/watches/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM watches WHERE id = $1', [req.params.id]);
        res.json({ message: 'Товар видалено' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка видалення товару' });
    }
});

app.patch('/api/watches/:id/quantity', async (req, res) => {
    try {
        const { quantity } = req.body;
        await pool.query('UPDATE watches SET stock_quantity = $1 WHERE id = $2', [quantity, req.params.id]);
        res.json({ message: 'Кількість оновлено' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка оновлення кількості' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'This email is already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, phone_number, password_hash) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, phone_number, role`,
            [firstName, lastName, email, phone, hashedPassword]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        res.json({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone_number,
            role: user.role
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error during login' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, first_name AS "firstName", last_name AS "lastName", email, phone_number AS phone, role FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка завантаження користувачів' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.json({ message: 'Користувача успішно видалено' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка видалення користувача' });
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone } = req.body;

        const result = await pool.query(
            `UPDATE users 
             SET first_name = $1, last_name = $2, phone_number = $3 
             WHERE id = $4 
             RETURNING id, first_name AS "firstName", last_name AS "lastName", email, phone_number AS "phone", role`,
            [firstName, lastName, phone, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Помилка при оновленні профілю' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});