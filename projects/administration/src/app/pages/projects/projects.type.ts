export interface IProject {
  id: number;
  title: string;
  link: string;
  service_id: number;
}

export interface IProjectFile {
  project_id: number;
  file: any;
  isMainFile: boolean;
  path: string;
  id: number;
}
