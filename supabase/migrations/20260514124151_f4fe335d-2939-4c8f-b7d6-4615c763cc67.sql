
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  state TEXT,
  district TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by owner" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles insert by owner" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles update by owner" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Scheme applications
CREATE TABLE public.scheme_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_code TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own applications select" ON public.scheme_applications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own applications insert" ON public.scheme_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own applications update" ON public.scheme_applications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own applications delete" ON public.scheme_applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Crop listings (marketplace)
CREATE TABLE public.crop_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sell','buy')),
  commodity TEXT NOT NULL,
  variety TEXT,
  quantity_qtl NUMERIC NOT NULL,
  price_per_qtl NUMERIC NOT NULL,
  location TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active listings visible to authenticated" ON public.crop_listings FOR SELECT TO authenticated USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "Own listing insert" ON public.crop_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own listing update" ON public.crop_listings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own listing delete" ON public.crop_listings FOR DELETE TO authenticated USING (auth.uid() = user_id);
