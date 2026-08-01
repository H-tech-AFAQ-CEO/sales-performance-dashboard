"""
Sample Data Generator for Sales & Inventory Analytics
Generates realistic transaction and inventory data for demonstration.
Run this script to create sample CSV files in the data/ directory.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

# Set random seed for reproducibility
np.random.seed(42)

# Configuration
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data', 'raw')
os.makedirs(DATA_DIR, exist_ok=True)

# Define master data
STORE_IDS = ['S001', 'S002', 'S003', 'S004', 'S005']
STORE_NAMES = {
    'S001': 'Downtown Flagship',
    'S002': 'Mall Location',
    'S003': 'Suburban Store',
    'S004': 'Downtown 2nd',
    'S005': 'Airport Kiosk'
}

SKU_DATA = {
    'SKU001': {'name': 'Premium Widget A', 'category': 'Widgets', 'cost': 15.00},
    'SKU002': {'name': 'Standard Widget B', 'category': 'Widgets', 'cost': 8.00},
    'SKU003': {'name': 'Luxury Gadget X', 'category': 'Gadgets', 'cost': 45.00},
    'SKU004': {'name': 'Basic Gadget Y', 'category': 'Gadgets', 'cost': 20.00},
    'SKU005': {'name': 'Accessory Pack', 'category': 'Accessories', 'cost': 5.00},
    'SKU006': {'name': 'Premium Bundle', 'category': 'Bundles', 'cost': 60.00},
}

PRICE_DATA = {
    'SKU001': 35.00,
    'SKU002': 18.00,
    'SKU003': 129.99,
    'SKU004': 49.99,
    'SKU005': 12.99,
    'SKU006': 149.99,
}

def generate_transactions(n_days=90, transactions_per_day=150):
    """Generate transaction records."""
    transactions = []
    start_date = datetime.now() - timedelta(days=n_days)
    
    for day_offset in range(n_days):
        transaction_date = start_date + timedelta(days=day_offset)
        n_trans = np.random.poisson(transactions_per_day)
        
        for _ in range(n_trans):
            store_id = np.random.choice(STORE_IDS)
            sku = np.random.choice(list(SKU_DATA.keys()))
            quantity = np.random.poisson(2) + 1
            
            transactions.append({
                'transaction_id': f'T{len(transactions):06d}',
                'transaction_date': transaction_date.date(),
                'store_id': store_id,
                'sku': sku,
                'quantity': quantity,
                'unit_price': PRICE_DATA[sku],
                'total_sale': quantity * PRICE_DATA[sku],
                'cost_of_goods': quantity * SKU_DATA[sku]['cost'],
            })
    
    df = pd.DataFrame(transactions)
    df['gross_margin'] = df['total_sale'] - df['cost_of_goods']
    df['gross_margin_pct'] = (df['gross_margin'] / df['total_sale'] * 100).round(2)
    return df

def generate_inventory():
    """Generate current inventory and inventory history."""
    inventory = []
    
    for sku in SKU_DATA.keys():
        for store_id in STORE_IDS:
            # Simulate current stock levels
            stock_on_hand = np.random.randint(10, 500)
            reorder_level = np.random.randint(20, 100)
            reorder_quantity = np.random.randint(100, 500)
            
            inventory.append({
                'sku': sku,
                'store_id': store_id,
                'stock_on_hand': stock_on_hand,
                'reorder_level': reorder_level,
                'reorder_quantity': reorder_quantity,
                'last_restock_date': (datetime.now() - timedelta(days=np.random.randint(1, 30))).date(),
                'snapshot_date': datetime.now().date(),
            })
    
    return pd.DataFrame(inventory)

def generate_product_master():
    """Generate product master data."""
    products = []
    
    for sku, data in SKU_DATA.items():
        products.append({
            'sku': sku,
            'product_name': data['name'],
            'category': data['category'],
            'cost': data['cost'],
            'retail_price': PRICE_DATA[sku],
            'status': 'Active',
        })
    
    return pd.DataFrame(products)

def generate_store_master():
    """Generate store master data."""
    stores = []
    
    for store_id in STORE_IDS:
        stores.append({
            'store_id': store_id,
            'store_name': STORE_NAMES[store_id],
            'region': np.random.choice(['North', 'South', 'East', 'West']),
            'status': 'Active',
        })
    
    return pd.DataFrame(stores)

def main():
    print("📊 Generating sample data...")
    
    # Generate all datasets
    transactions_df = generate_transactions(n_days=90, transactions_per_day=150)
    inventory_df = generate_inventory()
    products_df = generate_product_master()
    stores_df = generate_store_master()
    
    # Save to CSV
    transactions_df.to_csv(os.path.join(DATA_DIR, 'transactions.csv'), index=False)
    inventory_df.to_csv(os.path.join(DATA_DIR, 'inventory.csv'), index=False)
    products_df.to_csv(os.path.join(DATA_DIR, 'products.csv'), index=False)
    stores_df.to_csv(os.path.join(DATA_DIR, 'stores.csv'), index=False)
    
    print(f"✅ Data generated successfully in {DATA_DIR}/")
    print(f"\n📈 Dataset Summary:")
    print(f"  • Transactions: {len(transactions_df):,} records")
    print(f"  • Inventory snapshot: {len(inventory_df):,} SKU-store combinations")
    print(f"  • Products: {len(products_df)} unique SKUs")
    print(f"  • Stores: {len(stores_df)} locations")
    print(f"  • Total revenue: ${transactions_df['total_sale'].sum():,.2f}")
    print(f"  • Total gross margin: ${transactions_df['gross_margin'].sum():,.2f}")

if __name__ == '__main__':
    main()
