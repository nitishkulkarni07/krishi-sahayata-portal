
-- Extend profiles with role + KYC fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'farmer',
  ADD COLUMN IF NOT EXISTS aadhaar text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS trader_company text,
  ADD COLUMN IF NOT EXISTS trader_license text;

-- Validate aadhaar format (12 digits) when provided
CREATE OR REPLACE FUNCTION public.validate_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.aadhaar IS NOT NULL AND NEW.aadhaar !~ '^[0-9]{12}$' THEN
    RAISE EXCEPTION 'Aadhaar must be exactly 12 digits';
  END IF;
  IF NEW.role NOT IN ('farmer','trader') THEN
    RAISE EXCEPTION 'role must be farmer or trader';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS validate_profile_fields_trg ON public.profiles;
CREATE TRIGGER validate_profile_fields_trg
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profile_fields();

-- Update new-user handler to capture extra metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, state, district, role, aadhaar, address, trader_company, trader_license)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'district',
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    NEW.raw_user_meta_data->>'aadhaar',
    NEW.raw_user_meta_data->>'address',
    NEW.raw_user_meta_data->>'trader_company',
    NEW.raw_user_meta_data->>'trader_license'
  );
  RETURN NEW;
END; $$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id uuid,
  commodity text NOT NULL,
  variety text,
  quantity_qtl numeric NOT NULL,
  price_per_qtl numeric NOT NULL,
  location text NOT NULL,
  seller_contact text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own purchases select" ON public.purchases
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own purchases insert" ON public.purchases
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own purchases delete" ON public.purchases
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
