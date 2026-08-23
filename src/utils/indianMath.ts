import { Language, IndianPlaceValue } from '../types';

export const INDIAN_PLACE_VALUES: IndianPlaceValue[] = [
  {
    placeName: { en: 'Ones', hi: 'इकाई', mr: 'एकक', ur: 'اکائی' },
    shortName: { en: 'O', hi: 'इ', mr: 'ए', ur: 'ا' },
    multiplier: 1,
    digitIndex: 0
  },
  {
    placeName: { en: 'Tens', hi: 'दहाई', mr: 'दशक', ur: 'دہائی' },
    shortName: { en: 'T', hi: 'द', mr: 'द', ur: 'د' },
    multiplier: 10,
    digitIndex: 1
  },
  {
    placeName: { en: 'Hundreds', hi: 'सैकड़ा', mr: 'शतक', ur: 'سینکڑہ' },
    shortName: { en: 'H', hi: 'सै', mr: 'श', ur: 'س' },
    multiplier: 100,
    digitIndex: 2
  },
  {
    placeName: { en: 'Thousands', hi: 'हज़ार', mr: 'हजार', ur: 'ہزار' },
    shortName: { en: 'Th', hi: 'ह', mr: 'ह', ur: 'ہ' },
    multiplier: 1000,
    digitIndex: 3
  },
  {
    placeName: { en: 'Ten Thousands', hi: 'दस हज़ार', mr: 'दहा हजार', ur: 'دس ہزار' },
    shortName: { en: 'T-Th', hi: 'द.ह', mr: 'द.ह', ur: 'د.ہ' },
    multiplier: 10000,
    digitIndex: 4
  },
  {
    placeName: { en: 'Lakhs', hi: 'लाख', mr: 'लाख', ur: 'لاکھ' },
    shortName: { en: 'L', hi: 'ला', mr: 'ला', ur: 'لا' },
    multiplier: 100000,
    digitIndex: 5
  },
  {
    placeName: { en: 'Ten Lakhs', hi: 'दस लाख', mr: 'दहा लाख', ur: 'دس لاکھ' },
    shortName: { en: 'T-L', hi: 'द.ला', mr: 'द.ला', ur: 'د.لا' },
    multiplier: 1000000,
    digitIndex: 6
  },
  {
    placeName: { en: 'Crores', hi: 'करोड़', mr: 'कोटी', ur: 'کروڑ' },
    shortName: { en: 'Cr', hi: 'क', mr: 'को', ur: 'ک' },
    multiplier: 10000000,
    digitIndex: 7
  },
  {
    placeName: { en: 'Ten Crores', hi: 'दस करोड़', mr: 'दहा कोटी', ur: 'دس کروڑ' },
    shortName: { en: 'T-Cr', hi: 'द.क', mr: 'द.को', ur: 'د.ک' },
    multiplier: 100000000,
    digitIndex: 8
  }
];

// Format number in Indian numbering system (e.g. 54321678 -> 5,43,21,678)
export function formatIndianNumber(num: number | string): string {
  const str = String(num).replace(/,/g, '').trim();
  if (!str || isNaN(Number(str))) return '0';

  const parts = str.split('.');
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  if (integerPart.length <= 3) {
    return integerPart + decimalPart;
  }

  const lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return formattedOther + ',' + lastThree + decimalPart;
}

// Convert English numbers to local numerals if requested, or clean numerals
export function localizeNumber(num: number | string, lang: Language): string {
  const formatted = formatIndianNumber(num);
  // Numbers in math for Urdu, Hindi, Marathi are best presented with high-legibility Indian system
  return formatted;
}

// English words generator
const ONES_EN = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS_EN = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertUnder1000En(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ONES_EN[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (n < 20) {
      str += ONES_EN[n] + ' ';
    } else {
      str += TENS_EN[Math.floor(n / 10)] + ' ' + (ONES_EN[n % 10] ? ONES_EN[n % 10] + ' ' : '');
    }
  }
  return str.trim();
}

export function numberToWordsEnglish(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWordsEnglish(-num);

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const remainder = num;

  if (crore > 0) {
    result += convertUnder1000En(crore) + ' Crore ';
  }
  if (lakh > 0) {
    result += convertUnder1000En(lakh) + ' Lakh ';
  }
  if (thousand > 0) {
    result += convertUnder1000En(thousand) + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertUnder1000En(remainder) + ' ';
  }

  return result.trim();
}

