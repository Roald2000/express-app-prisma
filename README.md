# Prisma API Server

This is a simple RESTful API server built using Node.js and Prisma ORM. It allows CRUD operations for users and persons.

## Technologies Used

- Node.js
- Prisma ORM
- Express.js
- CORS package

## Installation

1. Clone the repository.
2. Run `npm install` to install all dependencies.
3. Create a PostgreSQL database and update the schema.prisma file accordingly.
4. Run migrations by executing the command `npx prisma migrate up --experimental`.
5. Run seeders by executing the command `npx prisma db seed --preview-feature`.

## Usage

1. Run the server by executing the command `npm start`.
2. Use different API routes to perform CRUD operations for users and persons.

## Routes

### User Routes

- **GET /user:** Get all users.
- **POST /user:** Create a new user.

### Person Routes

- **GET /person:** Get all persons.
- **GET /person/search/:search:** Search for persons with a specific criteria.
- **POST /person:** Create a new person.
- **PUT /person/:p_id:** Update an existing person.
- ** /person/:p_id:**  a person with a specific id.

## Error Handling

The server handles errors by returning a JSON response with a status code and an error message. In case of invalid routes, the server returns a 404 error. Additionally, all errors are logged in the console.

## Contribution

If you find any issues with the server, feel free to create an issue on the GitHub repository or fork it and submit a pull request.

## License

This project is licensed under the MIT License.