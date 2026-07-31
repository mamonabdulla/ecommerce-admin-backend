# E-commerce Admin Dashboard Backend

Backend API implementation for the **Trends Bird Limited Backend Developer Intern Assignment**.

This project implements the backend system for an e-commerce admin dashboard. The main focus of this project is authentication, authorization, role-based access control, catalog management, validation, database design, and API development.

---

# Live Demo

```
https://ecommerce-admin-frontend-eta.vercel.app/
```

```

## Swagger Documentation

```
https://ecommerce-admin-backend-production.up.railway.app/api
```

---

# Technology Stack

* Node.js v22.14.0
* NestJS
* TypeScript
* PostgreSQL
* TypeORM
* JWT Authentication
* Refresh Token Authentication
* bcrypt Password Hashing
* class-validator
* Swagger API Documentation

---

# Implemented Modules

| Module         | Status   |
| -------------- | -------- |
| Authentication | Complete |
| Permission     | Complete |
| Role           | Complete |
| User           | Complete |
| Media          | Complete |
| Category       | Complete |
| Brand          | Complete |
| Attribute      | Complete |
| Product        | Complete |

---

# Authentication

Implemented features:

* Login with email and password
* JWT access token authentication
* Refresh token authentication
* Logout with refresh token revocation
* Current user/session endpoint
* Password hashing using bcrypt
* Active/inactive user protection

Authentication strategy:

```http
Authorization: Bearer <access_token>
```

---

# Role Based Access Control (RBAC)

Authorization flow:

```
User → Role → Permission
```

A user has one role.

A role contains multiple permissions.

Each protected route checks whether the user's role has the required permission.

Example permissions:

```
product:create
product:read
product:update
product:delete

user:create
user:read
user:update
user:delete

role:create
role:update

media:upload
```

The API returns:

```
401 Unauthorized
```

when authentication fails.

```
403 Forbidden
```

when the user is authenticated but does not have enough permission.

---

# Database

Database:

```
PostgreSQL
```

ORM:

```
TypeORM
```

The project uses TypeORM migrations for database version control.

---

# Installation

Clone repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=ecommerce_admin

JWT_SECRET=your_secret

PORT=3000
```

---

# Database Migration

Generate migration:

```bash
npm run migration:generate
```

Run migration:

```bash
npm run migration:run
```

Revert migration:

```bash
npm run migration:revert
```

---

# Database Seed

The seed script creates:

* All required permissions
* Super Admin role
* Catalog Manager role
* Super Admin user
* Catalog Manager user

Run seed:

```bash
npm run seed
```

---

# Test Credentials

## Super Admin

```
Email:
admin@test.com

Password:
123456
```

Role:

```
Super Admin
```

This account has full system permissions.

---

## Catalog Manager

```
Email:
manager@test.com

Password:
123456
```

Role:

```
Catalog Manager
```

This account has limited permissions and is used to test authorization rules.

---

# Swagger Documentation

Swagger covers:

* Authentication
* Permissions
* Roles
* Users
* Media
* Categories
* Brands
* Attributes
* Products

Swagger endpoint:

```
https://ecommerce-admin-backend-production.up.railway.app/api
```

---

# Project Structure

```
src
│
├── auth
├── permission
├── role
├── user
├── media
├── category
├── brand
├── attribute
├── product
│
└── database
    ├── migrations
    └── seed.ts
```

---

# Media Module

Implemented:

* File upload
* Media records
* File metadata storage
* Shared media library
* Media attachment support

---

# Category Module

Implemented:

* Category CRUD
* Nested category structure
* Parent-child relationship
* Category tree support

---

# Brand Module

Implemented:

* Brand CRUD
* Product-brand relationship
* Brand management

---

# Attribute Module

Implemented:

* Attribute CRUD
* Attribute values
* Product variant support

---

# Product Module

Implemented:

* Simple products
* Variable products
* Product variants
* Category relationship
* Brand relationship
* Media attachment
* Product validation

---

# Validation and Error Handling

Implemented:

* Request validation
* Duplicate data handling
* Missing resource handling
* Authentication errors
* Authorization errors

---

# Deployment

The project is deployed using:

## Backend

```
Railway
```

Backend URL:

```
https://ecommerce-admin-backend-production.up.railway.app
```

## Frontend

```
Vercel
```

Frontend URL:

```
https://ecommerce-admin-frontend-eta.vercel.app/
```

Deployment includes:

* Railway PostgreSQL database
* Production backend hosting
* Production frontend hosting
* CORS configuration
* Database migration
* Database seeding

---

# Version Control

The project was developed incrementally with multiple commits covering:

* Authentication implementation
* JWT and refresh token system
* RBAC implementation
* Database design
* Catalog modules
* Frontend integration
* Production deployment

---

# Known Issues

* UI design is not the primary focus of this assignment.
* Automated tests and Docker setup were not included.

---

# Author

Md Abdulla Al Mamon

