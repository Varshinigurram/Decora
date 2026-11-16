# Décora – Risk Register & Mitigation Strategy

**Document Version:** 1.1.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
**Academic Subject:** Frontend Web Development (Primary Focus)  
**Evaluation Standard:** Risk Severity Index (Probability × Impact)

---

## 1. Risk Evaluation Matrix

Risks are rated on a scale of 1 to 5 for both **Probability (P)** and **Impact (I)**:
$$\text{Risk Severity Score (RSS)} = \text{Probability} \times \text{Impact}$$
- **High Severity (15–25):** Critical risk requiring proactive prevention and validated fallback architecture.
- **Medium Severity (8–14):** Significant risk requiring active monitoring and mitigation strategies.
- **Low Severity (1–7):** Acceptable operational risk managed through standard procedures.

---

## 2. Risk Register

| Risk ID | Category | Risk Description | Prob (1-5) | Imp (1-5) | Severity (P×I) | Mitigation Strategy | Contingency / Fallback Plan |
|---|---|---|---|---|---|---|---|
| **RSK-01** | Technical | **Room Planner Complexity:** Custom coordinate math and canvas hit-testing could lead to complex bugs and layout glitches. | 3 | 4 | **12 (Med)** | Use a **React-Managed SVG Canvas**. SVG elements natively support DOM events (`onClick`, `onMouseDown`), CSS transforms (`rotate`, `translate`), and responsive vector scaling without manual canvas raycasting. | If touch drag-and-drop behaves inconsistently on small devices, provide step-based directional controls (move left/right/up/down buttons) alongside drag handles. |
| **RSK-02** | Database | **MongoDB Atlas / Local Connection Failure:** Network connectivity to MongoDB Atlas cluster fails or local `mongod` daemon is stopped. | 3 | 4 | **12 (Med)** | Configure MongoDB Atlas as the primary database in `.env` with local MongoDB as a secondary option. Include robust connection retry and timeout handling in `db.js`. | **Never silently switch to an in-memory mock and pretend data was persisted.** If MongoDB is completely unreachable, surface a clear connection error banner or an **explicitly labelled read-only demo mode** informing the evaluator that persistence is offline. |
| **RSK-03** | Security | **XSS & Insecure Token Storage in LocalStorage:** Storing JWT in browser `localStorage` leaves tokens vulnerable to cross-site scripting (XSS). | 2 | 5 | **10 (Med)** | Store JWT strictly inside **HTTP-only, SameSite cookies** (`httpOnly: true, sameSite: 'lax', secure: false in dev`). Client JavaScript cannot access the token. Protect endpoints with ownership checks (`req.user.id === resource.userId`). | On the frontend, configure Axios with `withCredentials: true` and on Express use `cors({ origin: 'http://localhost:5173', credentials: true })` and `cookie-parser`. |
| **RSK-04** | Asset | **Image Broken Links & Variant Inconsistency:** External image links breaking or displaying unrelated furniture photos for color/material variants. | 3 | 4 | **12 (Med)** | Use a central asset registry (`furnitureMapping.js`) with curated, properly licensed photography and bundled local fallback SVG assets. For customization variants, use real color/material swatches and dynamic SVG/CSS overlay filters rather than swapping to unrelated furniture photos. | If an image fails to load, `onError` handler automatically swaps to the bundled local placeholder image. |
| **RSK-05** | Schedule | **Timeline Deviation from Frontend Priority:** Over-investing early development time in backend services when the academic evaluation focuses on Frontend Web Development. | 3 | 5 | **15 (High)** | Adopt the **Frontend-First schedule** (Phases 1–4 Days 1–10). Build and validate interactive React components with mock data first. Integrate Express and MongoDB in Phase 5 (Days 11–12). | Timebox backend endpoints to core CRUD operations and standard MVC patterns; avoid complex or speculative backend logic. |
| **RSK-06** | Access | **Broken Authorization on Admin Endpoints:** Non-admin users mutating products or viewing customer consultation requests. | 2 | 5 | **10 (Med)** | Implement two-layer authorization: backend middleware verifying `req.user.role === 'admin'` and React Router `<AdminRoute>` guards. Return HTTP 403 Forbidden on unauthorized requests. | Deny access by default; require explicit admin role claim on all `/api/v1/admin/*` routes. |
| **RSK-07** | Responsiveness | **Layout Overflow on Mobile Devices:** Complex catalog filters, customizer swatches, or room planner breaking on mobile screens (<= 375px). | 3 | 3 | **9 (Med)** | Develop mobile-first with collapsible drawer filters, flexible wrapping grids, responsive typography, and touch-optimized buttons. | Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) and overflow containment (`overflow-x-hidden`) across all views. |

---

## 3. Fallback & Architecture Protocols

### Protocol A: Database Availability & Transparency Protocol
- **Primary Connection:** MongoDB Atlas cloud cluster via `MONGODB_URI` environment variable.
- **Alternative Connection:** Local MongoDB daemon at `mongodb://127.0.0.1:27017/decora`.
- **Integrity Rule:** If both connections fail:
  1. The server must log an explicit, formatted connection error.
  2. The server must **NOT** silently spin up an in-memory mock database and falsely claim persistence.
  3. The frontend must display an **explicitly labelled read-only demo mode banner**: *"Notice: Database currently offline. Displaying static demo catalog in read-only mode."*

### Protocol B: Authentication & Local CORS Configuration Protocol
- **Cookie Security:**
  ```javascript
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  ```
- **Local Dev CORS Configuration:**
  - Express Server:
    ```javascript
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true
    }));
    ```
  - React Client:
    ```javascript
    // Axios global configuration
    axios.defaults.baseURL = 'http://localhost:5000/api/v1';
    axios.defaults.withCredentials = true;
    ```

### Protocol C: Image Handling & Variant Authenticity Protocol
- **Central Asset Registry:** All image references are resolved through a dedicated `client/src/assets/furnitureMapping.js` file.
- **Variant Handling Rule:** Customization variants (fabrics, woods, metals) modify material texture swatches and apply coordinated SVG/CSS filter overlays to the genuine furniture asset. Unrelated furniture photos must never be swapped in as a "variant".
- **Bundled Fallback:** Local SVG placeholders stored in `client/public/placeholders/` guarantee zero broken image icons even during complete network disconnects.
