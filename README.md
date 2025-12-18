This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# 📂 MediaValet Attribute Bulk Update Tool

A web-based tool built with **Next.js** and **Tailwind CSS** that lets you **update multiple MediaValet asset attributes at once using an Excel file**. Upload your spreadsheet, fill in the fields you want to update, and process all changes in bulk—no manual editing needed per asset.

---

## 🚀 Features

- Bulk update MediaValet asset metadata via Excel upload  
- Supports partial updates (only filled columns are processed)  
- Simple two-step workflow: **Upload → Process**  
- Clean, responsive UI powered by Tailwind CSS  
- Excel export & validation support  

---

## 📝 How It Works

### Step 1: Upload Excel File

- Click **Choose File** and select your Excel spreadsheet.  
- Supported Fields (Excel Column Names):

| Column Name | Required | Description |
| ----------- | -------- | ----------- |
| `id`        | ✅       | Asset ID (required) |
| `Title`     | ❌       | Asset title |
| `Filename`  | ❌       | File name |
| `Model Name`| ❌       | Model name |
| `Model Code`| ❌       | Model code |
| `AltText`   | ❌       | Alternative text |
| `Brand`     | ❌       | Brand name |
| `Description`| ❌      | Asset description |
| `Asset Type`| ❌       | Type of asset |

💡 *Tip: Only fill in the columns you want to update—leave the rest blank.*

### Step 2: Start Processing

- Click **Start Bulk Update** to process the file.  
- The system updates all filled attributes for the assets in MediaValet.

---

## 🛠 Tech Stack

- **Next.js** – React framework for server-side rendering and routing  
- **Tailwind CSS** – Utility-first CSS framework for styling  
- **Excel Integration** – Read and process Excel files for bulk updates  

---

## 📂 Usage

1. Clone the repository:  
```bash
git clone https://github.com/yourusername/mediavalet-bulk-update.git
