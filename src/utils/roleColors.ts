/**
 * Utilitaire pour gérer les couleurs des rôles
 */

export interface RoleColorConfig {
  bg: string;
  text: string;
  border?: string;
}

/**
 * Configuration des couleurs par rôle
 */
const ROLE_COLORS: Record<string, RoleColorConfig> = {
  // Président - Rouge
  président: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  présidente: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },
  president: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
  },

  // Vice-président - Primary (couleur du thème)
  'vice-président': {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  'vice-présidente': {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },
  'vice-president': {
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/20',
  },

  // Secrétaire Général - Jaune
  'secrétaire général': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  'secrétaire générale': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },
  sg: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
  },

  // Trésorier - Vert
  trésorier: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  trésorière: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },
  treasurer: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
  },

  // Responsables de pôles - Bleu
  responsable: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  resp: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  'responsable communication': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  'responsable événementiel': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  'responsable technique': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
  'responsable partenariats': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
  },
};

/**
 * Couleur par défaut pour les rôles non spécifiés
 */
const DEFAULT_ROLE_COLOR: RoleColorConfig = {
  bg: 'bg-primary/10',
  text: 'text-primary',
  border: 'border-primary/20',
};

/**
 * Récupère la configuration de couleur pour un rôle donné
 */
export function getRoleColor(roleName: string | null | undefined): RoleColorConfig {
  if (!roleName) {
    return DEFAULT_ROLE_COLOR;
  }

  // Normaliser le nom du rôle (minuscules, sans accents excessifs)
  const normalizedRole = roleName.toLowerCase().trim();

  // Recherche exacte d'abord
  if (ROLE_COLORS[normalizedRole]) {
    return ROLE_COLORS[normalizedRole];
  }

  // Recherche partielle pour les responsables
  if (normalizedRole.includes('responsable') || normalizedRole.includes('resp')) {
    return ROLE_COLORS['responsable'];
  }

  // Recherche partielle pour président
  if (normalizedRole.includes('président') || normalizedRole.includes('president')) {
    if (normalizedRole.includes('vice')) {
      return ROLE_COLORS['vice-président'];
    }
    return ROLE_COLORS['président'];
  }

  // Recherche partielle pour secrétaire
  if (normalizedRole.includes('secrétaire') || normalizedRole.includes('sg')) {
    return ROLE_COLORS['sg'];
  }

  // Recherche partielle pour trésorier
  if (normalizedRole.includes('trésorier') || normalizedRole.includes('treasurer')) {
    return ROLE_COLORS['trésorier'];
  }

  return DEFAULT_ROLE_COLOR;
}

/**
 * Génère les classes CSS pour afficher un badge de rôle
 */
export function getRoleClasses(roleName: string | null | undefined): string {
  const colors = getRoleColor(roleName);
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border || ''}`;
}

/**
 * Génère les classes CSS pour afficher un badge de rôle avec bordure
 */
export function getRoleClassesWithBorder(roleName: string | null | undefined): string {
  const colors = getRoleColor(roleName);
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border || 'border-gray-200'}`;
}
