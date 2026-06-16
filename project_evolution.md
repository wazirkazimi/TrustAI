# TrueBite: Project Evolution & Technical Documentation

This document outlines the complete journey of the TrueBite platform from its initial Product Requirements Document (PRD) to its current production-ready state. It details all the strategic shifts, technological upgrades, and algorithmic improvements that were implemented to realize the vision of an Indian-focused food transparency tool.

---

## 1. Technical Stack Evolution

The most significant changes occurred in the backend architecture to ensure scalability, ease of deployment, and modern database management.

### Initial Stack (Per PRD)
*   **Frontend**: React.js, Tailwind CSS (Mobile-constrained)
*   **Backend**: Node.js, Express
*   **Database**: MongoDB & Mongoose
*   **OCR**: Google Cloud Vision API (using Service Account JSON `GOOGLE_APPLICATION_CREDENTIALS`)
*   **Product Data**: Open Food Facts API (direct frontend calls)

### Current Stack (Live)
*   **Frontend**: React.js (Vite), Tailwind CSS v4, Framer Motion
*   **Database (Migrated)**: **Supabase (PostgreSQL)** - Replaced MongoDB for robust relational data persistence and seamless user management.
*   **OCR (Refined)**: **Google Vision REST API** - Shifted from bulky JSON credentials to a lightweight, secure REST implementation using `GOOGLE_VISION_API_KEY`.
*   **Camera Integration (New)**: `html5-qrcode` - Added to the frontend to enable true, hardware-accelerated live barcode scanning on both desktop and mobile devices.
*   **Product Data Proxy (New)**: **Backend Open Food Facts Proxy** - All external API calls now route through the Node.js backend to bypass browser CORS restrictions and securely handle data fetching.

---

## 2. Core Feature & Algorithmic Improvements

Several core features outlined in the PRD were overhauled to function correctly in real-world scenarios, particularly concerning the Indian market and accurate health grading.

### A. The Grading Algorithms (Strict & Personalized)
*   **The Issue**: The initial grading logic was too lenient. Missing nutritional data defaulted to a perfect 10/10 score, and sugary beverages (which lack fat) were bypassing penalties, resulting in sodas receiving "Excellent" grades.
*   **The Fix**: 
    *   Updated `gradingAlgorithms.js` to aggressively penalize high sugar (>5g/10g) and high calories, correctly classifying sugary drinks as "Poor".
    *   Implemented a fail-safe: Products with `0` or missing nutritional data now accurately display "N/A" or "No Data" rather than a false positive.
    *   The algorithms dynamically adjust based on the user's selected Health Mode (e.g., severe sugar penalties for the 'Diabetic' mode).

### B. Indian Market Focus
*   **The Issue**: Global searches returned irrelevant foreign products.
*   **The Fix**: Injected the `countries_tags_en='india'` parameter into the backend proxy (`openFoodFactsService.js`). The platform now strictly prioritizes and filters for Indian-packaged food products.

### C. Live Barcode Scanning
*   **The Issue**: The initial implementation used mock data or struggled with desktop webcam permissions.
*   **The Fix**: Fully integrated `html5-qrcode` into `Scan.jsx`, creating a dynamic UI that requests camera access and actively reads physical barcodes.

---

## 3. UI/UX & User Flow Enhancements

The platform evolved from a simple mobile MVP into a premium, cross-platform web application.

### A. Responsive Design (Mobile to Desktop)
*   Removed hardcoded mobile container widths (`max-w-[430px]`). The UI components, product cards, and grids (e.g., Results and Home pages) now use responsive CSS grids (`grid-cols-2` scaling to `grid-cols-6`) to utilize full desktop screen real estate perfectly.

### B. Personalized Multi-Step Onboarding
*   Transformed the `Register.jsx` page into an interactive, 4-step survey.
*   Users now input their Age, Primary Goal (Weight Loss, Muscle Gain, etc.), Vegan preference, and Allergies during account creation, ensuring the app is personalized from the very first login.

### C. The "Experts" Integration
*   Removed the generic search from the bottom navigation bar and replaced it with a dedicated **Experts** consultation page.
*   Replaced generic demo data with the actual founders: **Wazir Kazimi** (Co-Founder & CEO) and **Jyotsna Bannur** (Co-Founder & Head of Nutrition), establishing immediate trust and authority.

### D. Intelligent Search Navigation
*   **The Issue**: Clicking category chips (e.g., "Instant Food") resulted in "Product Not Found" because the API didn't recognize literal category strings.
*   **The Fix**: Mapped category UI chips to robust search queries behind the scenes (e.g., clicking "Instant Food" executes a search for "instant noodles"), ensuring immediate, relevant product discovery.

---

## 4. Summary of the Current Platform

TrueBite is now a highly secure, Supabase-backed, fully responsive web application. It successfully leverages Google Vision for OCR and Open Food Facts for deep nutritional data, filtering exclusively for the Indian market. The proprietary TrueBite rating algorithm is strict, accurate, and deeply personalized to the user's metabolic goals, fulfilling and exceeding the initial scope of the PRD.
