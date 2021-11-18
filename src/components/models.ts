export interface Size {
  width: number;
  height: number;
}

export class BenderModel {
  template?: string;
  json?: string;
  csv?: string;
  csvHasHeaders?: boolean;
  language?: string;
}
