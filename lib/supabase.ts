import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Inquiry = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  product: string;
  quantity: string;
  unit: string;
  spec: string;
  port: string;
  incoterm: string;
  message: string;
  status?: string;
  created_at?: string;
};

export type Feedback = {
  id?: string;
  name: string;
  company: string;
  country: string;
  rating: number;
  message: string;
  approved?: boolean;
  created_at?: string;
};

export type Testimonial = {
  id?: string;
  name: string;
  company: string;
  country: string;
  role: string;
  rating: number;
  message: string;
  active?: boolean;
  created_at?: string;
};
