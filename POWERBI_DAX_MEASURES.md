# Power BI Dashboard - DAX Measures & Configuration Guide

## Overview
This guide provides the complete set of DAX measures, relationships, and configuration steps to build the interactive sales performance and inventory dashboard in Power BI.

---

## Part 1: Data Model Setup

### Step 1: Import Tables
1. Open Power BI Desktop
2. **Get Data** → SQL Database (or your database type)
3. Connect to your database and import these tables:
   - `dim_product`
   - `dim_store`
   - `fact_sales`
   - `fact_inventory`

### Step 2: Set Up Relationships
In the **Model** view, establish these relationships:

| From Table | From Column | To Table | To Column | Type |
|------------|------------|----------|-----------|------|
| fact_sales | sku | dim_product | sku | Many-to-One |
| fact_sales | store_id | dim_store | store_id | Many-to-One |
| fact_inventory | sku | dim_product | sku | Many-to-One |
| fact_inventory | store_id | dim_store | store_id | Many-to-One |

---

## Part 2: DAX Measures

### Create a **Measures** table in Power BI:
1. In Power BI, go to **Modeling** → **New Table**
2. Paste this DAX formula to create an empty measures table:
   ```dax
   Measures = ROW("Placeholder", 1)
   ```
3. Define all measures below in this table

### Core Revenue & Sales Measures

#### Total Revenue
```dax
Total Revenue = SUM(fact_sales[total_sale])
```

#### Total Units Sold
```dax
Total Units Sold = SUM(fact_sales[quantity])
```

#### Total COGS (Cost of Goods Sold)
```dax
Total COGS = SUM(fact_sales[cost_of_goods])
```

#### Total Gross Margin
```dax
Total Gross Margin = SUM(fact_sales[gross_margin])
```

#### Gross Margin %
```dax
Gross Margin % = 
    DIVIDE(
        [Total Gross Margin],
        [Total Revenue],
        0
    ) * 100
```

#### Average Transaction Value
```dax
Avg Transaction Value = 
    DIVIDE(
        [Total Revenue],
        COUNTROWS(fact_sales),
        0
    )
```

### Inventory Measures

#### Total Stock On Hand
```dax
Total Stock On Hand = 
    SUMX(
        DISTINCT(fact_inventory[sku]),
        CALCULATE(
            SUM(fact_inventory[stock_on_hand]),
            fact_inventory[snapshot_date] = MAX(fact_inventory[snapshot_date])
        )
    )
```

#### Total Inventory Value
```dax
Total Inventory Value = 
    SUMX(
        DISTINCT(fact_inventory[sku]),
        CALCULATE(
            SUM(fact_inventory[inventory_value]),
            fact_inventory[snapshot_date] = MAX(fact_inventory[snapshot_date])
        )
    )
```

#### Average Inventory Turnover
```dax
Avg Inventory Turnover = 
    AVERAGEX(
        DISTINCT(fact_inventory[sku]),
        CALCULATE(
            AVERAGE(fact_inventory[inventory_turnover_ratio]),
            fact_inventory[snapshot_date] = MAX(fact_inventory[snapshot_date])
        )
    )
```

#### Low Stock Items Count
```dax
Low Stock Items = 
    COUNTROWS(
        FILTER(
            DISTINCT(fact_inventory[sku]),
            CALCULATE(
                MAX(fact_inventory[stock_on_hand]),
                fact_inventory[snapshot_date] = MAX(fact_inventory[snapshot_date]),
                fact_inventory[stock_status] = "Low Stock"
            ) > 0
        )
    )
```

### Performance Metrics

#### Revenue YoY Growth %
```dax
Revenue YoY Growth % = 
    DIVIDE(
        [Total Revenue] - CALCULATE([Total Revenue], DATEADD(fact_sales[transaction_date], -365, DAY)),
        CALCULATE([Total Revenue], DATEADD(fact_sales[transaction_date], -365, DAY)),
        0
    ) * 100
```

#### Units Sold per Store (Average)
```dax
Avg Units per Store = 
    DIVIDE(
        [Total Units Sold],
        DISTINCTCOUNT(fact_sales[store_id]),
        0
    )
```

#### Number of Transactions
```dax
Transaction Count = COUNTROWS(fact_sales)
```

#### Revenue per Store
```dax
Revenue per Store = 
    DIVIDE(
        [Total Revenue],
        DISTINCTCOUNT(fact_sales[store_id]),
        0
    )
```

---

## Part 3: Dashboard Pages & Visuals

### Page 1: **Sales Overview** (Executive Dashboard)
**Visuals:**
1. **KPI Card - Total Revenue**: Display [Total Revenue]
2. **KPI Card - Total Units Sold**: Display [Total Units Sold]
3. **KPI Card - Gross Margin %**: Display [Gross Margin %]
4. **KPI Card - Avg Transaction Value**: Display [Avg Transaction Value]
5. **Line Chart - Revenue Trend**: X-axis: `transaction_date`, Y-axis: [Total Revenue] (Daily)
6. **Clustered Column Chart - Sales by Store**: X-axis: `store_name`, Y-axis: [Total Revenue]
7. **Clustered Column Chart - Sales by Category**: X-axis: `category`, Y-axis: [Total Units Sold]
8. **Gauge Chart - Gross Margin %**: [Gross Margin %] (Min: 0%, Max: 100%, Target: 40%)

**Slicers:**
- Date range (transaction_date)
- Store (store_name)
- Category (category)
- Region (region)

---

