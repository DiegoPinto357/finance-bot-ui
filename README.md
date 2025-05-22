# Finance Bot UI

## Project Description

Finance Bot UI is a modern, React-based single-page application designed to help users manage and analyze their financial portfolios. It supports multiple asset types including stocks, cryptocurrencies, and fixed assets. The app provides detailed portfolio management features such as asset balance tracking, portfolio history, liquidity analysis, and position management with capabilities for swapping and transferring assets.

Built with React, TypeScript, Vite, and Tailwind CSS, the app leverages React Query for efficient data fetching and caching, React Router for navigation, and Radix UI components for accessible and customizable UI elements.

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finance-bot-ui
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

To start the development server with hot reloading:

```bash
npm run dev
# or
yarn dev
```

This will start the app on `http://localhost:5173` (default Vite port).

### Building for Production

To build the app for production deployment:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` folder.

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

### Running Tests

To run the test suite:

```bash
npm run test
# or
yarn test
```

For the interactive test UI:

```bash
npm run test:ui
# or
yarn test:ui
```

## Features and Capabilities

### Portfolio Management

- View and manage portfolio positions with detailed asset information.
- Swap and transfer assets within the portfolio.
- Track portfolio history and liquidity.
- Analyze portfolio differences over time.

### Stock Module

- View stock assets categorized by Brazilian stocks (BR), US stocks (US), and Real Estate Investment Funds (FII).

### Cryptocurrency Module

- Manage cryptocurrency holdings with different strategies:
  - HODL: Long-term holding.
  - Backed: Backed assets.
  - DeFi: Decentralized finance assets.

### Theming and UI

- Light and dark mode support with system theme detection.
- Accessible UI components built with Radix UI.
- Drag and drop support for interactive portfolio management.

### Developer Tools

- React Query Devtools integrated for debugging data fetching.
- ESLint and TypeScript for code quality and type safety.
- Vitest for unit and UI testing.
