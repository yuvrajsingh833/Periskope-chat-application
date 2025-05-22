# Chat Application

A modern chat application built with Next.js, Tailwind CSS, and Supabase.

## Features

- Real-time messaging
- Group chat support
- Chat labels/tags
- User authentication
- Message search
- Chat filters
- File attachments
- Dark/Light mode

## Prerequisites

- Node.js 18+ 
- A Supabase account

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

## Authentication

### Creating an Account

1. Visit the login page
2. Click the "Sign Up" tab
3. Enter your details:
   - Name
   - Email
   - Phone number
   - Password (minimum 6 characters)
4. Click "Sign Up"

### Logging In

1. Visit the login page
2. Enter your email and password
3. Click "Login"

## Usage

- **Sending Messages**: Type your message in the input box and press Enter or click the send button
- **Chat Labels**: Click the label icon to add/remove labels from chats
- **Search**: Use the search bar to find specific messages or chats
- **Filters**: Click the filter button to filter chats by labels
- **Group Chats**: Create group chats by clicking the new chat button and adding multiple participants

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and configurations
- `/providers` - React context providers
- `/stores` - State management (Zustand)
- `/supabase` - Database migrations and types