# LeetCode Clone

A web-based coding practice platform inspired by LeetCode, built with React and Vite. This application provides an interactive environment for solving coding problems with a Monaco code editor and real-time problem browsing.

## Features

- 📝 **Problem Panel**: Browse through 20 medium-difficulty coding problems
- 💻 **Code Editor**: Monaco Editor integration for a professional coding experience
- 📊 **Resizable Panels**: Customizable layout using react-resizable-panels
- 🎯 **Problem Details**: View problem descriptions, examples, constraints, and topics
- ⚡ **Fast Development**: Powered by Vite for instant hot module replacement

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js) or **pnpm** or **yarn**

You can verify your installation by running:
```bash
node --version
npm --version
```

## Installation

Follow these steps to set up the project on your local device:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leetcode-clone
   ```

2. **Install dependencies**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Or using pnpm:
   ```bash
   pnpm install
   ```
   
   Or using yarn:
   ```bash
   yarn install
   ```

   This will install all required dependencies including:
   - React 18.3.1
   - Vite 4.5.14
   - Monaco Editor
   - React Resizable Panels

3. **Verify installation**
   
   After installation completes, you should see a `node_modules` folder in the project directory.

## Running the Project

### Development Mode

To start the development server with hot reload:

```bash
npm run dev
```

The application will start at `http://localhost:5173` (default Vite port). Open this URL in your browser to view the application.

### Build for Production

To create a production-ready build:

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Previews the production build locally |

## Project Structure

```
leetcode-clone/
├── src/
│   ├── components/
│   │   ├── ProblemPanel.jsx       # Problem list and details
│   │   ├── ProblemPanel.css
│   │   ├── EditorPanel.jsx        # Monaco code editor
│   │   ├── EditorPanel.css
│   │   ├── ExplanationPanel.jsx   # Problem explanations
│   │   └── ExplanationPanel.css
│   ├── App.jsx                     # Main application component
│   ├── App.css
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── problems.json                   # 20 LeetCode medium problems
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── package.json                    # Project dependencies and scripts
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## Technology Stack

- **React 18.3.1** - UI library
- **Vite 4.5.14** - Build tool and development server
- **Monaco Editor** - VS Code's code editor
- **React Resizable Panels** - Resizable panel layout

## Problems Database

The `problems.json` file contains 20 medium-difficulty LeetCode problems covering various topics:
- Arrays & Strings
- Linked Lists
- Trees & Graphs
- Dynamic Programming
- Backtracking
- And more...

## Troubleshooting

### Port already in use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.). Check the terminal output for the actual port.

### Module not found errors
If you encounter module errors, try deleting `node_modules` and reinstalling:
```bash
rm -rf node_modules
npm install
```

### Clear Vite cache
If you experience caching issues:
```bash
rm -rf node_modules/.vite
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter any issues or have questions, please open an issue in the repository.

---

Happy Coding! 🚀
