import { Member } from '../types';

export const validateMemberName = (name: string, members: Member[]): string | null => {
  if (!name.trim()) return "Member name is required";
  if (name.trim().length < 2) return "Member name must be at least 2 characters";
  if (name.trim().length > 50) return "Member name must be less than 50 characters";
  if (members.some(m => m.name.toLowerCase() === name.trim().toLowerCase())) return "Member with this name already exists";
  return null;
};

export const validateBillData = (title: string, amount: string, period: string, members: Member[]): string | null => {
  if (!title.trim()) return "Bill title is required";
  if (title.trim().length < 2) return "Bill title must be at least 2 characters";
  if (title.trim().length > 120) return "Bill title must be less than 120 characters";
  
  const amountNum = Number(amount);
  if (!amount.trim()) return "Amount is required";
  if (isNaN(amountNum) || amountNum <= 0) return "Amount must be a positive number";
  if (amountNum > 999999) return "Amount cannot exceed €999,999";
  
  if (!period.trim()) return "Period is required";
  if (!period.match(/^\d{4}-\d{2}$/)) return "Period must be in YYYY-MM format";
  
  if (members.length === 0) return "Add at least one member before creating bills";
  
  return null;
};

type SplitMetadata = Record<string, string | number>;

const getValue = (meta: SplitMetadata, id: number): string | number | undefined => {
  return meta[String(id)];
};

export const validatePercentages = (percentMeta: SplitMetadata, members: Member[]): string | null => {
  let sum = 0;
  const memberCount = members.length;
  let filledCount = 0;
  
  for (const m of members) {
    const value = getValue(percentMeta, m.id);
    if (value !== undefined && value !== '') {
      const num = typeof value === 'string' ? Number(value) : value;
      if (isNaN(num) || num < 0) return `Invalid percentage for ${m.name}`;
      if (num > 100) return `Percentage for ${m.name} cannot exceed 100%`;
      sum += num;
      filledCount++;
    }
  }
  
  if (filledCount === 0) return "Please enter percentages for at least one member";
  if (filledCount < memberCount) return "Please enter percentages for all members";
  if (Math.abs(sum - 100) > 0.01) return `Percentages must sum to 100% (currently ${sum.toFixed(2)}%)`;
  
  return null;
};

export const validateWeights = (weightMeta: SplitMetadata, members: Member[]): string | null => {
  let sum = 0;
  let filledCount = 0;
  
  for (const m of members) {
    const value = getValue(weightMeta, m.id);
    if (value !== undefined && value !== '') {
      const num = typeof value === 'string' ? Number(value) : value;
      if (isNaN(num) || num < 0) return `Invalid weight for ${m.name}`;
      if (num > 1000) return `Weight for ${m.name} cannot exceed 1000`;
      sum += num;
      filledCount++;
    }
  }
  
  if (filledCount === 0) return "Please enter weights for at least one member";
  if (sum <= 0) return "Total weight must be greater than 0";
  
  return null;
};
