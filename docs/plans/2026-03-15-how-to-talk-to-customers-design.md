# Article Design: How to Talk to Customers

## Metadata

- **Title:** "How I Learned to Talk to Customers"
- **Slug:** `how-to-talk-to-customers`
- **Pillar:** build
- **Format:** Guide
- **Topics:** customer-discovery, startups, founder-journey
- **Target length:** ~3000-3500 words
- **Style:** Personal narrative (like "A Founder's Guide to Early Customer Discounts")

## Core Thesis

User interviews are necessary but insufficient. The real product insights come from **shadowing** - watching users work in their actual environment. People can't articulate workflows they've internalized. The gap between what users say and what they do is where product opportunities live.

## Data Sources

1. **Emmett Shear's YC lecture** ("How to Run a User Interview") - Referenced lightly as the standard framework, then built upon
2. **4PEL shadowing notes** (5 days on-site) - The heart of the article
3. **Product risk matrix** from Solar Labs - Shows how observations mapped to product decisions
4. **User interviews** with Swati, Bharat, Ground Mount Guy - Contrasted with shadowing observations

## Structure

### Opening (~200 words)

**Hook:** Started Solar Labs building for solar engineers. Problem: founders weren't solar engineers. Could code but couldn't design a solar system.

**The mistake:** Early on, built features based on assumptions and competitor analysis. Months wasted building features nobody wanted.

**The turn:** Then went to 4PEL for a week. Everything changed.

### Act 1: What Everyone Gets Right (and What They Miss) (~400 words)

Reference Emmett Shear's YC framework briefly:
- Talk to users before building
- Don't ask about features, understand their problems
- Talk to 6-8 people across different segments
- Use "detective mode" when something surprises you
- Record interviews for team buy-in

**The twist:** All good advice. But interviews have a fundamental limitation - people can't articulate workflows they've internalized. They'll tell you about pain points they're conscious of. They won't tell you about the 60% of their time spent on formatting because they don't even register it as waste. That's where shadowing comes in.

Shadowing = watching users work in their real environment without intervening. It's ethnography, not market research. And it's what turned Solar Labs from "another solar tool" into software that 53 countries wanted.

### Act 2: The 4PEL Week (~1800 words)

#### Setting the Scene (~200 words)

4PEL: a solar EPC company in India. Building software for solar designers but never watched one work. Negotiated to shadow for a week. Day 1 brought a notebook. By day 3 it was full.

#### Day 1-2: Shadowing Manoj and Pawan (~500 words)

**Pair-programming observation:** One feeding values, other verifying. Nobody would describe this as "pair programming" in an interview - but that's exactly what they were doing. Reveals how collaborative and fragile the workflow is.

**The shadow analysis moment:** Checking shadows for 21st of every month. Trying 9-to-4 window first, then 9-to-3:30 if capacity doesn't fit contractual load. While tediously adding and removing panels, **they don't know their current capacity**. Working blind, going on gut. Bet is they've removed too many. Once removed, very hard to go back.

**The export disaster:** SketchUp to DWG for AutoCAD. Then an hour cleaning up stray lines. Toggle layers, delete measurements, remove offsets used for modeling but unnecessary for construction. Sometimes can't remove everything and just leave it. "Seeing them struggling with copying design and deleting selective stuff - they so want a layering tool."

**Copy-paste with reference points:** Always need a reference point when duplicating. Offset tool: direction + value, then type "*X" to repeat X times. These micro-workflows are invisible in interviews.

**Symmetry matters:** Can't keep one panel on the side "just like that." Aesthetic constraints that no feature spec would capture.

#### Day 3: Vinayak and the Big Realization (~400 words)

**Cabling workflow:** Measuring distance from each string to inverter along cable trench. Adding up-and-down Z distance. Multiplying by 2 for runs. 10% safety buffer. All in Excel. All manual.

**The time allocation insight:** "Most of the time is gone into decorative stuff like making things look good like hatching and coloring and cutting the waste line and measuring stuff. They are spending so little time in actual designing - like how to place panels, where to start stringing from, where to place the inverter." If you asked "what takes the most time?" they'd say "design" or "shading analysis." They wouldn't say "making hatching look pretty" because they don't think of it as separate. But watching them revealed the actual time allocation was inverted.

**The stringing disaster:** After completing all stringing, two modules were missing. Added 6 panels somewhere for stringing reasons, removed 8 somewhere else for shading. Net: -2, nobody noticed until the end. If last inverter had right count and middle ones were +/- offset, might never catch it. The fragility of manual tracking creating silent errors.

Then the realization about needing to reverse panels on one shed to minimize DC wire length. The complexity compounds with every decision, but each individual step seems manageable.

