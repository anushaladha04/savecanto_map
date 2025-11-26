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

function mapAudienceToPinType(audience: string): 'adults' | 'kids' | 'college' | 'other' {
  const normalized = audience?.trim() || '';
  
  if (normalized === 'Adults') {
    return 'adults';
  } else if (normalized === 'Children & Teens') {
    return 'kids';
  } else if (normalized === 'College / University') {
    return 'college';
  } else {
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

