export interface Country {
  code: string;
  dialCode: string;
  name: string;
  nameAr: string;
}

export const countries: Country[] = [
  {
    code: 'qa',
    dialCode: '+974',
    name: 'Qatar',
    nameAr: 'قطر'
  },
  {
    code: 'sa',
    dialCode: '+966',
    name: 'Saudi Arabia',
    nameAr: 'المملكة العربية السعودية'
  },
  {
    code: 'ae',
    dialCode: '+971',
    name: 'United Arab Emirates',
    nameAr: 'الإمارات العربية المتحدة'
  },
  {
    code: 'kw',
    dialCode: '+965',
    name: 'Kuwait',
    nameAr: 'الكويت'
  },
  {
    code: 'bh',
    dialCode: '+973',
    name: 'Bahrain',
    nameAr: 'البحرين'
  },
  {
    code: 'om',
    dialCode: '+968',
    name: 'Oman',
    nameAr: 'عُمان'
  },
  {
    code: 'jo',
    dialCode: '+962',
    name: 'Jordan',
    nameAr: 'الأردن'
  },
  {
    code: 'eg',
    dialCode: '+20',
    name: 'Egypt',
    nameAr: 'مصر'
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find(country => country.dialCode === dialCode);
};

export const DEFAULT_COUNTRY = countries[0]; // Qatar
