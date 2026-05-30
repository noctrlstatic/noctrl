-- ============================================================
-- NOCTRL — Supabase Schema
-- Esegui questo SQL nel SQL Editor di Supabase
-- ============================================================

-- 1. PRODOTTI
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  oldPrice DECIMAL(10,2),
  category TEXT NOT NULL DEFAULT 'Generico',
  image TEXT,
  images JSONB DEFAULT '[]',
  isNew BOOLEAN DEFAULT false,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDINI
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  stripeSessionId TEXT UNIQUE,
  customerEmail TEXT DEFAULT '',
  customerName TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  shipping JSONB NOT NULL DEFAULT '{}',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'In elaborazione',
  tracking TEXT DEFAULT '',
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIBERS (newsletter)
CREATE TABLE subscribers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT UNIQUE NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_orders_stripe_session ON orders(stripeSessionId);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Prodotti: tutti possono leggere, solo admin può scrivere
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_admin" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_admin" ON products FOR UPDATE USING (true);
CREATE POLICY "products_delete_admin" ON products FOR DELETE USING (true);

-- Ordini: tutti possono creare, solo admin può leggere/aggiornare
CREATE POLICY "orders_insert_all" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_admin" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (true);

-- Subscribers: tutti possono inserire, solo admin può leggere/eliminare
CREATE POLICY "subscribers_insert_all" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "subscribers_select_admin" ON subscribers FOR SELECT USING (true);
CREATE POLICY "subscribers_delete_admin" ON subscribers FOR DELETE USING (true);

-- ============================================================
-- Dati iniziali
-- ============================================================

INSERT INTO products (name, price, oldPrice, category, image, images, isNew, quantity) VALUES
  ('NOCTRL Thermal Bottle 500ml', 29.90, 39.90, 'Accessories', '/uploads/foto/borraccia.jpeg', '["/uploads/foto/borraccia.jpeg","/uploads/foto/borraccia-2.jpeg","/uploads/foto/borraccia-3.jpeg"]', true, 150),
  ('Essential Graphic Tee — White', 29.90, null, 'T-Shirts', '/uploads/foto/essential-graphic-tee-1.jpeg', '["/uploads/foto/essential-graphic-tee-1.jpeg"]', true, 15),
  ('Essential Graphic Tee — Black', 29.90, null, 'T-Shirts', '/uploads/foto/essential-graphic-tee-2.jpeg', '["/uploads/foto/essential-graphic-tee-2.jpeg"]', true, 20),
  ('Polo Premium — White', 44.90, 54.90, 'Polos', '/uploads/foto/polo-bianca.jpeg', '["/uploads/foto/polo-bianca.jpeg"]', true, 25),
  ('Polo Premium — Black', 44.90, null, 'Polos', '/uploads/foto/polo-nera.jpeg', '["/uploads/foto/polo-nera.jpeg"]', true, 12),
  ('Polo Premium — Beige', 44.90, null, 'Polos', '/uploads/foto/polo-beige.jpeg', '["/uploads/foto/polo-beige.jpeg","/uploads/foto/polo-beige-2.jpeg"]', true, 8),
  ('Brillantini Tee — White', 34.90, null, 'T-Shirts', '/uploads/foto/maglia-bianca-brillantini.jpeg', '["/uploads/foto/maglia-bianca-brillantini.jpeg","/uploads/foto/maglia-bianca-brillantini-2.jpeg"]', false, 10),
  ('Brillantini Tee — Black', 34.90, null, 'T-Shirts', '/uploads/foto/maglia-nera-brillantini.jpeg', '["/uploads/foto/maglia-nera-brillantini.jpeg","/uploads/foto/maglia-brillantini-nera.jpeg"]', false, 6),
  ('Summer Costume', 59.90, 74.90, 'Costumes', '/uploads/foto/costume.jpeg', '["/uploads/foto/costume.jpeg","/uploads/foto/costume-2-1.jpeg"]', true, 5),
  ('Cargo Shorts — Black', 39.90, null, 'Shorts', '/uploads/foto/jeans-corti.jpeg', '["/uploads/foto/jeans-corti.jpeg","/uploads/foto/jeans-corti-2.jpeg"]', false, 18),
  ('Cargo Shorts — Gray', 39.90, null, 'Shorts', '/uploads/foto/jeans-corti-3.jpeg', '["/uploads/foto/jeans-corti-3.jpeg"]', false, 10);
