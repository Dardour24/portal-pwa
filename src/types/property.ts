
export interface Property {
  id?: string;
  client_id: string;
  name: string;
  beds24_property_id?: number | null;
  address?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
