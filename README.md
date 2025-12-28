# GuideScope Frontend - Web Discovery Portal

This is the user-facing web application for the GuideScope Discovery Platform, providing a reactive and intuitive interface for clinical guideline discovery.

## 🛠️ Technology Stack
- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Custom tokens)
- **State Management**: React Hooks (Native)

## 📂 Key Components
- `/src/components`: UI Building blocks (Search bars, Result cards, Filters)
- `/src/services`: API client for interacting with the GuideScope Backend
- `/src/assets`: Design tokens and global styles

## 🚀 Getting Started
This application is designed to be run as part of the GuideScope monorepo.
- **Prerequisites**: Node.js 18+, running GuideScope Backend
- **Execution**: Use the scripts in the root `/scripts/` directory:
  - `run-frontend.ps1` (Windows)
  - `./run-frontend.sh` (Linux/macOS)

## 🔧 Environment Configuration
The frontend connects to the backend API (defaulting to `http://localhost:8080`). Configuration can be adjusted in the Vite environment profile.

---
Part of the [GuideScope](..) platform.
