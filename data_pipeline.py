"""
Data Cleaning & Transformation Pipeline
Cleans raw transaction and inventory data, performs joins, calculates KPIs, and prepares for SQL loading.
Usage: python data_pipeline.py
"""

import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration - Dynamic paths (no hard-coded paths)
PROJECT_ROOT = Path(__file__).parent
RAW_DATA_DIR = PROJECT_ROOT / 'data' / 'raw'
PROCESSED_DATA_DIR = PROJECT_ROOT / 'data' / 'processed'
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)

class DataPipeline:
    def __init__(self):
        self.transactions = None
        self.inventory = None
        self.products = None
        self.stores = None
        self.sales_fact = None
        self.inventory_fact = None

    def load_raw_data(self):
        """Load raw CSV files."""
        logger.info("Loading raw data files...")
        
        try:
            self.transactions = pd.read_csv(RAW_DATA_DIR / 'transactions.csv')
            self.inventory = pd.read_csv(RAW_DATA_DIR / 'inventory.csv')
            self.products = pd.read_csv(RAW_DATA_DIR / 'products.csv')
            self.stores = pd.read_csv(RAW_DATA_DIR / 'stores.csv')
            
            logger.info(f"✓ Transactions: {len(self.transactions)} rows")
            logger.info(f"✓ Inventory: {len(self.inventory)} rows")
            logger.info(f"✓ Products: {len(self.products)} rows")
            logger.info(f"✓ Stores: {len(self.stores)} rows")
            
        except FileNotFoundError as e:
            logger.error(f"File not found: {e}. Run data_generator.py first.")
            raise

    def clean_transactions(self):
        """Clean and validate transaction data."""
        logger.info("Cleaning transaction data...")
        
        df = self.transactions.copy()
        
        # Convert dates
        df['transaction_date'] = pd.to_datetime(df['transaction_date'])
        
        # Validate data types
        df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce')
        df['unit_price'] = pd.to_numeric(df['unit_price'], errors='coerce')
        df['total_sale'] = pd.to_numeric(df['total_sale'], errors='coerce')
        df['cost_of_goods'] = pd.to_numeric(df['cost_of_goods'], errors='coerce')
        df['gross_margin'] = pd.to_numeric(df['gross_margin'], errors='coerce')
        df['gross_margin_pct'] = pd.to_numeric(df['gross_margin_pct'], errors='coerce')
        
        # Remove rows with missing critical fields
        initial_rows = len(df)
        df = df.dropna(subset=['transaction_id', 'sku', 'store_id', 'quantity', 'unit_price'])
        removed = initial_rows - len(df)
        if removed > 0:
            logger.warning(f"Removed {removed} rows with missing critical data")
        
        # Ensure positive quantities and prices
        df = df[(df['quantity'] > 0) & (df['unit_price'] > 0)]
        
        # Recalculate derived fields for consistency
        df['total_sale'] = (df['quantity'] * df['unit_price']).round(2)
        df['gross_margin'] = (df['total_sale'] - df['cost_of_goods']).round(2)
        df['gross_margin_pct'] = (df['gross_margin'] / df['total_sale'] * 100).round(2)
        
        # Add useful time dimensions
        df['year'] = df['transaction_date'].dt.year
        df['month'] = df['transaction_date'].dt.month
        df['week'] = df['transaction_date'].dt.isocalendar().week
        df['day_of_week'] = df['transaction_date'].dt.day_name()
        
        self.transactions = df
        logger.info(f"✓ Transactions cleaned: {len(df)} rows retained")

    def clean_inventory(self):
        """Clean and validate inventory data."""
        logger.info("Cleaning inventory data...")
        
        df = self.inventory.copy()
        
        # Convert dates
        df['last_restock_date'] = pd.to_datetime(df['last_restock_date'])
        df['snapshot_date'] = pd.to_datetime(df['snapshot_date'])
        
        # Validate numeric fields
        df['stock_on_hand'] = pd.to_numeric(df['stock_on_hand'], errors='coerce')
        df['reorder_level'] = pd.to_numeric(df['reorder_level'], errors='coerce')
        df['reorder_quantity'] = pd.to_numeric(df['reorder_quantity'], errors='coerce')
        
        # Remove rows with missing critical fields
        df = df.dropna(subset=['sku', 'store_id', 'stock_on_hand'])
        
        # Ensure non-negative stock
        df = df[df['stock_on_hand'] >= 0]
        
        # Calculate stock status
        df['stock_status'] = df.apply(
            lambda x: 'Low Stock' if x['stock_on_hand'] <= x['reorder_level'] else 'In Stock',
            axis=1
        )
        
        self.inventory = df
        logger.info(f"✓ Inventory cleaned: {len(df)} rows retained")

    def clean_dimensions(self):
        """Clean product and store dimension tables."""
        logger.info("Cleaning dimension tables...")
        
        # Products
        products = self.products.copy()
        products['cost'] = pd.to_numeric(products['cost'], errors='coerce')
        products['retail_price'] = pd.to_numeric(products['retail_price'], errors='coerce')
        products = products.dropna(subset=['sku', 'product_name'])
        self.products = products
        logger.info(f"✓ Products: {len(products)} rows")
        
        # Stores
        stores = self.stores.copy()
        stores = stores.dropna(subset=['store_id', 'store_name'])
        self.stores = stores
        logger.info(f"✓ Stores: {len(stores)} rows")

    def create_sales_fact(self):
        """Create sales fact table by joining transactions with dimensions."""
        logger.info("Creating sales fact table...")
        
        # Start with transactions
        fact = self.transactions.copy()
        
        # Join with products
        fact = fact.merge(
            self.products[['sku', 'product_name', 'category']],
            on='sku',
            how='left'
        )
        
        # Join with stores
        fact = fact.merge(
            self.stores[['store_id', 'store_name', 'region']],
            on='store_id',
            how='left'
        )
        
        # Ensure no nulls in critical dimensions (log warnings for mismatches)
        if fact[['product_name', 'store_name']].isnull().any().any():
            logger.warning(f"Found {fact[['product_name', 'store_name']].isnull().sum().sum()} dimension mismatches")
        
        # Select final columns
        self.sales_fact = fact[[
            'transaction_id', 'transaction_date', 'year', 'month', 'week', 'day_of_week',
            'store_id', 'store_name', 'region',
            'sku', 'product_name', 'category',
            'quantity', 'unit_price', 'total_sale',
            'cost_of_goods', 'gross_margin', 'gross_margin_pct'
        ]].copy()
        
        logger.info(f"✓ Sales fact table: {len(self.sales_fact)} rows")

    def create_inventory_fact(self):
        """Create inventory fact table with SKU and store dimensions."""
        logger.info("Creating inventory fact table...")
        
        fact = self.inventory.copy()
        
        # Join with products
        fact = fact.merge(
            self.products[['sku', 'product_name', 'category', 'retail_price']],
            on='sku',
            how='left'
        )
        
        # Join with stores
        fact = fact.merge(
            self.stores[['store_id', 'store_name', 'region']],
            on='store_id',
            how='left'
        )
        
        # Calculate inventory value (at retail)
        fact['inventory_value'] = (fact['stock_on_hand'] * fact['retail_price']).round(2)
        
        # Select final columns
        self.inventory_fact = fact[[
            'sku', 'product_name', 'category',
            'store_id', 'store_name', 'region',
            'stock_on_hand', 'reorder_level', 'reorder_quantity',
            'stock_status', 'last_restock_date', 'snapshot_date',
            'inventory_value'
        ]].copy()
        
        logger.info(f"✓ Inventory fact table: {len(self.inventory_fact)} rows")

    def calculate_inventory_turnover(self):
        """Calculate inventory turnover by SKU and store (optional enrichment)."""
        logger.info("Calculating inventory turnover metrics...")
        
        # Aggregate sales by SKU and store over the period
        sales_by_sku_store = self.sales_fact.groupby(['sku', 'store_id']).agg({
            'quantity': 'sum',
            'total_sale': 'sum'
        }).reset_index()
        sales_by_sku_store.columns = ['sku', 'store_id', 'units_sold_period', 'revenue_period']
        
        # Calculate turnover (units sold / avg stock, or simplified: units_sold / current_stock)
        turnover = self.inventory_fact.merge(
            sales_by_sku_store,
            on=['sku', 'store_id'],
            how='left'
        )
        
        turnover['units_sold_period'] = turnover['units_sold_period'].fillna(0)
        turnover['inventory_turnover_ratio'] = (
            turnover['units_sold_period'] / (turnover['stock_on_hand'] + 1)  # +1 to avoid division by zero
        ).round(2)
        
        self.inventory_fact = turnover[[
            'sku', 'product_name', 'category',
            'store_id', 'store_name', 'region',
            'stock_on_hand', 'reorder_level', 'reorder_quantity',
            'stock_status', 'last_restock_date', 'snapshot_date',
            'inventory_value', 'units_sold_period', 'inventory_turnover_ratio'
        ]].copy()
        
        logger.info(f"✓ Inventory turnover calculated")

    def save_processed_data(self):
        """Save processed tables to CSV."""
        logger.info("Saving processed data...")
        
        self.sales_fact.to_csv(PROCESSED_DATA_DIR / 'sales_fact.csv', index=False)
        self.inventory_fact.to_csv(PROCESSED_DATA_DIR / 'inventory_fact.csv', index=False)
        self.products.to_csv(PROCESSED_DATA_DIR / 'dim_product.csv', index=False)
        self.stores.to_csv(PROCESSED_DATA_DIR / 'dim_store.csv', index=False)
        
        logger.info(f"✓ Processed data saved to {PROCESSED_DATA_DIR}")

    def export_sql_scripts(self):
        """Generate SQL CREATE TABLE statements."""
        logger.info("Generating SQL schema...")
        
        sql_file = PROJECT_ROOT / 'schema.sql'
        
        sql_schema = """-- Sales & Inventory Analytics Schema
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
"""
        
        with open(sql_file, 'w') as f:
            f.write(sql_schema)
        
        logger.info(f"✓ SQL schema exported to {sql_file}")

    def run_pipeline(self):
        """Execute the full pipeline."""
        logger.info("=" * 60)
        logger.info("Starting Data Cleaning & Transformation Pipeline")
        logger.info("=" * 60)
        
        self.load_raw_data()
        self.clean_transactions()
        self.clean_inventory()
        self.clean_dimensions()
        self.create_sales_fact()
        self.create_inventory_fact()
        self.calculate_inventory_turnover()
        self.save_processed_data()
        self.export_sql_scripts()
        
        logger.info("=" * 60)
        logger.info("✅ Pipeline completed successfully!")
        logger.info("=" * 60)
        logger.info("\nNext steps:")
        logger.info("1. Load processed CSV files to your SQL database using schema.sql")
        logger.info("2. Use the Power BI template with connection to the SQL tables")
        logger.info("3. Configure refresh schedule in Power BI")

def main():
    pipeline = DataPipeline()
    pipeline.run_pipeline()

if __name__ == '__main__':
    main()
