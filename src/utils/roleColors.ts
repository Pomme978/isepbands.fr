/**
 * Utilitaire pour gérer les couleurs des rôles
 */

export interface RoleColorConfig {
  bg: string;
  text: string;
  border?: string;
  gradient?: string;
}

/**
 * Configuration des couleurs par rôle
 */
const ROLE_COLORS: Record<string, RoleColorConfig> = {
  // Président - Rouge gradient royal
  président: {
    bg: 'bg-gradient-to-r from-red-600 to-red-800',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-red-600 to-red-800',
  },
  présidente: {
    bg: 'bg-gradient-to-r from-red-600 to-red-800',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-red-600 to-red-800',
  },
  president: {
    bg: 'bg-gradient-to-r from-red-600 to-red-800',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-red-600 to-red-800',
  },

  // Vice-président - Primary gradient sophisticated
  'vice-président': {
    bg: 'bg-gradient-to-r from-purple-600 to-violet-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-purple-600 to-violet-600',
  },
  'vice-présidente': {
    bg: 'bg-gradient-to-r from-purple-600 to-violet-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-purple-600 to-violet-600',
  },
  'vice-president': {
    bg: 'bg-gradient-to-r from-purple-600 to-violet-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-purple-600 to-violet-600',
  },

  // Secrétaire Général - Or gradient premium
  'secrétaire général': {
    bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },
  'secrétaire générale': {
    bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },
  sg: {
    bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  },

  // Trésorier - Vert émeraude gradient
  trésorier: {
    bg: 'bg-gradient-to-r from-green-600 to-emerald-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-green-600 to-emerald-600',
  },
  trésorière: {
    bg: 'bg-gradient-to-r from-green-600 to-emerald-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-green-600 to-emerald-600',
  },
  treasurer: {
    bg: 'bg-gradient-to-r from-green-600 to-emerald-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-green-600 to-emerald-600',
  },

  // Responsables de pôles - Bleu océan gradient
  responsable: {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  resp: {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  'responsable communication': {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  'responsable événementiel': {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  'responsable technique': {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  'responsable partenariats': {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
    text: 'text-white font-bold',
    gradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
};

/**
 * Couleur par défaut pour les rôles non spécifiés
 */
const DEFAULT_ROLE_COLOR: RoleColorConfig = {
  bg: 'bg-gradient-to-r from-gray-600 to-slate-600',
  text: 'text-white font-bold',
  gradient: 'bg-gradient-to-r from-gray-600 to-slate-600',
};

/**
 * Récupère la configuration de couleur pour un rôle donné
 * Supporte maintenant les couleurs personnalisées depuis la base de données
 */
export function getRoleColor(
  roleName: string | null | undefined,
  customColors?: { gradientStart?: string; gradientEnd?: string },
): RoleColorConfig {
  if (!roleName) {
    return DEFAULT_ROLE_COLOR;
  }

  // Si des couleurs personnalisées sont fournies, les utiliser (priorité absolue)
  if (customColors?.gradientStart && customColors?.gradientEnd) {
    return {
      bg: `bg-gradient-to-r`,
      text: 'text-white font-bold',
      gradient: `linear-gradient(to right, ${customColors.gradientStart}, ${customColors.gradientEnd})`,
    };
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
 * Génère les classes CSS pour afficher un badge de rôle avec gradient
 */
export function getRoleClasses(roleName: string | null | undefined): string {
  const colors = getRoleColor(roleName);
  return `${colors.bg} ${colors.text}`;
}

/**
 * Génère les classes CSS pour afficher un badge de rôle avec bordure (deprecated - use getRoleClasses)
 */
export function getRoleClassesWithBorder(roleName: string | null | undefined): string {
  const colors = getRoleColor(roleName);
  return `${colors.bg} ${colors.text}`;
}

/**
 * Récupère la couleur principale d'un rôle pour le texte (sans gradient)
 */
export function getRoleTextColor(roleName: string | null | undefined): string {
  if (!roleName) {
    return 'text-gray-600';
  }

  const normalizedRole = roleName.toLowerCase().trim();

  // Président - Rouge
  if (normalizedRole.includes('président') || normalizedRole.includes('president')) {
    if (normalizedRole.includes('vice')) {
      return 'text-purple-600'; // Vice-président
    }
    return 'text-red-600'; // Président
  }

  // Secrétaire Général - Orange/Jaune
  if (normalizedRole.includes('secrétaire') || normalizedRole.includes('sg')) {
    return 'text-orange-500';
  }

  // Trésorier - Vert
  if (normalizedRole.includes('trésorier') || normalizedRole.includes('treasurer')) {
    return 'text-green-600';
  }

  // Responsables - Bleu
  if (normalizedRole.includes('responsable') || normalizedRole.includes('resp')) {
    return 'text-blue-600';
  }

  return 'text-gray-600';
}
