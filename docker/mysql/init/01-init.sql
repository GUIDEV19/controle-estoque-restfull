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
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type enum('unity', 'people', 'supplier'), 
    document VARCHAR(255) NOT NULL,
    daughter BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

---Table Users
CREATE TABLE IF NOT EXISTS TbUser (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

---Table Transactions
CREATE TABLE IF NOT EXISTS TbTransaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origin_id INT NOT NULL,
    destination_id INT NOT NULL,
    type enum('sale', 'buy', 'transfer'),
    status enum('pending', 'approved', 'rejected'),
    price DECIMAL(10, 2) NOT NULL,
    user_created_id INT NOT NULL,
    user_updated_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_transaction_origin FOREIGN KEY (origin_id) REFERENCES TbEntity(id),
    CONSTRAINT fk_transaction_destination FOREIGN KEY (destination_id) REFERENCES TbEntity(id),
    CONSTRAINT fk_transaction_user_created FOREIGN KEY (user_created_id) REFERENCES TbUser(id),
    CONSTRAINT fk_transaction_user_updated FOREIGN KEY (user_updated_id) REFERENCES TbUser(id)
);

---Table TransactionItems
CREATE TABLE IF NOT EXISTS TbTransactionItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_total DECIMAL(10, 2) NOT NULL,
    user_created_id INT NOT NULL,
    user_updated_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_transaction_item_transaction FOREIGN KEY (transaction_id) REFERENCES TbTransaction(id),
    CONSTRAINT fk_transaction_item_product FOREIGN KEY (product_id) REFERENCES TbProduct(id),
    CONSTRAINT fk_transaction_item_user_created FOREIGN KEY (user_created_id) REFERENCES TbUser(id),
    CONSTRAINT fk_transaction_item_user_updated FOREIGN KEY (user_updated_id) REFERENCES TbUser(id)
);

---Table Products
CREATE TABLE IF NOT EXISTS TbProduct (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    user_created_id INT NOT NULL,
    user_updated_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES TbCategory(id),
    CONSTRAINT fk_product_user_created FOREIGN KEY (user_created_id) REFERENCES TbUser(id),
    CONSTRAINT fk_product_user_updated FOREIGN KEY (user_updated_id) REFERENCES TbUser(id)
);

---Table Categories
CREATE TABLE IF NOT EXISTS TbCategory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);