/** Maps natural scroll progress to the measured centers of the two later milestones. */
export const OWNERSHIP_PHASES = { shared: 0.45, fundraiser: 0.85 } as const;

export const clampTimelineProgress = (value: number) => Math.min(1, Math.max(0, value));

export const getTimelineFill = (
  progress: number,
  sharedCenter: number,
  fundraiserCenter: number
) => {
  const position = clampTimelineProgress(progress);
  const shared = clampTimelineProgress(sharedCenter);
  const fundraiser = Math.max(shared, clampTimelineProgress(fundraiserCenter));

  if (position <= OWNERSHIP_PHASES.shared) {
    return shared * (position / OWNERSHIP_PHASES.shared);
  }
  if (position <= OWNERSHIP_PHASES.fundraiser) {
    return shared + (fundraiser - shared) *
      ((position - OWNERSHIP_PHASES.shared) / (OWNERSHIP_PHASES.fundraiser - OWNERSHIP_PHASES.shared));
  }
  return fundraiser + (1 - fundraiser) *
    ((position - OWNERSHIP_PHASES.fundraiser) / (1 - OWNERSHIP_PHASES.fundraiser));
};

export const getCurrentTimelineStage = (progress: number) => {
  const position = clampTimelineProgress(progress);
  if (position >= OWNERSHIP_PHASES.fundraiser) return 2;
  if (position >= OWNERSHIP_PHASES.shared) return 1;
  return 0;
};
