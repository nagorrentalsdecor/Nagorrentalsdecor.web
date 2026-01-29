# Supabase Setup Guide for Nagor Rental

This project has been configured to support **Supabase** as its primary database. Follow these steps to set up your project.

## 1. Create a Supabase Project

1.  Go to [database.new](https://database.new) and sign in/sign up.
2.  Create a new project (e.g., "Nagor Rental").
3.  Set a database password and choose a region near you.
4.  Wait for the project to finish "Provisioning".

## 2. Get Your Credentials

1.  In your Supabase project dashboard, go to the **Project Settings** (gear icon) > **API**.
2.  Find the `Project URL` and `anon public` key.

## 3. Configure Environment Variables

1.  In your `client` folder, create a file named `.env.local` (if it doesn't exist).
2.  Add the following lines, replacing the values with your actual Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
    ```

    > **Note:** Whenever these variables are present, the application will attempt to use Supabase. If you remove them, it will fall back to the local `data.json` file (Legacy Mode).

## 4. Set Up the Database Schema

1.  Go to the **SQL Editor** in your Supabase Dashboard (sidebar icon looks like `>_`).
2.  Click **New Query**.
3.  Open the file `client/supabase_schema.sql` in your local editor.
4.  Copy the **entire content** of `supabase_schema.sql`.
5.  Paste it into the Supabase SQL Editor.
6.  Click **Run** (bottom right).

    *Success! This will create all necessary tables (packages, items, bookings, messages, settings) and seed them with initial data.*

## 5. Verify Setup

1.  Restart your local development server:
    ```bash
    npm run dev
    ```
2.  Visit the **Admin Dashboard** > **Inventory**.
3.  If you see the items (Gold Phoenix Chair, etc.), your connection is working!
    *   *Tip: You can try adding a new item. If it appears in your Supabase "items" table, you are fully live.*

## Optional: Row Level Security (RLS) policies

By default, the tables created are public or readable by the server. Since we are using the helper client mainly from server-side API routes, this is secure. However, for client-side protection, consider enabling RLS in the Authentication > Policies section of Supabase later.