// Hindi words dictionary & converter
const HINDI_MAP: Record<number, string> = {
  0: 'शून्य', 1: 'एक', 2: 'दो', 3: 'तीन', 4: 'चार', 5: 'पाँच', 6: 'छह', 7: 'सात', 8: 'आठ', 9: 'नौ', 10: 'दस',
  11: 'ग्यारह', 12: 'बारह', 13: 'तेरह', 14: 'चौदह', 15: 'पंद्रह', 16: 'सोलह', 17: 'सत्रह', 18: 'अठारह', 19: 'उन्नीस', 20: 'बीस',
  21: 'इक्कीस', 22: 'बाईस', 23: 'तेईस', 24: 'चौबीस', 25: 'पच्चीस', 26: 'छब्बीस', 27: 'सत्ताईस', 28: 'अट्ठाईस', 29: 'उनतीस', 30: 'तीस',
  31: 'इकतीस', 32: 'बत्तीस', 33: 'तैंतीस', 34: 'चौंतीस', 35: 'पैंतीस', 36: 'छत्तीस', 37: 'सैंतीस', 38: 'अड़तीस', 39: 'उनतालीस', 40: 'चालीस',
  41: 'इकतालीस', 42: 'बयालीस', 43: 'तैंतालीस', 44: 'चवालीस', 45: 'पैंतालीस', 46: 'छियालीस', 47: 'सैंतालीस', 48: 'अड़तालीस', 49: 'उनचास', 50: 'पचास',
  51: 'इक्यावन', 52: 'बावन', 53: 'तिरेपन', 54: 'चौवन', 55: 'पचपन', 56: 'छप्पन', 57: 'सत्तावन', 58: 'अट्ठावन', 59: 'उनसठ', 60: 'साठ',
  61: 'इकसठ', 62: 'बासठ', 63: 'तिरेसठ', 64: 'चौंसठ', 65: 'पैंसठ', 66: 'छियासठ', 67: 'सड़सठ', 68: 'अड़सठ', 69: 'उनहत्तर', 70: 'सत्तर',
  71: 'इकहत्तर', 72: 'बहत्तर', 73: 'तिहत्तर', 74: 'चौहत्तर', 75: 'पचहत्तर', 76: 'छहत्तर', 77: 'सतहत्तर', 78: 'अठहत्तर', 79: 'उनासी', 80: 'अस्सी',
  81: 'इक्यासी', 82: 'बयासी', 83: 'तिरासी', 84: 'चौरासी', 85: 'पचासी', 86: 'छियासी', 87: 'सतासी', 88: 'अट्ठासी', 89: 'नवासी', 90: 'नब्बे',
  91: 'इक्यानवे', 92: 'बानवे', 93: 'तिरानवे', 94: 'चौरानवे', 95: 'पंचानवे', 96: 'छियानवे', 97: 'सत्तानवे', 98: 'अट्ठानवे', 99: 'निन्यानवे'
};

export function numberToWordsHindi(num: number): string {
  if (num === 0) return 'शून्य';
  if (num < 0) return 'ऋण ' + numberToWordsHindi(-num);

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (crore > 0) {
    result += (HINDI_MAP[crore] || numberToWordsHindi(crore)) + ' करोड़ ';
  }
  if (lakh > 0) {
    result += (HINDI_MAP[lakh] || numberToWordsHindi(lakh)) + ' लाख ';
  }
  if (thousand > 0) {
    result += (HINDI_MAP[thousand] || numberToWordsHindi(thousand)) + ' हज़ार ';
  }
  if (hundred > 0) {
    result += (HINDI_MAP[hundred] || numberToWordsHindi(hundred)) + ' सौ ';
  }
  if (remainder > 0) {
    result += HINDI_MAP[remainder] + ' ';
  }

  return result.trim();
}

