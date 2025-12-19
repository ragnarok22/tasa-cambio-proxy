export interface ProvinceRate {
  id: string;
  name: string;
  usdRate: number;
  variance: number;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface ProvinceData {
  provinces: ProvinceRate[];
  nationalRate: number;
  lastUpdated: string;
}
