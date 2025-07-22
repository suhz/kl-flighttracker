import { CountryInfo } from '@/types/aircraft'

// ICAO hex code ranges for country detection
interface HexRange {
  start: string;
  end: string;
  country: string;
  code: string;
  flag: string;
}

export const ICAO_HEX_RANGES: HexRange[] = [
  { start: "004000", end: "0043FF", country: "Zimbabwe", code: "ZW", flag: "🇿🇼" },
  { start: "006000", end: "006FFF", country: "Mozambique", code: "MZ", flag: "🇲🇿" },
  { start: "008000", end: "00FFFF", country: "South Africa", code: "ZA", flag: "🇿🇦" },
  { start: "010000", end: "017FFF", country: "Egypt", code: "EG", flag: "🇪🇬" },
  { start: "018000", end: "01FFFF", country: "Libya", code: "LY", flag: "🇱🇾" },
  { start: "020000", end: "027FFF", country: "Morocco", code: "MA", flag: "🇲🇦" },
  { start: "028000", end: "02FFFF", country: "Tunisia", code: "TN", flag: "🇹🇳" },
  { start: "030000", end: "0303FF", country: "Botswana", code: "BW", flag: "🇧🇼" },
  { start: "032000", end: "032FFF", country: "Burundi", code: "BI", flag: "🇧🇮" },
  { start: "034000", end: "034FFF", country: "Cameroon", code: "CM", flag: "🇨🇲" },
  { start: "035000", end: "0353FF", country: "Comoros", code: "KM", flag: "🇰🇲" },
  { start: "036000", end: "036FFF", country: "Congo", code: "CG", flag: "🇨🇬" },
  { start: "038000", end: "038FFF", country: "Cote d'Ivoire", code: "CI", flag: "🇨🇮" },
  { start: "03E000", end: "03EFFF", country: "Gabon", code: "GA", flag: "🇬🇦" },
  { start: "040000", end: "040FFF", country: "Ethiopia", code: "ET", flag: "🇪🇹" },
  { start: "042000", end: "042FFF", country: "Equatorial Guinea", code: "GQ", flag: "🇬🇶" },
  { start: "044000", end: "044FFF", country: "Ghana", code: "GH", flag: "🇬🇭" },
  { start: "046000", end: "046FFF", country: "Guinea", code: "GN", flag: "🇬🇳" },
  { start: "048000", end: "0483FF", country: "Guinea-Bissau", code: "GW", flag: "🇬🇼" },
  { start: "04A000", end: "04A3FF", country: "Lesotho", code: "LS", flag: "🇱🇸" },
  { start: "04C000", end: "04CFFF", country: "Kenya", code: "KE", flag: "🇰🇪" },
  { start: "050000", end: "050FFF", country: "Liberia", code: "LR", flag: "🇱🇷" },
  { start: "054000", end: "054FFF", country: "Madagascar", code: "MG", flag: "🇲🇬" },
  { start: "058000", end: "058FFF", country: "Malawi", code: "MW", flag: "🇲🇼" },
  { start: "05A000", end: "05A3FF", country: "Maldives", code: "MV", flag: "🇲🇻" },
  { start: "05C000", end: "05CFFF", country: "Mali", code: "ML", flag: "🇲🇱" },
  { start: "05E000", end: "05E3FF", country: "Mauritania", code: "MR", flag: "🇲🇷" },
  { start: "060000", end: "0603FF", country: "Mauritius", code: "MU", flag: "🇲🇺" },
  { start: "062000", end: "062FFF", country: "Niger", code: "NE", flag: "🇳🇪" },
  { start: "064000", end: "064FFF", country: "Nigeria", code: "NG", flag: "🇳🇬" },
  { start: "068000", end: "068FFF", country: "Uganda", code: "UG", flag: "🇺🇬" },
  { start: "06A000", end: "06A3FF", country: "Qatar", code: "QA", flag: "🇶🇦" },
  { start: "06C000", end: "06CFFF", country: "Central African Republic", code: "CF", flag: "🇨🇫" },
  { start: "06E000", end: "06EFFF", country: "Rwanda", code: "RW", flag: "🇷🇼" },
  { start: "070000", end: "070FFF", country: "Senegal", code: "SN", flag: "🇸🇳" },
  { start: "074000", end: "0743FF", country: "Seychelles", code: "SC", flag: "🇸🇨" },
  { start: "076000", end: "0763FF", country: "Sierra Leone", code: "SL", flag: "🇸🇱" },
  { start: "078000", end: "078FFF", country: "Somalia", code: "SO", flag: "🇸🇴" },
  { start: "07A000", end: "07A3FF", country: "Eswatini", code: "SZ", flag: "🇸🇿" },
  { start: "07C000", end: "07CFFF", country: "Sudan", code: "SD", flag: "🇸🇩" },
  { start: "080000", end: "080FFF", country: "Tanzania", code: "TZ", flag: "🇹🇿" },
  { start: "084000", end: "084FFF", country: "Chad", code: "TD", flag: "🇹🇩" },
  { start: "088000", end: "088FFF", country: "Togo", code: "TG", flag: "🇹🇬" },
  { start: "08A000", end: "08AFFF", country: "Zambia", code: "ZM", flag: "🇿🇲" },
  { start: "08C000", end: "08CFFF", country: "Democratic Republic of the Congo", code: "CD", flag: "🇨🇩" },
  { start: "090000", end: "090FFF", country: "Angola", code: "AO", flag: "🇦🇴" },
  { start: "094000", end: "0943FF", country: "Benin", code: "BJ", flag: "🇧🇯" },
  { start: "096000", end: "0963FF", country: "Cape Verde", code: "CV", flag: "🇨🇻" },
  { start: "098000", end: "0983FF", country: "Djibouti", code: "DJ", flag: "🇩🇯" },
  { start: "09A000", end: "09AFFF", country: "Gambia", code: "GM", flag: "🇬🇲" },
  { start: "09C000", end: "09CFFF", country: "Burkina Faso", code: "BF", flag: "🇧🇫" },
  { start: "09E000", end: "09E3FF", country: "Sao Tome and Principe", code: "ST", flag: "🇸🇹" },
  { start: "0A0000", end: "0A7FFF", country: "Algeria", code: "DZ", flag: "🇩🇿" },
  { start: "0A8000", end: "0A8FFF", country: "Bahamas", code: "BS", flag: "🇧🇸" },
  { start: "0AA000", end: "0AA3FF", country: "Barbados", code: "BB", flag: "🇧🇧" },
  { start: "0AB000", end: "0AB3FF", country: "Belize", code: "BZ", flag: "🇧🇿" },
  { start: "0AC000", end: "0ACFFF", country: "Colombia", code: "CO", flag: "🇨🇴" },
  { start: "0AE000", end: "0AEFFF", country: "Costa Rica", code: "CR", flag: "🇨🇷" },
  { start: "0B0000", end: "0B0FFF", country: "Cuba", code: "CU", flag: "🇨🇺" },
  { start: "0B2000", end: "0B2FFF", country: "El Salvador", code: "SV", flag: "🇸🇻" },
  { start: "0B4000", end: "0B4FFF", country: "Guatemala", code: "GT", flag: "🇬🇹" },
  { start: "0B6000", end: "0B6FFF", country: "Guyana", code: "GY", flag: "🇬🇾" },
  { start: "0B8000", end: "0B8FFF", country: "Haiti", code: "HT", flag: "🇭🇹" },
  { start: "0BA000", end: "0BAFFF", country: "Honduras", code: "HN", flag: "🇭🇳" },
  { start: "0BC000", end: "0BC3FF", country: "Saint Vincent and the Grenadines", code: "VC", flag: "🇻🇨" },
  { start: "0BE000", end: "0BEFFF", country: "Jamaica", code: "JM", flag: "🇯🇲" },
  { start: "0C0000", end: "0C0FFF", country: "Nicaragua", code: "NI", flag: "🇳🇮" },
  { start: "0C2000", end: "0C2FFF", country: "Panama", code: "PA", flag: "🇵🇦" },
  { start: "0C4000", end: "0C4FFF", country: "Dominican Republic", code: "DO", flag: "🇩🇴" },
  { start: "0C6000", end: "0C6FFF", country: "Trinidad and Tobago", code: "TT", flag: "🇹🇹" },
  { start: "0C8000", end: "0C8FFF", country: "Suriname", code: "SR", flag: "🇸🇷" },
  { start: "0CA000", end: "0CA3FF", country: "Antigua and Barbuda", code: "AG", flag: "🇦🇬" },
  { start: "0CC000", end: "0CC3FF", country: "Grenada", code: "GD", flag: "🇬🇩" },
  { start: "0D0000", end: "0D7FFF", country: "Mexico", code: "MX", flag: "🇲🇽" },
  { start: "0D8000", end: "0DFFFF", country: "Venezuela", code: "VE", flag: "🇻🇪" },
  { start: "100000", end: "1FFFFF", country: "Russian Federation", code: "RU", flag: "🇷🇺" },
  { start: "201000", end: "2013FF", country: "Namibia", code: "NA", flag: "🇳🇦" },
  { start: "202000", end: "2023FF", country: "Eritrea", code: "ER", flag: "🇪🇷" },
  { start: "300000", end: "33FFFF", country: "Italy", code: "IT", flag: "🇮🇹" },
  { start: "340000", end: "37FFFF", country: "Spain", code: "ES", flag: "🇪🇸" },
  { start: "380000", end: "3BFFFF", country: "France", code: "FR", flag: "🇫🇷" },
  { start: "3C0000", end: "3FFFFF", country: "Germany", code: "DE", flag: "🇩🇪" },
  { start: "400000", end: "43FFFF", country: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { start: "440000", end: "447FFF", country: "Austria", code: "AT", flag: "🇦🇹" },
  { start: "448000", end: "44FFFF", country: "Belgium", code: "BE", flag: "🇧🇪" },
  { start: "450000", end: "457FFF", country: "Bulgaria", code: "BG", flag: "🇧🇬" },
  { start: "458000", end: "45FFFF", country: "Denmark", code: "DK", flag: "🇩🇰" },
  { start: "460000", end: "467FFF", country: "Finland", code: "FI", flag: "🇫🇮" },
  { start: "468000", end: "46FFFF", country: "Greece", code: "GR", flag: "🇬🇷" },
  { start: "470000", end: "477FFF", country: "Hungary", code: "HU", flag: "🇭🇺" },
  { start: "478000", end: "47FFFF", country: "Norway", code: "NO", flag: "🇳🇴" },
  { start: "480000", end: "487FFF", country: "Netherlands", code: "NL", flag: "🇳🇱" },
  { start: "488000", end: "48FFFF", country: "Poland", code: "PL", flag: "🇵🇱" },
  { start: "490000", end: "497FFF", country: "Portugal", code: "PT", flag: "🇵🇹" },
  { start: "498000", end: "49FFFF", country: "Czech Republic", code: "CZ", flag: "🇨🇿" },
  { start: "4A0000", end: "4A7FFF", country: "Romania", code: "RO", flag: "🇷🇴" },
  { start: "4A8000", end: "4AFFFF", country: "Sweden", code: "SE", flag: "🇸🇪" },
  { start: "4B0000", end: "4B7FFF", country: "Switzerland", code: "CH", flag: "🇨🇭" },
  { start: "4B8000", end: "4BFFFF", country: "Turkey", code: "TR", flag: "🇹🇷" },
  { start: "4C0000", end: "4C7FFF", country: "Serbia", code: "RS", flag: "🇷🇸" },
  { start: "4C8000", end: "4C83FF", country: "Cyprus", code: "CY", flag: "🇨🇾" },
  { start: "4CA000", end: "4CAFFF", country: "Ireland", code: "IE", flag: "🇮🇪" },
  { start: "4CC000", end: "4CCFFF", country: "Iceland", code: "IS", flag: "🇮🇸" },
  { start: "4D0000", end: "4D03FF", country: "Luxembourg", code: "LU", flag: "🇱🇺" },
  { start: "4D2000", end: "4D23FF", country: "Malta", code: "MT", flag: "🇲🇹" },
  { start: "4D4000", end: "4D43FF", country: "Monaco", code: "MC", flag: "🇲🇨" },
  { start: "500000", end: "5003FF", country: "San Marino", code: "SM", flag: "🇸🇲" },
  { start: "501000", end: "5013FF", country: "Albania", code: "AL", flag: "🇦🇱" },
  { start: "501C00", end: "501FFF", country: "Croatia", code: "HR", flag: "🇭🇷" },
  { start: "502C00", end: "502FFF", country: "Latvia", code: "LV", flag: "🇱🇻" },
  { start: "503C00", end: "503FFF", country: "Lithuania", code: "LT", flag: "🇱🇹" },
  { start: "504C00", end: "504FFF", country: "Moldova", code: "MD", flag: "🇲🇩" },
  { start: "505C00", end: "505FFF", country: "Slovakia", code: "SK", flag: "🇸🇰" },
  { start: "506C00", end: "506FFF", country: "Slovenia", code: "SI", flag: "🇸🇮" },
  { start: "507C00", end: "507FFF", country: "Uzbekistan", code: "UZ", flag: "🇺🇿" },
  { start: "508000", end: "50FFFF", country: "Ukraine", code: "UA", flag: "🇺🇦" },
  { start: "510000", end: "5103FF", country: "Belarus", code: "BY", flag: "🇧🇾" },
  { start: "511000", end: "5113FF", country: "Estonia", code: "EE", flag: "🇪🇪" },
  { start: "512000", end: "5123FF", country: "North Macedonia", code: "MK", flag: "🇲🇰" },
  { start: "513000", end: "5133FF", country: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦" },
  { start: "514000", end: "5143FF", country: "Georgia", code: "GE", flag: "🇬🇪" },
  { start: "515000", end: "5153FF", country: "Tajikistan", code: "TJ", flag: "🇹🇯" },
  { start: "516000", end: "5163FF", country: "Montenegro", code: "ME", flag: "🇲🇪" },
  { start: "600000", end: "6003FF", country: "Armenia", code: "AM", flag: "🇦🇲" },
  { start: "600800", end: "600BFF", country: "Azerbaijan", code: "AZ", flag: "🇦🇿" },
  { start: "601000", end: "6013FF", country: "Kyrgyzstan", code: "KG", flag: "🇰🇬" },
  { start: "601800", end: "601BFF", country: "Turkmenistan", code: "TM", flag: "🇹🇲" },
  { start: "680000", end: "6803FF", country: "Bhutan", code: "BT", flag: "🇧🇹" },
  { start: "681000", end: "6813FF", country: "Micronesia", code: "FM", flag: "🇫🇲" },
  { start: "682000", end: "6823FF", country: "Mongolia", code: "MN", flag: "🇲🇳" },
  { start: "683000", end: "6833FF", country: "Kazakhstan", code: "KZ", flag: "🇰🇿" },
  { start: "684000", end: "6843FF", country: "Palau", code: "PW", flag: "🇵🇼" },
  { start: "700000", end: "700FFF", country: "Afghanistan", code: "AF", flag: "🇦🇫" },
  { start: "702000", end: "702FFF", country: "Bangladesh", code: "BD", flag: "🇧🇩" },
  { start: "704000", end: "704FFF", country: "Myanmar", code: "MM", flag: "🇲🇲" },
  { start: "706000", end: "706FFF", country: "Kuwait", code: "KW", flag: "🇰🇼" },
  { start: "708000", end: "708FFF", country: "Laos", code: "LA", flag: "🇱🇦" },
  { start: "70A000", end: "70AFFF", country: "Nepal", code: "NP", flag: "🇳🇵" },
  { start: "70C000", end: "70C3FF", country: "Oman", code: "OM", flag: "🇴🇲" },
  { start: "70E000", end: "70EFFF", country: "Cambodia", code: "KH", flag: "🇰🇭" },
  { start: "710000", end: "717FFF", country: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
  { start: "718000", end: "71FFFF", country: "South Korea", code: "KR", flag: "🇰🇷" },
  { start: "720000", end: "727FFF", country: "North Korea", code: "KP", flag: "🇰🇵" },
  { start: "728000", end: "72FFFF", country: "Iraq", code: "IQ", flag: "🇮🇶" },
  { start: "730000", end: "737FFF", country: "Iran", code: "IR", flag: "🇮🇷" },
  { start: "738000", end: "73FFFF", country: "Israel", code: "IL", flag: "🇮🇱" },
  { start: "740000", end: "747FFF", country: "Jordan", code: "JO", flag: "🇯🇴" },
  { start: "748000", end: "74FFFF", country: "Lebanon", code: "LB", flag: "🇱🇧" },
  { start: "750000", end: "757FFF", country: "Malaysia", code: "MY", flag: "🇲🇾" },
  { start: "758000", end: "75FFFF", country: "Philippines", code: "PH", flag: "🇵🇭" },
  { start: "760000", end: "767FFF", country: "Pakistan", code: "PK", flag: "🇵🇰" },
  { start: "768000", end: "76FFFF", country: "Singapore", code: "SG", flag: "🇸🇬" },
  { start: "770000", end: "777FFF", country: "Sri Lanka", code: "LK", flag: "🇱🇰" },
  { start: "778000", end: "77FFFF", country: "Syria", code: "SY", flag: "🇸🇾" },
  { start: "780000", end: "7BFFFF", country: "China", code: "CN", flag: "🇨🇳" },
  { start: "7C0000", end: "7FFFFF", country: "Australia", code: "AU", flag: "🇦🇺" },
  { start: "800000", end: "83FFFF", country: "India", code: "IN", flag: "🇮🇳" },
  { start: "840000", end: "87FFFF", country: "Japan", code: "JP", flag: "🇯🇵" },
  { start: "880000", end: "887FFF", country: "Thailand", code: "TH", flag: "🇹🇭" },
  { start: "888000", end: "88FFFF", country: "Vietnam", code: "VN", flag: "🇻🇳" },
  { start: "890000", end: "890FFF", country: "Yemen", code: "YE", flag: "🇾🇪" },
  { start: "894000", end: "894FFF", country: "Bahrain", code: "BH", flag: "🇧🇭" },
  { start: "895000", end: "8953FF", country: "Brunei", code: "BN", flag: "🇧🇳" },
  { start: "896000", end: "896FFF", country: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { start: "897000", end: "8973FF", country: "Solomon Islands", code: "SB", flag: "🇸🇧" },
  { start: "898000", end: "898FFF", country: "Papua New Guinea", code: "PG", flag: "🇵🇬" },
  { start: "899000", end: "8993FF", country: "Taiwan", code: "TW", flag: "🇹🇼" },
  { start: "8A0000", end: "8A7FFF", country: "Indonesia", code: "ID", flag: "🇮🇩" },
  { start: "900000", end: "9003FF", country: "Marshall Islands", code: "MH", flag: "🇲🇭" },
  { start: "901000", end: "9013FF", country: "Cook Islands", code: "CK", flag: "🇨🇰" },
  { start: "902000", end: "9023FF", country: "Samoa", code: "WS", flag: "🇼🇸" },
  { start: "A00000", end: "AFFFFF", country: "United States", code: "US", flag: "🇺🇸" },
  { start: "C00000", end: "C3FFFF", country: "Canada", code: "CA", flag: "🇨🇦" },
  { start: "C80000", end: "C87FFF", country: "New Zealand", code: "NZ", flag: "🇳🇿" },
  { start: "C88000", end: "C88FFF", country: "Fiji", code: "FJ", flag: "🇫🇯" },
  { start: "C8A000", end: "C8A3FF", country: "Nauru", code: "NR", flag: "🇳🇷" },
  { start: "C8C000", end: "C8C3FF", country: "Saint Lucia", code: "LC", flag: "🇱🇨" },
  { start: "C8D000", end: "C8D3FF", country: "Tonga", code: "TO", flag: "🇹🇴" },
  { start: "C8E000", end: "C8E3FF", country: "Kiribati", code: "KI", flag: "🇰🇮" },
  { start: "C90000", end: "C903FF", country: "Vanuatu", code: "VU", flag: "🇻🇺" },
  { start: "E00000", end: "E3FFFF", country: "Argentina", code: "AR", flag: "🇦🇷" },
  { start: "E40000", end: "E7FFFF", country: "Brazil", code: "BR", flag: "🇧🇷" },
  { start: "E80000", end: "E80FFF", country: "Chile", code: "CL", flag: "🇨🇱" },
  { start: "E84000", end: "E84FFF", country: "Ecuador", code: "EC", flag: "🇪🇨" },
  { start: "E88000", end: "E88FFF", country: "Paraguay", code: "PY", flag: "🇵🇾" },
  { start: "E8C000", end: "E8CFFF", country: "Peru", code: "PE", flag: "🇵🇪" },
  { start: "E90000", end: "E90FFF", country: "Uruguay", code: "UY", flag: "🇺🇾" },
  { start: "E94000", end: "E94FFF", country: "Bolivia", code: "BO", flag: "🇧🇴" }
];

export function getCountryFromHex(hex: string): CountryInfo {
  if (!hex) return { country: 'Unknown', code: 'XX', flag: '❓' };
  
  // Convert hex to uppercase and remove any spaces
  const cleanHex = hex.toUpperCase().replace(/\s/g, '');
  
  // Convert hex string to number for comparison
  const hexNum = parseInt(cleanHex, 16);
  
  // Find the matching range
  for (const range of ICAO_HEX_RANGES) {
    const startNum = parseInt(range.start, 16);
    const endNum = parseInt(range.end, 16);
    
    if (hexNum >= startNum && hexNum <= endNum) {
      return {
        country: range.country,
        code: range.code,
        flag: range.flag
      };
    }
  }
  
  return { country: 'Unknown', code: 'XX', flag: '❓' };
}

// Keep the old registration-based function for backward compatibility
export function getCountryFromRegistration(registration: string): CountryInfo {
  if (!registration) return { country: 'Unknown', code: 'XX', flag: '❓' };
  
  // Try longest prefixes first (4 chars, then 3, then 2, then 1)
  for (let i = Math.min(registration.length, 4); i >= 1; i--) {
    const prefix = registration.substring(0, i).toUpperCase();
    if (REGISTRATION_PREFIXES[prefix]) {
      return REGISTRATION_PREFIXES[prefix];
    }
  }
  
  return { country: 'Unknown', code: 'XX', flag: '❓' };
}

export function extractAirlineFromFlight(flight: string): string {
  if (!flight) return 'Unknown';
  const match = flight.trim().match(/^([A-Z]{2,3})/);
  return match ? match[1] : 'Unknown';
}

// Legacy registration prefixes (keeping for backward compatibility)
export const REGISTRATION_PREFIXES: Record<string, CountryInfo> = {
  // Malaysia
  '9M': { country: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  
  // Singapore
  '9V': { country: 'Singapore', code: 'SG', flag: '🇸🇬' },
  
  // India
  'VT': { country: 'India', code: 'IN', flag: '🇮🇳' },
  
  // Thailand
  'HS': { country: 'Thailand', code: 'TH', flag: '🇹🇭' },
  
  // Indonesia
  'PK': { country: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  
  // China
  'B': { country: 'China', code: 'CN', flag: '🇨🇳' },
  
  // USA
  'N': { country: 'United States', code: 'US', flag: '🇺🇸' },
  
  // Switzerland
  'HB': { country: 'Switzerland', code: 'CH', flag: '🇨🇭' },
  
  // United Kingdom
  'G': { country: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  
  // Germany
  'D': { country: 'Germany', code: 'DE', flag: '🇩🇪' },
  
  // France
  'F': { country: 'France', code: 'FR', flag: '🇫🇷' },
  
  // Netherlands
  'PH': { country: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  
  // Turkey
  'TC': { country: 'Turkey', code: 'TR', flag: '🇹🇷' },
  
  // UAE
  'A6': { country: 'UAE', code: 'AE', flag: '🇦🇪' },
  
  // Qatar
  'A7': { country: 'Qatar', code: 'QA', flag: '🇶🇦' },
  
  // Japan
  'JA': { country: 'Japan', code: 'JP', flag: '🇯🇵' },
  
  // South Korea
  'HL': { country: 'South Korea', code: 'KR', flag: '🇰🇷' },
  
  // Australia
  'VH': { country: 'Australia', code: 'AU', flag: '🇦🇺' },
  
  // Philippines
  'RP': { country: 'Philippines', code: 'PH', flag: '🇵🇭' },
  
  // Vietnam
  'VN': { country: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  
  // Bangladesh
  'S2': { country: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
  
  // Myanmar
  'XY': { country: 'Myanmar', code: 'MM', flag: '🇲🇲' },
  
  // Cambodia
  'XU': { country: 'Cambodia', code: 'KH', flag: '🇰🇭' },
  
  // Laos
  'RDPL': { country: 'Laos', code: 'LA', flag: '🇱🇦' },
  
  // Brunei
  'V8': { country: 'Brunei', code: 'BN', flag: '🇧🇳' }
}; 