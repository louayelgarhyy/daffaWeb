export const commonAddressTitles = [
  { en: 'Home', ar: 'المنزل' },
  { en: 'Work', ar: 'العمل' },
  { en: 'Office', ar: 'المكتب' },
  { en: "Parent's Home", ar: 'منزل الوالدين' },
  { en: 'Other', ar: 'أخرى' },
];

export const getAddressTitleSuggestions = (language: string): string[] => {
  return commonAddressTitles.map(title =>
    language === 'ar' ? title.ar : title.en
  );
};
