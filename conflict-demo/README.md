# Merge conflict fixtures

These files are inert examples for testing conflict resolution, not a running app.
Branches `conflict-a` and `conflict-b` intentionally edit the same regions.
The GitHub Actions workflow is separate and remains unchanged.

## Product direction

The dashboard is called Team Overview.
It prioritizes a balanced summary of activity.
The primary audience is the whole team.

## Shared navigation

The navigation contains Overview, Activity, and Settings.
Every page keeps the same navigation order.
Links have descriptive labels.
Keyboard navigation follows the visual order.
The active page is marked explicitly.

## First-run experience

New users see a short welcome message.
The first suggested action is to browse recent activity.
Empty states explain where data will appear.

## Shared accessibility

All controls have visible focus indicators.
Status information includes text, not just color.
Headings follow a consistent hierarchy.
Animations respect reduced-motion preferences.
Content remains readable at increased text sizes.

## Rollout plan

Release the dashboard to the internal team first.
Collect feedback for one week.
Expand access after reviewing the initial feedback.
