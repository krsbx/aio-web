export type DetailedExportJson = {
  types: string;
  require?: string;
  import?: string;
};

export type ExportJson = DetailedExportJson | string;
