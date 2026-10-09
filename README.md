# Fruit Store API

A RESTful API for managing an online fruit store. It provides endpoints for managing fruit products and supports database integration, image uploads, and interactive API documentation.

## Features

- **Fruit Management:** Create, retrieve, update, and delete fruit products.
- **MongoDB Integration:** Store and manage data using MongoDB and Mongoose.
- **Image Uploads:** Upload fruit images using Cloudinary and Multer.
- **API Documentation:** Explore and test endpoints using Swagger UI.
- **TypeScript:** Benefit from static typing and improved code maintainability.
- **Environment Configuration:** Keep application settings and sensitive credentials in environment variables.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Cloudinary
- Multer
- Swagger UI
- Git and GitHub

## Prerequisites

Before running this project, ensure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A MongoDB database, either local or hosted on MongoDB Atlas
- A Cloudinary account for image uploads

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Philemon2-tuyishimire/fruit-store-api.git
cd fruit-store-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root directory.

Add the environment variables required by your application:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your actual configuration. If your project requires additional variables, add them as needed.

**Security:** Never commit your `.env` file, database credentials, API secrets, or JWT secrets to GitHub.

### 4. Run the application

Use the development or production command configured in your `package.json`. For example, if a development script is configured:

```bash
npm run dev
```

If the project uses a build script for production, compile and start it using the scripts defined in `package.json`.

## API Documentation

Once the server is running, open Swagger UI in your browser:

[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Use the documentation to inspect available endpoints, review request parameters, and test API operations.

## Fruit API Endpoints

The following are the expected fruit-management operations. Confirm the exact paths and HTTP methods against your Express routes or Swagger documentation.

| Operation | Description |
|---|---|
| Get all fruits | Retrieve the list of fruits |
| Get fruit by ID | Retrieve a specific fruit |
| Create fruit | Add a new fruit |
| Update fruit | Modify an existing fruit |
| Delete fruit | Remove a fruit |

## Project Structure

```text
fruit-store-api/
├── Src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── db.ts
│   ├── controllers/
│   │   └── fruitController.ts
│   ├── models/
│   │   └── Fruit.ts
│   └── server.ts
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

*Note: Adjust this structure to match your actual files and folders.*

## Error Handling and Testing

When testing the API, verify that:

- Valid requests return the expected data and status codes.
- Invalid IDs and missing fields are handled appropriately.
- Database connection failures are reported correctly.
- Image uploads comply with configured file-size and file-type restrictions.
- Sensitive credentials are stored in environment variables.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with a descriptive message.
4. Push your branch and open a pull request.

## Author

**Philemon TUYISHIMIRE**

GitHub: [Philemon2-tuyishimire](https://github.com/Philemon2-tuyishimire)

## License

A license has not yet been specified. Add a `LICENSE` file and update this section if you choose to distribute the project under a particular license.
