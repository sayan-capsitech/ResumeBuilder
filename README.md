# Project : ResumeBuilder

Welcome to the ResumeBuilder project! This application is designed to help users create professional resumes using a dynamic and user-friendly interface. The project utilizes a stack of modern technologies, including React, TypeScript, Fluent UI, Formik, and C# for the backend.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Intuitive and responsive user interface
- Form-based input for easy resume creation
- Real-time preview of the resume
- Backend integration for storing and retrieving user-defined templates

## Technologies Used

- **Frontend:**
  - React
  - TypeScript
  - Fluent UI (for UI components)
  - Formik (for form management and validation)

- **Backend:**
  - C# (ASP.NET Core for RESTful API development)
  - Entity Framework Core (for database management)

## Getting Started

To get a copy of the project up and running on your local machine, follow these steps:

### Prerequisites

- Ensure you have the following installed:
  - Node.js (version 14 or above)
  - npm (Node package manager)
  - .NET SDK (version 6.0 or above)
  - A code editor (like Visual Studio or Visual Studio Code)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/resumebuilder.git
   cd resumebuilder
   ```

2. **Frontend Setup:**
   Navigate to the client folder and install the dependencies:
   ```bash
   cd client
   npm install
   ```

3. **Backend Setup:**
   Navigate to the server folder and restore the packages:
   ```bash
   cd server
   dotnet restore
   ```

4. **Run the Backend:**
   Start the backend server:
   ```bash
   dotnet run
   ```

5. **Run the Frontend:**
   Open a new terminal, navigate back to the client folder, and run the frontend:
   ```bash
   cd client
   npm start
   ```

Now, you should be able to access the ResumeBuilder application at `http://localhost:3000`.

## Usage

Once the application is up and running, you can:

- Navigate through the different sections to fill out your resume details.
- Use the real-time preview feature to see how your changes reflect on the document.
- Save your resume data for future use

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for checking out the ResumeBuilder Project! If you have any questions, feel free to reach out or open an issue in the repository. Happy coding!
