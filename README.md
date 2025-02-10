# Transactions Dashboard Backend

Steps to run
```
git clone https://github.com/arjunsharma6622/roxiler-BE
cd roxiler-BE
npm i
npm run dev
```
Backend will run on http://localhost:8000
<br/><br/>
Add `MONGO_URL = your_mongo_endpoint` in `.env` file
<br/><br/>
Frontend Repo https://github.com/arjunsharma6622/roxiler

## API Docs
- **Initialize Data**  
  `GET /api/transaction/initializeData`  
  - Populates the database with sample transaction data.  
  - Call once to seed the database.

- **Get All Transactions**  
  `GET /api/transaction/all?page=5&limit=2&month=3`  
  - Retrieves paginated transaction data.  
  - **Query Parameters:**  
    - `page` (number) – Page number for pagination.  
    - `limit` (number) – Number of records per page.  
    - `month` (number) – Filters transactions by a specific month (1-12).
   
   
- **Get Transaction Statistics**  
  `GET /api/transaction/stats?month=3`  
  - Provides aggregated statistics for transactions in a given month.  
  - **Response includes:**  
    - Total sales amount.  
    - Number of transactions.  
    - Average transaction value.
   
- **Get Bar Chart Data**  
  `GET /api/transaction/barchart?month=3`  
  - Returns transaction distribution for a selected month in a format suitable for bar charts.  
  - **Response includes:**  
    - Category-wise breakdown of transactions.  

- **Get Pie Chart Data**  
  `GET /api/transaction/piechart?month=3`  
  - Provides transaction data categorized for visualization in a pie chart.  
  - **Response includes:**  
    - Unique categories and their respective transaction counts.  
