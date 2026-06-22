---
name: tattoo-31-day-stories
description: Use when the user (a tattoo artist/studio owner, or the Tattoo AI Assistant acting on their behalf) wants help planning, writing, or adapting Instagram/social media Stories content for a tattoo business — e.g. "склади мені контент-план на сторіс", "що написати в сторіс сьогодні", "допоможи з прогрівом аудиторії", "31 день сторіс", or any request about a daily/weekly Stories calendar, audience warm-up ("прогрев"), or sales stories for a tattoo master. Not for general tattoo consulting (style/placement/aftercare) — that is handled by the main consultant system prompt.
---

# Tattoo Artist 31-Day Stories Plan

This skill packages a ready-made 31-day Instagram Stories content calendar ("Pro Stories") originally written for tattoo masters/studio owners. Use it as a knowledge base to generate, adapt, or explain daily Stories content for a tattoo artist's audience-warming and sales funnel.

The full source plan, **verbatim, unmodified**, is in `reference.md` next to this file. Read it before responding whenever the user's request maps to one or more days of the plan.

## How to use this skill

1. **Identify which day(s) the user needs.** If they say "what should I post today" without context, ask which day of the cycle they're on (1–31), or offer to start from Day 1.
2. **Pull the relevant day's content from `reference.md`** and adapt it:
   - Keep the same structure (creative story → call-to-action → sales blocks where present).
   - Translate or rewrite in the language the user is writing in (the source is Ukrainian/Russian with emoji), but preserve the *intent* and *sequence* of each day — don't skip the sales/CTA blocks where the original has them (days 5, 10, 11, 16, 17, 29, 30, 31 are heavier on sales; days 1–3, 6, 12–14, 19 are lighter/personal "lifestyle" days).
   - Keep emoji usage in the style of the original — it's part of the engagement format.
3. **If the user wants a full month plan**, summarize all 31 days as a compact table/list (day number + 1-line theme), then expand individual days on request rather than dumping the entire reference verbatim.
4. **If the user wants to customize** (different niche details, different discount %, different studio specifics), apply their specifics into the day's template instead of the generic placeholders in the source.
5. **Don't invent new days or themes** that aren't in the source plan unless the user explicitly asks for original additional content — this skill's value is fidelity to the tested 31-day sequence.

## Key principles embedded in the plan (apply when generating new copy)

- Personal/origin-story days build trust before any selling happens (days 1–2).
- Process/behind-the-scenes days build perceived professionalism (days 3, 8, 16).
- Discounts should be framed as percentages, not flat amounts, and time-boxed (day 5).
- Every "sales" day should have at least two calls-to-action: one mid-stories, one at the end.
- Expert/Q&A days reduce booking friction by preemptively answering common client fears (days 18, 28).
- Lifestyle/personal days (6, 12–14, 19) should be interspersed to keep the audience emotionally engaged, not just sold to.
