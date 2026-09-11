export type StoreRow = {
  wwStoreId: string;
  name: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  lat: number;
  lng: number;
  division?: string;
};

export type PostcodeRow = {
  postcode: string;
  locality: string;
  state: string;
  lat: number;
  lng: number;
};

export type ObservationRow = {
  wwStoreId: string;
  stockcode: string;
  inStock: boolean;
  observedAt: string;
};

export type SightingRow = {
  wwStoreId: string;
  stockcode: string;
  level: string;
  comment?: string | null;
  sightedAt: string;
};
