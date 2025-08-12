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

### **Acad-AI Frontend Branching Structure Update**

**Effective Date:** August 2, 2025

Please note the following updates to our **Acad-AI Frontend** repository branching structure:

### **Branch Renaming**

To enhance clarity and streamline our development workflow, the following branch names have been updated:

- `dev` ➝ `prod`
- `beta-test` ➝ `version`
- `main` ➝ `staging`

Kindly update your local repositories accordingly to reflect these changes.

> Note: Prior to these changes, the default branch was updated from main to dev. As such, our current default branch is now prod.

---

### **Branching Hierarchy**

### **Primary Branches:**

1. `prod` – **Production Branch**

   This branch reflects the latest stable version of the application and must not be modified during the workweek except in the case of emergency fixes (e.g., critical bugs or fatal errors). Updates to this branch should occur only at the **end of each week (Friday)** following successful testing in the `staging` branch.

2. `version` – **Versioning Branch**

   This branch serves as the integration point for features and enhancements intended for the next major version of Acad-AI. All changes targeting future releases should be merged here.

   Final approval for merging this branch into `prod` must be obtained from [Nsikak](https://github.com/Nsiikak) and [Anjola](https://github.com/lifewjola).

3. `staging` – **Staging Branch**

   All new features, improvements, and fixes are to be merged into this branch for testing and review prior to their promotion to `prod`. This ensures system stability and alignment with project goals.

### **Secondary Branches:**

- `ezekiel`
- `pellumi`
- `pentest-branch`

These branches serve as dedicated workspaces for individual developers and testing efforts. All secondary developers are encouraged to **create feature-specific branches** from any of the relevant primary branches and submit pull requests upon completion.

---

### **Developer Responsibilities**

- **Primary Frontend Developers** are assigned personal branches and may merge directly into `staging`, `version`, or (in special cases) `prod`, ensuring due diligence and testing has been conducted.
- **Secondary Frontend Developers** must create a feature branch from the appropriate base, push their changes, and initiate a pull request for review.

> This structure is not a reflection of your capabilities but a deliberate strategy to maintain transparency, accountability, and system integrity.

We appreciate your adherence to these guidelines and your continued dedication to building a resilient and scalable system.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

## Contact

For any questions or suggestions, feel free to reach out to the project maintainers or open an issue on the repository. You can also reach out to [Ezekiel](mailto:ikinwotezekiel@gmail.com), [Philip](mailto:philip.edward1510@gmail.com) or visit their GitHub profile [ZeeksX](https://github.com/ZeeksX), [Pellumi](https://github.com/Pellumi).

---
