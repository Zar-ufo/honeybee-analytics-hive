
-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_profiles - users can only see and edit their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Update the employees table to reference user_profiles instead of having its own auth
ALTER TABLE public.employees DROP COLUMN IF EXISTS password;
ALTER TABLE public.employees ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on employees table
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for employees - they can see employees in their company
CREATE POLICY "Employees can view company employees" 
  ON public.employees 
  FOR SELECT 
  USING (
    company_id IN (
      SELECT company_id 
      FROM public.employees 
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for companies - employees can see their company
CREATE POLICY "Employees can view their company" 
  ON public.companies 
  FOR SELECT 
  USING (
    id IN (
      SELECT company_id 
      FROM public.employees 
      WHERE user_id = auth.uid()
    )
  );

-- Update products RLS policy
DROP POLICY IF EXISTS "Allow all operations on products" ON public.products;

CREATE POLICY "Employees can manage company products" 
  ON public.products 
  FOR ALL 
  USING (
    company_id IN (
      SELECT company_id 
      FROM public.employees 
      WHERE user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
