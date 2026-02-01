export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateDays = (startDate: string | undefined, endDate: string | undefined): number => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const calculateBudgetSpent = (expenses: number[]): number => {
  return expenses.reduce((sum, expense) => sum + expense, 0);
};

export const calculateBudgetRemaining = (budget: number, spent: number): number => {
  return Math.max(0, budget - spent);
};

export const validateDate = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};
