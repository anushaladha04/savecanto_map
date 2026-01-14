// owner: anusha
// convert CSV data to Program format for pins
// map Audience field to pin types

import type { Program } from '../components/pins/PinsLayer';

interface CsvRow {
  Name: string;
  Audience: string;
  Latitude: string | number;
  Longitude: string | number;
  [key: string]: any;
}

// Normalize category labels to consistent English format
// Handles Chinese and other language variations
export function normalizeCategoryLabel(category?: string): string {
  if (!category) return '';
  
  const trimmed = category.trim();
  const normalized = trimmed.toLowerCase();
  
  // Handle K-12 After School (including Chinese variant)
  // K-12 After School ｜K-12 課後課程（如補習班、培訓班、語文課等等）
  // Handle K-12 Public School (including Chinese variant)
  // K-12 Public School ｜K-12 公立學校之課程
  if (normalized.includes('k-12') || normalized.includes('k12') || 
      trimmed.includes('K-12') || trimmed.includes('課後課程') || trimmed.includes('公立學校')) {
    return 'Children & Teens';
  }
  
  // Handle Chinese characters for college/university
  // 大学 = university, 學院 = college/academy
  // Check for Chinese characters in the original string (before lowercasing)
  const hasChinese = /[\u4e00-\u9fff]/.test(trimmed);
  if (hasChinese && (trimmed.includes('大学') || trimmed.includes('學院') || trimmed.includes('大学') || trimmed.includes('學院'))) {
    return 'College / University';
  }
  
  // Handle College/University (various English formats)
  if (normalized.includes('college') && (normalized.includes('university') || normalized.includes('univ'))) {
    return 'College / University';
  }
  if (normalized === 'college / university' || normalized === 'college/university' || 
      normalized === 'college & university' || normalized === 'college&university') {
    return 'College / University';
  }
  
  // Handle Adults
  if (normalized.includes('adult') || normalized === 'adults') {
    return 'Adults';
  }
  
  // Handle Children & Teens
  if (normalized.includes('child') || normalized.includes('teen')) {
    return 'Children & Teens';
  }
  if (normalized === 'children & teens' || normalized === 'children and teens' ||
      normalized === 'children/teens' || normalized === 'children&teens') {
    return 'Children & Teens';
  }
  
  // Handle Other
  if (normalized.includes('other') || normalized === 'other') {
    return 'Other';
  }
  
  // Return original if no match found (preserve original formatting)
  return trimmed;
}

function mapAudienceToPinType(audience: string): 'adults' | 'kids' | 'college' | 'other' {
  const normalized = audience?.trim().toLowerCase() || '';
  const original = audience?.trim() || '';
  
  // Handle K-12 After School and K-12 Public School (including Chinese variants)
  if (normalized.includes('k-12') || normalized.includes('k12') || 
      original.includes('K-12') || original.includes('課後課程') || original.includes('公立學校')) {
    return 'kids';
  }
  
  // Handle Adults
  if (normalized === 'adults') {
    return 'adults';
  } 
  // Handle Children & Teens (various formats)
  else if (normalized === 'children & teens' || normalized === 'children and teens' || 
           normalized === 'children/teens' || normalized === 'children/teens' ||
           normalized.includes('child') || normalized.includes('teen')) {
    return 'kids';
  } 
  // Handle College/University (various formats with/without spaces, slashes, ampersands)
  else if (normalized.includes('college') && (normalized.includes('university') || normalized.includes('univ'))) {
    return 'college';
  } 
  else {
    return 'other';
  }
}

// convert CSV row to Program format
export function convertCsvRowToProgram(row: CsvRow, index: number): Program | null {
  // Skip rows without valid coordinates
  const lat = typeof row.Latitude === 'string' ? parseFloat(row.Latitude) : row.Latitude;
  const lng = typeof row.Longitude === 'string' ? parseFloat(row.Longitude) : row.Longitude;
  
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }
  
  // Use row number (index) as the unique ID
  // Note: index is 0-based, so row 1 in the CSV = index 0
  return {
    id: `csv-${index}`, // Unique ID based on row number
    csvIndex: index, // Store the CSV row number (0-based index)
    name: row.Name || 'Unnamed Program',
    type: mapAudienceToPinType(row.Audience),
    latitude: lat,
    longitude: lng,
  };
}

// convert array of csv rows to program array
export function convertCsvToPrograms(csvData: CsvRow[]): Program[] {
  return csvData
    .map((row, index) => convertCsvRowToProgram(row, index))
    .filter((program): program is Program => program !== null);
}

