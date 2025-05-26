CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `f_name` VARCHAR(50) NOT NULL,
  `l_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `username` VARCHAR(50) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(12) NOT NULL,
  `sex` bool NOT NULL,
  `user_type` int NOT NULL,
  `birth_date` date,
  `shop_id` BIGINT,
  `signed_in` bool NOT NULL DEFAULT false,
  `remember_token` VARCHAR(100),
  `acount_verified_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `malls` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `owner_id` BIGINT,
  `city_id` BIGINT,
  `X_Coordinates` DECIMAL(10, 7),
  `Y_Coordinates` DECIMAL(10, 7),
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `floors` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `mall_id` BIGINT,
  `width` DECIMAL(8,2),
  `length` DECIMAL(8,2),
  `floor_number` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `facilities` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `mall_id` BIGINT,
  `floor_id` BIGINT,
  `width` DECIMAL(8,2),
  `length` DECIMAL(8,2),
  `rent_price` DECIMAL(10,2),
  `electricity_id_number` VARCHAR(255),
  `water_id_number` VARCHAR(255),
  `X_Coordinates` DECIMAL(10,7),
  `Y_Coordinates` DECIMAL(10,7),
  `status` bool NOT NULL DEFAULT false,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `shops` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `work_times` varchar(250),
  `state` bool NOT NULL DEFAULT false,
  `facility_id` BIGINT,
  `rent_began_At` date,
  `mall_id` BIGINT,
  `owner_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `money_logs` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `amount` DECIMAL(10,2) NOT NULL,
  `type_id` int,
  `date` date,
  `shop_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `shop_categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` BIGINT NOT NULL,
  `category_id` BIGINT NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2),
  `category_id` BIGINT,
  `barcode` varchar(255),
  `Manufact_country_id` BIGINT,
  `company_id` BIGINT,
  `shop_id` BIGINT NOT NULL,
  `is_showed_online` bool NOT NULL DEFAULT true,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `stocks` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `quantity` INT NOT NULL DEFAULT 0,
  `product_id` BIGINT NOT NULL,
  `warehouse_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `warehouses` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `city_id` BIGINT,
  `location` VARCHAR(255),
  `name` VARCHAR(255),
  `shop_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `countries` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `governorates` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `governorate` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `cities` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `governorate_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `sales` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `quantity` INT,
  `unit_price` DECIMAL(10,2),
  `product_id` BIGINT,
  `bill_id` BIGINT,
  `is_reserved` bool DEFAULT false,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `bills` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `date` DATETIME,
  `shop_id` BIGINT,
  `user_id` BIGINT,
  `customer_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `reviews` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `rating` TINYINT NOT NULL,
  `comment` TEXT,
  `date` DATETIME,
  `product_id` BIGINT,
  `user_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `companies` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `chats` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `shop_id` bigint NOT NULL,
  `mall_id` bigint NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `messages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `sender_type` bool NOT NULL,
  `sender_id` bigint NOT NULL,
  `chat_id` BIGINT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `notifications` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `is_answered` bool DEFAULT false,
  `read_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `recieved_at` TIMESTAMP
);

CREATE TABLE `reservations` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `date` DATETIME,
  `quantity` int,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `is_recieved` bool DEFAULT false,
  `unit_price` DECIMAL(10,2),
  `recieved_at` datetime,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
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
ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
ALTER TABLE `shop_categories` ADD FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`) ON DELETE CASCADE;
ALTER TABLE `shop_categories` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
