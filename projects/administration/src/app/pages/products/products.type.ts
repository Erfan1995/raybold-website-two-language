export interface IProduct {
  id: number;
  title: string;
  link: string;
  language: string;
}

export interface IProductFile {
  product_id: number;
  file: any;
  isMainFile: boolean;
  path: string;
  id: number;
}
