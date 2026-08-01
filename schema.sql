-- Sales & Inventory Analytics Schema
-- Generated automatically; adapt to your database (PostgreSQL, SQL Server, MySQL, etc.)

-- Dimension: Products
CREATE TABLE dim_product (
    sku VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    cost DECIMAL(10,2),
    retail_price DECIMAL(10,2),
    status VARCHAR(50)
);

-- Dimension: Stores
CREATE TABLE dim_store (
    store_id VARCHAR(50) PRIMARY KEY,
    store_name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    status VARCHAR(50)
);

-- Fact: Sales Transactions
CREATE TABLE fact_sales (
    transaction_id VARCHAR(50) PRIMARY KEY,
    transaction_date DATE NOT NULL,
    year INT,
    month INT,
    week INT,
    day_of_week VARCHAR(20),
    store_id VARCHAR(50) NOT NULL,
    store_name VARCHAR(255),
    region VARCHAR(100),
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(255),
    category VARCHAR(100),
    quantity INT,
    unit_price DECIMAL(10,2),
    total_sale DECIMAL(12,2),
    cost_of_goods DECIMAL(12,2),
    gross_margin DECIMAL(12,2),
    gross_margin_pct DECIMAL(5,2),
    FOREIGN KEY (sku) REFERENCES dim_product(sku),
    FOREIGN KEY (store_id) REFERENCES dim_store(store_id)
);

-- Fact: Inventory Snapshot
CREATE TABLE fact_inventory (
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(255),
    category VARCHAR(100),
    store_id VARCHAR(50) NOT NULL,
    store_name VARCHAR(255),
    region VARCHAR(100),
    stock_on_hand INT,
    reorder_level INT,
    reorder_quantity INT,
    stock_status VARCHAR(50),
    last_restock_date DATE,
    snapshot_date DATE NOT NULL,
    inventory_value DECIMAL(12,2),
    units_sold_period INT,
    inventory_turnover_ratio DECIMAL(10,2),
    PRIMARY KEY (sku, store_id, snapshot_date),
    FOREIGN KEY (sku) REFERENCES dim_product(sku),
    FOREIGN KEY (store_id) REFERENCES dim_store(store_id)
);

-- Create useful indexes
CREATE INDEX idx_sales_date ON fact_sales(transaction_date);
CREATE INDEX idx_sales_store ON fact_sales(store_id);
CREATE INDEX idx_sales_sku ON fact_sales(sku);
CREATE INDEX idx_inventory_date ON fact_inventory(snapshot_date);
