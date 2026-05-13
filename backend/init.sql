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

INSERT INTO watches (title, description, price, image_url, stock_quantity, category_id, material_id, color_id) VALUES
('Chrono Master', 'Елітний спортивний хронограф з точним секундоміром.', 15500.00, 'https://i.pinimg.com/1200x/aa/74/87/aa7487ecd1c050f2ac64b7d9f3b6daaf.jpg', 12,
 (SELECT id FROM categories WHERE name='Chronograph'), (SELECT id FROM materials WHERE name='Stainless Steel'), (SELECT id FROM colors WHERE name='Black')),
('Ocean Deep', 'Професійний годинник для дайвінгу з водонепроникністю 300м.', 18200.00, 'https://i.pinimg.com/1200x/a9/0b/68/a90b6898ceacafe4e19aa3dbd8bdcc50.jpg', 5,
 (SELECT id FROM categories WHERE name='Diver'), (SELECT id FROM materials WHERE name='Titanium'), (SELECT id FROM colors WHERE name='Blue')),
('Classic Gold', 'Класичний золотий годинник для ділових зустрічей.', 45000.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=500', 2,
 (SELECT id FROM categories WHERE name='Dress Watch'), (SELECT id FROM materials WHERE name='Gold'), (SELECT id FROM colors WHERE name='Gold')),
('Minimalist White', 'Мінімалістичний дизайн, який пасує до будь-якого стилю.', 8500.00, 'https://i.pinimg.com/1200x/62/96/27/62962728af608bdad0e4e49e8b592f92.jpg', 25,
 (SELECT id FROM categories WHERE name='Minimalist'), (SELECT id FROM materials WHERE name='Ceramic'), (SELECT id FROM colors WHERE name='White')),
('Smart Fit Pro', 'Розумний годинник з функціями трекінгу здоров''я.', 11000.00, 'https://i.pinimg.com/1200x/a9/dd/0b/a9dd0b8630f321880346d04d3b9f6d26.jpg', 0,
 (SELECT id FROM categories WHERE name='Smartwatch'), (SELECT id FROM materials WHERE name='Rubber (Strap)'), (SELECT id FROM colors WHERE name='Black')),
('Aviator X', 'Пілотський годинник з великим циферблатом для легкості читання.', 13400.00, 'https://i.pinimg.com/736x/27/be/87/27be87ece94b0caada7175a2a22c7720.jpg', 8,
 (SELECT id FROM categories WHERE name='Aviator'), (SELECT id FROM materials WHERE name='Leather (Strap)'), (SELECT id FROM colors WHERE name='Black')),
('Rose Elegance', 'Вишуканий жіночий годинник кольору рожевого золота.', 22000.00, 'https://i.pinimg.com/1200x/59/2b/67/592b674212634fe3d26d2150ac48a4f3.jpg', 4,
 (SELECT id FROM categories WHERE name='Dress Watch'), (SELECT id FROM materials WHERE name='Gold'), (SELECT id FROM colors WHERE name='Rose Gold')),
('Aqua Marine', 'Яскравий дайверський годинник з зеленим циферблатом.', 16800.00, 'https://i.pinimg.com/1200x/42/24/7b/42247bb2d5630e842a8c8c0faddd317a.jpg', 10,
 (SELECT id FROM categories WHERE name='Diver'), (SELECT id FROM materials WHERE name='Stainless Steel'), (SELECT id FROM colors WHERE name='Green')),
('Racing Chrono', 'Годинник для автоспорту з тахіметричною шкалою.', 19500.00, 'https://i.pinimg.com/1200x/09/3b/06/093b0655c06ec5b871cfefcdafb4e83b.jpg', 7,
 (SELECT id FROM categories WHERE name='Chronograph'), (SELECT id FROM materials WHERE name='Leather (Strap)'), (SELECT id FROM colors WHERE name='Silver')),
('Platinum Prestige', 'Найвища якість. Корпус з чистої платини.', 95000.00, 'https://i.pinimg.com/736x/c4/19/09/c419093bed20424dd077adc9ccfb005c.jpg', 1,
 (SELECT id FROM categories WHERE name='Dress Watch'), (SELECT id FROM materials WHERE name='Platinum'), (SELECT id FROM colors WHERE name='Silver')),
('Urban Smart', 'Елегантний смарт-годинник для повсякденного носіння.', 12500.00, 'https://i.pinimg.com/736x/d8/60/e8/d860e8e26528b086998c69a2f85eefab.jpg', 15,
 (SELECT id FROM categories WHERE name='Smartwatch'), (SELECT id FROM materials WHERE name='Stainless Steel'), (SELECT id FROM colors WHERE name='Silver')),
('Night Hawk', 'Авіатор з повністю чорним матовим покриттям.', 14200.00, 'https://i.pinimg.com/1200x/f3/02/ad/f302ad9725890afe50968023ee2ed0f8.jpg', 0,
 (SELECT id FROM categories WHERE name='Aviator'), (SELECT id FROM materials WHERE name='Ceramic'), (SELECT id FROM colors WHERE name='Black')),
