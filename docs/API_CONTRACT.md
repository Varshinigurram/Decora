# Décora — REST API Contract Specification (`/api/v1`)

**Document Version:** 1.1.0  
**Phase:** Phase 4, Day 13 — Complete User Data Backend Integration Implemented & Tested  
**Base URL:** `http://localhost:5000/api/v1`  
**Transport Security:** CORS with credentials, HTTP-only Cookie Bearer tokens, JSON envelopes  

---

## 1. Global Conventions & Standard Formats

### 1.1. Standard Success Response Format
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {
    "timestamp": "2026-11-18T10:00:00.000Z"
  }
}
```

### 1.2. Standard Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ],
  "meta": {
    "timestamp": "2026-11-18T10:00:00.000Z"
  }
}
```

### 1.3. Common HTTP Status Codes
| Code | Meaning | Typical Usage |
|---|---|---|
| `200 OK` | Request succeeded | Successful GET, PUT, PATCH, or non-creation POST. |
| `201 Created` | Resource created | Successful registration, board creation, snapshot addition. |
| `400 Bad Request` | Client malformed request | Validation failure, invalid payload, incompatible variant. |
| `401 Unauthorized` | Authentication required | Missing or expired JWT cookie on protected endpoint. |
| `403 Forbidden` | Access denied | Non-admin accessing `/admin/*`, or attempting to access another user's board. |
| `404 Not Found` | Resource missing | Product slug not found, board ID does not exist. |
| `409 Conflict` | State collision | Email already registered. |
| `429 Too Many Requests` | Rate limited | Exceeded auth route brute-force thresholds. |
| `500 Internal Error` | Server failure | Database disconnection or unhandled exception. |

---

## 2. Authentication Endpoints (`/api/v1/auth`)

### 2.1. Register Account
- **Method / Endpoint:** `POST /api/v1/auth/register`
- **Auth / Role:** Public (Unauthenticated)
- **Request Body:**
  ```json
  {
    "fullName": "Varsha Sharma",
    "email": "varsha@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Validation:**
  - `fullName`: Required string, 2–100 characters.
  - `email`: Required valid email format, normalized to lowercase.
  - `password`: Required string, 8–72 bytes, with at least one letter and one number (never trimmed).
- **Response (`201 Created`):**
  - Sets `httpOnly` cookies: `accessToken` (15m expiry, `path: '/'`) and `refreshToken` (7d expiry, `path: '/api/v1/auth'`).
  - Always forces role to `'customer'`.
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Account created successfully.",
    "data": {
      "user": {
        "id": "673b0a1f4f8d2b001c9a1001",
        "email": "varsha@example.com",
        "fullName": "Varsha Sharma",
        "role": "customer"
      }
    }
  }
  ```

### 2.2. User Login
- **Method / Endpoint:** `POST /api/v1/auth/login`
- **Auth / Role:** Public (Guarded by `authLimiter`)
- **Request Body:**
  ```json
  {
    "email": "varsha@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response (`200 OK`):**
  - Sets `httpOnly` cookies: `accessToken` and `refreshToken`.
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Signed in successfully.",
    "data": {
      "user": {
        "id": "673b0a1f4f8d2b001c9a1001",
        "email": "varsha@example.com",
        "fullName": "Varsha Sharma",
        "role": "customer"
      }
    }
  }
  ```
- **Error Response (`401 Unauthorized`):** Generic `"Invalid email address or password."` for both unknown emails and bad passwords.

