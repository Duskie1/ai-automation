# Plan: Create Auto-Activated CEO Mentor

## Context

The user wants a personal CEO mentor/wingman based on Dan Martell's "Buy Back Your Time" book that is **automatically active** in every conversation - no manual command needed.

## Approach: Hybrid Knowledge Architecture (User Approved)

**3 layers of knowledge:**

| Layer | Location | Content | Purpose |
|-------|----------|---------|---------|
| **1. Persona** | CLAUDE.md | Dan Martell's coaching style, triggers | Auto-activated mentor |
| **2. Frameworks + Summaries** | Memory MCP | 10-15 entities with frameworks + chapter summaries | Quick retrieval |
| **3. Full Content** | data/books/.../full_text.md | Complete book | Deep queries on demand |

**Memory entities to create:**

1. **Core Principles** (success_pattern)
   - Buyback Principle, Buyback Loop, Buyback Rate

2. **Frameworks** (success_pattern)
   - DRIP Matrix (4 quadrants explained)
   - Replacement Ladder
   - 10-80-10 Rule
   - Camcorder Method

3. **Chapter Summaries** (lesson_learned)
   - Ch 1: How I Buy Back My Life
   - Ch 2: The DRIP Matrix
   - Ch 3: The 5 Time Assassins
   - Ch 4: The Only 3 Trades That Matter
   - Ch 5: The Replacement Ladder
   - Ch 6: Clone Yourself
   - Ch 7: Building Playbooks
   - Ch 8: Your Perfect Week
   - Ch 9-14: (key insights)

4. **Key Concepts** (lesson_learned)
   - Energy Audit, Calendar Audit, etc.

**CLAUDE.md addition (~100 lines):**
- CEO Mentor persona definition
- When to apply frameworks
- Instruction to search memory for book knowledge
- Reference to full book for deep dives

---

## Implementation

### 1. Add CEO Mentor Section to CLAUDE.md

Add a new section to project instructions that:
- Defines the CEO mentor persona (Dan Martell's coaching style)
- Embeds core principles directly
- Instructs Claude to apply frameworks proactively
- References memory entities for detailed frameworks

### 2. Store Key Frameworks in Memory MCP

Create `success_pattern` entities:

| Framework | Description |
|-----------|-------------|
| **Buyback Principle** | Don't hire to grow. Hire to buy back your time. |
| **Buyback Loop** | Audit → Transfer → Fill cycle |
| **Buyback Rate** | 25% of effective hourly rate |
| **DRIP Matrix** | Delegation, Replacement, Investment, Production |
| **Replacement Ladder** | Systematic task offloading |
| **5 Time Assassins** | What kills entrepreneur time |
| **Camcorder Method** | Record tasks to create playbooks |
| **10-80-10 Rule** | First 10%, delegate 80%, review 10% |

### 3. Book Reference

Preprocessed book location:
```
data/books/Buy_Back_Your_Time_-_Dan_Martell-340-1/markdown/full_text.md
```

---

## Critical Files

- **Modify:** `CLAUDE.md` - Add CEO mentor section
- **Create:** Memory entities for frameworks
- **Reference:** Preprocessed book markdown

---

## Verification

1. Start new conversation - CEO mentor persona should be active
2. Ask about time/delegation - should apply book principles automatically
3. Ask about a framework - should retrieve from memory or book

---

## Implementation Steps

1. Add CEO mentor section to CLAUDE.md
2. Create memory entities for key frameworks
3. Test in new session
