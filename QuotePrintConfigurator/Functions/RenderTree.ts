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
  // photourl1: string;
  // photourl2: string;
  // photourl3: string;
  // photourl4: string;
  PhotoURL: string[];
  children?: RenderTree[];
}
