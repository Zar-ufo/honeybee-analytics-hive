
-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  password TEXT NOT NULL, -- In production, this should be hashed
  role TEXT DEFAULT 'employee',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table (if it doesn't exist) or add company_id column
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'low-stock')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, sku) -- SKU should be unique within a company
);

-- Add RLS policies for companies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on companies" 
  ON public.companies 
  FOR ALL 
  USING (true);

-- Add RLS policies for employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on employees" 
  ON public.employees 
  FOR ALL 
  USING (true);

-- Add RLS policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on products" 
  ON public.products 
  FOR ALL 
  USING (true);

-- Add trigger for updated_at on companies
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add trigger for updated_at on employees
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Add trigger for updated_at on products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert sample data
INSERT INTO public.companies (name, email, phone, address) VALUES
('HoneyBee Farms', 'contact@honeybeefarms.com', '+1-555-0101', '123 Farm Road, Rural County, State'),
('Sweet Harvest Co.', 'info@sweetharvest.com', '+1-555-0102', '456 Honey Lane, Bee City, State');

INSERT INTO public.employees (company_id, name, email, password, role) VALUES
((SELECT id FROM public.companies WHERE name = 'HoneyBee Farms'), 'John Smith', 'john@honeybeefarms.com', 'password123', 'manager'),
((SELECT id FROM public.companies WHERE name = 'HoneyBee Farms'), 'Sarah Johnson', 'sarah@honeybeefarms.com', 'employee456', 'employee'),
((SELECT id FROM public.companies WHERE name = 'Sweet Harvest Co.'), 'Mike Wilson', 'mike@sweetharvest.com', 'harvest789', 'manager');

-- Insert sample products for each company
INSERT INTO public.products (company_id, name, sku, category, price, stock, status, description) VALUES
((SELECT id FROM public.companies WHERE name = 'HoneyBee Farms'), 'Premium Honey Jar', 'HON-001', 'Honey Products', 24.99, 150, 'active', 'Pure organic honey in premium glass jar'),
((SELECT id FROM public.companies WHERE name = 'HoneyBee Farms'), 'Beeswax Candles Set', 'BWX-002', 'Candles', 18.50, 5, 'low-stock', 'Handcrafted beeswax candles, set of 3'),
((SELECT id FROM public.companies WHERE name = 'Sweet Harvest Co.'), 'Raw Wildflower Honey', 'WFL-001', 'Honey Products', 29.99, 75, 'active', 'Unprocessed wildflower honey'),
((SELECT id FROM public.companies WHERE name = 'Sweet Harvest Co.'), 'Honey Comb Pieces', 'HCM-002', 'Raw Products', 35.00, 25, 'active', 'Fresh honeycomb pieces');
