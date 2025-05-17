# AuthN & AuthZ Workshop: Securing Your DevOps Beer App

## Project Overview

This workshop guides you through implementing authentication and authorization in a full-stack application step by step. You'll learn how to secure your API and frontend application using modern OAuth2, Role-Based Access Control (RBAC), and fine-grained permission scopes.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Docker and Docker Compose (for running Keycloak)
- Git
- A code editor (VS Code recommended)
- Basic knowledge of TypeScript, Express, and Angular

## Repository Structure

This repository contains two main directories:

- **devopsbeerer-api**: Express TypeScript API for beer management
- **devopsbeerer-frontoffice**: Angular SPA for the frontend beer application

## Branch Structure

### `main` branch

The main branch contains the complete, working project with full authentication and authorization implementation.

### Learning Branches

Each branch represents a progressive step in implementing security features:

1. `steps/0-initial`: Initial project setup with basic functionality but no authentication
2. `steps/1-oauth2`: Implementation of OAuth2 authentication with Keycloak
3. `steps/2-roles`: Role-based access control (RBAC) implementation
4. `steps/3-scopes`: Fine-grained permission scopes implementation

## Workshop Setup Instructions

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/tintin92350/devopsdays-2025-workshop-apis-authz-authn.git
cd devopsdays-2025-workshop-apis-authz-authn

# Start with the first branch
git checkout steps/0-initial

# Set up environment variables
cp .env.example devopsbeerer-api/.env
# Edit .env file with your configuration

# Install dependencies for both projects
cd devopsbeerer-api
npm ci

cd ../devopsbeerer-frontoffice
npm ci
```

### Starting the Application

1. **Start Keycloak (Identity Provider):**

   ```bash
   docker compose up -d
   ```

   Keycloak will be available at <http://localhost:8080>
   - Default admin credentials:
     - Username: `admin`
     - Password: `admin`

2. **Start the API:**

   ```bash
   cd devopsbeerer-api
   npm run dev
   ```

   The API will be available at <http://localhost:3000>

3. **Start the Frontend:**

   ```bash
   cd devopsbeerer-frontoffice
   npm start
   ```

   The frontend will be available at <http://localhost:4200>

## Keycloak Configuration

After starting Keycloak with Docker Compose, you'll need to:

1. Login to the Keycloak Admin Console at <http://localhost:8080>
2. Create or use the existing `devopsbeerer-dev` realm
3. Configure clients for the API and frontend application
4. Create users and roles as needed for each exercise

## Exercises by Branch

### 0-initial: Getting Started

**Problem:** No authentication is setup. Anyone can access our API endpoints to add, delete, and view our beers!

**Objective:** Protect the API and add authentication to the frontend.

**Tasks:**

- Start Keycloak using Docker Compose: `docker compose up -d`
- Create users in Keycloak under the `devopsbeerer-dev` realm
- API Implementation:
  - Use `keycloak-passport` library to protect API endpoints
  - Configure OAuth2 with Keycloak as the identity provider
- Frontend Implementation:
  - Use `angular-auth-oidc-client` to add authentication
  - Implement login/logout functionality
  - Add auth guards to protected routes

**Resources:**

- Keycloak Passport: <https://github.com/exlinc/keycloak-passport>
- Angular Auth OIDC Client: <https://www.npmjs.com/package/angular-auth-oidc-client>

### 1-oauth2: Adding Role-Based Access Control

**Problem:** Our API is protected, but we don't want all authenticated users to be able to add or delete beers!

**Objective:** Implement role-based access control to restrict certain operations to authorized users only.

**Tasks:**

- Create roles in Keycloak under the `devopsbeerer-dev` realm (e.g., `admin`, `beer-creator`, etc.)
- Assign roles to users
- API Implementation:
  - Protect POST `/beers` and DELETE `/beers/${id}` endpoints with role checks
  - Verify user roles from the JWT token
- Frontend Implementation:
  - Hide UI elements based on user roles

### 2-roles: Implementing Fine-Grained Permissions with Scopes

**Problem:** Even with roles, we want more granular control over what applications can do with our API.

**Objective:** Implement OAuth2 scopes to provide fine-grained API permissions.

**Tasks:**

- Configure scopes in Keycloak under the `devopsbeerer-dev` realm
  - Available scopes: `Beers.Read`, `Beers.Read.All`, `Beers.Write`
- API Implementation:
  - Verify scopes in protected endpoints
  - Limit access based on both roles and scopes
- Frontend Implementation:
  - Request appropriate scopes during authentication

### 3-scopes: Complete Secured Application

**Problem:** Review the complete implementation and ensure all security measures are properly integrated.

**Objective:** Ensure the application is fully protected with multiple layers of security.

**Tasks:**

- Test various user scenarios
- Review security implementation
- Identify any potential vulnerabilities
- Enhance error handling and user feedback