### 2.3. Silent Session Refresh
- **Method / Endpoint:** `POST /api/v1/auth/refresh`
- **Auth / Role:** Public / Refresh Cookie Holder
- **Headers:** `Origin: http://localhost:5173`, `Cookie: refreshToken=<token>`
- **Response (`200 OK`):**
  - Rotates both tokens atomically and updates `refreshTokenHash` in MongoDB.
  - Sets new `accessToken` and `refreshToken` cookies.
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Session refreshed successfully.",
    "data": {
      "user": {
        "id": "673b0a1f4f8d2b001c9a1001",
        "email": "varsha@example.com",
        "fullName": "Varsha Sharma",
        "role": "customer"
      }
    }
  }
  ```

### 2.4. User Logout
- **Method / Endpoint:** `POST /api/v1/auth/logout`
- **Auth / Role:** Public / Authenticated
- **Operation:**
  - Idempotently clears `refreshTokenHash` on the user record when identified.
  - Clears `accessToken` (`path: '/'`) and `refreshToken` (`path: '/api/v1/auth'`) cookies.
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Signed out successfully."
  }
  ```

### 2.5. Current User Session Verification
- **Method / Endpoint:** `GET /api/v1/auth/me`
- **Auth / Role:** Authenticated (`authenticateJWT`)
- **Operation:**
  - Verifies token signature and checks live database record (`isActive`, `tokenVersion`).
  - Returns current database-backed user properties.
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "user": {
        "id": "673b0a1f4f8d2b001c9a1001",
        "email": "varsha@example.com",
        "fullName": "Varsha Sharma",
        "role": "customer"
      }
    }
  }
  ```

---

## 3. Product Catalog Endpoints (`/api/v1/products`)

### 3.1. List & Filter Products
- **Method / Endpoint:** `GET /api/v1/products`
- **Auth / Role:** Public
- **Query Parameters:**
  - `category` (optional): `Seating`, `Tables`, `Storage`, `Lighting`, `Beds`, `Decor`, `all`
  - `roomType` (optional): `living`, `bedroom`, `dining`, `office`, `architectural`, `all` (also accepts alias `room`)
  - `style` (optional): `Japandi`, `Minimalist`, `Scandinavian`, `Mid-Century`, `Warm Editorial`, etc.
  - `search` / `q` (optional): Case-insensitive string search against name, description, and primaryMaterial (special characters escaped)
  - `customizable` (optional): Boolean `true` or `false`
  - `featured` (optional): Boolean `true` or `false`
  - `inStock` (optional): Boolean `true` or `false`
  - `material` (optional): Comma-separated materials list
  - `minPrice` / `maxPrice` (optional): Numeric INR bounds (`minPrice <= maxPrice` strictly enforced)
  - `sort` (optional): `featured` (default), `price-asc`, `price-desc`, `name-asc`, `name-desc`, `newest`
  - `page` / `limit` (optional): Defaults `page=1`, `limit=12` (max limit: 48)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Products retrieved successfully.",
    "data": [
      {
        "id": "chair-komorebi",
        "productId": "chair-komorebi",
        "slug": "komorebi-lounge-chair",
        "name": "Komorebi Lounge Chair",
        "title": "Komorebi Lounge Chair",
        "category": "Seating",
        "roomType": "living",
        "style": "Japandi",
        "basePrice": 28000,
        "inStock": true,
        "stockCount": 10,
        "customizable": true,
        "featured": true,
        "image": "/assets/products/chair-komorebi.png",
        "dimensions": { "width": 78, "depth": 84, "height": 72, "formatted": "78 × 84 × 72 cm" }
      }
    ],
    "pagination": {
      "total": 16,
      "page": 1,
      "pages": 2,
      "limit": 12
    },
    "filters": {
      "categories": ["Beds", "Decor", "Lighting", "Seating", "Storage", "Tables"],
      "roomTypes": ["architectural", "bedroom", "dining", "living", "office"],
      "styles": ["Japandi", "Mid-Century", "Minimalist", "Scandinavian"],
      "priceRange": { "min": 9500, "max": 48500 },
      "totalProducts": 16
    }
  }
  ```

