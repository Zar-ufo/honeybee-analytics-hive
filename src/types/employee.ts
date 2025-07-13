export interface Employee {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  is_active: boolean | null;
  company_id: string;
  password?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  companies?: {
    name: string;
  };
}

export interface NewEmployee {
  name: string;
  email: string;
  password: string;
  role: string;
}