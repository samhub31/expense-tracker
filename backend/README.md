# Personal Expense Tracker - Frontend

Frontend application for the Personal Expense Tracker built with React, React Router, and TailwindCSS.

## Features

- User authentication (register/login)
- Add, edit, view, and delete expenses
- Filter expenses by category and date range
- View spending statistics by category
- Visualize spending trends with charts
- Responsive design with TailwindCSS

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create a `.env` file based on `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update the `.env` file with your backend API URL:
\`\`\`
VITE_API_URL=http://localhost:5000/api
\`\`\`

4. Make sure the backend server is running on port 5000

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will run on http://localhost:3000

## Build for Production

\`\`\`bash
npm run build
\`\`\`

The build files will be in the `dist` directory.

## Project Structure

- `/src/components` - Reusable React components
- `/src/context` - Context providers for state management
- `/src/pages` - Page components
- `/src/utils` - Utility functions and API configuration
