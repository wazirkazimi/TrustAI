# FoodTrust AI: Scan. Verify. Trust.

FoodTrust AI is a premium, fully responsive (desktop and mobile) web application designed to empower Indian consumers with science-backed food transparency. By scanning product labels or live barcodes, users receive unbiased health ratings, FSSAI verification status, and personalized nutritional analysis tailored to their specific metabolic goals (Diabetic, Weight Loss, Gym Mode, etc.).

---

## 👥 The Experts Behind FoodTrust AI

FoodTrust AI was built with a foundation of food science, consumer health, and clinical dietetics:
- **Wazir Kazimi** – Co-Founder & CEO (10+ years in Food Science, Consumer Health, and Policy)
- **Jyotsna Bannur** – Co-Founder & Head of Nutrition (14 years in Clinical Dietetics, Metabolic Syndrome, and Wellness)

---

## 🚀 Key Features

- **Live Barcode Scanning (Desktop & Mobile)**: Utilizing `html5-qrcode`, users can instantly scan barcodes using their desktop webcams or mobile cameras.
- **Indian Market Focus**: Integrated with the Open Food Facts API (filtered for Indian products) to reliably fetch real-world product data, images, and ingredients.
- **Personalized Health Onboarding**: A multi-step registration survey configures the user's profile (Age, Goal, Allergies, Vegan Mode) to provide highly personalized food ratings.
- **Global Grading Standards**: Analyzes products based on 4 distinct health grading systems (FoodTrust Custom, EU Nutri-Score, Singapore Nutri-Grade, and Japanese Balance).
- **Smart Stricter Algorithms**: Advanced logic distinguishes between solid foods and liquids, heavily penalizing high-sugar and high-calorie beverages (e.g., carbonated sodas).
- **Smart Swaps**: Recommends healthier, locally available alternatives for unhealthy or ultra-processed products.
- **FSSAI Verification**: Instantly checks if a product's license is valid and provides a direct link to report non-compliant products to the FSSAI portal.
- **Expert Consultations**: Direct access to book sessions with our leading nutrition experts directly from the dashboard.

---

## 🧠 Grading System: How it Works

FoodTrust AI uses a weighted algorithm that aggregates four global standards to provide a comprehensive **FoodTrust Rating**.

### 1. Custom FoodTrust Score (0–10)
Our proprietary system designed specifically for the Indian diet.
- **Penalties**: Strict penalties for high sugar (>5g/10g/20g limits), saturated fat (>3g), trans fat (>0g), and high calories.
- **Personalization**:
  - **Diabetic**: Severe penalties for sugar content.
  - **Weight Loss**: Extra penalties for calories >150 and fat >5g.
  - **Gym Mode**: Protein rewards (>15g) and stricter sugar limits.

### 2. Nutri-Score (A–E)
The European standard that calculates points based on:
- **Negative Elements**: Energy, sugars, saturated fats, and sodium.
- **Positive Elements**: Fiber and protein.

### 3. Nutri-Grade (A–D)
The Singaporean grading system focused heavily on sugar and saturated fat content.

### 4. Japanese Balance Grade
A balance-based system that evaluates the ratio of macronutrients.
- **Excellent/Good/Fair/Poor**: Based on a 100-point scale penalizing high fat/sodium/sugar and rewarding high fiber/protein.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v4** (Modern Responsive Styling for Desktop & Mobile)
- **Framer Motion** (Smooth interactive animations)
- **Lucide React** (Premium Iconography)
- **html5-qrcode** (Hardware-accelerated barcode scanning)
- **React Router DOM** (Navigation)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Data Persistence)
- **Cloudinary** (Image Storage)
- **Google Vision API** (OCR Processing)
- **Open Food Facts API** (Global Product Database Proxy)

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
│   │   ├── pages/      # Route pages (Home, Scan, Results, Experts, etc.)
│   │   └── utils/      # Grading Algorithms and API utilities
├── server/             # Node.js + Express Backend
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB Schemas
│   ├── routes/         # API Endpoints
│   ├── services/       # OCR, Grading, and OpenFoodFacts Proxy
│   └── middleware/     # Auth and Upload handling
└── README.md
```

---

## ⚖️ License
This project is built for transparency and educational purposes. Data is sourced from Open Food Facts and analyzed using public nutritional science standards.
