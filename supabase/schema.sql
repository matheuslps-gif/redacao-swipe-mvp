-- ==============================================================================
-- REDACAO.SWIPE — SUPABASE DDL MIGRATION (100% IDEMPOTENTE)
-- Pode ser executado múltiplas vezes sem erros no SQL Editor do Supabase
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
  initial_focus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garante todas as colunas em tabelas que já existiam previamente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_study_date TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 10;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS initial_focus TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS free_limit_reset_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();


-- 2. TABELA DE CARDS SALVOS / FAVORITOS
CREATE TABLE IF NOT EXISTS public.user_saved_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_saved_cards ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_saved_cards ADD COLUMN IF NOT EXISTS card_id TEXT;
ALTER TABLE public.user_saved_cards ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2.1 Deduplica registros pré-existentes de testes antes de criar a restrição
DELETE FROM public.user_saved_cards
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY user_id, card_id
      ORDER BY created_at DESC, id DESC
    ) AS rnum
    FROM public.user_saved_cards
  ) t
  WHERE t.rnum > 1
);

-- Restrição de Unicidade em user_saved_cards (Idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_saved_cards_user_card_unique'
  ) THEN
    ALTER TABLE public.user_saved_cards ADD CONSTRAINT user_saved_cards_user_card_unique UNIQUE (user_id, card_id);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;


-- 3. TABELA DE HISTÓRICO DE REVISÕES / SWIPES
CREATE TABLE IF NOT EXISTS public.user_card_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  trail_id TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_card_reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.user_card_reviews ADD COLUMN IF NOT EXISTS card_id TEXT;
ALTER TABLE public.user_card_reviews ADD COLUMN IF NOT EXISTS trail_id TEXT;
ALTER TABLE public.user_card_reviews ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.user_card_reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.user_card_reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3.1 Deduplica registros pré-existentes de testes mantendo o review mais recente
DELETE FROM public.user_card_reviews
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY user_id, card_id
      ORDER BY created_at DESC, id DESC
    ) AS rnum
    FROM public.user_card_reviews
  ) t
  WHERE t.rnum > 1
);

-- Restrição de Unicidade em user_card_reviews (Idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_card_reviews_user_card_unique'
  ) THEN
    ALTER TABLE public.user_card_reviews ADD CONSTRAINT user_card_reviews_user_card_unique UNIQUE (user_id, card_id);
  END IF;
EXCEPTION
  WHEN duplicate_table OR duplicate_object THEN NULL;
END $$;


-- ==============================================================================
-- ÍNDICES DE ALTA PERFORMANCE (IDEMPOTENTES)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_reviews_user_trail ON public.user_card_reviews(user_id, trail_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_card ON public.user_card_reviews(user_id, card_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_card ON public.user_saved_cards(user_id, card_id);


-- ==============================================================================
-- HABILITAÇÃO DO ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_card_reviews ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- POLÍTICAS DE RLS: ISOLAMENTO TOTAL (DROP + CREATE LIMPO)
-- ==============================================================================

-- 1. Políticas para 'profiles'
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem visualizar apenas seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seu próprio perfil" ON public.profiles;

CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 2. Políticas para 'user_saved_cards'
DROP POLICY IF EXISTS "saved_cards_select" ON public.user_saved_cards;
DROP POLICY IF EXISTS "saved_cards_insert" ON public.user_saved_cards;
DROP POLICY IF EXISTS "saved_cards_delete" ON public.user_saved_cards;
DROP POLICY IF EXISTS "Usuários podem visualizar apenas seus próprios cards salvos" ON public.user_saved_cards;
DROP POLICY IF EXISTS "Usuários podem salvar cards para si mesmos" ON public.user_saved_cards;
DROP POLICY IF EXISTS "Usuários podem remover apenas seus próprios cards salvos" ON public.user_saved_cards;

CREATE POLICY "saved_cards_select_policy"
  ON public.user_saved_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saved_cards_insert_policy"
  ON public.user_saved_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_cards_delete_policy"
  ON public.user_saved_cards FOR DELETE
  USING (auth.uid() = user_id);


-- 3. Políticas para 'user_card_reviews'
DROP POLICY IF EXISTS "reviews_select" ON public.user_card_reviews;
DROP POLICY IF EXISTS "reviews_insert" ON public.user_card_reviews;
DROP POLICY IF EXISTS "reviews_update" ON public.user_card_reviews;
DROP POLICY IF EXISTS "Usuários podem visualizar apenas seus próprios reviews" ON public.user_card_reviews;
DROP POLICY IF EXISTS "Usuários podem inserir apenas seus próprios reviews" ON public.user_card_reviews;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seus próprios reviews" ON public.user_card_reviews;

CREATE POLICY "reviews_select_policy"
  ON public.user_card_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "reviews_insert_policy"
  ON public.user_card_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reviews_update_policy"
  ON public.user_card_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ==============================================================================
-- TRIGGER AUTOMÁTICO: CRIAÇÃO DE PERFIL NO CADASTRO (AUTH.USERS -> PROFILES)
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
