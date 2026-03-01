
import { AgeResult, ClassConfig } from './types';
import { CLASSES } from './constants';

export const calculateAge = (dob: Date, targetDate: Date): { years: number; months: number; days: number } => {
  let years = targetDate.getFullYear() - dob.getFullYear();
  let months = targetDate.getMonth() - dob.getMonth();
  let days = targetDate.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

export const validateAge = (age: { years: number; months: number; days: number }, classConfig: ClassConfig): AgeResult => {
  const { years, months } = age;
  // Use a more precise comparison for board compliance
  // Usually boards look at the year count primarily, but some are strict on the month too.
  const totalMonths = (years * 12) + months;
  const minMonths = classConfig.minAge * 12;
  const maxMonths = classConfig.maxAge * 12;

  if (totalMonths >= minMonths && totalMonths < maxMonths) {
    return {
      ...age,
      isValid: true,
      status: 'perfect',
      message: 'Age is compliant',
      suggestion: `This student meets the standard criteria for ${classConfig.name}. They fall within the required range of ${classConfig.minAge} to ${classConfig.maxAge} years.`
    };
  } else if (totalMonths < minMonths) {
    const monthsNeeded = minMonths - totalMonths;
    const bestClass = CLASSES.find(c => {
      const cMin = c.minAge * 12;
      const cMax = c.maxAge * 12;
      return totalMonths >= cMin && totalMonths < cMax;
    });

    return {
      ...age,
      isValid: false,
      status: 'under-age',
      message: 'Student is Under-age',
      suggestion: `The student is short by ${monthsNeeded} month(s) for ${classConfig.name}. ${bestClass ? `Based on current age, the most suitable class for this student is ${bestClass.name}.` : 'They are too young for the primary sections.'}`
    };
  } else {
    const bestClass = [...CLASSES].reverse().find(c => totalMonths >= (c.minAge * 12));
    
    return {
      ...age,
      isValid: false,
      status: 'over-age',
      message: 'Student is Over-age',
      suggestion: `The student's age exceeds the board's recommended limit for ${classConfig.name}. ${bestClass ? `They might be better suited for ${bestClass.name} or may require special permission for admission.` : 'They have exceeded the school age brackets.'}`
    };
  }
};

export const isValidDate = (day: number, month: number, year: number): boolean => {
  if (year < 1900 || year > 2100) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
