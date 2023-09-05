export interface RenderTree {
  id: string;
  name: string;
  desc: string;
  SalesPersonNote: string;
  Guid: string;
  EntityType: string;
  RTPrintDescription: boolean;
  RTPrintPhotos: boolean;
  RTPrintNote: boolean;
  RTPrintPrice: boolean;
  RTExcludeFromPrint: boolean;
  RTExcludeFromPrintParent: boolean;
  PhotoURL: string[];
  children?: RenderTree[];
}