// Marathi words dictionary & converter
const MARATHI_MAP: Record<number, string> = {
  0: 'शून्य', 1: 'एक', 2: 'दोन', 3: 'तीन', 4: 'चार', 5: 'पाच', 6: 'सहा', 7: 'सात', 8: 'आठ', 9: 'नऊ', 10: 'दहा',
  11: 'अकरा', 12: 'बारा', 13: 'तेरा', 14: 'चौदा', 15: 'पंधरा', 16: 'सोळा', 17: 'सतरा', 18: 'अठरा', 19: 'एकोणीस', 20: 'वीस',
  21: 'एकवीस', 22: 'बावीस', 23: 'तेवीस', 24: 'चोवीस', 25: 'पंचवीस', 26: 'सव्वीस', 27: 'सत्तावीस', 28: 'अठ्ठावीस', 29: 'एकोणतीस', 30: 'तीस',
  31: 'एकतीस', 32: 'बत्तीस', 33: 'तेहेतीस', 34: 'चौतीस', 35: 'पस्तीस', 36: 'छत्तीस', 37: 'सदतीस', 38: 'अडतीस', 39: 'एकेचाळीस', 40: 'चाळीस',
  41: 'एक्केचाळीस', 42: 'बेचाळीस', 43: 'त्रेचाळीस', 44: 'चव्वेचाळीस', 45: 'पंचेचाळीस', 46: 'शेहेचाळीस', 47: 'सत्तेचाळीस', 48: 'अठ्ठेचाळीस', 49: 'एकोणपन्नास', 50: 'पन्नास',
  51: 'एक्कावन्न', 52: 'बावन्न', 53: 'त्रेपन्न', 54: 'चौपन्न', 55: 'पंचावन्न', 56: 'छप्पन्न', 57: 'सत्तावन्न', 58: 'अठ्ठावन्न', 59: 'एकोणसाठ', 60: 'साठ',
  61: 'एकसष्ठ', 62: 'बासष्ठ', 63: 'त्रेसष्ठ', 64: 'चौसष्ठ', 65: 'पासष्ठ', 66: 'सहासष्ठ', 67: 'सदुसष्ठ', 68: 'अडुसष्ठ', 69: 'एकोणसत्तर', 70: 'सत्तर',
  71: 'एकाहत्तर', 72: 'बाहत्तर', 73: 'त्र्याहत्तर', 74: 'चौऱ्याहत्तर', 75: 'पंच्याहत्तर', 76: 'शहात्तर', 77: 'सत्त्याहत्तर', 78: 'अठ्ठ्याहत्तर', 79: 'एकोणऐंशी', 80: 'ऐंशी',
  81: 'एक्क्यांशी', 82: 'ब्यांशी', 83: 'त्र्यांशी', 84: 'चौऱ्यांशी', 85: 'पंच्यांशी', 86: 'शहांशी', 87: 'सत्त्यांशी', 88: 'अठ्ठ्यांशी', 89: 'एकोणनव्वद', 90: 'नव्वद',
  91: 'एक्याण्णव', 92: 'ब्याण्णव', 93: 'त्र्याण्णव', 94: 'चौऱ्याण्णव', 95: 'पंच्याण्णव', 96: 'शहाण्णव', 97: 'सत्त्याण्णव', 98: 'अठ्ठ्याण्णव', 99: 'नव्व्याण्णव'
};

export function numberToWordsMarathi(num: number): string {
  if (num === 0) return 'शून्य';
  if (num < 0) return 'वजा ' + numberToWordsMarathi(-num);

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (crore > 0) {
    result += (MARATHI_MAP[crore] || numberToWordsMarathi(crore)) + ' कोटी ';
  }
  if (lakh > 0) {
    result += (MARATHI_MAP[lakh] || numberToWordsMarathi(lakh)) + ' लाख ';
  }
  if (thousand > 0) {
    result += (MARATHI_MAP[thousand] || numberToWordsMarathi(thousand)) + ' हजार ';
  }
  if (hundred > 0) {
    result += (MARATHI_MAP[hundred] || numberToWordsMarathi(hundred)) + ' शे ';
  }
  if (remainder > 0) {
    result += MARATHI_MAP[remainder] + ' ';
  }

  return result.trim();
}

