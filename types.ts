
export enum Board {
  PUNJAB = 'Punjab Board',
  SINDH = 'Sindh Board',
  FEDERAL = 'Federal Board',
  KPK = 'KPK Board',
  DI_KHAN = 'D I Khan Board'
}

export interface ClassConfig {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  color: string;
  textColor: string;
  bgColor: string;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  isValid: boolean;
  status: 'perfect' | 'under-age' | 'over-age';
  message: string;
  suggestion?: string;
}

export interface DOB {
  day: number | string;
  month: number | string;
  year: number | string;
}
