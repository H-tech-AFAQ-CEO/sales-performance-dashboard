# Sales & Inventory Performance Analysis
## Executive Summary & Refresh Guide

---

## 📊 Dashboard Overview

This analytics solution consolidates transaction and inventory data into a single source of truth, enabling data-driven decisions across sales, inventory, and finance teams.

### Key Performance Indicators (KPIs)

| Metric | Definition | Target Use |
|--------|-----------|-----------|
| **Total Revenue** | Sum of all sales transactions | Track top-line growth |
| **Units Sold** | Total quantity of items sold | Monitor volume trends |
| **Gross Margin %** | (Revenue - COGS) / Revenue × 100 | Assess profitability |
| **Stock On Hand** | Current inventory units by SKU/store | Optimize stocking levels |
| **Inventory Turnover** | Units Sold / Avg Stock | Measure efficiency |
| **Avg Transaction Value** | Total Revenue / Transaction Count | Understand purchase patterns |

---

## 🎯 Key Insights (Sample Data)

Based on the included sample dataset (90 days):

### Sales Performance
- **Total Revenue Generated**: Varies based on transactions (sample shows ~$40K-$70K)
- **Average Transaction Value**: Indicator of customer spending behavior
- **Best Performing Category**: Review by category mix in dashboard
- **Growth Trend**: Monitor month-over-month growth in Revenue Trend chart

### Inventory Health
- **Current Stock Value**: At-risk inventory that ties up working capital
- **Low Stock Items**: Requires reordering to avoid stockouts
- **Inventory Turnover**: High-turnover SKUs are efficient; low-turnover need review
- **Reorder Actions**: Trigger replenishment orders for items near reorder level

### Margin Analysis
- **Overall Gross Margin %**: Target profitability threshold
- **Margin by Product**: Some SKUs may have better margins
- **Margin Trend**: Watch for deterioration due to pricing or cost changes

---

## 🔄 Data Refresh Process

### Automated Refresh (Recommended)

#### Step 1: Set Up Source Data Location
Place raw data files in a consistent location:
```
/data/raw/
  ├── transactions.csv
  ├── inventory.csv
  ├── products.csv
  └── stores.csv
```

**Important**: Use dynamic paths (no hard-coded paths) so the pipeline works across environments.

#### Step 2: Schedule Data Pipeline
Run `data_pipeline.py` daily before business hours:

**Option A: Windows Task Scheduler**
1. Open Task Scheduler
2. Create Basic Task: "Daily Sales Data Refresh"
3. Trigger: Daily at 7:00 AM
4. Action: `python C:\path\to\data_pipeline.py`
5. Run with highest privileges ✓

**Option B: Linux Cron**
```bash
# Add to crontab (crontab -e)
0 7 * * * cd /path/to/project && python data_pipeline.py >> /var/log/data_pipeline.log 2>&1
```

**Option C: Cloud Automation (Recommended for production)**
- **GitHub Actions**: Commit trigger on raw data updates
- **Azure DevOps**: Scheduled pipeline
- **AWS Lambda**: Serverless scheduling

#### Step 3: Load Processed Data to SQL
After pipeline runs, processed CSVs are generated in `/data/processed/`:
- `sales_fact.csv`
- `inventory_fact.csv`
- `dim_product.csv`
- `dim_store.csv`

Use your SQL tool to load these (examples below):

**PostgreSQL**:
```sql
COPY fact_sales FROM '/path/to/data/processed/sales_fact.csv' 
WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

**SQL Server**:
```sql
BULK INSERT fact_sales
FROM 'C:\path\to\data\processed\sales_fact.csv'
WITH (
    FORMAT = 'CSV',
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n'
);
```

**MySQL**:
```sql
LOAD DATA INFILE '/path/to/data/processed/sales_fact.csv'
INTO TABLE fact_sales
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

#### Step 4: Refresh Power BI
- **If using Power BI Online**: Automatic with scheduled refresh (8:00 AM after data loads)
- **If using Power BI Desktop**: Press **Refresh** manually or set a scheduled refresh via Power BI Gateway

