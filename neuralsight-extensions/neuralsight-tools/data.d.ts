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
//upload error and success responses
export type ServerErrorData = {
  Details: string;
  HttpError: string;
  HttpStatus: number;
  Message: string;
  Method: string;
  OrthancError: string;
  OrthancStatus: number;
  Uri: string;
};
export type ServerSuccessData = {
  ID: string;
  ParentPatient: string;
  ParentSeries: string;
  ParentStudy: string;
  Path: string;
  Status: 'AlreadyStored' | 'Success';
};

//study info data response
export type StudyInfoType = {
  ID: string;
  MainDicomTags: {
    AccessionNumber?: string;
    StudyDate?: string;
    StudyDescription?: string;
    StudyID?: string;
    StudyInstanceUID?: string;
    StudyTime?: string;
  };
  ParentPatient: string;
  Series: string[];
  Type: string;
};