#### Day 4: The Interviews (Contrast) (~400 words)

**Swati:** "I hate AutoCAD work." Clean, quotable. But what actually consumed her time? BOM revisions (cable lengths), wiring (inverter position changes). "You can't copy paste scale values in SketchUp." Specifics only came after watching her work first and asking grounded follow-ups.

**Bharat (the reviewer):** Completely different perspective. Common mistakes he catches: washing valves not accessible, skip wiring not used, footing reference points wrong. Doesn't find small projects frustrating - but big projects need every single string checked. Without the reviewer's perspective, you'd only have the creator's view of the workflow.

**Ground Mount Guy:** "Rough estimations work for shading and the whole building is not required." Contradicted the assumption that precise 3D modeling was needed. But contradicted by the design manager who said "presentation is super important." Different roles, completely different needs from the same software.

#### Day 4: The Sales Meeting (~300 words)

Sat in on a sales meeting. Not scheduled as a "user interview." Just asked to observe.

Clients get about 20 proposals from different parties. Close rate is 10%. Turnaround: 7 days first design, 7 days client response, 2-3 days next iteration. Biggest problem wasn't design quality - it was speed of sending proposals.

They wanted 3-4 design options simultaneously. Proposal needed 3D snaps, videos, LCOE calculations. Design team was a bottleneck not because they were slow at designing - but because each proposal was a manual, multi-day process.

None of this came from talking to engineers. It came from sitting where sales met design.

**The confirmation bias note:** "Every company's design team is living under a confirmation bias bubble where they are the right ones and bashing the other ones." Taught the lesson to triangulate - never trust a single company's view of how things "should" work.

### Act 3: What Shadowing Taught Me (~600 words)

Six concrete lessons, each tied to how it shaped Solar Labs:

1. **People don't know their own workflows.** They've adapted. Watch them struggle and they don't call it struggling. Led to: building the auto-designer that eliminated the manual panel placement/removal loop.

2. **The real bottleneck is rarely where they say it is.** Engineers said shading analysis was hard. Reality: they spent more time on formatting and layouts. Led to: prioritizing automated layouts and exports.

3. **Interview different roles, shadow the doers.** Design manager, sales team, reviewers (Bharat), drafters (Swati) - each had completely different perspectives. Led to: building features for the full workflow, not just the design step.

4. **Your product risks map to user realities.** Product risk matrix showed "system design accuracy" as top concern. But watching users manually manipulate PVSyst factors revealed they cared more about speed and flexibility than precision. Led to: generation estimates within 3% of PVSyst, but 10x faster.

5. **Compare what they say vs. what they do.** "We need precise 3D modeling." Reality: "Rough estimations work for shading and the whole building is not required." Led to: simplifying the modeling interface instead of over-engineering 3D precision.

6. **Every company thinks they're uniquely right.** Confirmation bias bubbles everywhere. Need multiple companies to triangulate truth. Led to: shadowing at multiple EPCs, not just 4PEL.

### Closing: A Practical Playbook (~400 words)

**When to interview vs. shadow:**
- Interview when you need to understand the landscape (who are the players, what tools exist, what frustrates them generally)
- Shadow when you need to build a product (what do they actually do, where do they waste time, what's the real workflow)
- Do both. Interviews give you the map. Shadowing gives you the territory.

**How to set up a shadowing week:**
- Ask to visit for a week, not a day. Day 1 is "performing for the guest." Day 3+ is reality.
- Bring a notebook, not a laptop. Write observations, not judgments.
- Shadow multiple roles, not just your target user.
- Sit in on meetings you "shouldn't" be in (sales calls, client reviews).
- Don't interrupt. Don't suggest. Just watch and write.

**What to watch for:**
- Workarounds they've normalized (copy-paste with reference points, manual Excel calculations)
- Time spent on tasks they don't consider "work" (formatting, cleanup, verification)
- The gap between what they say they need and what actually slows them down
- Cross-team handoff friction (design to sales, creator to reviewer)
- Silent errors (the missing 2 modules nobody noticed)

**Final line:** Something about how the best products aren't built from surveys or feature requests - they're built by founders who cared enough to sit in someone else's chair for a week.

## Writing Notes

- First person throughout, conversational tone
- Use specific details from notes (mm precision, 21st of each month, 9-to-4 windows) - these make it real
- Don't sanitize the messiness - the "fuck this is getting complicated" note shows genuine learning
- 4PEL team members by first name (Manoj, Pawan, Swati, Bharat, Vinayak) - humanizes the story
- Avoid jargon-heavy solar engineering terms unless needed for the anecdote
- Reference Emmett Shear briefly, don't over-rely on his framework
- The article should feel like sitting with a founder who's sharing what actually happened, not a thought leader prescribing methodology
