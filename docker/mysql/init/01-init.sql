-- Create database if not exists
CREATE DATABASE IF NOT EXISTS estoque_db;
USE estoque_db;

-- Set character set and collation
ALTER DATABASE estoque_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON estoque_db.* TO 'estoque_user'@'%';
FLUSH PRIVILEGES; 