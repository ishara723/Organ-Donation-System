# LifeLink - Organ Donation Coordination Platform

LifeLink is a secure, role-based full-stack web application designed to streamline and automate organ donation registry, hospital requests, and immunological compatibility matching.

---

## System Architecture

LifeLink is structured as a three-tier architecture:
1.  **Presentation Layer**: Built with **React 18**, **Vite**, and **Tailwind CSS v4** for responsive, glassmorphic interfaces.
2.  **Application Layer**: Powered by **Java 17 / Spring Boot 3** providing RESTful APIs, JWT authentication, and business coordination services.
3.  **Data Layer**: Persisted on a **MongoDB** database for flexible schema mapping of patient, donor, and match records.

---

## Directory Layout

```
organ-donation-system/
├── backend/                  # Spring Boot 3.x Source Code
│   ├── src/                  # Controllers, Services, Entities, Repositories
│   ├── pom.xml               # Maven configuration & dependencies
│   └── Dockerfile            # Container definition
├── frontend/                 # React 18.x Source Code
│   ├── src/                  # Layouts, Components, Context, Pages, Services
│   ├── package.json          # NPM dependencies
│   └── vite.config.js        # Proxy & Vite settings
└── docker-compose.yml        # Orchestration (MongoDB + Backend)
```

---

## Key Features by Workspace

### 1. Donor Portal (Public Users)
*   **Consent Management**: Toggles to explicitly grant or revoke organ donation authorization.
*   **Medical Profiles**: Configure blood types, allergies, medical history, and emergency contact details.
*   **Pledge Selectors**: Checkbox matrix to select specific organs (Kidney, Liver, Heart, Lungs, etc.).

### 2. Hospital Portal (Clinicians)
*   **Patient Requests**: Anonymized recipient logs flagged by urgency level (Critical, High, Medium, Low) and priority scores.
*   **Compatibility Search**: Search the registry with automatic filters matching recipient blood types (e.g. O- universal matching).
*   **Match Proposals**: Recommends compatible matches directly to the coordination network.

### 3. Admin Console (Coordinators)
*   **Command Metrics**: Visual analytical charts (Recharts) displaying organ demands and donor distributions.
*   **Verification Queue**: Audit and approve donor files before they enter the active search pool.
*   **Match Board**: Dynamic compatibility lists with surgical completion trackers.

---

## Getting Started

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recommended)
*   [Node.js v18+](https://nodejs.org/)
*   [Java JDK 17+](https://adoptium.net/) & Maven (if running without containers)

---

### Method A: Quick Run with Docker (Recommended)

1.  Make sure Docker is running.
2.  From the root directory, build and run all services:
    ```bash
    docker-compose up --build
    ```
3.  The database will spin up on port `27017` and the API backend will launch on `http://localhost:8080/api/v1`.

---

### Method B: Manual Run

#### 1. Database
Launch a local MongoDB instance running on port `27017` or use Docker to run mongo alone:
```bash
docker run -d -p 27017:27017 --name lifelink-mongo mongo:7.0
```

#### 2. Backend Services
Navigate to `organ-donation-system/backend` and run:
```bash
mvn spring-boot:run
```
*   API Port: `http://localhost:8080/api/v1`
*   Swagger Open API Docs: `http://localhost:8080/api/v1/swagger-ui.html`

#### 3. Frontend App
Navigate to `organ-donation-system/frontend` and run:
```bash
npm install
npm run dev
```
*   Client Port: `http://localhost:5173`
*   *Note: Vite dev server automatically proxies `/api/v1` calls to backend port `8080`.*

---

## Configuration & Credentials

### Default Admin Logins
For initial system testing and matching approvals, use the default administrator credentials:
*   **Email**: `admin@lifelink.org`
*   **Password**: `Admin@123`

### Mail & JWT settings
Database settings and SMTP keys are configured in:
`organ-donation-system/backend/src/main/resources/application.properties`

---

## Technology Stack

*   **Frontend**: React, React Router v6, Tailwind CSS v4, Lucide Icons, Recharts, Axios.
*   **Backend**: Spring Boot, Spring Security (JWT), Spring Data MongoDB, Lombok.
