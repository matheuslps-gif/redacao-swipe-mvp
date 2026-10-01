-- ==============================================================================
-- REDACAO.SWIPE — SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Execute este script no SQL Editor do painel Supabase
-- ==============================================================================

-- 1. TABELA DE PERFIS E PROGRESSO DO USUÁRIO
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  streak INTEGER DEFAULT 0,
  last_study_date TIMESTAMPTZ,
  daily_goal INTEGER DEFAULT 10,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE CARDS SALVOS / FAVORITOS DO USUÁRIO
CREATE TABLE IF NOT EXISTS public.user_saved_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- 3. TABELA DE HISTÓRICO DE REVISÕES / SWIPES DO USUÁRIO
CREATE TABLE IF NOT EXISTS public.user_card_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  trail_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('dominei', 'revisar')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- HABILITAÇÃO DO ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_card_reviews ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- POLÍTICAS DE RLS: ISOLAMENTO TOTAL (auth.uid() = user_id)
-- ==============================================================================

-- Políticas para 'profiles'
DROP POLICY IF EXISTS "Usuários podem visualizar apenas seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem visualizar apenas seu próprio perfil"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar apenas seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para 'user_saved_cards'
DROP POLICY IF EXISTS "Usuários podem visualizar apenas seus próprios cards salvos" ON public.user_saved_cards;
CREATE POLICY "Usuários podem visualizar apenas seus próprios cards salvos"
  ON public.user_saved_cards
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem salvar cards para si mesmos" ON public.user_saved_cards;
CREATE POLICY "Usuários podem salvar cards para si mesmos"
  ON public.user_saved_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem remover apenas seus próprios cards salvos" ON public.user_saved_cards;
CREATE POLICY "Usuários podem remover apenas seus próprios cards salvos"
  ON public.user_saved_cards
  FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para 'user_card_reviews'
DROP POLICY IF EXISTS "Usuários podem visualizar apenas seus próprios reviews" ON public.user_card_reviews;
CREATE POLICY "Usuários podem visualizar apenas seus próprios reviews"
  ON public.user_card_reviews
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir apenas seus próprios reviews" ON public.user_card_reviews;
CREATE POLICY "Usuários podem inserir apenas seus próprios reviews"
  ON public.user_card_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: CRIAÇÃO DE PERFIL APÓS SIGNUP NO SUPABASE AUTH
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, streak, daily_goal)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    0,
    10
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
