// Static sample content for merge-conflict testing; this is not application code.
export const dashboardHeader = {
  title: "Evening Review",
  subtitle: "Reflect on what your team accomplished today.",
  action: "Write a daily reflection",
};

export const navigation = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "settings", label: "Settings" },
];

// Stable navigation content separates the editable sections.
export const emptyState = {
  title: "Every day has something worth recording",
  description: "Start with a prompt about today's wins and lessons.",
  action: "Choose a reflection prompt",
};

export const accessibility = {
  pageRole: "main",
  navigationLabel: "Workspace navigation",
  statusRole: "status",
  liveRegion: "polite",
  respectReducedMotion: true,
};

export const releaseBanner = {
  title: "Public preview for contributors",
  description: "Help refine the daily retrospective workflow.",
  action: "Explore the retrospective preview",
};
