export interface ProgramDetails {
  id?: string;
  csvIndex?: number;
  name?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  category?: string;
  website?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: any;
}