---

## 📋 Data Quality Checks

The pipeline includes automated validations:

1. **Missing Critical Fields**: Rows with missing transaction_id, sku, store_id, or quantity are logged and removed
2. **Data Type Validation**: Non-numeric prices/quantities are flagged
3. **Outlier Detection**: Unusually high/low prices are logged for review
4. **Referential Integrity**: SKU and store_id are validated against dimension tables
5. **Date Validation**: Transaction dates must be in valid range
6. **Dimension Match**: Products and stores must exist in master data

**Review logs in console output** after each pipeline run.

---

## 🛠️ Troubleshooting & Maintenance

### Issue: Pipeline Fails with "File Not Found"
**Solution**: Verify raw data files exist in `/data/raw/`:
```bash
ls -la /path/to/project/data/raw/
```
Expected files: `transactions.csv`, `inventory.csv`, `products.csv`, `stores.csv`

### Issue: SQL Load Fails
**Solution**: 
1. Check CSV file encoding (should be UTF-8)
2. Verify table schema matches processed data columns
3. Ensure database user has INSERT permissions

### Issue: Power BI Dashboard Shows Old Data
**Solution**:
1. Verify pipeline ran successfully (check logs)
2. Verify SQL data was updated (SELECT MAX(transaction_date) FROM fact_sales)
3. Refresh Power BI: **Refresh** button in Home tab
4. Clear cache: File → Options → Privacy → Clear Cache (then refresh)

### Issue: Performance is Slow
**Solution**:
1. Add indexes (provided in schema.sql)
2. Archive old data (older than 1 year) to separate table
3. Use aggregated views (v_daily_sales_summary, v_monthly_kpi)
4. Filter by recent dates (last 90 days) in Power BI

---

## 📈 Dashboard Navigation & Interpretation

### Page 1: Sales Overview
**Best For**: Executive dashboard, daily check-in

**How to Use**:
1. Observe the **Total Revenue** KPI card for daily/weekly performance
2. Use **Revenue Trend** chart to spot seasonal patterns
3. Filter by **Date Range** to compare periods
4. Drill down into **Sales by Category** to identify top/bottom performers
5. Use **Region** slicer to compare geographic performance

**Example Insights**:
- "Revenue peaked in week 3 of month; why? (promotion? holiday?)"
- "South region underperforming; allocate more inventory there?"

---

### Page 2: Inventory Analysis
**Best For**: Operations, supply chain, purchasing team

**How to Use**:
1. Review **KPI Cards**: Stock on hand, inventory value, turnover ratio
2. Check **Low Stock Alert** table for immediate reorder needs
3. Filter by **Store** to see location-specific inventory gaps
4. Analyze **Stock Status Distribution** (% In Stock vs. Low Stock)
5. Use **Turnover by SKU** to identify slow-moving items

**Example Insights**:
- "Premium Widget A has 0.5 turnover; reduce reorder quantity"
- "Downtown Flagship is out of stock on 3 SKUs; replenish immediately"
- "Inventory value is $150K; benchmark against sales to optimize"

---

### Page 3: Product Performance
**Best For**: Category managers, product teams

**How to Use**:
1. Sort **SKU Performance Table** by revenue, margin, or units sold
2. Identify **Top 10 Products** by revenue and units
3. Review **Bottom 10** for potential discontinuation or repositioning
4. Analyze **Profit Contribution** by category
5. Compare margin % across products

**Example Insights**:
- "SKU004 has highest margin %; should we upsell this?"
- "Bundles category only 5% of revenue; undermarketed?"
- "Low-margin items are high-volume; correct pricing strategy?"

---

### Page 4: Store & Regional Analysis
**Best For**: Regional managers, store operations

**How to Use**:
1. View **Map Visual** to see revenue distribution by location
2. Sort **KPI by Store** to rank stores
3. Compare **Regional Performance** and identify trends
4. Use **Heat Map** to find category strengths/weaknesses by store
5. Filter by **Date Range** to track seasonal store performance

