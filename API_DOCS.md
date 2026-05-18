# LeadFlow API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require a valid JWT, passed as either:
- `Authorization: Bearer <token>` header
- `token` httpOnly cookie (set automatically on login/register)

---

## Authentication

### POST /auth/register

Creates a new user account.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales_user"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | Yes | 2–80 characters |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 6 characters |
| `role` | string | No | `admin` or `sales_user` (default: `sales_user`) |

**Response 201:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales_user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error 409** — Email already exists
```json
{ "success": false, "message": "An account with this email already exists" }
```

---

### POST /auth/login

Authenticates a user and returns a JWT.

**Request Body:**
```json
{
  "email": "rahul@example.com",
  "password": "secret123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Rahul Sharma", "email": "...", "role": "sales_user" },
    "token": "eyJhbGciO..."
  }
}
```

**Error 401** — Invalid credentials
```json
{ "success": false, "message": "Invalid email or password" }
```

---

### POST /auth/logout

Clears the auth cookie.

**Response 200:**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

### GET /auth/me

Returns the currently authenticated user's profile.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Rahul Sharma", "email": "...", "role": "admin" }
  }
}
```

---

## Leads

### GET /leads

Returns a paginated, filtered list of leads.

**Query Parameters:**

| Parameter | Type | Description | Example |
|---|---|---|---|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Records per page (default: 10, max: 100) | `?limit=10` |
| `search` | string | Search by name or email (case-insensitive) | `?search=rahul` |
| `status` | string | Filter by status. Comma-separate for multiple. | `?status=New,Qualified` |
| `source` | string | Filter by source. Comma-separate for multiple. | `?source=Instagram` |
| `sort` | string | `latest` (default) or `oldest` | `?sort=oldest` |

**Combined Example:**
```
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "notes": "Very interested in the premium plan",
      "createdBy": "65a1...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T08:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### GET /leads/export/csv

Exports leads matching current filters as a downloadable CSV file.

> **Admin only**

**Query Parameters:** Same as `GET /leads` (except `page` and `limit` — all matching records are exported).

**Response:** `text/csv` file download
```
Content-Disposition: attachment; filename="leads_export_2024-01-15.csv"
```

CSV columns: `ID, Name, Email, Status, Source, Notes, Created At`

---

### POST /leads

Creates a new lead.

**Request Body:**
```json
{
  "name": "Priya Patel",
  "email": "priya@example.com",
  "status": "New",
  "source": "Referral",
  "notes": "Referred by existing client"
}
```

| Field | Type | Required | Valid values |
|---|---|---|---|
| `name` | string | Yes | 2–100 characters |
| `email` | string | Yes | Valid email format |
| `status` | string | No | `New`, `Contacted`, `Qualified`, `Lost` (default: `New`) |
| `source` | string | Yes | `Website`, `Instagram`, `Referral` |
| `notes` | string | No | Max 1000 characters |

**Response 201:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "lead": { ... } }
}
```

---

### GET /leads/:id

Returns a single lead by ID.

**Response 200:**
```json
{
  "success": true,
  "data": { "lead": { ... } }
}
```

**Error 404:**
```json
{ "success": false, "message": "Lead not found" }
```

---

### PUT /leads/:id

Updates an existing lead. All fields are optional — only send what you want to change.

**Request Body (partial):**
```json
{
  "status": "Qualified",
  "notes": "Had a demo call — very promising"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { "lead": { ... } }
}
```

---

### DELETE /leads/:id

Deletes a lead permanently.

> **Admin only**

**Response 200:**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

Validation errors include an `errors` array:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "body.email", "message": "Please provide a valid email address" }
  ]
}
```

## HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid ID format etc.) |
| 401 | Unauthorized (no or invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g. duplicate email) |
| 422 | Validation Error |
| 500 | Internal Server Error |
