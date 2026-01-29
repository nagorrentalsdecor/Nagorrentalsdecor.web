# Nagor Rental & Decor - Luxury Event Website

A modern, full-stack web application for Nagor Rental & Decor, featuring a luxury frontend design, booking system, and admin dashboard.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion
- **Backend**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL) - *Migrated from local JSON*
- **Styling**: Custom Luxury Theme with Tailwind
- **Icons**: Lucide React

## 📂 Project Structure

- `client/` - Frontend application & API Routes
- `client/supabase_schema.sql` - Database definition
- `server/` - (Deprecated) Legacy Express Backend

## 🛠️ Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally (default: `mongodb://127.0.0.1:27017/nagro_rental`)

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database with initial luxury packages and items:
   ```bash
   npm run data:import
   ```
   *This will create the `nagro_rental` database and populate it with sample data.*

4. Start the server (runs on port 5000):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on port 3000):
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Admin Access

- **Dashboard URL**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- **Admin User**: (See `server/data/users.js` for credentials if implementing auth)
  - Currently, valid credentials are seeded in DB, but the frontend Admin dashboard is accessible directly for demonstration.

## ✨ Features Implemented

- **Luxury Home Page**: Parallax hero, glassmorphism effects, smooth entry animations.
- **Service Showcase**: Elegant cards displaying wedding, corporate, and party decoration services.
- **Rental Inventory**: Browsable catalog of chairs, tents, lights, etc.
- **Responsive Design**: Fully mobile-optimized navbar and layouts.
- **Admin Dashboard**: Overview of bookings, revenue, and inventory status.
- **Testimonials**: Auto-playing slider with client reviews.

## 📝 Configuration

- **Database**: Edit `server/config/db.js` to change MongoDB URI.
- **Images**: Located in `client/public/images`.
