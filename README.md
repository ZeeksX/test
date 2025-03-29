# ACAD AI - Frontend

Welcome to the **ACAD AI Frontend** repository! This project is the frontend side of the **ACAD AI Grading System**, designed to automate the grading of theoretical tests and exams using advanced AI techniques. It leverages **React.js** (with Vite.js for project scaffolding) to create a fast, scalable, and user-friendly interface for administrators and users.

## Features

- **AI-Powered Grading Integration**: Interfaces seamlessly with the backend AI models for automated grading.
- **User-Friendly Interface**: Intuitive UI for managing tests, uploading responses, and viewing results.
- **Fast and Scalable**: Built with Vite.js and React.js for quick performance and easy scalability.
- **Customizable Grading Rubrics**: Define grading criteria to suit various exam formats.

## Tech Stack

- **Frontend**: React.js (with Vite.js for fast builds)
- **State Management**: React Context API or Redux (as needed)
- **Styling**: CSS Modules / Tailwind CSS / Styled Components (customizable)
- **Testing**: Jest, React Testing Library

## Installation

To get started, clone the repository and install the dependencies.

```bash
# Clone the repository
git clone https://github.com/ACAD-AI/frontend.git

# Navigate to the project directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build.
- `npm run test`: Run tests.

## Folder Structure

```plaintext
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   |   ├── courses/        # Courses related UI components
│   |   ├── modals/         # Mini UI components
│   |   ├── topnav/         # Top Navigation UI components
│   |   ├── ui/             # UI component kit
│   ├── pages/       # Application pages
│   ├── assets/      # Images, fonts, etc.
│   ├── styles/      # Global and modular CSS
│   ├── features/    # Global state management using redux
│   |   ├── reducers/       # Redux reducers
│   ├── utils/       # Utility functions
│   ├── hooks/       # Custom React hooks
│   ├── contexts/    # Context API providers
│   ├── api/         # API service functions
│   └── App.jsx      # Main application component
├── .eslintrc.js     # ESLint configuration
├── vite.config.js   # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature name'`.
4. Push to your branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

## Contact

For any questions or suggestions, feel free to reach out to the project maintainers or open an issue on the repository. You can also reach out to [Ezekiel](mailto:ikinwotezekiel@gmail.com), [Philip](mailto:philip.edward1510@gmail.com)  or visit their GitHub profile [ZeeksX](https://github.com/ZeeksX), [Pellumi](https://github.com/Pellumi).

---

Happy coding! 🎉
