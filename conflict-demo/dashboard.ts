// Static sample content for merge-conflict testing; this is not application code.
export const dashboardHeader = {
  title: "Morning Brief",
  subtitle: "Plan the work that matters most today.",
  action: "Create a priority list",
};

export const navigation = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

// Stable navigation content separates the editable sections.
export const emptyState = {
  title: "Your day is ready to plan",
  description: "Choose a sample plan or add your first priority.",
  action: "Use a sample plan",
};

export const accessibility = {
  pageRole: "main",
  navigationLabel: "Workspace navigation",
  statusRole: "status",
  liveRegion: "polite",
  respectReducedMotion: true,
};

export const releaseBanner = {
  title: "Private beta for team leads",
  description: "Help refine the daily planning workflow.",
  action: "Review the planning beta",
};
