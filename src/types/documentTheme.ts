export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontSize = 'small' | 'normal' | 'large';
export type PageWidth = 'normal' | 'large';

export interface HeaderToggles {
  coverImage: boolean;
  pageTitleIcon: boolean;
  subtitle: boolean;
  author: boolean;
  contributors: boolean;
  date: boolean;
  pageOutline: boolean;
  subpages: boolean;
}

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'checklist'
  | 'quote'
  | 'bullet'
  | 'numbered';

export interface DocumentBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
}
