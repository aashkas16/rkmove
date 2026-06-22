
-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'staff');

-- Create user_roles table (roles stored separately per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create branches table
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  category TEXT NOT NULL DEFAULT 'Regular' CHECK (category IN ('Corporate','Regular','VIP','Vendor','Transport Partner')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create parcels table
CREATE TABLE public.parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lr_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  description TEXT,
  vehicle_number TEXT,
  current_location TEXT,
  status TEXT NOT NULL DEFAULT 'Booked' CHECK (status IN ('Booked','Packed','In Transit','Reached Hub','Out for Delivery','Delivered')),
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  advance_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  balance NUMERIC(12,2) GENERATED ALWAYS AS (total_amount - advance_paid) STORED,
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending','Partial','Paid')),
  expected_delivery DATE,
  remarks TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

-- Create parcel_status_log table
CREATE TABLE public.parcel_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID REFERENCES public.parcels(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  location TEXT,
  remarks TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parcel_status_log ENABLE ROW LEVEL SECURITY;

-- Create income table
CREATE TABLE public.income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT,
  lr_number TEXT,
  amount NUMERIC(12,2) NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'Cash' CHECK (payment_mode IN ('Cash','UPI','Bank','Cheque')),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;

-- Create expenditure table
CREATE TABLE public.expenditure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('Fuel','Toll','Labour','Maintenance','Office Expense','Other')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  vehicle_number TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.expenditure ENABLE ROW LEVEL SECURITY;

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_type TEXT NOT NULL DEFAULT 'GST Invoice' CHECK (invoice_type IN ('GST Invoice','LR Copy','Quotation')),
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  lr_number TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  gst_percent NUMERIC(5,2) NOT NULL DEFAULT 18,
  gst_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function: is_admin (super_admin or staff)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'staff')
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for branches
CREATE POLICY "Admins can view branches" ON public.branches FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Super admins can manage branches" ON public.branches FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can update branches" ON public.branches FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete branches" ON public.branches FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for customers
CREATE POLICY "Admins can view customers" ON public.customers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Super admins can delete customers" ON public.customers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for vehicles
CREATE POLICY "Admins can view vehicles" ON public.vehicles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Super admins can delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for parcels
CREATE POLICY "Admins can manage parcels" ON public.parcels FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Public can track parcels" ON public.parcels FOR SELECT TO anon USING (true);

-- RLS Policies for parcel_status_log
CREATE POLICY "Admins can manage status log" ON public.parcel_status_log FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Public can view status log" ON public.parcel_status_log FOR SELECT TO anon USING (true);

-- RLS Policies for income
CREATE POLICY "Admins can view income" ON public.income FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert income" ON public.income FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update income" ON public.income FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Super admins can delete income" ON public.income FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for expenditure
CREATE POLICY "Admins can view expenditure" ON public.expenditure FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert expenditure" ON public.expenditure FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update expenditure" ON public.expenditure FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Super admins can delete expenditure" ON public.expenditure FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for invoices
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.is_admin());

-- RLS Policies for activity_logs
CREATE POLICY "Admins can manage logs" ON public.activity_logs FOR ALL TO authenticated USING (public.is_admin());

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON public.parcels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- LR Number sequence
CREATE SEQUENCE IF NOT EXISTS lr_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_lr_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.lr_number IS NULL OR NEW.lr_number = '' THEN
    NEW.lr_number := 'RKCPM' || TO_CHAR(NOW(), 'YYYYMM') || LPAD(nextval('lr_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_lr_number BEFORE INSERT ON public.parcels FOR EACH ROW EXECUTE FUNCTION public.generate_lr_number();

-- Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('invoice_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_invoice_number BEFORE INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.generate_invoice_number();
