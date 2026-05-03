# E-E-A-T Strategy v2: Second-Pass Review

## ACCEPT (What was done well & integrated correctly)
- **Build-First Pivot:** Fully integrated and correctly conceptualized. Concentrating the volume on the "Build" pillar while allowing "Invest" and "Thrive" to exist opportunistically protects the topical entity without abandoning the multi-disciplinary author signal.
- **Phase A.5 (Domain Network Wiring):** Added exactly as needed. Moving the schema/entity work before the content velocity phase is the right sequence.
- **Cross-Domain Rules / PBN Constitution:** Excellent. The rules around topical relevance (solar domains only link to Build), brand anchors only, and no sitewide/footer links effectively mitigate the footprint risks of using a portfolio.
- **Name Resolution Schema:** Implemented correctly. Using `name: "Sid Gangal"` with `alternateName: "Siddharth Gangal"` bridges the informal brand and the formal/legal identity perfectly.

## CHANGE (Issues in the Domain Owner Brief)

**1. Disconnected Person Schema Risk**
In Part 1 of the Brief, you provide a standalone JSON-LD block for the `Person` schema. 
*The problem:* If a site owner just pastes this `<script>` into their `<head>`, it creates a `Person` node that isn't connected to the article itself. Meanwhile, their CMS (e.g., WordPress/Yoast) is likely already auto-generating an `Article` schema with a different, auto-generated author node. Google will see two conflicting authors.
*The fix:* The brief must explicitly state that this `Person` node needs to be referenced by the `Article` or `BlogPosting` schema as the `author` (e.g., `"author": { "@id": "https://theusefulstack.com/about#sid" }`). For WordPress users, you should add a note that they may need a developer to hook into Yoast/RankMath to override the default author `@id`, rather than just pasting a new script tag.

**2. Misuse of the `employee` property in Organization Schema**
In Part 2 of the Brief, you write: *"If Sid is an employee / contributor but not a founder, replace `founder` with `employee`"*.
*The problem:* If you are just a guest contributor to your friends' sites (e.g., surgepv.com), you are not legally an employee. Falsely claiming `employee` in the schema can cause trust issues if Google cross-references LinkedIn or other data. schema.org does not have a `contributor` property for Organization.
*The fix:* Clarify that if you are just a guest author/friend, they should NOT link you to their `Organization` schema at all. Your connection to their site is strictly through the `author` property on the `Article` schema.

## ADD (Missing Context)

**1. The "Why" for Non-Technical Owners (Onboarding Context)**
While Part 6 covers "What You Get Out of This," the tone of the brief is highly technical right out of the gate. If a friend who runs a solar company reads this, they might be intimidated. 
*Recommendation:* Add a very short, non-technical TL;DR at the very top explaining: *"I am trying to consolidate my author identity across the web so Google knows it's me writing these articles. This document is for your web developer to ensure our sites are linked correctly behind the scenes. It should take them less than an hour."*

**2. Canonicalization vs. Duplicate Content Clarification**
In Part 4 (Canonical Convention), make it crystal clear that the partner site should NOT use a canonical tag if the article is unique to their site. The brief hints at this (*"only for articles where Sid is the primary author and the partner site is acting as a distribution channel"*), but non-technical users often confuse this and might canonical *every* post you write for them back to your blog, which would destroy their own site's ability to rank for those unique posts.

## Final Verdict
The strategy document (`plan.md`) is rock solid. The Domain Owner Brief (`domain-owner-brief.md`) is structurally sound but needs the technical refinements above (specifically regarding Yoast integration and the `Article` schema connection) before you hand it to partner developers.