### 3.2. Filter Metadata
- **Method / Endpoint:** `GET /api/v1/products/filters/meta`
- **Auth / Role:** Public
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Filter metadata retrieved successfully.",
    "data": {
      "categories": ["Beds", "Decor", "Lighting", "Seating", "Storage", "Tables"],
      "roomTypes": ["architectural", "bedroom", "dining", "living", "office"],
      "styles": ["Japandi", "Mid-Century", "Minimalist", "Scandinavian"],
      "priceRange": { "min": 9500, "max": 48500 },
      "priceBounds": { "min": 9500, "max": 48500 },
      "totalProducts": 16
    }
  }
  ```

### 3.3. Get Product by Slug
- **Method / Endpoint:** `GET /api/v1/products/slug/:slug`
- **Auth / Role:** Public
- **Response (`200 OK`):** Full serialized product object.
- **Errors:** `404 Not Found` with `code: "PRODUCT_NOT_FOUND"`.

### 3.4. Get Product by ID
- **Method / Endpoint:** `GET /api/v1/products/:id`
- **Auth / Role:** Public
- **Identifier:** Stable `productId` (e.g. `'chair-komorebi'`) or MongoDB ObjectId (`'6b01c3b25f1bab89380809a1'`).
- **Response (`200 OK`):** Full serialized product object including `dimensions`, `materials`, `customizationOptions`, and `gallery`.
- **Errors:** `404 Not Found` with `code: "PRODUCT_NOT_FOUND"`.

### 3.5. Calculate Authoritative Configured Price
- **Method / Endpoint:** `POST /api/v1/products/:productId/price`
- **Auth / Role:** Public
- **Request Body:**
  ```json
  {
    "configuration": {
      "fabricId": "fab-boucle",
      "finishId": "fin-oak",
      "sizeId": "size-grand"
    }
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Configured price calculated successfully.",
    "data": {
      "productId": "chair-komorebi",
      "basePrice": 28000,
      "fabricAdjustment": 3500,
      "finishAdjustment": 2000,
      "sizeAdjustment": 4000,
      "finalPrice": 37500,
      "currency": "INR",
      "formattedPrice": "₹37,500",
      "isValid": true,
      "selectedOptions": {
        "fabric": { "id": "fab-boucle", "name": "Cream Bouclé", "delta": 3500 },
        "finish": { "id": "fin-oak", "name": "Natural White Oak", "delta": 2000 },
        "size": { "id": "size-grand", "name": "Grand Scale (+10% width)", "delta": 4000 }
      },
      "breakdown": [
        { "item": "Base Price", "amount": 28000 },
        { "item": "Cream Bouclé", "amount": 3500 },
        { "item": "Natural White Oak", "amount": 2000 },
        { "item": "Grand Scale (+10% width)", "amount": 4000 }
      ]
    }
  }
  ```
- **Error Codes:**
  - `400 Bad Request`: `PRODUCT_NOT_CUSTOMIZABLE` (for products with `customizable: false`)
  - `400 Bad Request`: `INVALID_CUSTOMIZATION_OPTION` (for non-existent fabricId, finishId, or sizeId)
  - `400 Bad Request`: `VALIDATION_ERROR` (malformed request body)
  - `404 Not Found`: `PRODUCT_NOT_FOUND` (non-existent productId)

---

## 4. Wishlist Endpoints (`/api/v1/wishlist`)

### 4.1. Get User Wishlist
- **Method / Endpoint:** `GET /api/v1/wishlist`
- **Auth / Role:** Authenticated (`authenticateJWT`)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "productIds": ["chair-komorebi", "table-kanso"],
      "products": [ /* populated Product objects for instant rendering */ ]
    }
  }
  ```

### 4.2. Toggle Wishlist Item
- **Method / Endpoint:** `POST /api/v1/wishlist/toggle`
- **Auth / Role:** Authenticated
- **Request Body:**
  ```json
  { "productId": "sofa-sylvan" }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Product added to wishlist",
    "data": {
      "productId": "sofa-sylvan",
      "inWishlist": true,
      "wishlistCount": 3
    }
  }
  ```

