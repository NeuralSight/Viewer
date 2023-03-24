interface ModelInfoDataType {
  model_name: string;
  organ: string;
  modality: string;
  task: string;
  data_desc: string | null;
  model_desc: string | null;
  additional_info_required: null | string;
  model_performance: string;
  website: string | null;
  citation: string | null;
  version: string;
}
export type UniqueModelInfoDataType = {
  [model_name in keyof ModelInfoDataType]-?: ModelInfoDataType[model_name] extends Omit<
    ModelInfoDataType,
    model_name
  >[Exclude<keyof ModelInfoDataType, model_name>]
    ? unknown
    : never;
};

export interface SelectType {
  value: string;
  label: string;
}