('imple Black', 'Нічого зайвого. Тільки час і стиль.', 7200.00, 'https://i.pinimg.com/1200x/43/bc/5b/43bc5b4911aafd31609e23b19a9c0ca7.jpg', 30,
 (SELECT id FROM categories WHERE name='Minimalist'), (SELECT id FROM materials WHERE name='Leather (Strap)'), (SELECT id FROM colors WHERE name='Black')),
('Titanium Master', 'Надзвичайно легкий і міцний годинник.', 21000.00, 'https://i.pinimg.com/736x/f0/0d/cc/f00dccffcd5db16fae4d2a4195d39d61.jpg', 6,
 (SELECT id FROM categories WHERE name='Diver'), (SELECT id FROM materials WHERE name='Titanium'), (SELECT id FROM colors WHERE name='Silver')),
('Royal White', 'Класика з білим емалевим циферблатом.', 38000.00, 'https://i.pinimg.com/1200x/71/2e/e9/712ee9dd24dcbba8bbaae156c37d17a1.jpg', 3,
 (SELECT id FROM categories WHERE name='Dress Watch'), (SELECT id FROM materials WHERE name='Gold'), (SELECT id FROM colors WHERE name='White')),
('Active Pulse', 'Спортивний смарт-годинник з пульсометром.', 9900.00, 'https://i.pinimg.com/1200x/e5/42/52/e54252ac19750bc1dad405648a32c4fd.jpg', 22,
 (SELECT id FROM categories WHERE name='Smartwatch'), (SELECT id FROM materials WHERE name='Rubber (Strap)'), (SELECT id FROM colors WHERE name='Green')),
('Sky Commander', 'Вибір справжніх пілотів.', 17500.00, 'https://i.pinimg.com/1200x/98/0f/4e/980f4e806984d5cd2af0292bd09a4276.jpg', 9,
 (SELECT id FROM categories WHERE name='Aviator'), (SELECT id FROM materials WHERE name='Stainless Steel'), (SELECT id FROM colors WHERE name='Blue')),
('Pure Steel', 'Сувора сталь і мінімалізм.', 8900.00, 'https://i.pinimg.com/736x/c7/e6/88/c7e6880be0898ab28c00389cf799b1ea.jpg', 18,
 (SELECT id FROM categories WHERE name='Minimalist'), (SELECT id FROM materials WHERE name='Stainless Steel'), (SELECT id FROM colors WHERE name='Silver')),
('Dark Chrono', 'Хронограф у повністю чорному виконанні.', 16000.00, 'https://i.pinimg.com/1200x/d1/b2/c2/d1b2c27145015ef3815129714743b68b.jpg', 0,
 (SELECT id FROM categories WHERE name='Chronograph'), (SELECT id FROM materials WHERE name='Titanium'), (SELECT id FROM colors WHERE name='Black')),
('Coral Reef', 'Дайвер для дослідження підводного світу.', 18900.00, 'https://i.pinimg.com/1200x/98/68/39/98683973bc579f21bfb863d8599a3a53.jpg', 11,
 (SELECT id FROM categories WHERE name='Diver'), (SELECT id FROM materials WHERE name='Rubber (Strap)'), (SELECT id FROM colors WHERE name='Blue')),
('Diamond Dress', 'Прикрашений справжніми діамантами.', 120000.00, 'https://i.pinimg.com/736x/9f/16/18/9f161889c9faa8b2fec82627227c3564.jpg', 1,
 (SELECT id FROM categories WHERE name='Dress Watch'), (SELECT id FROM materials WHERE name='Platinum'), (SELECT id FROM colors WHERE name='White')),
('Aero Light', 'Надлегкий авіатор з титану.', 15800.00, 'https://i.pinimg.com/1200x/38/ac/c8/38acc8ea1e364f72e70812701611b435.jpg', 5,
 (SELECT id FROM categories WHERE name='Aviator'), (SELECT id FROM materials WHERE name='Titanium'), (SELECT id FROM colors WHERE name='White')),
('Executive Smart', 'Смарт-годинник, який виглядає як класичний.', 14500.00, 'https://i.pinimg.com/1200x/97/48/a6/9748a6561c02fa3a42d114f5e3d17ce2.jpg', 14,
 (SELECT id FROM categories WHERE name='Smartwatch'), (SELECT id FROM materials WHERE name='Leather (Strap)'), (SELECT id FROM colors WHERE name='Silver')),
('Ceramic Noir', 'Глянцева чорна кераміка.', 10500.00, 'https://i.pinimg.com/736x/95/23/c4/9523c4dd727842269359cd8934783416.jpg', 7,
 (SELECT id FROM categories WHERE name='Minimalist'), (SELECT id FROM materials WHERE name='Ceramic'), (SELECT id FROM colors WHERE name='Black')),
('Ultimate Titanium', 'Вершина інженерної думки L''HEURE.', 25000.00, 'https://i.pinimg.com/1200x/95/dc/78/95dc780b4207766b957317e5b4dbee0f.jpg', 4,
 (SELECT id FROM categories WHERE name='Chronograph'), (SELECT id FROM materials WHERE name='Titanium'), (SELECT id FROM colors WHERE name='Blue'));
