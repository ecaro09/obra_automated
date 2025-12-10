# AI Assistant Rules for OBRA Furniture App

This document outlines the technical stack and specific library usage guidelines for the OBRA Furniture application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **React**: The core library for building the user interface.
*   **TypeScript**: Used for type safety across the entire codebase, enhancing code quality and developer experience.
*   **Tailwind CSS**: The exclusive utility-first CSS framework for all styling, ensuring responsive and consistent designs.
*   **shadcn/ui & Radix UI**: Pre-installed component libraries for building accessible and customizable UI elements.
*   **Lucide React**: Utilized for all icons throughout the application.
*   **Google Gemini API (`@google/genai`)**: Powers all AI-driven features, including product search, image generation, and chat assistance.
*   **Vite**: The build tool for a fast development experience and optimized production builds.
*   **React Router**: Used for managing client-side routing within the single-page application.
*   **Recharts**: Employed for rendering data visualizations and charts, specifically for the inventory dashboard.
*   **LocalStorage**: Used for client-side persistence of user-specific data like added products and image overrides.

## Library Usage Rules

*   **UI Components**:
    *   Always use React for component logic and structure.
    *   Prioritize `shadcn/ui` and `Radix UI` components where applicable. If a specific component is not available or needs significant customization, create a new, small, focused component in `src/components/`.
    *   Never add new components to existing files; always create a new file for each new component.
*   **Styling**:
    *   **Exclusively use Tailwind CSS utility classes** for all styling. Avoid custom CSS files or inline styles unless absolutely necessary for dynamic, computed styles.
    *   Ensure designs are responsive by utilizing Tailwind's responsive prefixes (e.g., `sm:`, `md:`, `lg:`).
*   **Icons**:
    *   All icons must be imported and used from the `lucide-react` library.
*   **AI Integration**:
    *   All interactions with AI models (image generation, description generation, search, chat) must go through the `services/gemini.ts` file, utilizing the `@google/genai` package.
*   **Charting**:
    *   For any data visualization or charting needs, use the `recharts` library.
*   **Routing**:
    *   If new routes are required, implement them using `react-router-dom` and keep the main routing configuration within `src/App.tsx`.
*   **State Management**:
    *   Use React's built-in `useState`, `useEffect`, and `useMemo` hooks for component-level and application-level state management.
    *   For persistent client-side data, use `localStorage` as demonstrated in `App.tsx`.
*   **Error Handling**:
    *   Do not implement `try/catch` blocks for API calls or component rendering unless specifically requested. Errors should bubble up to allow for centralized debugging and fixing.
*   **Code Structure**:
    *   New components should be placed in `src/components/`.
    *   New pages should be placed in `src/pages/`.
    *   Utility functions should be placed in `src/utils/`.
    *   API service integrations should be placed in `src/services/`.
    *   Custom hooks should be placed in `src/hooks/`.