CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
    );

INSERT INTO users (first_name, last_name, email, phone_number, password_hash, role)
VALUES ('Vaniko', 'Vstaniko', 'vaniko.vstaniko@gmail.com', '+380123456789', '$2b$10$WEvSlTVxwuKP1/wXKoMWIeQ7207M13ImWq9dWMpMIrmw2tka.Nbem', 'admin');

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
    );

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
    );

CREATE TABLE IF NOT EXISTS colors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
    );

CREATE TABLE IF NOT EXISTS watches (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    material_id INTEGER REFERENCES materials(id) ON DELETE SET NULL,
    color_id INTEGER REFERENCES colors(id) ON DELETE SET NULL
    );

INSERT INTO categories (name) VALUES ('Chronograph'), ('Diver'), ('Dress Watch'), ('Smartwatch'), ('Aviator'), ('Minimalist');

INSERT INTO materials (name) VALUES ('Stainless Steel'), ('Titanium'), ('Gold'), ('Platinum'), ('Ceramic'), ('Leather (Strap)'), ('Rubber (Strap)');

INSERT INTO colors (name) VALUES ('Silver'), ('Gold'), ('Rose Gold'), ('Black'), ('Blue'), ('Green'), ('White');

INSERT INTO watches (title, description, price, image_url, stock_quantity, category_id, material_id, color_id)
VALUES (
       'LHEURE Luxury Gold',
       'Преміальний годинник з вашої нової колекції',
       12500.00,
       'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=500',
       5,
       (SELECT id FROM categories WHERE name = 'Dress Watch'),
       (SELECT id FROM materials WHERE name = 'Gold'),
       (SELECT id FROM colors WHERE name = 'Gold')
       );

