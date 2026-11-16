# Décora – Risk Register & Mitigation Strategy

**Document Version:** 1.0.0  
**Phase:** Phase 0 (Planning & Requirements Engineering)  
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
| **RSK-01** | Technical | **Room Planner 2D Canvas Over-Engineering:** Building custom drag/drop, rotation, and collision math from scratch could encounter edge cases or browser quirks. | 4 | 4 | **16 (High)** | Implement top-down architectural bounding-box representation with clear coordinate math (X, Y, Width, Length, Angle). Use standard HTML5 Canvas 2D or SVG elements. | If HTML5 Canvas hit-testing becomes cumbersome, switch to an SVG-based room container with standard CSS transform drag-and-drop. |
| **RSK-02** | Data / Infra | **MongoDB Connection / Service Availability:** Local MongoDB server daemon might not be running or may encounter permissions issues on Windows. | 3 | 5 | **15 (High)** | Check and test local `mongod` service, or configure standard connection fallback using a free MongoDB Atlas URI in `.env`. | Provide an automated mock in-memory database fallback or seeded JSON mock service if local MongoDB fails to start during local evaluation. |
| **RSK-03** | Schedule | **14-Day Timeline Compression:** Spending excessive time on early visual design could leave insufficient time for Admin features and Room Planner. | 4 | 4 | **16 (High)** | Enforce strict daily milestone timeboxing following the Phase 1–5 schedule. Prioritize MVP user stories before styling polish. | Defer non-critical stretch features (such as image file uploads or PDF export) to future release. |
| **RSK-04** | Asset | **Image Broken Links / External CDN Latency:** External image URLs breaking or encountering rate limits during evaluation. | 3 | 4 | **12 (Med)** | Use curated, direct, high-availability interior design images from reliable CDNs (Unsplash curated furniture collections) with explicit fallback placeholder images. | Store lightweight local SVG and WebP fallback assets directly in `client/public/assets/placeholders/`. |
| **RSK-05** | Technical | **Customizer Visual Complexity:** Expectation of full 3D rendering vs. practical 2D visual customization. | 3 | 4 | **12 (Med)** | Clearly document that Release 1.0 uses high-fidelity multi-attribute variant swatches, layered image composites, and real-time price math. | Avoid heavy Three.js dependencies; ensure the interactive 2D swatches and price updates are responsive and polished. |
| **RSK-06** | Security | **Broken Access Control on Admin Routes:** Unauthenticated or regular customer users accessing admin dashboard or mutating catalog items. | 2 | 5 | **10 (Med)** | Implement two-tier middleware on the Express backend (`verifyToken` + `verifyAdminRole`), and route-guard wrappers in React Router (`<AdminRoute>`). | Deny access by default (HTTP 403 Forbidden) if user role !== "admin". |
| **RSK-07** | Quality | **Responsive Layout Degradation on Mobile:** Canvas or complex catalog filters overflowing on small smartphone screens (<= 375px). | 3 | 3 | **9 (Med)** | Design mobile-first with collapsible drawer filters, responsive flex/grid wrappers, and touch-friendly drag handlers or touch controls for the Room Planner. | Render a dedicated mobile-optimized notice or simplified coordinate adjusters for the Room Planner on screens < 640px. |

---

## 3. Fallback Architectures & Decision Protocols

### Protocol A: Room Planner Canvas Architecture
- **Primary Architecture:** HTML5 Canvas element managed via React `useRef`, handling top-down rectangular and circular furniture items with bounding-box collision detection.
- **Fallback Architecture:** If canvas event coordinates encounter pointer inaccuracies across high-DPI screens, pivot to an **SVG-based Room Board** where each furniture piece is an `<svg>` element with SVG `transform="translate(x, y) rotate(deg)"`. SVG provides native DOM event handling (`onClick`, `onMouseDown`) without manual pixel raycasting.

### Protocol B: Database Resilience
- **Primary Architecture:** MongoDB running locally on `mongodb://127.0.0.1:27017/decora`.
- **Fallback Architecture:** A pre-configured MongoDB Atlas connection string in `.env.example` that allows immediate connection without local Windows service dependencies.

### Protocol C: Image Asset Strategy
- **Primary Architecture:** High-resolution interior architecture images hosted via Unsplash CDN with exact resolution query parameters (`?auto=format&fit=crop&w=800&q=80`).
- **Fallback Architecture:** Bundled local fallback SVG/WebP assets inside `client/public/images/` to guarantee zero missing images even when offline.
