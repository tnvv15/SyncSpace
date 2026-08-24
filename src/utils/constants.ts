import { PaperColor, StampVariant } from '../types/canvas';

export const PAPER_COLOR_CONFIG: Record<PaperColor, {
  name: string;
  bgClass: string;
  borderClass: string;
  headerClass: string;
  accentHex: string;
  tapeHex: string;
}> = {
  sunflower: {
    name: 'Sunflower Yellow',
    bgClass: 'bg-[#FEF08A] text-[#713F12]',
    borderClass: 'border-[#CA8A04]',
    headerClass: 'bg-[#FDE047] text-[#854D0E]',
    accentHex: '#EAB308',
    tapeHex: 'rgba(234, 179, 8, 0.45)',
  },
  coral: {
    name: 'Warm Coral',
    bgClass: 'bg-[#FED7AA] text-[#9A3412]',
    borderClass: 'border-[#F97316]',
    headerClass: 'bg-[#FDBA74] text-[#7C2D12]',
    accentHex: '#E05A47',
    tapeHex: 'rgba(224, 90, 71, 0.4)',
  },
  sage: {
    name: 'Sage Olive',
    bgClass: 'bg-[#D1FAE5] text-[#065F46]',
    borderClass: 'border-[#10B981]',
    headerClass: 'bg-[#A7F3D0] text-[#064E3B]',
    accentHex: '#52796F',
    tapeHex: 'rgba(82, 121, 111, 0.42)',
  },
  sky: {
    name: 'French Blue',
    bgClass: 'bg-[#BAE6FD] text-[#0369A1]',
    borderClass: 'border-[#0EA5E9]',
    headerClass: 'bg-[#7DD3FC] text-[#075985]',
    accentHex: '#0284C7',
    tapeHex: 'rgba(59, 130, 246, 0.35)',
  },
  violet: {
    name: 'Lavender Mist',
    bgClass: 'bg-[#EDE9FE] text-[#5B21B6]',
    borderClass: 'border-[#8B5CF6]',
    headerClass: 'bg-[#DDD6FE] text-[#4C1D95]',
    accentHex: '#7C3AED',
    tapeHex: 'rgba(124, 58, 237, 0.35)',
  },
  kraft: {
    name: 'Kraft Board',
    bgClass: 'bg-[#E7D6BC] text-[#452B14]',
    borderClass: 'border-[#B8A179]',
    headerClass: 'bg-[#DAC2A2] text-[#3D250F]',
    accentHex: '#9B8155',
    tapeHex: 'rgba(184, 161, 121, 0.55)',
  },
  cream: {
    name: 'Parchment White',
    bgClass: 'bg-[#FFFDF8] text-[#292524]',
    borderClass: 'border-[#D6C7B2]',
    headerClass: 'bg-[#F5EFE6] text-[#44403C]',
    accentHex: '#A89F91',
    tapeHex: 'rgba(168, 159, 145, 0.35)',
  },
  rose: {
    name: 'Rose Dust',
    bgClass: 'bg-[#FFE4E6] text-[#9F1239]',
    borderClass: 'border-[#FB7185]',
    headerClass: 'bg-[#FECDD3] text-[#881337]',
    accentHex: '#F43F5E',
    tapeHex: 'rgba(244, 63, 94, 0.35)',
  },
};

export const STAMP_CONFIG: Record<StampVariant, {
  label: string;
  inkColor: string;
  borderStyle: string;
  iconName: string;
}> = {
  APPROVED: {
    label: 'APPROVED',
    inkColor: '#15803D',
    borderStyle: 'border-2 border-dashed border-[#15803D]',
    iconName: 'CheckCircle2',
  },
  DRAFT: {
    label: 'DRAFT',
    inkColor: '#B45309',
    borderStyle: 'border-2 border-dashed border-[#B45309]',
    iconName: 'FileEdit',
  },
  URGENT: {
    label: 'URGENT',
    inkColor: '#DC2626',
    borderStyle: 'border-2 border-double border-[#DC2626]',
    iconName: 'AlertTriangle',
  },
  IDEA: {
    label: '★ IDEA ★',
    inkColor: '#D97706',
    borderStyle: 'border-2 border-dotted border-[#D97706]',
    iconName: 'Lightbulb',
  },
  REVIEW: {
    label: 'IN REVIEW',
    inkColor: '#4338CA',
    borderStyle: 'border-2 border-solid border-[#4338CA]',
    iconName: 'Eye',
  },
  COMPLETED: {
    label: 'COMPLETED',
    inkColor: '#047857',
    borderStyle: 'border-2 border-solid border-[#047857]',
    iconName: 'CheckCheck',
  },
  PRIORITY: {
    label: 'TOP PRIORITY',
    inkColor: '#BE123C',
    borderStyle: 'border-2 border-dashed border-[#BE123C]',
    iconName: 'Flag',
  },
  CONFIDENTIAL: {
    label: 'STUDIO ONLY',
    inkColor: '#334155',
    borderStyle: 'border-2 border-dashed border-[#334155]',
    iconName: 'Lock',
  },
};

export const USER_COLORS = [
  '#E05A47', // Coral
  '#52796F', // Sage
  '#EAB308', // Sunflower
  '#2563EB', // Cobalt
  '#7C3AED', // Violet
  '#C2410C', // Terracotta
  '#0D9488', // Teal
  '#BE185D', // Magenta
];

export const RANDOM_USER_NAMES = [
  'Artisan Potter',
  'Paper Smith',
  'Ink Weaver',
  'Quill Crafter',
  'Print Master',
  'Book Binder',
  'Linocut Carver',
  'Calligrapher',
  'Draftsperson',
  'Studio Apprentice',
];

export function getRandomUserName(): string {
  return RANDOM_USER_NAMES[Math.floor(Math.random() * RANDOM_USER_NAMES.length)];
}

export function getRandomUserColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export function generateId(): string {
  return 'elem_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}
