-- Create database if not exists
CREATE DATABASE IF NOT EXISTS estoque_db;
USE estoque_db;

-- Set character set and collation
ALTER DATABASE estoque_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges to the application user
GRANT ALL PRIVILEGES ON estoque_db.* TO 'estoque_user'@'%';
FLUSH PRIVILEGES; 

---Table Entities
CREATE TABLE IF NOT EXISTS TbEntity (
    idEntity INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type enum('unity', 'people', 'supplier'), 
    document VARCHAR(255) NOT NULL,
    daughter BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

---Table Entities
CREATE TABLE IF NOT EXISTS TbUser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);