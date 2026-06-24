# M-Agent Dashboard UX Audit

Date: 18 June 2026  
Scope: Desktop review of 7 dashboard tabs for a user who does not already know the M Agent backend data or machine timeline.

## Screens Reviewed

1. [All Configurations Overview](ux-audit-m-agent-dashboard/01-overview.png) - healthy, but the first story is slightly mixed between performance and display library.
2. [Compare By Machine](ux-audit-m-agent-dashboard/02-compare-machine.png) - strong comparison view, but clickable machine cards are not explained.
3. [Compare by month](ux-audit-m-agent-dashboard/03-compare-month.png) - clear trend, but lacks a short takeaway sentence.
4. [Location timeline](ux-audit-m-agent-dashboard/04-location-timeline.png) - useful, but needs a stronger explanation of borrowed event vs permanent location.
5. [Data Machine ID](ux-audit-m-agent-dashboard/05-data-machine-id.png) - good master table, but search/filter behavior is inconsistent.
6. [Top topics and repeated questions](ux-audit-m-agent-dashboard/06-top-topics.png) - clear and management-friendly.
7. [Data import](ux-audit-m-agent-dashboard/07-data-import.png) - simple, but needs clearer expected file structure for non-technical users.

## Strengths

- The KPI cards are easy to scan and the month-over-month comparison is visible.
- Compare By Machine works well for ranking all 5 kiosks.
- Q&A analysis is the clearest tab for management because it explains topic volume and answer gaps together.
- Event display images now appear in Event borrowing log only, which supports the latest data model.
- No browser console errors were found during the audit.

## UX Risks For New Users

1. Hero message conflicts with the main dashboard purpose.  
   The page title says monthly performance, but the right-side hero says Event Display Library. A first-time viewer may think this page is mainly about display visuals, not kiosk performance.

2. Tab names are too system-oriented.  
   "All Configurations Overview" and "Data Machine ID" sound like backend/internal labels. New users may not know which tab answers their question.

3. Filters feel global, but not every tab responds consistently.  
   Searching `NO4` filters Compare By Machine down to 1 card, but Data Machine ID still shows 5 rows while the filter note says 1 kiosk included. This can reduce trust in the dashboard.

4. Machine cards are clickable, but the UI does not say so.  
   Clicking a machine card correctly changes the Location timeline to that machine. This is useful, but currently hidden.

5. Timeline needs a legend and plain-language explanation.  
   Terms such as Permanent, Borrowed, Event, Internal relocation, and Machine Consolidation are meaningful to the backend team, but a new viewer needs a short legend.

6. Current location vs event borrowing can still feel conceptually tangled.  
   In Data Machine ID, machines show current permanent M8 locations, while Event borrowing shows temporary event usage. The dashboard should explicitly say that event movement does not replace the permanent/current location.

7. Top-level summary does not answer "what should I do next?" strongly enough.  
   The data is there, but the Overview could better surface action items: low-performing machine, content gap to fix, highest-engagement event, and relocation watchlist.

## Recommended Fix Order

1. Rename tabs into question-based language:
   - Monthly Overview
   - Compare Machines
   - Month Trend
   - Machine Movement Timeline
   - Machine Master Data
   - Customer Questions & KM Gaps
   - Import Data

2. Add a short "This month at a glance" strip under filters:
   - 5 machines active
   - 2 event borrowings
   - Highest engagement: NO1
   - Needs attention: NO4 apology/error rate

3. Add a visible hint on machine cards:
   - "Click to view movement timeline"

4. Fix search/filter consistency in Data Machine ID.

5. Add a timeline legend:
   - Permanent = normal location
   - Borrowed/Event = temporary event usage
   - Consolidation = moved to M8 as current base

6. Replace the hero side label with a dashboard-oriented label:
   - "M-Agent Monthly Command View"
   - Subtext: "Performance, movement, events, and KM gaps in one view"

7. Improve Data Import with a downloadable sample template and field grouping:
   - Machine fields
   - Monthly performance fields
   - Q&A/error log fields
   - Event borrowing fields

## Accessibility And QA Notes

- Visual contrast generally looks acceptable from screenshots, but this was not a full WCAG contrast calculation.
- Keyboard navigation and screen reader labels were not fully audited.
- Wide tables may be difficult on smaller screens and should keep sticky headers or horizontal scroll cues.
- No console errors appeared while navigating the 7 tabs.