**Example Insights**:
- "Suburban Store is consistently #2 in revenue; allocate premium inventory there"
- "Gadgets perform well in North; emphasize this category there"
- "Airport Kiosk has low turnover; reduce product mix there"

---

### Page 5: Margin Analysis
**Best For**: Finance, pricing strategy, cost control

**How to Use**:
1. Track **Margin Trend** line chart over time
2. Identify **Margin by Category** to find profit drivers
3. Review **Margin by SKU** table for individual product profitability
4. Monitor **Waterfall Chart** to see where margin is generated/lost
5. Flag any declining margin trends early

**Example Insights**:
- "Margin declining month-over-month; check costs and pricing"
- "Widgets category has 35% margin; Gadgets only 25%; adjust mix"
- "One supplier's product margin declined 5%; renegotiate or source alternative"

---

## 💡 Best Practices

### For Sales Teams
- Review Sales Overview daily to track momentum
- Set weekly revenue targets based on historical trends
- Use Category and Store filters to identify underperformers
- Drill into specific products to understand what's selling

### For Inventory/Operations
- Check Low Stock Alerts daily to avoid stockouts
- Monitor Inventory Turnover to optimize safety stock
- Use Store/Region filters to balance inventory across locations
- Flag items below reorder level for immediate action

### For Finance/Management
- Review Margin Analysis weekly to monitor profitability
- Use Revenue Trend to forecast cash flow
- Benchmark stores against each other and against targets
- Track seasonal patterns for budget planning

### For Product/Category Managers
- Use Product Performance to identify winners and dogs
- Analyze margin by product to optimize profitability
- Compare across stores to identify regional preferences
- Monitor units sold trends to adjust marketing spend

---

## 🔐 Data Security & Governance

### Access Control
- Share Power BI reports only with authorized personnel
- Use Row-Level Security (RLS) if managers should see only their regions/stores
- Track who accesses the dashboard via Power BI audit logs

### Data Lineage
All data in the dashboard originates from:
1. Raw transaction files (ERP/POS system)
2. Raw inventory files (warehouse management system)
3. Product master data (catalog system)
4. Store master data (locations system)

**Pipeline Process**:
Raw Data → Python Cleaning → SQL Database → Power BI

### Data Retention
- Keep raw data for 3+ years (compliance)
- Archive sales transactions older than 2 years to separate table
- Monthly refresh of inventory snapshots (keep rolling 12 months)

---

## 📞 Support & Documentation

**Files Included**:
- `data_generator.py` - Generates sample data (for demo/testing)
- `data_pipeline.py` - Main cleaning and transformation script
- `schema.sql` - SQL CREATE TABLE statements
- `POWERBI_DAX_MEASURES.md` - All DAX formulas and dashboard structure
- `ANALYTICS_REPORT.md` - This file

**To Get Started**:
1. Run `python data_generator.py` to create sample CSV files
2. Run `python data_pipeline.py` to clean and process data
3. Create SQL database using `schema.sql`
4. Load processed CSVs to SQL tables
5. Follow `POWERBI_DAX_MEASURES.md` to build Power BI dashboard

**Next Steps**:
- Adapt schema and pipeline to your actual data fields
- Update DAX measures to match your business metrics
- Apply your brand color palette to Power BI
- Schedule automated refresh
- Share with stakeholders

---

## 📊 Sample KPI Targets

Use these as benchmarks; adjust based on your business:

| KPI | Industry Benchmark | Target |
|-----|-------------------|--------|
| Gross Margin % | 35-50% | **40-45%** |
| Inventory Turnover | 4-8x/year | **6x/year** |
| Days Inventory Outstanding | 45-90 days | **60 days** |
| Stock-out Rate | <2% | **<1%** |
| Transaction Growth YoY | 5-10% | **8%** |
| Avg Transaction Value | Product dependent | Define by category |

---

**Report Version**: 1.0  
**Last Updated**: August 2026  
**Next Review**: Quarterly  

For updates or customization, contact your analytics team.
