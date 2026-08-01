# Sales & Inventory Analytics Platform
## Complete Data Pipeline + Power BI Dashboard Solution

Transform raw transaction and inventory data into actionable insights with this end-to-end analytics solution.

---

## 📦 What's Included

### 1. **Data Generation** (`data_generator.py`)
Creates realistic sample transaction and inventory data for testing and demonstration.

**Features**:
- 90 days of transaction history with 150+ daily transactions
- 5 store locations across multiple regions
- 6 product SKUs across 4 categories
- Current inventory snapshots with stock status

**Run it**:
```bash
python data_generator.py
```
Output: `/data/raw/` folder with 4 CSV files

---

### 2. **Data Pipeline** (`data_pipeline.py`)
Cleans, validates, and transforms raw data into production-ready fact tables.

**Features**:
- ✅ Data quality validation (missing values, data types, outliers)
- ✅ Automatic field standardization (dates, numeric types)
- ✅ Derived metrics calculation (margins, KPIs, turnover ratios)
- ✅ Dimension table enrichment (products, stores joined to facts)
- ✅ Dynamic paths (no hard-coded paths; works anywhere)
- ✅ Comprehensive logging

**Run it**:
```bash
python data_pipeline.py
```
Output: `/data/processed/` folder with clean CSV files + `schema.sql`

**Output Tables**:
- `sales_fact.csv` - Fact table with all transaction details
- `inventory_fact.csv` - Fact table with stock levels and turnover
- `dim_product.csv` - Product dimension
- `dim_store.csv` - Store dimension

---

### 3. **SQL Schema** (`schema.sql`)
Database-agnostic schema supporting PostgreSQL, SQL Server, MySQL, and others.

**Includes**:
- Dimension tables: Products, Stores
- Fact tables: Sales, Inventory
- Indexes for query performance
- Optional aggregated views for BI performance

**How to use**:
1. Open your SQL tool (pgAdmin, SQL Server Management Studio, MySQL Workbench)
2. Copy and paste `schema.sql` into a new query
3. Execute to create all tables and indexes

---

### 4. **Power BI Configuration** (`POWERBI_DAX_MEASURES.md`)
Complete guide to building the interactive dashboard.

**Includes**:
- Data model relationships and setup
- 20+ DAX measures for KPIs
- 5 dashboard pages with specific visuals
- Slicer and filter configuration
- Drill-through navigation
- Refresh strategy

**Pages**:
1. **Sales Overview** - Executive dashboard with revenue, units, margin trends
2. **Inventory Analysis** - Stock levels, turnover, low-stock alerts
3. **Product Performance** - SKU-level analysis, top/bottom performers
4. **Store & Regional** - Geographic performance, regional comparison
5. **Margin Analysis** - Profitability trends and breakdown

---

### 5. **Analytics Report** (`ANALYTICS_REPORT.md`)
Executive summary with insights, refresh instructions, and troubleshooting.

**Covers**:
- KPI definitions and targets
- Data refresh process (automated scheduling)
- Dashboard navigation and interpretation
- Best practices by role
- Troubleshooting common issues

---

## 🚀 Quick Start

### Step 1: Generate Sample Data
```bash
python data_generator.py
```
Creates sample transaction and inventory CSV files in `/data/raw/`

### Step 2: Clean and Process Data
```bash
python data_pipeline.py
```
Generates clean, joined datasets in `/data/processed/` and `schema.sql`

### Step 3: Create SQL Database
1. Open your SQL database tool
2. Run `schema.sql` to create tables and indexes
3. Import CSV files from `/data/processed/` to SQL tables

### Step 4: Build Power BI Dashboard
1. Open Power BI Desktop
2. Connect to your SQL database
3. Follow `POWERBI_DAX_MEASURES.md` to add tables, relationships, and measures
4. Create 5 dashboard pages with visuals and slicers
5. Publish to Power BI Service (optional)

### Step 5: Set Up Automated Refresh
- Schedule `data_pipeline.py` to run daily (see `ANALYTICS_REPORT.md`)
- Configure Power BI refresh (automatic daily after data loads)

---

## 📊 Directory Structure

```
project/
├── README.md                          (this file)
├── data_generator.py                  (sample data creation)
├── data_pipeline.py                   (cleaning and transformation)
├── schema.sql                         (database schema)
├── POWERBI_DAX_MEASURES.md           (dashboard configuration)
├── ANALYTICS_REPORT.md               (insights and refresh guide)
│
├── data/
│   ├── raw/                          (source CSV files)
│   │   ├── transactions.csv
│   │   ├── inventory.csv
│   │   ├── products.csv
│   │   └── stores.csv
│   │
│   └── processed/                    (cleaned output files)
│       ├── sales_fact.csv
│       ├── inventory_fact.csv
│       ├── dim_product.csv
│       └── dim_store.csv
│
└── logs/                             (optional, pipeline logs)
```

---

## 🔧 Adapting to Your Data

### Step 1: Replace Sample Data
1. Export your actual transaction data as CSV
2. Export your actual inventory data as CSV
3. Place files in `/data/raw/` with names: `transactions.csv`, `inventory.csv`
4. Ensure required columns match (see Data Schema below)

### Step 2: Update Data Schema
Edit `data_pipeline.py` to match your actual column names:
```python
# In data_pipeline.py, update field names in clean_transactions():
df['your_date_column'] = pd.to_datetime(df['your_date_column'])
df['your_quantity_column'] = pd.to_numeric(df['your_quantity_column'])
# ... and so on
```

### Step 3: Adjust SQL Schema
Update `schema.sql` if your column names differ:
```sql
ALTER TABLE fact_sales RENAME COLUMN total_sale TO revenue;  -- example
```

