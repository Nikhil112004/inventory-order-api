# Inventory & Order API

A simple backend API for managing products and creating orders using Node.js, Express.js, and MongoDB.

## Features

### Authentication

* User signup
* User login
* JWT-based authentication
* JWT stored in an HTTP-only cookie
* Password hashing using bcrypt
* Email and password validation

### Products

* Create a product
* Get all products
* Get a single product
* Update a product
* Delete a product
* Search products by name
* Filter products by category
* Filter products by availability
* Pagination

### Orders

* Create an order
* Get logged-in user's orders
* Get a single logged-in user's order
* Validate product existence
* Validate available stock
* Calculate total amount on the server
* Reduce stock when an order is created

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* validator
* cookie-parser

## Project Structure

```text
src/
├── config/
│   └── db.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── order.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── error.middleware.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
│
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── order.routes.js
│
├── app.js
└── server.js
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/auth/signup` | Register a new user |
| POST   | `/auth/login`  | Login user          |
| POST   | `/auth/logout` | Logout user         |

### Products

| Method | Endpoint        | Description     | Auth         |
| ------ | --------------- | --------------- | ------------ |
| POST   | `/products`     | Create product  | Required     |
| GET    | `/products`     | Get products    | Not required |
| GET    | `/products/:id` | Get one product | Not required |
| PATCH  | `/products/:id` | Update product  | Required     |
| DELETE | `/products/:id` | Delete product  | Required     |

### Orders

| Method | Endpoint      | Description                 | Auth     |
| ------ | ------------- | --------------------------- | -------- |
| POST   | `/orders`     | Create order                | Required |
| GET    | `/orders`     | Get logged-in user's orders | Required |
| GET    | `/orders/:id` | Get one user's order        | Required |

## Product Search, Filtering & Pagination

The `GET /products` endpoint supports:

### Search

```text
GET /products?search=iphone
```

### Category

```text
GET /products?category=electronics
```

### Availability

```text
GET /products?inStock=true
```

```text
GET /products?inStock=false
```

### Pagination

```text
GET /products?page=1&limit=10
```

### Combined Query

```text
GET /products?category=electronics&inStock=true&page=1&limit=10
```

## Order Creation

The client only sends product IDs and quantities.

Example:

```json
{
  "products": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    }
  ]
}
```

The server:

1. Checks whether the product exists.
2. Checks whether enough stock is available.
3. Atomically reduces the stock.
4. Calculates the total amount using the product price.
5. Creates the order.

The client does not provide `totalAmount`, `price`, or `user`.

## Concurrent Stock Handling

Stock updates use an atomic MongoDB operation:

```text
stockQuantity >= requested quantity
        ↓
atomically decrease stock
```

This prevents stock from becoming negative when multiple users try to purchase the same limited-stock product simultaneously.

For example, if only one item is available and two users request one item at the same time, only one atomic update can succeed. The other request receives an insufficient-stock response.

For a fully transactional multi-product order, MongoDB transactions could be added so that all stock changes and order creation either succeed together or roll back together.

## Error Handling

The API includes centralized error handling for:

* Mongoose validation errors
* Invalid MongoDB IDs
* Duplicate database keys
* Unexpected server errors

HTTP status codes are used according to the type of error.

## Security

* Passwords are hashed using bcrypt.
* JWT is stored in an HTTP-only cookie.
* JWT secret is stored in environment variables.
* `.env` is excluded from Git.
* Protected routes require valid authentication.
* Users can only access their own orders.

## Environment Variables

Create `.env` using `.env.example`:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
NODE_ENV=development
```

## Postman Collection

A Postman collection is included with the project for testing all available API endpoints.

## AI Usage

AI tools were used during development for:

* Understanding and planning the API structure
* Generating and reviewing boilerplate code
* Debugging errors
* Reviewing validation and database logic
* Improving documentation

All submitted code was reviewed and tested during development.

## Testing

All implemented API endpoints were tested using Postman, including authentication, product CRUD, product filtering/pagination, and order creation/retrieval.

##

This project was created as part of a Backend Developer technical assessment.
