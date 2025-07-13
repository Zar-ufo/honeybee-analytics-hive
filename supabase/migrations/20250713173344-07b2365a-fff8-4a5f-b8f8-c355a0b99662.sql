-- Create password settings table for company password policies
CREATE TABLE public.password_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  min_length INTEGER NOT NULL DEFAULT 8,
  require_uppercase BOOLEAN NOT NULL DEFAULT true,
  require_lowercase BOOLEAN NOT NULL DEFAULT true,
  require_numbers BOOLEAN NOT NULL DEFAULT true,
  require_special_chars BOOLEAN NOT NULL DEFAULT false,
  password_expiry_days INTEGER,
  max_login_attempts INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

-- Enable RLS
ALTER TABLE public.password_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for password settings
CREATE POLICY "Company admins can manage password settings" 
ON public.password_settings 
FOR ALL 
USING (
  company_id IN (
    SELECT company_id 
    FROM public.employees 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_password_settings_updated_at
BEFORE UPDATE ON public.password_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default password settings for existing companies
INSERT INTO public.password_settings (company_id)
SELECT id FROM public.companies
ON CONFLICT (company_id) DO NOTHING;