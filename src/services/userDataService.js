import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const userDataService = {
  // Carrega o perfil / progresso isolado do usuário
  async getUserProgress(userId) {
    if (!userId) return null;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, streak, last_study_date, daily_goal, xp, level, initial_focus')
          .eq('id', userId)
          .single();

        if (data && !error) {
          return {
            streak: data.streak || 0,
            lastStudyDate: data.last_study_date ? new Date(data.last_study_date) : null,
            dailyGoal: data.daily_goal || 10,
            xp: data.xp || 0,
            level: data.level || 1,
            name: data.name || 'Estudante',
            initialFocus: data.initial_focus || null,
          };
        }
      } catch (err) {
        console.warn('Fallback para cache local isolado por usuário:', err.message);
      }
    }

    // Cache local isolado por user ID (começa em 0 para novos usuários)
    const localStreak = localStorage.getItem(`redacaoSwipeStreak_${userId}`);
    const localLastDate = localStorage.getItem(`redacaoSwipeLastStudyDate_${userId}`);
    const localDailyGoal = localStorage.getItem(`redacaoSwipeDailyGoal_${userId}`);
    const localFocus = localStorage.getItem(`redacaoSwipeInitialFocus_${userId}`);

    return {
      streak: localStreak ? parseInt(localStreak, 10) : 0,
      lastStudyDate: localLastDate ? new Date(localLastDate) : null,
      dailyGoal: localDailyGoal ? parseInt(localDailyGoal, 10) : 10,
      xp: 0,
      level: 1,
      name: 'Estudante',
      initialFocus: localFocus || null,
    };
  },

  // Salva foco inicial escolhido pelo usuário no zero state
  async saveInitialFocus(userId, focusKey) {
    if (!userId || !focusKey) return;

    localStorage.setItem(`redacaoSwipeInitialFocus_${userId}`, focusKey);

    if (isSupabaseConfigured()) {
      try {
        // Tenta salvar no profiles
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            initial_focus: focusKey,
            updated_at: new Date().toISOString(),
          });
      } catch (_err) {
        // Fallback: salva em user_metadata do auth
        try {
          await supabase.auth.updateUser({
            data: { initial_focus: focusKey },
          });
        } catch (metaErr) {
          console.warn('Erro ao sincronizar foco inicial no Supabase:', metaErr.message);
        }
      }
    }
  },

  // Salva / atualiza o streak e a última data de estudo
  async saveStreak(userId, streak, lastStudyDate) {
    if (!userId) return;

    localStorage.setItem(`redacaoSwipeStreak_${userId}`, streak.toString());
    if (lastStudyDate) {
      localStorage.setItem(`redacaoSwipeLastStudyDate_${userId}`, lastStudyDate.toISOString());
    }

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            streak,
            last_study_date: lastStudyDate ? lastStudyDate.toISOString() : new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.warn('Erro ao sincronizar streak no Supabase:', err.message);
      }
    }
  },

  // Salva meta diária
  async saveDailyGoal(userId, dailyGoal) {
    if (!userId) return;

    localStorage.setItem(`redacaoSwipeDailyGoal_${userId}`, dailyGoal.toString());

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            daily_goal: dailyGoal,
            updated_at: new Date().toISOString(),
          });
      } catch (err) {
        console.warn('Erro ao sincronizar meta diária no Supabase:', err.message);
      }
    }
  },

  // Carrega cards salvos pelo usuário logado (novo usuário começa com [])
  async getSavedCards(userId) {
    if (!userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('user_saved_cards')
          .select('card_id')
          .eq('user_id', userId);

        if (data && !error) {
          const cardIds = data.map((item) => item.card_id);
          localStorage.setItem(`redacaoSwipeSavedCards_${userId}`, JSON.stringify(cardIds));
          return cardIds;
        }
      } catch (err) {
        console.warn('Fallback para saved cards local:', err.message);
      }
    }

    const localSaved = localStorage.getItem(`redacaoSwipeSavedCards_${userId}`);
    return localSaved ? JSON.parse(localSaved) : [];
  },

  // Adiciona ou remove card dos salvos
  async toggleSavedCard(userId, cardId, isCurrentlySaved) {
    if (!userId || !cardId) return;

    const localSaved = localStorage.getItem(`redacaoSwipeSavedCards_${userId}`);
    let currentList = localSaved ? JSON.parse(localSaved) : [];
    if (isCurrentlySaved) {
      currentList = currentList.filter((id) => id !== cardId);
    } else {
      if (!currentList.includes(cardId)) currentList.push(cardId);
    }
    localStorage.setItem(`redacaoSwipeSavedCards_${userId}`, JSON.stringify(currentList));

    if (isSupabaseConfigured()) {
      try {
        if (isCurrentlySaved) {
          await supabase
            .from('user_saved_cards')
            .delete()
            .match({ user_id: userId, card_id: cardId });
        } else {
          await supabase
            .from('user_saved_cards')
            .insert({
              user_id: userId,
              card_id: cardId,
              created_at: new Date().toISOString(),
            });
        }
      } catch (err) {
        console.warn('Erro ao sincronizar saved card no Supabase:', err.message);
      }
    }
  },

  // Carrega todas as revisões/swipes do usuário logado
  async getUserReviews(userId) {
    if (!userId) return [];

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('user_card_reviews')
          .select('card_id, trail_id, action, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (data && !error) {
          // Deduplica mantendo o review mais recente por card_id
          const latestByCard = {};
          data.forEach((r) => {
            if (r.card_id) latestByCard[r.card_id] = r;
          });
          const deduplicated = Object.values(latestByCard);

          localStorage.setItem(`redacaoSwipeReviews_${userId}`, JSON.stringify(deduplicated));
          return deduplicated;
        }
      } catch (err) {
        console.warn('Fallback para reviews locais:', err.message);
      }
    }

    const localReviews = localStorage.getItem(`redacaoSwipeReviews_${userId}`);
    if (localReviews) {
      try {
        const parsed = JSON.parse(localReviews);
        const latestByCard = {};
        parsed.forEach((r) => {
          if (r.card_id) latestByCard[r.card_id] = r;
        });
        return Object.values(latestByCard);
      } catch {}
    }
    return [];
  },

  // Registra avaliação de um card (Swipe: 'dominei' ou 'revisar')
  async recordCardReview(userId, cardId, trailId, action) {
    if (!userId || !cardId) return;

    const reviewEntry = {
      card_id: cardId,
      trail_id: trailId,
      action,
      created_at: new Date().toISOString(),
    };

    // Atualiza cache local de forma deduplicada
    const localReviews = localStorage.getItem(`redacaoSwipeReviews_${userId}`);
    let reviewsList = localReviews ? JSON.parse(localReviews) : [];
    reviewsList = reviewsList.filter((r) => r.card_id !== cardId);
    reviewsList.push(reviewEntry);
    localStorage.setItem(`redacaoSwipeReviews_${userId}`, JSON.stringify(reviewsList));

    if (isSupabaseConfigured()) {
      try {
        // Tenta upsert se a tabela tiver restrição de unicidade
        const { error } = await supabase.from('user_card_reviews').upsert(
          {
            user_id: userId,
            card_id: cardId,
            trail_id: trailId,
            action,
            created_at: reviewEntry.created_at,
          },
          { onConflict: 'user_id,card_id' }
        );

        if (error) {
          // Fallback para insert normal
          await supabase.from('user_card_reviews').insert({
            user_id: userId,
            card_id: cardId,
            trail_id: trailId,
            action,
            created_at: reviewEntry.created_at,
          });
        }
      } catch (_err) {
        try {
          await supabase.from('user_card_reviews').insert({
            user_id: userId,
            card_id: cardId,
            trail_id: trailId,
            action,
            created_at: reviewEntry.created_at,
          });
        } catch (insertErr) {
          console.warn('Erro ao registrar review no Supabase:', insertErr.message);
        }
      }
    }
  },
};
