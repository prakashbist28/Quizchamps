export const percentageColor = (pct) => {
  if (pct >= 75) return 'text-green-500';
  if (pct >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

export const percentageBadge = (pct) => {
  if (pct >= 75) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (pct >= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
};

export const difficultyBadge = (diff) => {
  if (diff === 'Easy') return 'bg-green-500/15 dark:bg-green-400/20 text-green-700 dark:text-green-400 border border-green-500/25 dark:border-green-400/25';
  if (diff === 'Hard') return 'bg-red-500/15 dark:bg-red-400/20 text-red-700 dark:text-red-400 border border-red-500/25 dark:border-red-400/25';
  return 'bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-400 border border-amber-500/25 dark:border-amber-400/25';
};