// Urdu words dictionary & converter
const URDU_MAP: Record<number, string> = {
  0: 'صفر', 1: 'ایک', 2: 'دو', 3: 'تین', 4: 'چار', 5: 'پانچ', 6: 'چھ', 7: 'سات', 8: 'آٹھ', 9: 'نو', 10: 'دس',
  11: 'گیارہ', 12: 'بارہ', 13: 'تیرہ', 14: 'چودہ', 15: 'پندرہ', 16: 'सोलह', 17: 'سترہ', 18: 'اٹھارہ', 19: 'انیس', 20: 'بیس',
  21: 'اکیس', 22: 'بائیس', 23: 'تیئیس', 24: 'چوبیس', 25: 'پچیس', 26: 'چھبیس', 27: 'ستائیس', 28: 'اٹَھائیس', 29: 'انتیس', 30: 'تیس',
  31: 'اکتیس', 32: 'بتیس', 33: 'تینتیس', 34: 'چونتیس', 35: 'پینتیس', 36: 'چھتیس', 37: 'سینتیس', 38: 'اڑتیس', 39: 'انتالیس', 40: 'چالیس',
  41: 'اکتالیس', 42: 'بیالیس', 43: 'تینتالیس', 44: 'چوالیس', 45: 'پینتالیس', 46: 'چھیا لیس', 47: 'سینتالیس', 48: 'اڑتالیس', 49: 'انچاس', 50: 'پچاس',
  51: 'اکیاون', 52: 'باون', 53: 'ترپن', 54: 'چوون', 55: 'پچپن', 56: 'چھپن', 57: 'ستاون', 58: 'اٹھاون', 59: 'انسٹھ', 60: 'ساٹھ',
  61: 'اکسٹھ', 62: 'باسٹھ', 63: 'تریسٹھ', 64: 'چونسٹھ', 65: 'پینسٹھ', 66: 'چھیاسٹھ', 67: 'سڑسٹھ', 68: 'اڑسٹھ', 69: 'انہتر', 70: 'ستر',
  71: 'اکہتر', 72: 'بہتر', 73: 'تہتر', 74: 'چوہتر', 75: 'پچہتر', 76: 'چھہتر', 77: 'ستتر', 78: 'اٹھہتر', 79: 'انیاسی', 80: 'اسی',
  81: 'اکیاسی', 82: 'بیاسی', 83: 'تراسی', 84: 'چوراسی', 85: 'پچاسی', 86: 'چھیاسی', 87: 'ستاسی', 88: 'اٹھاسی', 89: 'نواسی', 90: 'نوے',
  91: 'اکیانوے', 92: 'بانوے', 93: 'ترانوے', 94: 'چورانوے', 95: 'پچانوے', 96: 'چھیانوے', 97: 'ستانوے', 98: 'اٹھانوے', 99: 'ننانوے'
};

export function numberToWordsUrdu(num: number): string {
  if (num === 0) return 'صفر';
  if (num < 0) return 'منفی ' + numberToWordsUrdu(-num);

  let result = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remainder = num % 100;

  if (crore > 0) {
    result += (URDU_MAP[crore] || numberToWordsUrdu(crore)) + ' کروڑ ';
  }
  if (lakh > 0) {
    result += (URDU_MAP[lakh] || numberToWordsUrdu(lakh)) + ' لاکھ ';
  }
  if (thousand > 0) {
    result += (URDU_MAP[thousand] || numberToWordsUrdu(thousand)) + ' ہزار ';
  }
  if (hundred > 0) {
    result += (URDU_MAP[hundred] || numberToWordsUrdu(hundred)) + ' سو ';
  }
  if (remainder > 0) {
    result += URDU_MAP[remainder] + ' ';
  }

  return result.trim();
}

// Master dynamic number to words dispatcher
export function convertNumberToWords(num: number, lang: Language): string {
  switch (lang) {
    case 'hi':
      return numberToWordsHindi(num);
    case 'mr':
      return numberToWordsMarathi(num);
    case 'ur':
      return numberToWordsUrdu(num);
    case 'en':
    default:
      return numberToWordsEnglish(num);
  }
}

// Deconstruct any number into Place Value digits array
export interface DigitPlaceValueInfo {
  digit: number;
  placeName: string;
  shortName: string;
  multiplier: number;
  placeValue: number;
  expandedForm: string;
  placeIndex: number;
}

export function getNumberPlaceValueBreakdown(num: number, lang: Language): DigitPlaceValueInfo[] {
  const str = String(Math.abs(Math.floor(num)));
  const len = str.length;
  const result: DigitPlaceValueInfo[] = [];

  for (let i = 0; i < len; i++) {
    const digit = parseInt(str[i], 10);
    const placeIndex = len - 1 - i;
    const placeInfo = INDIAN_PLACE_VALUES[placeIndex] || {
      placeName: { en: `10^${placeIndex}`, hi: `10^${placeIndex}`, mr: `10^${placeIndex}`, ur: `10^${placeIndex}` },
      shortName: { en: `${placeIndex}`, hi: `${placeIndex}`, mr: `${placeIndex}`, ur: `${placeIndex}` },
      multiplier: Math.pow(10, placeIndex),
      digitIndex: placeIndex
    };

    const placeValue = digit * placeInfo.multiplier;
    const placeName = placeInfo.placeName[lang] || placeInfo.placeName.en;
    const shortName = placeInfo.shortName[lang] || placeInfo.shortName.en;

    result.push({
      digit,
      placeName,
      shortName,
      multiplier: placeInfo.multiplier,
      placeValue,
      expandedForm: `${digit} × ${formatIndianNumber(placeInfo.multiplier)} = ${formatIndianNumber(placeValue)}`,
      placeIndex
    });
  }

  return result;
}
