-- IMPROVED TRIGGER: FIRST USER BECOMES ADMIN AUTOMATICALLY
-- Run this in Supabase SQL Editor

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  -- Check if any admin already exists
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') INTO is_first_user;

  INSERT INTO public.profiles (id, email, nama_lengkap, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN is_first_user THEN 'admin'::user_role 
      ELSE COALESCE((new.raw_user_meta_data->>'role')::user_role, 'mahasiswa'::user_role)
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nama_lengkap = EXCLUDED.nama_lengkap,
    role = EXCLUDED.role, -- Allow role update if it was the first user attempt
    updated_at = NOW();
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