### Step 4: Update DAX Measures
In `POWERBI_DAX_MEASURES.md`, replace table and column references:
```dax
-- OLD:
Total Revenue = SUM(fact_sales[total_sale])

-- NEW (if column is named "revenue"):
Total Revenue = SUM(fact_sales[revenue])
```

---

## 📋 Required Data Schema

### Minimum Required Columns

**transactions.csv**:
- `transaction_id` - Unique identifier
- `transaction_date` - Date of transaction (YYYY-MM-DD)
- `store_id` - Store identifier
- `sku` - Product SKU/ID
- `quantity` - Units sold (positive integer)
- `unit_price` - Price per unit (decimal)
- `cost_of_goods` - Cost to acquire (decimal)

**inventory.csv**:
- `sku` - Product SKU/ID
- `store_id` - Store identifier
- `stock_on_hand` - Current units (non-negative integer)
- `snapshot_date` - Inventory date (YYYY-MM-DD)

**products.csv**:
- `sku` - Product SKU/ID (must match transactions.csv and inventory.csv)
- `product_name` - Display name
- `category` - Category name (for grouping)
- `cost` - Standard cost (decimal)
- `retail_price` - Retail price (decimal)

**stores.csv**:
- `store_id` - Store identifier (must match transactions.csv and inventory.csv)
- `store_name` - Display name
- `region` - Region for geographic analysis

---

## 🔄 Automated Refresh Setup

### Windows (Task Scheduler)
1. Open **Task Scheduler**
2. **Create Basic Task** → Name: "Daily Sales Refresh"
3. **Trigger**: Daily at 7:00 AM
4. **Action**: `C:\Python\python.exe C:\path\to\data_pipeline.py`
5. Save

### Linux/Mac (Cron)
```bash
# Edit crontab
crontab -e

# Add this line (runs at 7:00 AM daily)
0 7 * * * cd /path/to/project && python data_pipeline.py
```

### Cloud (GitHub Actions)
Commit `data_pipeline.py` to GitHub and create `.github/workflows/refresh.yml`:
```yaml
name: Daily Data Refresh
on:
  schedule:
    - cron: '0 7 * * *'
jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install pandas
      - run: python data_pipeline.py
```

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'pandas'"
**Solution**:
```bash
pip install pandas numpy
```

### "File not found: data/raw/transactions.csv"
**Solution**: Run `python data_generator.py` first to create sample data, OR place your actual CSV files in `/data/raw/`

### SQL Import Fails
**Solution**:
1. Verify CSV encoding is UTF-8 (not UTF-16 or others)
2. Check column names exactly match SQL schema
3. Use database-specific import tool (e.g., COPY for PostgreSQL, BULK INSERT for SQL Server)

### Power BI Slow
**Solution**:
1. Use aggregated views (v_daily_sales_summary, v_monthly_kpi) instead of raw fact tables
2. Add date filters to Power BI slicers (e.g., last 90 days only)
3. Ensure SQL indexes exist (in schema.sql)

---

## 📈 KPI Definitions

| Metric | Calculation | Purpose |
|--------|-----------|---------|
| **Revenue** | SUM(quantity × unit_price) | Top-line sales |
| **Units Sold** | SUM(quantity) | Volume metric |
| **Gross Margin** | SUM(revenue - COGS) | Profit dollars |
| **Gross Margin %** | (Gross Margin / Revenue) × 100 | Profitability % |
| **Stock On Hand** | Current inventory units | Availability |
| **Inventory Turnover** | Units Sold / Avg Stock | Efficiency |
| **Low Stock** | Stock On Hand ≤ Reorder Level | Replenishment trigger |

---

## 🎨 Customization

### Brand Colors
Update Power BI visuals:
1. Select any visual
2. Go **Format** → **Colors**
3. Change primary/secondary colors to match your brand

### Add More Metrics
In Power BI:
1. Create new measure: **Modeling** → **New Measure**
2. Write DAX formula (examples in POWERBI_DAX_MEASURES.md)
3. Add to dashboard

### Add More Dashboard Pages
1. Create new page: **+ Page**
2. Add visuals for new analysis
3. Connect to data model
4. Add slicers for interactivity

---

## 📞 Support

**Documentation Files**:
- `POWERBI_DAX_MEASURES.md` - Dashboard and DAX formula guide
- `ANALYTICS_REPORT.md` - Insights, refresh process, and troubleshooting
- `schema.sql` - Database schema and indexed views

**Common Questions**:
1. **How often should I refresh?** - Daily recommended; adjust based on business need
2. **Can I use this with Excel instead of SQL?** - Yes, but SQL scales better
3. **How do I add new metrics?** - Create DAX measures in Power BI (see DAX guide)
4. **Can I share this dashboard with stakeholders?** - Yes, publish to Power BI Service

---

## 📄 License & Usage

Use this analytics platform for internal business intelligence and reporting.
- ✅ Customize for your data
- ✅ Share within your organization
- ✅ Extend with additional metrics and pages
- ❌ Do not redistribute or resell

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Aug 2026 | Initial release: data generator, pipeline, schema, Power BI guide |

---

## 🎯 Next Steps

1. **Run the quick start** (Steps 1-5 above)
2. **Review the analytics report** for KPI definitions and insights
3. **Customize to your data** using the adaptation guide
4. **Schedule automated refresh** for daily data updates
5. **Share dashboard** with stakeholders

---

**Questions?** Refer to `ANALYTICS_REPORT.md` (Troubleshooting section) or the relevant documentation file above.

**Ready to build?** Start with `python data_generator.py`! 🚀
