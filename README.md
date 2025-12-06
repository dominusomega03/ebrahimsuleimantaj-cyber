# TumyTum

TumyTum is an AI-Powered Service & Ecommerce Platform designed to provide infinite happiness through elite services and premium products.

## Features

- **AI Concierge**: Personalized recommendations using Google Gemini.
- **Service Booking**: Book car washes, house cleaning, and luxury customization.
- **Marketplace**: Buy premium car care products and electronics.
- **Loyalty Rewards**: Earn points and climb tiers (Bronze to Diamond).
- **Admin Dashboard**: Manage bookings, services, and products.

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
- **Icons**: Lucide React
- **Charts**: Recharts

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory and add your Google Gemini API Key:
    ```env
    API_KEY=your_api_key_here
    ```
    *Note: For Vercel deployment, add this in the Vercel Project Settings.*

3.  **Run Locally**
    ```bash
    npm run dev
    ```

4.  **Build**
    ```bash
    npm run build
    ```

## Deployment on Vercel

1.  Push this repository to GitHub.
2.  Import the project in Vercel.
3.  Vercel will detect `Vite` automatically.
4.  Add your `API_KEY` in the Environment Variables section during deployment.
5.  Click Deploy.
