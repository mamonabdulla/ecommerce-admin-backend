# E-commerce Admin Dashboard Backend

Backend API implementation for the **Trends Bird Limited Backend Developer Intern Assignment**.

This project implements the backend system for an e-commerce admin dashboard. The main focus of this project is authentication, authorization, role-based access control, catalog management, validation, database design, and API development.

---

# Live Demo

```
https://ecommerce-admin-frontend-eta.vercel.app/
```

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

---

# Implemented Modules

| Module | Status |
|---|---|
| Authentication | Complete |
| Permission | Complete |
| Role | Complete |
| User | Complete |
| Media | Complete |
| Category | Complete |
| Brand | Complete |
| Attribute | Complete |
| Product | Complete |

---

# Architecture Overview

The backend follows a modular NestJS architecture.

```
Controller
    |
Service
    |
Repository (TypeORM)
    |
PostgreSQL Database
```

The system implements:

* JWT authentication
* Refresh token authentication
* Global authentication guard
* Permission-based authorization
* Role-based access control
* Request validation
* Database migrations and seeding

---

# Authentication

Implemented features:

* Login with email and password
* JWT access token authentication
* Refresh token rotation
* Logout with refresh token revocation
* Current user/session endpoint
* Password hashing using bcrypt
* Active/inactive user protection

Authentication strategy:

```
Authorization: Bearer <access_token>
```

The project uses Authorization headers instead of cookies.

---

# Role Based Access Control (RBAC)

Authorization flow:

```
User → Role → Permission
```

A user has one role.

A role contains multiple permissions.

Each protected route declares required permissions.

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

API responses:

```
401 Unauthorized
```

Returned when:

* Token is missing
* Token is invalid
* Token is expired
* User account is inactive


```
403 Forbidden
```

Returned when:

* Token is valid
* User does not have the required permission

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

Database changes are managed using TypeORM migrations.

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
JWT_EXPIRES_IN=15m

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

This account has all system permissions.

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

This account has limited permissions and is used to verify authorization restrictions.

---

# API Documentation and Testing

The REST API was tested and verified using **Postman**.

The Postman collection is included in the repository:

```
postman/ecommerce-admin-backend.postman_collection.json
```

The collection covers:

* Authentication APIs
* Login flow
* Access token handling
* Refresh token functionality
* Logout functionality
* Session endpoint
* Role-based access control
* Permission-based authorization
* User management
* Media management
* Category management
* Brand management
* Attribute management
* Product management

Authentication flow:

### 1. Login

```
POST /auth/login
```

### 2. Receive access token.

### 3. Send token with protected requests:

```http
Authorization: Bearer <access_token>
```

All major API endpoints were tested using Postman.

---

# Project Structure

```
src
|
├── modules
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

* Single file upload
* Multiple file upload
* Media records
* File metadata storage
* Shared media library
* Product media attachment support

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
* Search and filtering support

---

# Attribute Module

Implemented:

* Attribute CRUD
* Attribute values management
* Product variant support

---

# Product Module

Implemented:

* Simple products
* Variable products
* Product variants
* Product-category relationship
* Product-brand relationship
* Media attachment
* Product validation

---

# Validation and Error Handling

Implemented:

* DTO validation using class-validator
* Duplicate data handling
* Missing resource handling
* Authentication error handling
* Authorization error handling

---

# Deployment

## Backend

Platform:

```
Railway
```
Deployment includes:

* Railway PostgreSQL database
* Production backend hosting
* Database migration
* Database seeding
* CORS configuration


## Frontend

Platform:

```
Vercel
```

Frontend:

```
https://ecommerce-admin-frontend-eta.vercel.app/
```

---

# Version Control

Development was done incrementally with commits covering:

* Authentication implementation
* JWT and refresh token system
* RBAC implementation
* Database design
* Module development
* Frontend integration
* Production deployment

---

# Known Issues

* UI design is not the main focus of this assignment.
* Automated tests were not included.
* Docker setup was not included.

---

# Author

Md Abdulla Al Mamon