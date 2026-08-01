# Getting Started - Sales & Inventory Analytics

Your complete analytics platform is ready. Follow these steps to go from raw data to a working Power BI dashboard.

---

## 🎯 What You Have

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Complete overview & quick reference | ✅ Ready |
| `data_generator.py` | Creates sample data for testing | ✅ Executed |
| `data_pipeline.py` | Cleans & transforms raw data | ✅ Executed |
| `schema.sql` | Database schema (all tables & indexes) | ✅ Generated |
| `POWERBI_DAX_MEASURES.md` | Dashboard configuration guide | ✅ Ready |
| `ANALYTICS_REPORT.md` | Insights & refresh instructions | ✅ Ready |
| `/data/raw/` | Raw CSV files (sample data) | ✅ Generated |
| `/data/processed/` | Cleaned CSV files ready for SQL | ✅ Generated |

---

## 📋 3-Step Implementation Path

### STEP 1: Prepare Your Database (30 min)

**Option A: PostgreSQL**
```bash
# Connect to your PostgreSQL database
psql -U username -d database_name -f schema.sql
```

**Option B: SQL Server**
```sql
-- Open SQL Server Management Studio
-- Open schema.sql and execute all statements
```

**Option C: MySQL**
```bash
# Connect to your MySQL database
mysql -u username -p database_name < schema.sql
```

**Option D: Other Databases**
- Adapt `schema.sql` data types to your database
- Main changes: `DECIMAL` → `NUMERIC` (SQL Server), `TIMESTAMP` → `DATETIME`, etc.

✅ After running schema.sql, verify tables exist:
```sql
SELECT * FROM dim_product;
SELECT * FROM dim_store;
SELECT COUNT(*) FROM fact_sales;  -- Should show 13,366
SELECT COUNT(*) FROM fact_inventory;  -- Should show 30
```

---

### STEP 2: Load Your Data (15 min)

**For Sample Data (Testing)**:
Data is already processed in `/data/processed/`:
- `sales_fact.csv` (13,366 rows)
- `inventory_fact.csv` (30 rows)
- `dim_product.csv` (6 rows)
- `dim_store.csv` (5 rows)

**Option A: PostgreSQL**
```bash
# Open terminal in project folder
cd /data/processed

psql -U username -d database_name << EOF
\COPY fact_sales FROM 'sales_fact.csv' WITH (FORMAT csv, HEADER true);
\COPY fact_inventory FROM 'inventory_fact.csv' WITH (FORMAT csv, HEADER true);
\COPY dim_product FROM 'dim_product.csv' WITH (FORMAT csv, HEADER true);
\COPY dim_store FROM 'dim_store.csv' WITH (FORMAT csv, HEADER true);
EOF
```

**Option B: SQL Server**
```sql
-- In SQL Server Management Studio, adjust file path and run:
BULK INSERT dim_product
FROM 'C:\path\to\data\processed\dim_product.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');

BULK INSERT dim_store
FROM 'C:\path\to\data\processed\dim_store.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');

BULK INSERT fact_sales
FROM 'C:\path\to\data\processed\sales_fact.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');

BULK INSERT fact_inventory
FROM 'C:\path\to\data\processed\inventory_fact.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');
```

**Option C: MySQL**
```sql
LOAD DATA INFILE '/absolute/path/to/dim_product.csv'
INTO TABLE dim_product
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Repeat for other 3 tables...
```

**Option D: Excel/GUI Tools**
- Open SQL Server Management Studio, pgAdmin, or MySQL Workbench
- Right-click table → Import Data
- Select CSV file from `/data/processed/`
- Map columns and import

✅ After loading, verify data:
```sql
SELECT COUNT(*) FROM fact_sales;  -- Should be 13,366
SELECT SUM(total_sale) FROM fact_sales;  -- Should be ~$2.6M
SELECT MAX(stock_on_hand) FROM fact_inventory;  -- Should be ~400+
```

---

### STEP 3: Build Power BI Dashboard (45 min)

**Step 3a: Create Data Source**
1. Open **Power BI Desktop**
2. **Get Data** → **SQL Database**
3. Enter your database server and credentials
4. Select tables: `dim_product`, `dim_store`, `fact_sales`, `fact_inventory`
5. Click **Load**

**Step 3b: Set Up Relationships**
1. Go to **Model** view
2. Create these relationships:
   - `fact_sales[sku]` → `dim_product[sku]` (Many-to-One)
   - `fact_sales[store_id]` → `dim_store[store_id]` (Many-to-One)
   - `fact_inventory[sku]` → `dim_product[sku]` (Many-to-One)
   - `fact_inventory[store_id]` → `dim_store[store_id]` (Many-to-One)

**Step 3c: Create Measures**
1. Go to **Modeling** → **New Table** → Paste:
   ```dax
   Measures = ROW("Placeholder", 1)
   ```
2. Create these 10 key measures (from `POWERBI_DAX_MEASURES.md`):
   - Total Revenue
   - Total Units Sold
   - Gross Margin %
   - Total Inventory Value
   - Avg Inventory Turnover
   - Revenue YoY Growth %
   - Transaction Count
   - Low Stock Items
   - Avg Transaction Value
   - Total COGS

**Step 3d: Create 5 Dashboard Pages**
Follow the structure in `POWERBI_DAX_MEASURES.md` Part 3:

