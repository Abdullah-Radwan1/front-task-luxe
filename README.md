# React Application – Setup & Architecture Overview

## 1. Project Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js** (LTS recommended)
- **npm** or **pnpm** / **yarn**

### Installation

```bash
npm install or bun i
```

### Development Server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 2. Project Structure (High Level)

```text
src/
├─ app/                 # App entry & providers
├─ routes/              # TanStack Router route definitions
│  ├─ public/           # Public routes (login, register, landing)
│  ├─ user/             # User-protected routes
│  ├─ admin/            # Admin-protected routes
│  └─ routeTree.gen.ts  # Auto-generated route tree
├─ components/          # Reusable UI components (shadcn/ui)
├─ features/            # Feature-based modules (products, orders, etc.)
├─ hooks/               # Custom React hooks
├─ lib/                 # Utilities (api, auth, helpers)
├─ store/               # Global state (Zustand / Redux)
└─ styles/              # Global styles
```

This project follows a **feature-based + role-based routing** approach to keep the codebase scalable and maintainable.

---

## 3. Multi‑Role Routing Architecture

The application supports **multiple roles** (User & Admin) using **TanStack Router**.

### Route Categories

#### 1. Public Routes

Accessible without authentication.

Examples:

- `/login`
- `/register`
- `/`

Located under:

```text
routes/public/
```

---

#### 2. User Routes

Accessible only to authenticated **regular users**.

Examples:

- `/user/dashboard`
- `/user/orders`
- `/user/wishlist`
- `/user/products`
- `/user/profile`

Located under:

```text
routes/user/
```

Protected using an **auth guard** that checks:

- User is authenticated
- Role === `user`

---

#### 3. Admin Routes

Accessible only to authenticated **admins**.

Examples:

- `/admin/dashboard`
- `/admin/products`
- `/admin/users`
- `/admin/orders`

Located under:

```text
routes/admin/
```

Protected using an **admin guard** that checks:

- User is authenticated
- Role === `admin`

---

### Route Protection Strategy

- Authentication state is stored in global state (Zustand / Redux)
- Role is derived from the authenticated user object
- Each protected route validates access **before rendering**
- Unauthorized access redirects to `/login` or `/unauthorized`

This ensures:

- No admin UI leakage to users
- No access to protected APIs via UI routing

---

## 4. Admin vs User Access

### User Account Access

1. Register or login using a **regular user account**
2. After login, you will be redirected to:

```
/user/dashboard
```

3. User accounts **cannot** access admin routes

---

### Admin Account Access

1. Login using an **admin account**
2. Admin users are redirected to:

```
/admin/dashboard
```

3. Direct access to admin URLs is blocked for non-admin users

---

### Example Roles

| Role  | Access Scope                   |
| ----- | ------------------------------ |
| user  | User routes only               |
| admin | Admin + full management routes |

Role checks are enforced **both at the routing level and UI level**.

---

## 5. Key Notes

- Navigation is handled entirely by **TanStack Router** (SPA navigation)
- Search params & pagination are router‑controlled (no full reloads)
- UI components follow **shadcn/ui** standards
- The architecture is optimized for scalability and role expansion

---

## 6. Future Improvements

- Add more granular roles (e.g. `manager`, `support`)
- Server‑side role validation
- Route‑level permission configuration

---

If you have questions about extending roles or routing logic, check the `routes/` folder first—it defines the full access model.
