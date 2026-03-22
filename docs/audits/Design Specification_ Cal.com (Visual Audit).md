# Design Specification: Cal.com (Visual Audit)

## 1. Design Philosophy & Visual Identity
Cal.com employs a **minimalist, high-utility aesthetic** that balances professional enterprise reliability with modern open-source transparency. The design language is heavily influenced by the "Linear" and "Apple" schools of UI—prioritizing clarity, whitespace, and a monochromatic palette to reduce cognitive load in a complex scheduling environment.

| Attribute | Description |
| :--- | :--- |
| **Style** | Modern Minimalist / Neo-Bento |
| **Tone** | Professional, Trustworthy, Developer-centric |
| **Visual Hierarchy** | High contrast with bold typography and subtle depth |

---

## 2. Color System (Monochrome & Neutrals)
The palette is strictly functional, using a range of grays to define depth and hierarchy without relying on vibrant colors.

| Token | Value (Hex/RGB) | Usage |
| :--- | :--- | :--- |
| **Primary Background** | `#F4F4F4` / `rgb(244, 244, 244)` | Main page background, soft contrast against white cards |
| **Surface/Card** | `#FFFFFF` | Component backgrounds, cards, and input fields |
| **Primary Text** | `#000000` | Headings and primary body copy |
| **Secondary Text** | `#666666` | Labels, descriptions, and metadata |
| **Accent/Action** | `#000000` | Primary buttons and key interactive elements |
| **Border/Stroke** | `#E5E7EB` | Subtle dividers and card outlines |

---

## 3. Typography
Typography is the cornerstone of Cal.com's identity. It uses a custom geometric sans-serif for brand recognition and a highly legible variable font for UI.

### **Headings: Cal Sans**
- **Weight:** 600 (Semi-bold)
- **Character:** Geometric, tight tracking, modern.
- **Usage:** Hero titles, section headers.

### **Body & UI: Inter / Cal Sans UI**
- **Weight:** 400 (Regular), 500 (Medium)
- **Character:** High legibility, neutral.
- **Usage:** Navigation, labels, body text, data tables.

---

## 4. Layout & Grid System
Cal.com utilizes a **Bento-box layout** for feature showcases, which allows for modular, responsive content blocks.

- **Container Width:** Standard 1280px max-width for content.
- **Spacing (Gutter):** Generous use of `gap-4` (16px) to `gap-8` (32px) in grids.
- **Padding:** Large vertical section padding (80px - 120px) to create "breathing room."

---

## 5. Component Patterns

### Cards
- **Border Radius:** `12px` to `16px` (Softened corners).
- **Border:** `1px solid #E5E7EB` or subtle inner shadows.
- **Shadow:** Minimalistic "flat" shadows or none at all, relying on background contrast.
- **Marketplace Variant:** App cards use a fixed-height layout with top-aligned logos and bottom-aligned "Details" buttons to maintain grid consistency.

### Imagery & Illustration
- **Style:** Minimalist line-art illustrations with a "hand-drawn" feel.
- **Color:** Primarily black strokes on white or light gray backgrounds.
- **Purpose:** Used in the App Store and feature sections to add personality without distracting from the UI.

### **Buttons**
- **Primary:** Black background, white text, `8px` border-radius, bold weight.
- **Secondary:** White/Transparent background, black border, subtle hover lift.
- **Iconography:** Clean, stroke-based icons (likely Lucide or custom SVG).

### **Inputs & Forms**
- **Style:** High-contrast borders, clear focus states (black ring), and consistent internal padding.

---

## 6. Interaction & Motion
- **Hover States:** Subtle background shifts (e.g., white to `#F9FAFB`) or slight scale-up on cards.
- **Transitions:** Fast, linear-out-slow-in easing for a "snappy" feel.
- **Empty States:** Clean illustrations and clear CTAs.

---

## 7. Key Takeaways for AI Designer
1. **Stick to Monochrome:** Use color only for status indicators (e.g., green for available).
2. **Typography is UI:** Let the font size and weight do the heavy lifting for hierarchy.
3. **Rounded but Precise:** Use consistent `12px` radii across all major components.
4. **Whitespace is a Feature:** Do not crowd the interface; prioritize "air" between sections.