### 4.3. Bulk Sync (Guest-to-Customer Login Handshake)
- **Method / Endpoint:** `POST /api/v1/wishlist/sync`
- **Auth / Role:** Authenticated
- **Request Body:**
  ```json
  {
    "productIds": ["chair-komorebi", "table-kanso"]
  }
  ```
- **Response (`200 OK`):**
  Merges client localStorage IDs into database using `$addToSet` and returns updated array.

---

## 5. Design Board Endpoints (`/api/v1/boards`)

### 5.1. List User's Design Boards
- **Method / Endpoint:** `GET /api/v1/boards`
- **Auth / Role:** Authenticated (`authenticateJWT`)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "boards": [
        {
          "id": "673b0c2a4f8d2b001c9a2001",
          "title": "Minimalist Loft Suite",
          "roomType": "Living Room",
          "style": "Modern Architectural",
          "coverImage": "/assets/categories/cat-living.svg",
          "itemCount": 3,
          "estimatedBudget": 124500,
          "hasRoomLayout": true,
          "updatedAt": "2026-11-18T10:15:00.000Z"
        }
      ]
    }
  }
  ```

### 5.2. Create Design Board
- **Method / Endpoint:** `POST /api/v1/boards`
- **Auth / Role:** Authenticated
- **Request Body:**
  ```json
  {
    "title": "Penthouse Living Room",
    "roomType": "Living Room",
    "style": "Warm Editorial",
    "description": "Natural oak and bouclé textural haven"
  }
  ```
- **Response (`201 Created`):**
  Returns newly created board document.

### 5.3. Get Board Detail
- **Method / Endpoint:** `GET /api/v1/boards/:id`
- **Auth / Role:** Authenticated + Ownership (`verifyBoardOwnership`)
- **Response (`200 OK`):**
  Returns complete board document including `items` snapshot array and `roomLayout`.

### 5.4. Update Board Metadata
- **Method / Endpoint:** `PATCH /api/v1/boards/:id`
- **Auth / Role:** Authenticated + Ownership
- **Request Body:**
  ```json
  {
    "title": "Renamed Penthouse Suite",
    "description": "Updated editorial notes"
  }
  ```

### 5.5. Delete Board
- **Method / Endpoint:** `DELETE /api/v1/boards/:id`
- **Auth / Role:** Authenticated + Ownership
- **Response (`200 OK`):** `{ "success": true, "message": "Design board deleted" }`

### 5.6. Duplicate Board
- **Method / Endpoint:** `POST /api/v1/boards/:id/duplicate`
- **Auth / Role:** Authenticated + Ownership
- **Response (`201 Created`):**
  Deep clones board with newly generated `boardItemId`s and copies `roomLayout`.

---

## 6. Board Snapshot Item Endpoints (`/api/v1/boards/:id/items`)

### 6.1. Add Snapshot Item to Board
- **Method / Endpoint:** `POST /api/v1/boards/:id/items`
- **Auth / Role:** Authenticated + Ownership
- **Request Body:**
  ```json
  {
    "productId": "sofa-sylvan",
    "quantity": 1,
    "configuration": {
      "fabricId": "fab-velvet-olive",
      "finishId": "fin-smoked-walnut",
      "sizeId": "size-3seater"
    }
  }
  ```
- **Server Processing:**
  1. Backend looks up `Product` by `productId`.
  2. Executes `pricingService.validateAndCalculate(product, configuration)` to determine the authoritative `unitPrice` and option metadata.
  3. Appends new immutable snapshot to `board.items`.
  4. Returns updated board.

### 6.2. Update Item Quantity
- **Method / Endpoint:** `PATCH /api/v1/boards/:id/items/:boardItemId/quantity`
- **Auth / Role:** Authenticated + Ownership
- **Request Body:**
  ```json
  { "quantity": 2 }
  ```

### 6.3. Remove Item Snapshot
- **Method / Endpoint:** `DELETE /api/v1/boards/:id/items/:boardItemId`
- **Auth / Role:** Authenticated + Ownership

---

## 7. Room Layout Endpoints (`/api/v1/boards/:id/layout`)

### 7.1. Save / Update Staged Floorplan Layout
- **Method / Endpoint:** `PUT /api/v1/boards/:id/layout`
- **Auth / Role:** Authenticated + Ownership
- **Request Body:**
  ```json
  {
    "roomLength": 6.0,
    "roomWidth": 4.5,
    "units": "m",
    "furnitureInstances": [
      {
        "instanceId": "inst-1794939941168-819",
        "productId": "table-kanso",
        "name": "Kanso Sculptural Coffee Table",
        "category": "Tables",
        "price": 18500,
        "x": 155,
        "y": 200,
        "rotation": 90,
        "w": 110,
        "d": 60,
        "glyphType": "coffee-table",
        "configuration": { "fabricId": null, "finishId": null, "sizeId": null },
        "activeFabric": null,
        "activeFinish": { "id": "fin-kanso", "name": "Travertine & Oak", "colorHex": "#D8C8B5" }
      }
    ]
  }
  ```
- **Response (`200 OK`):**
  Validates dimensions ($1m \le L, W \le 20m$), recalculates/verifies instance prices via `pricingService`, persists `board.roomLayout`, and returns updated board.

### 7.2. Delete Staged Layout
- **Method / Endpoint:** `DELETE /api/v1/boards/:id/layout`
- **Auth / Role:** Authenticated + Ownership
- **Response (`200 OK`):** Sets `board.roomLayout = null`.

---

## 8. Consultation Endpoints (`/api/v1/consultations`)

### 8.1. Submit Consultation Request (Guest or Customer)
- **Method / Endpoint:** `POST /api/v1/consultations`
- **Auth / Role:** Public (If authenticated, `req.user._id` is automatically attached)
- **Request Body:**
  ```json
  {
    "fullName": "Varsha Sharma",
    "email": "varsha@example.com",
    "phone": "+91 98765 43210",
    "roomType": "Living Room",
    "style": "Japandi",
    "budgetTier": "₹1,50,000–₹3,00,000",
    "roomDimensions": { "length": 5.5, "width": 4.2, "units": "m" },
    "notes": "Looking for low-slung seating and neutral textured linen accents."
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Consultation request received successfully",
    "data": {
      "referenceCode": "DEC-2026-A8K9",
      "status": "New",
      "submittedAt": "2026-11-18T10:30:00.000Z"
    }
  }
  ```

### 8.2. Get Customer's Own Consultation Inquiries
- **Method / Endpoint:** `GET /api/v1/consultations/my-consultations`
- **Auth / Role:** Authenticated (`authenticateJWT`)
- **Response (`200 OK`):** Returns inquiries matching `userId === req.user._id`.

---

## 9. Administrative Endpoints (`/api/v1/admin`)

All administrative routes require `authenticateJWT` **AND** `requireRole('admin')`.

### 9.1. Platform Overview Metrics
- **Method / Endpoint:** `GET /api/v1/admin/stats`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "totalProducts": 34,
      "pendingConsultations": 8,
      "registeredUsers": 142,
      "activeDesignBoards": 89
    }
  }
  ```

### 9.2. Product Catalog Management (CRUD)
- `POST /api/v1/admin/products` — Create new product record.
- `PUT /api/v1/admin/products/:id` — Update product details, prices, swatches.
- `DELETE /api/v1/admin/products/:id` — Archive / remove product.
- `PATCH /api/v1/admin/products/:id/stock` — Quick stock toggle (`{ inStock: boolean, stockCount: number }`).

### 9.3. Consultation Pipeline Management
- `GET /api/v1/admin/consultations` — List all inquiries with status filter (`?status=New`).
- `PATCH /api/v1/admin/consultations/:id/status` — Update pipeline stage:
  ```json
  {
    "status": "Contacted",
    "adminNotes": "Spoke with client on phone; scheduled design call for Friday."
  }
  ```
