import { flashcardsData } from '../data/flashcardsData';

// Metadados estéticos fixos das 7 trilhas ENEM (cores, números e ícones da UI)
export const TRAILS_METADATA = [
  {
    id: 'fundamentos',
    number: 1,
    name: 'Fundamentos',
    competency: 'Estrutura Geral',
    description: 'Regras da banca e critérios de anulação',
    barColor: 'bg-tertiary-container',
    numColor: 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant',
    icon: 'verified',
    iconColor: 'text-on-tertiary-fixed-variant',
  },
  {
    id: 'introducao',
    number: 2,
    name: 'Introdução',
    competency: 'Competência 1 & 2',
    description: 'Contextualização e tese central',
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'check_circle',
    iconColor: 'text-primary',
  },
  {
    id: 'argumentacao',
    number: 3,
    name: 'Argumentação',
    competency: 'Competência 3',
    description: 'Estratégia dissertativa e projeto de texto',
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'trending_up',
    iconColor: 'text-on-surface-variant',
  },
  {
    id: 'repertorio',
    number: 4,
    name: 'Repertório',
    competency: 'Competência 2',
    description: 'Legitimado, pertinente e produtivo',
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'history_edu',
    iconColor: 'text-on-surface-variant',
  },
  {
    id: 'coesao',
    number: 5,
    name: 'Coesão',
    competency: 'Competência 4',
    description: 'Conectivos inter e intraparágrafos',
    barColor: 'bg-primary-container',
    numColor: 'bg-primary-fixed/40 text-on-primary-fixed-variant',
    icon: 'link',
    iconColor: 'text-on-surface-variant',
  },
  {
    id: 'proposta',
    number: 6,
    name: 'Proposta de Intervenção',
    competency: 'Competência 5',
    description: 'Agente, ação, meio, efeito e detalhamento',
    barColor: 'bg-secondary-container',
    numColor: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    icon: 'warning',
    iconColor: 'text-secondary',
    highlightContainer: 'bg-secondary-fixed/20',
  },
  {
    id: 'conclusao',
    number: 7,
    name: 'Conclusão',
    competency: 'Fechamento Geral',
    description: 'Retomada de tese e arremate nota 1000',
    barColor: 'bg-outline-variant',
    numColor: 'bg-surface-container text-on-surface-variant',
    icon: 'play_circle',
    iconColor: 'text-outline',
  },
];

export const COMPETENCIES_METADATA = [
  {
    key: 'C1',
    name: 'Competência 1',
    shortName: 'C1 · Gramática',
    label: 'Norma Culta & Gramática',
    trailId: 'introducao',
    bar: 'bg-primary-container',
    match: (c) => c.competency?.includes('I') || c.trailId === 'introducao',
  },
  {
    key: 'C2',
    name: 'Competência 2',
    shortName: 'C2 · Repertório',
    label: 'Compreensão & Repertório',
    trailId: 'repertorio',
    bar: 'bg-tertiary-container',
    match: (c) => c.competency?.includes('II') || c.trailId === 'repertorio',
  },
  {
    key: 'C3',
    name: 'Competência 3',
    shortName: 'C3 · Argumentação',
    label: 'Projeto de Texto & Argumento',
    trailId: 'argumentacao',
    bar: 'bg-primary-container',
    match: (c) => c.competency?.includes('III') || c.trailId === 'argumentacao',
  },
  {
    key: 'C4',
    name: 'Competência 4',
    shortName: 'C4 · Coesão',
    label: 'Coesão & Conectivos',
    trailId: 'coesao',
    bar: 'bg-primary-fixed-dim',
    match: (c) => c.competency?.includes('IV') || c.trailId === 'coesao',
  },
  {
    key: 'C5',
    name: 'Competência 5',
    shortName: 'C5 · Proposta',
    label: 'Proposta de Intervenção',
    trailId: 'proposta',
    bar: 'bg-secondary-container',
    match: (c) => c.competency?.includes('V') || c.trailId === 'proposta',
  },
];

