// Text Analysis Types

export interface TextResponse {
  id: number;
  text: string;
  field: 'boligpolitikk' | 'tomt_årsak';
  demografi: {
    alder: string;
    kjønn: string;
    lokasjon: string;
  };
  timestamp: string;
  themes: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface Theme {
  name: string;
  keywords: string[];
  color: string;
  icon: string;
}

export interface WordFrequency {
  text: string;
  value: number;
}
