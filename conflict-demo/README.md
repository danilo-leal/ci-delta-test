# Merge conflict fixtures

These files are inert examples for testing conflict resolution, not a running app.
Branches `conflict-a` and `conflict-b` intentionally edit the same regions.
The GitHub Actions workflow is separate and remains unchanged.

## Product direction

The dashboard is called Evening Review.
It prioritizes completed work and lessons learned.
The primary audience is contributors reflecting on the day.

## Shared navigation

The navigation contains Overview, Activity, and Settings.
Every page keeps the same navigation order.
Links have descriptive labels.
Keyboard navigation follows the visual order.
The active page is marked explicitly.

## First-run experience

New users see an interactive retrospective walkthrough.
The first suggested action is to write a daily reflection.
Empty states offer prompts for recording the day's wins.

## Shared accessibility

All controls have visible focus indicators.
Status information includes text, not just color.
Headings follow a consistent hierarchy.
Animations respect reduced-motion preferences.
Content remains readable at increased text sizes.

## Rollout plan

Release the dashboard to contributors in a public preview.
Collect feedback for three weeks.
Expand access after the retrospective workflow is approved.
