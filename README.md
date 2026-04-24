# TrustAI: Indian Food Transparency & Health Platform

TrustAI is a premium, mobile-first web application designed to empower Indian consumers with science-backed food transparency. By scanning product labels or barcodes, users get unbiased health ratings, FSSAI verification, and personalized nutritional analysis based on their specific health goals (Diabetic, Weight Loss, Gym Mode, etc.).

---

## 🚀 Key Features

- **Multi-Modal Scanning**: Scan product barcodes or upload photos of nutrition labels.
- **AI-Powered OCR**: Automatically extracts nutritional data and FSSAI license numbers from images.
- **Global Grading Standards**: Analysis based on 4 distinct health grading systems (India-Custom, EU Nutri-Score, Singapore Nutri-Grade, and Japanese Balance).
- **Personalized Health Scoring**: Ratings change based on your profile (e.g., stricter sugar penalties for diabetics).
- **Smart Swaps**: Recommends healthier, locally available alternatives for unhealthy products.
- **FSSAI Verification**: Instantly checks if a product's license is valid and provides a direct link to report non-compliant products to the FSSAI portal.

---

## 🧠 Grading System: How it Works

TrustAI uses a weighted algorithm that aggregates four global standards to provide a comprehensive **FoodTrust Rating**.

### 1. Custom TrustAI Score (0–10)
Our proprietary system designed specifically for the Indian diet.
- **Penalties**: High sugar (>15g), saturated fat (>5g), and any trans fat.
- **Personalization**:
  - **Diabetic**: Extra penalties for sugar >5g.
  - **Weight Loss**: Extra penalties for calories >300 and fat >10g.
  - **Gym Mode**: Protein rewards (>20g) and stricter sugar limits.

### 2. Nutri-Score (A–E)
The European standard that calculates points based on:
- **Negative Elements**: Energy, sugars, saturated fats, and sodium.
- **Positive Elements**: Fiber and protein.

### 3. Nutri-Grade (A–D)
The Singaporean grading system focused heavily on sugar and saturated fat content per 100g.

### 4. Japanese Balance Grade
A balance-based system that evaluates the ratio of macronutrients.
- **Excellent/Good/Fair/Poor**: Based on a 100-point scale penalizing high fat/sodium and rewarding high fiber/protein.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v4** (Modern Styling)
- **Framer Motion** (Smooth interactive animations)
- **Lucide React** (Premium Iconography)
- **React Router DOM** (Navigation)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Data Persistence)
- **Cloudinary** (Image Storage)
- **Google Vision API** (OCR Processing)
- **Open Food Facts API** (Global Product Database)

---

## 🔧 Installation & Build

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Vision API Key
- Cloudinary Account (Optional, for image uploads)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/wazirkazimi/TrustAI.git
   cd TrustAI
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_vision_key.json
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Running the Project

- **Start Backend**: `cd server && npm run dev`
- **Start Frontend**: `cd client && npm run dev`

The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```
TrustAI/
├── client/             # Vite + React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages (Home, Scan, Results, etc.)
│   │   └── services/   # Frontend API utilities
├── server/             # Node.js + Express Backend
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints
│   ├── services/       # OCR, Grading, and OFF Integration
│   └── middleware/     # Auth and Upload handling
└── README.md
```

---

## ⚖️ License
This project is built for transparency and educational purposes. Data is sourced from Open Food Facts and analyzed using public nutritional science standards.
