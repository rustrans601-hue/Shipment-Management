# React + Tailwind CSS Project

This is a modern web application built with React, TypeScript, Tailwind CSS, and Vite. It includes various plugins and configurations to enhance development experience and functionality.

## Features

- **React** - A JavaScript library for building user interfaces
- **TypeScript** - Strongly typed programming language that builds on JavaScript
- **Tailwind CSS** - Utility-first CSS framework for rapidly building custom designs
- **Vite** - Next-generation frontend build tool that's fast and lightweight
- **ESLint** - Pluggable JavaScript linter for identifying problematic patterns
- **PostCSS** - Tool for transforming CSS with JavaScript plugins

## Project Structure

```
/
├── src/                    # Source files
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Entry point for the React application
│   ├── index.css          # Global styles
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── types/             # TypeScript type definitions
├── plugins/               # Custom Vite/Babel plugins
├── public/                # Static assets
├── README.md              # Project documentation
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── vite.config.ts         # Vite build configuration
```

## Setup and Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository
3. Navigate to the project directory
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Builds the application for production
- `npm run preview` - Locally previews the production build

## Plugins

This project includes custom plugins located in the `plugins/` directory:
- `babel-plugin-inject-data-locator.ts` - Babel plugin for injecting data locators
- `vite-plugin-inject-data-locator.ts` - Vite plugin for injecting data locators

## Additional References

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
