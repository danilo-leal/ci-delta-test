// Static sample content for merge-conflict testing; this is not application code.
export const dashboardHeader = {
  title: "Team Overview",
  subtitle: "A balanced view of your team's activity.",
  action: "Browse activity",
};

export const navigation = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

// Stable navigation content separates the editable sections.
export const emptyState = {
  title: "No activity yet",
  description: "New updates will appear here.",
  action: "Explore the workspace",
};

export const accessibility = {
  pageRole: "main",
  navigationLabel: "Workspace navigation",
  statusRole: "status",
  liveRegion: "polite",
  respectReducedMotion: true,
};

export const releaseBanner = {
  title: "An early look at the dashboard",
  description: "Share feedback with the internal team.",
  action: "Send feedback",
};