| Page | Key Visuals | Slicers |
|------|-------------|---------|
| **Sales Overview** | Revenue KPI, Trend line, Sales by Store/Category | Date, Store, Category, Region |
| **Inventory Analysis** | Stock KPI, Turnover chart, Low Stock alert | Date, Store, Category |
| **Product Performance** | SKU table, Top 10 revenue/units | Date, Category, Store |
| **Store & Regional** | Map, Regional comparison, Heat map | Date, Region |
| **Margin Analysis** | Margin trend, Margin by category, Waterfall | Date, Category, Store |

**Step 3e: Apply Brand Colors**
1. Select any visual → **Format** panel
2. Change colors to match your brand palette
3. Apply consistently across all visuals

✅ Test the dashboard:
- Use date slicer to filter last 30 days
- Click on category → should drill down
- Verify numbers match SQL queries
- Save as `.pbix` file

---

## 🔄 Using Your Real Data

### Phase 1: Prepare Your CSVs
1. Export from your system:
   - Transaction file (required columns: date, store_id, sku, quantity, unit_price, cost_of_goods)
   - Inventory file (required columns: sku, store_id, stock_on_hand, snapshot_date)
2. Save as CSVs to `/data/raw/`:
   - `transactions.csv`
   - `inventory.csv`
   - `products.csv` (optional, or create in code)
   - `stores.csv` (optional, or create in code)

### Phase 2: Adapt Pipeline
1. Open `data_pipeline.py`
2. Update column names in `clean_transactions()` and `clean_inventory()` to match your data
3. Example:
   ```python
   # If your column is "SalesDate" instead of "transaction_date":
   df['SalesDate'] = pd.to_datetime(df['SalesDate'])
   df = df.rename(columns={'SalesDate': 'transaction_date'})
   ```
4. Run pipeline: `python data_pipeline.py`
5. Check output in `/data/processed/` folder

### Phase 3: Load & Refresh
1. Load processed CSVs to your database (Step 2 above)
2. Schedule daily refresh (see `ANALYTICS_REPORT.md` - Automated Refresh section)
3. Power BI will refresh automatically each morning

---

## 📊 Quick Data Quality Checks

Run these SQL queries to verify data integrity:

```sql
-- Check for missing values
SELECT COUNT(*) as null_count FROM fact_sales WHERE sku IS NULL OR store_id IS NULL;

-- Verify date range
SELECT MIN(transaction_date) as first_date, MAX(transaction_date) as latest_date FROM fact_sales;

-- Check revenue calculations
SELECT SUM(total_sale) as total_revenue, AVG(gross_margin_pct) as avg_margin FROM fact_sales;

-- Verify dimension matches
SELECT COUNT(DISTINCT sku) FROM fact_sales;  -- Should match product count
SELECT COUNT(DISTINCT store_id) FROM fact_sales;  -- Should match store count

-- Check inventory health
SELECT COUNT(*) as low_stock FROM fact_inventory WHERE stock_status = 'Low Stock';
```

---

## 🚀 Next: Automate Daily Refresh

Once everything is working, schedule automated updates:

### Windows (Task Scheduler)
```
1. Open Task Scheduler
2. Create Basic Task → "Daily Sales Pipeline"
3. Trigger: Daily at 7:00 AM
4. Action: C:\Python\python.exe C:\path\to\data_pipeline.py
5. Save
```

### Linux (Cron)
```bash
# Run daily at 7 AM
0 7 * * * cd /path/to/project && python data_pipeline.py
```

### GitHub Actions (Cloud)
Commit to GitHub and create `.github/workflows/refresh.yml` (see `README.md`)

---

## 📞 Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| **"No tables found"** | Verify schema.sql ran successfully; tables should appear in your DB |
| **"Import failed - column mismatch"** | Check CSV headers match SQL schema exactly (case-sensitive) |
| **Power BI shows no data** | Refresh data source: File → Options → Data Load → Refresh |
| **Slow dashboard** | Use aggregated views; filter to last 90 days; add indexes |
| **Numbers don't match** | Run SQL queries to verify data loaded; check DAX formulas use correct table names |

---

## 📚 Documentation Reference

- **Quick Overview**: `README.md` (start here)
- **Dashboard Config**: `POWERBI_DAX_MEASURES.md` (all formulas & visuals)
- **Insights & Refresh**: `ANALYTICS_REPORT.md` (deep dive)
- **Data Quality**: Check console output from `data_pipeline.py` after each run

---

## ✅ Success Checklist

- [ ] Schema created in database
- [ ] Sample data loaded (13,366 sales records visible in SQL)
- [ ] Power BI connects to database (Get Data successful)
- [ ] 4 relationships set up in Model view
- [ ] 10+ measures created
- [ ] 5 dashboard pages built with visuals
- [ ] Date slicer working (filters charts dynamically)
- [ ] KPI cards showing values (~$2.6M revenue, etc.)
- [ ] Drill-through working (click product → goes to detail page)
- [ ] Saved as `.pbix` file

---

## 🎯 You're Ready!

Your analytics platform is complete and ready to use. The next step is:

1. **Test with sample data** (already done ✅)
2. **Connect your real data** (replace CSVs in `/data/raw/`)
3. **Schedule daily refresh** (automate pipeline)
4. **Share with stakeholders** (publish Power BI)
5. **Monitor & optimize** (use ANALYTICS_REPORT.md insights)

---

**Questions?** Refer to:
- `README.md` - Detailed documentation
- `ANALYTICS_REPORT.md` - Section: "Troubleshooting & Maintenance"
- `POWERBI_DAX_MEASURES.md` - Dashboard configuration examples

**Ready to build?** → Start with **STEP 1** above! 🚀