// Calcula analytics e progresso real a partir dos reviews do usuário logado
export function calculateUserAnalytics(reviews = []) {
  // Mapeia o último status de cada card avaliado
  const latestReviewPerCard = {};
  for (const r of reviews) {
    if (r.card_id) {
      latestReviewPerCard[r.card_id] = r.action; // 'dominei' | 'revisar'
    }
  }

  const masteredCardIds = new Set();
  const reviewCardIds = new Set();

  Object.entries(latestReviewPerCard).forEach(([cardId, action]) => {
    if (action === 'dominei') {
      masteredCardIds.add(cardId);
    } else if (action === 'revisar') {
      reviewCardIds.add(cardId);
    }
  });

  const totalCardsGlobal = flashcardsData.length;
  const dominoCount = masteredCardIds.size;
  const revisarCount = reviewCardIds.size;
  const totalStudied = dominoCount + revisarCount;
  const novosCount = Math.max(0, totalCardsGlobal - dominoCount - revisarCount);
  const globalMasteryPercent = totalCardsGlobal > 0 ? Math.round((dominoCount / totalCardsGlobal) * 100) : 0;

  // Analytics por Trilha
  const trails = TRAILS_METADATA.map((meta) => {
    const cardsInTrail = flashcardsData.filter((c) => c.trailId === meta.id);
    const totalTrailCards = cardsInTrail.length;
    const masteredInTrail = cardsInTrail.filter((c) => masteredCardIds.has(c.id)).length;
    const reviewInTrail = cardsInTrail.filter((c) => reviewCardIds.has(c.id)).length;
    const mastery = totalTrailCards > 0 ? Math.round((masteredInTrail / totalTrailCards) * 100) : 0;

    let tag = 'Não iniciado';
    let tagClass = 'bg-surface-container text-on-surface-variant';
    let tagIcon = null;

    if (mastery === 100) {
      tag = 'Consolidado';
      tagClass = 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant';
    } else if (mastery > 0 && reviewInTrail > 0 && mastery < 50) {
      tag = 'Ponto de atenção';
      tagClass = 'bg-secondary-fixed text-on-secondary-fixed-variant';
      tagIcon = 'priority_high';
    } else if (mastery > 0) {
      tag = 'Em progresso';
      tagClass = 'bg-surface-container text-on-surface-variant';
    }

    return {
      ...meta,
      subtitle: `${totalTrailCards} cards · ${meta.description}`,
      mastery,
      totalCards: totalTrailCards,
      masteredCount: masteredInTrail,
      reviewCount: reviewInTrail,
      tag,
      tagClass,
      tagIcon,
    };
  });

  // Analytics por Competência (C1 a C5)
  let totalScoreSum = 0;
  const competencies = COMPETENCIES_METADATA.map((cfg) => {
    const compCards = flashcardsData.filter(cfg.match);
    const total = Math.max(1, compCards.length);
    const mastered = compCards.filter((c) => masteredCardIds.has(c.id)).length;
    const reviewing = compCards.filter((c) => reviewCardIds.has(c.id)).length;
    const score = Math.round((mastered / total) * 200);
    const pct = Math.round((score / 200) * 100);
    totalScoreSum += score;

    let status = 'Não iniciado';
    let statusColor = 'bg-surface-container text-outline';

    if (pct >= 80) {
      status = 'Consolidado (Forte)';
      statusColor = 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-semibold';
    } else if (pct >= 40) {
      status = 'Em desenvolvimento';
      statusColor = 'bg-primary-fixed/40 text-primary font-semibold';
    } else if (reviewing > 0) {
      status = 'Ponto de atenção';
      statusColor = 'bg-secondary-fixed text-on-secondary-fixed-variant font-semibold';
    } else if (mastered > 0) {
      status = 'Iniciado';
      statusColor = 'bg-surface-container text-on-surface-variant';
    }

    return {
      key: cfg.key,
      name: cfg.name,
      shortName: cfg.shortName,
      label: cfg.label,
      trailId: cfg.trailId,
      score: `${score}/200`,
      scoreNum: score,
      pct,
      masteredCount: mastered,
      reviewCount: reviewing,
      totalCards: total,
      bar: cfg.bar,
      status,
      statusColor,
    };
  });

  // Identifica a competência de Atenção Prioritária dinamicamente
  let priorityCompetency = null;
  if (totalStudied > 0) {
    // Ordena priorizando: maior quantidade de cards marcados para revisão, menor taxa de domínio
    const sorted = [...competencies].sort((a, b) => {
      if (b.reviewCount !== a.reviewCount) {
        return b.reviewCount - a.reviewCount; // Mais cards a revisar vem primeiro
      }
      return a.pct - b.pct; // Menor percentual de acerto/domínio vem primeiro
    });

    const weakest = sorted[0];
    const detail = weakest.reviewCount > 0
      ? `Você marcou ${weakest.reviewCount} ${weakest.reviewCount === 1 ? 'card' : 'cards'} para revisar nesta competência (${weakest.pct}% de domínio). Recomendamos focar nesta trilha.`
      : `Seu domínio atual é de ${weakest.pct}%. Treine os cards desta competência para acelerar sua pontuação no ENEM.`;

    priorityCompetency = {
      ...weakest,
      detail,
    };
  }

  // Quantidade de trilhas com bom ritmo (> 70%)
  const passingTrailsCount = trails.filter((t) => t.mastery >= 70).length;

  return {
    totalCardsGlobal,
    dominoCount,
    revisarCount,
    totalStudied,
    novosCount,
    globalMasteryPercent,
    trails,
    competencies,
    priorityCompetency,
    enemScore: totalScoreSum,
    passingTrailsCount,
  };
}