### Page 2: **Inventory Analysis**
**Visuals:**
1. **KPI Card - Total Stock On Hand**: Display [Total Stock On Hand]
2. **KPI Card - Inventory Value**: Display [Total Inventory Value]
3. **KPI Card - Avg Turnover Ratio**: Display [Avg Inventory Turnover]
4. **Table - Current Inventory**: Columns: product_name, category, store_name, stock_on_hand, reorder_level, stock_status
5. **Donut Chart - Stock Status Distribution**: Legend: `stock_status`, Values: COUNT
6. **Bar Chart - Turnover by SKU**: X-axis: `product_name`, Y-axis: [Avg Inventory Turnover]
7. **Table - Low Stock Alert**: Filter for `stock_status` = "Low Stock"

**Slicers:**
- Snapshot Date (snapshot_date)
- Store (store_name)
- Category (category)

---

### Page 3: **Product Performance**
**Visuals:**
1. **Table - SKU Performance Detailed**: Columns:
   - product_name
   - category
   - [Total Units Sold]
   - [Total Revenue]
   - [Gross Margin %]
   - [Avg Inventory Turnover]
2. **Top 10 Products - Revenue**: Bar chart, X-axis: product_name, Y-axis: [Total Revenue] (Top 10)
3. **Top 10 Products - Units Sold**: Bar chart, X-axis: product_name, Y-axis: [Total Units Sold] (Top 10)
4. **Bottom 10 Products - Revenue**: To identify underperformers
5. **Profit Contribution**: 100% Stacked Column by category

**Slicers:**
- Date range
- Category
- Store

---

### Page 4: **Store & Regional Analysis**
**Visuals:**
1. **Map Visual**: `store_name` as location, size by [Total Revenue]
2. **KPI by Store**: Table showing store_name, revenue, units_sold, margin_%
3. **Regional Comparison**: Clustered bar chart by region
4. **Heat Map - Performance Matrix**: Rows: store_name, Columns: category, Values: [Total Revenue]

**Slicers:**
- Date range
- Region

---

### Page 5: **Margin Analysis**
**Visuals:**
1. **Line Chart - Margin Trend**: X-axis: transaction_date, Y-axis: [Gross Margin %]
2. **Clustered Column - Margin by Category**: X-axis: category, Y-axis: [Gross Margin %]
3. **Table - Margin by SKU**: Columns: product_name, unit_price, COGS, margin_amount, margin_%
4. **Waterfall Chart**: Show breakdown of revenue → margin

**Slicers:**
- Date range
- Category
- Store

---

## Part 4: Interactive Features

### Drill-Through
1. **Sales Overview** → Product Performance:
   - Right-click on any product in the Sales Overview chart
   - Select "Drill through" → Product Performance page
   - Automatically filters to that product

2. **Sales Overview** → Store Analysis:
   - Right-click on any store name
   - "Drill through" → Store & Regional Analysis page

### Bookmarks (Optional)
Create bookmarks for quick views:
- "This Month"
- "Year to Date"
- "Last Quarter"
- "All Data"

---

## Part 5: Refresh Strategy

### Scheduled Refresh (Power BI Premium/Online)
1. Go to **Settings** → **Scheduled Refresh**
2. Set frequency:
   - Daily: 8:00 AM (after overnight data loads)
   - Or every 6 hours if near real-time needed

### Manual Refresh
Users can refresh any time by pressing **Refresh** in Power BI or by scheduling with:
- Power BI Gateway (for on-premise SQL Server)
- Direct SQL connection (for cloud databases like Azure SQL)

### Python Script Automation (Optional)
Schedule `data_pipeline.py` to run daily using:
- **Windows Task Scheduler** (Windows)
- **Cron** (Linux/Mac)
- **GitHub Actions** or **Azure DevOps** (cloud-based)

Example cron (Linux): Run daily at 7:00 AM
```bash
0 7 * * * cd /path/to/project && python data_pipeline.py
```

---

## Part 6: Design & Formatting

### Color Scheme (Customize to Your Brand)
Update all visuals with your brand palette in **Format** pane:
- Primary Color (Revenue, Key metrics): `#0078D4` (Blue)
- Secondary Color (Margin): `#107C10` (Green)
- Highlight (Negative/Alert): `#D83B01` (Red)
- Neutral: `#F3F2F1` (Light Gray)

### Themes
Apply a consistent theme:
1. **File** → **Switch Theme** → Choose or create custom theme

### Formatting Tips
- Use light backgrounds for easy reading
- Bold and larger fonts for KPI cards
- Consistent axis labels across all charts
- Add data labels where appropriate

---

## Part 7: Security & Sharing

### Row-Level Security (RLS) - Optional
If you need store managers to see only their store data:
1. Go to **Modeling** → **Manage Roles**
2. Create role "Store Manager"
3. Add DAX filter: `dim_store[store_id] = USERNAME()`
4. Publish and assign users to roles

### Sharing
1. Publish report to Power BI Service
2. Share with team/stakeholders
3. Stakeholders can interact with filters and slicers without editing

---

## Troubleshooting

### Measure Returns BLANK
- Check relationships are correctly set up
- Use **ALLEXCEPT()** if filtering is too aggressive
- Verify table cardinality

### Slow Performance
- Use aggregated views (v_daily_sales_summary, v_monthly_kpi)
- Reduce fact table rows with date filters
- Archive older data to separate tables

### Refresh Fails
- Verify database connection credentials
- Check database is accessible and online
- Review Power BI Gateway status (if using)

---

## Summary
This dashboard provides complete visibility into:
- ✅ Daily/weekly/monthly revenue trends
- ✅ Product and category performance
- ✅ Regional and store-level KPIs
- ✅ Inventory health and turnover
- ✅ Margin analysis and profitability
- ✅ Interactive drill-through for deeper insights

Next steps: Use this as a template and adapt column names/measures to your actual data fields.
