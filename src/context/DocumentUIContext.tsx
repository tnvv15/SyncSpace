import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  FontFamily,
  FontSize,
  PageWidth,
  HeaderToggles,
  BlockType
} from '../types/documentTheme';

export interface DocumentUIContextType {
  currentHeading: string;
  setCurrentHeading: (heading: string) => void;
  activeFormats: Record<string, boolean>;
  toggleFormat: (format: 'bold' | 'italic' | 'underline' | 'strike') => void;
  activeAlign: 'left' | 'center' | 'right';
  setActiveAlign: (align: 'left' | 'center' | 'right') => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addBlockSignal: { type: BlockType; timestamp: number } | null;
  triggerAddBlock: (type: BlockType) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  pageWidth: PageWidth;
  setPageWidth: (width: PageWidth) => void;
  headerToggles: HeaderToggles;
  setHeaderToggles: React.Dispatch<React.SetStateAction<HeaderToggles>>;
  toggleHeaderItem: (key: keyof HeaderToggles) => void;
  wordCount: number;
  setWordCount: (count: number) => void;
  zoomLevel: string;
  setZoomLevel: (zoom: string) => void;
}

const defaultHeaderToggles: HeaderToggles = {
  coverImage: true,
  pageTitleIcon: true,
  subtitle: false,
  author: true,
  contributors: true,
  date: true,
  pageOutline: false,
  subpages: false,
};

const DocumentUIContext = createContext<DocumentUIContextType | undefined>(undefined);

export function DocumentUIProvider({ children }: { children: ReactNode }) {
  const [currentHeading, setCurrentHeading] = useState('Heading 1');
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  });
  const [activeAlign, setActiveAlign] = useState<'left' | 'center' | 'right'>('left');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [addBlockSignal, setAddBlockSignal] = useState<{ type: BlockType; timestamp: number } | null>(null);
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [pageWidth, setPageWidth] = useState<PageWidth>('normal');
  const [headerToggles, setHeaderToggles] = useState<HeaderToggles>(defaultHeaderToggles);
  const [wordCount, setWordCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState('100%');

  const toggleFormat = (format: 'bold' | 'italic' | 'underline' | 'strike') => {
    setActiveFormats(prev => ({ ...prev, [format]: !prev[format] }));
  };

  const triggerAddBlock = (type: BlockType) => {
    setAddBlockSignal({ type, timestamp: Date.now() });
  };

  const toggleHeaderItem = (key: keyof HeaderToggles) => {
    setHeaderToggles((prev: HeaderToggles) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DocumentUIContext.Provider
      value={{
        currentHeading,
        setCurrentHeading,
        activeFormats,
        toggleFormat,
        activeAlign,
        setActiveAlign,
        isInspectorOpen,
        setIsInspectorOpen,
        addBlockSignal,
        triggerAddBlock,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        pageWidth,
        setPageWidth,
        headerToggles,
        setHeaderToggles,
        toggleHeaderItem,
        wordCount,
        setWordCount,
        zoomLevel,
        setZoomLevel,
      }}
    >
      {children}
    </DocumentUIContext.Provider>
  );
}

export function useDocumentUI() {
  const context = useContext(DocumentUIContext);
  if (!context) {
    throw new Error('useDocumentUI must be used within a DocumentUIProvider');
  }
  return context;
}
