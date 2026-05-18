# News Article CRUD Application

This project is a complete front-end application for managing news articles. It provides full CRUD (Create, Read, Update, Delete) functionality, allowing users to view a list of articles, add new ones, edit existing ones, and remove them. The application is built with React, TypeScript, and Vite, and it interacts with a mock REST API powered by `json-server`.

## Features

*   **List and View Articles**: Displays all articles with their title, summary, publisher, and publication date.
*   **Create Articles**: A dedicated form with validation to add new articles.
*   **Update Articles**: Modify the details of any existing article through a pre-populated form.
*   **Delete Articles**: Remove articles from the list with a confirmation prompt.
*   **Live Search**: Filter articles in real-time by searching for a title or publisher.
*   **Custom Date Picker**: A user-friendly calendar widget for selecting the article's publication date.
*   **Client-Side Routing**: Utilizes React Router for seamless navigation between viewing, creating, and editing pages.

## Tech Stack

*   **Framework/Library**: React
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **HTTP Client**: Axios
*   **Routing**: React Router
*   **Mock Backend**: `json-server`

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js] (which includes npm) installed on your computer.

### Installation & Usage

1.  **Clone the repository:**
    git clone https://github.com/nicoleleechiaqi/news-article-assignment-handshakes.git

2.  **Navigate into the project directory:**
    cd news-article-assignment-handshakes

3.  **Install the dependencies:**
    npm install

4.  **Run the Mock API Server:**
    The application requires a backend to function. Open a terminal and run the following command to start the `json-server`.
    npm run server

    This will serve the `db.json` file on `http://localhost:3001`. Keep this terminal window open.

5.  **Run the React Application:**
    In a **new** terminal window, start the Vite development server.
    npm run dev

    The application will be running and accessible at the URL provided in the terminal (usually `http://localhost:5173`).

## Available Scripts

This project comes with several scripts defined in `package.json`:

*   `npm run dev`
    Starts the Vite development server for the front-end application.

*   `npm run server`
    Starts the `json-server` mock API. **You must have this running in a separate terminal for the application to work correctly.**

*   `npm run build`
    Compiles TypeScript and builds the application for production into the `dist` folder.

*   `npm run lint`
    Runs ESLint to analyze the code for potential errors and style issues.

*   `npm run preview`
    Serves the production build locally to preview the final application. You must run `npm run build` first.