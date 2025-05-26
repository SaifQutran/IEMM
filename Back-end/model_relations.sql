-- Users Relationships
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` BIGINT
);

-- Malls Relationships
CREATE TABLE `malls` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `owner_id` BIGINT,
  `city_id` BIGINT
);
CREATE TABLE `countries` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT
  
);
CREATE TABLE `companies` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT
);
-- Floors Relationships
CREATE TABLE `floors` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `mall_id` BIGINT
);

-- Facilities Relationships
CREATE TABLE `facilities` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `mall_id` BIGINT,
  `floor_id` BIGINT
);

-- Shops Relationships
CREATE TABLE `shops` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `facility_id` BIGINT,
  `mall_id` BIGINT,
  `owner_id` BIGINT
);

-- Money Logs Relationships
CREATE TABLE `money_logs` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` BIGINT
);

-- Products Relationships
CREATE TABLE `products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `category_id` BIGINT,
  `Manufact_country_id` BIGINT,
  `company_id` BIGINT,
  `shop_id` BIGINT NOT NULL
);

-- Stocks Relationships
CREATE TABLE `stocks` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `warehouse_id` BIGINT
);

-- Warehouses Relationships
CREATE TABLE `warehouses` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `city_id` BIGINT,
  `shop_id` BIGINT
);

CREATE TABLE `governorates` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT
);
-- Cities Relationships
CREATE TABLE `cities` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `governorate_id` BIGINT
);

-- Sales Relationships
CREATE TABLE `sales` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT,
  `bill_id` BIGINT
);

-- Bills Relationships
CREATE TABLE `bills` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` BIGINT,
  `user_id` BIGINT,
  `customer_id` BIGINT
);

-- Reviews Relationships
CREATE TABLE `reviews` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT,
  `user_id` BIGINT
);

-- Chats Relationships
CREATE TABLE `chats` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` BIGINT NOT NULL,
  `mall_id` BIGINT NOT NULL
);

-- Messages Relationships
CREATE TABLE `messages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `sender_id` BIGINT NOT NULL,
  `chat_id` BIGINT
);

-- Notifications Relationships
CREATE TABLE `notifications` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL
);

-- Reservations Relationships
CREATE TABLE `reservations` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL
);

-- Categories Relationships
CREATE TABLE `categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT
);

-- Shop Categories Relationships (Pivot Table)
CREATE TABLE `shop_categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` BIGINT NOT NULL,
  `category_id` BIGINT NOT NULL
);

-- Foreign Key Constraints
ALTER TABLE `users` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE SET NULL;

ALTER TABLE `malls` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `malls` ADD FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL;

ALTER TABLE `floors` ADD FOREIGN KEY (`mall_id`) REFERENCES `malls` (`id`) ON DELETE CASCADE;

ALTER TABLE `facilities` ADD FOREIGN KEY (`mall_id`) REFERENCES `malls` (`id`) ON DELETE CASCADE;
ALTER TABLE `facilities` ADD FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE;

ALTER TABLE `shops` ADD FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE SET NULL;
ALTER TABLE `shops` ADD FOREIGN KEY (`mall_id`) REFERENCES `malls` (`id`) ON DELETE CASCADE;
ALTER TABLE `shops` ADD FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `money_logs` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
ALTER TABLE `products` ADD FOREIGN KEY (`Manufact_country_id`) REFERENCES `countries` (`id`) ON DELETE SET NULL;
ALTER TABLE `products` ADD FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;
ALTER TABLE `products` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;

ALTER TABLE `stocks` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `stocks` ADD FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL;

ALTER TABLE `warehouses` ADD FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL;
ALTER TABLE `warehouses` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;

ALTER TABLE `cities` ADD FOREIGN KEY (`governorate_id`) REFERENCES `governorates` (`id`) ON DELETE CASCADE;

ALTER TABLE `sales` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;
ALTER TABLE `sales` ADD FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE;

ALTER TABLE `bills` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;
ALTER TABLE `bills` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `bills` ADD FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `reviews` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `chats` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;
ALTER TABLE `chats` ADD FOREIGN KEY (`mall_id`) REFERENCES `malls` (`id`) ON DELETE CASCADE;

ALTER TABLE `messages` ADD FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE;
ALTER TABLE `messages` ADD FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `notifications` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

ALTER TABLE `reservations` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `reservations` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

ALTER TABLE `shop_categories` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;
ALTER TABLE `shop_categories` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE; 