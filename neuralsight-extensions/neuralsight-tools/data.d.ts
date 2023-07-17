interface AnyObject {
  [key: string]: any;
}

interface AIModelInfoType {
  model_id: string;
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
  active: boolean;
}

export type UniqueAIModelInfoType = {
  [model_name in keyof AIModelInfoType]-?: AIModelInfoType[model_name] extends Omit<
    AIModelInfoType,
    model_name
  >[Exclude<keyof AIModelInfoType, model_name>]
    ? unknown
    : never;
};

export interface SelectType {
  value: string;
  label: string;
}
//upload error and success responses
export type OrthancServerErrorData = {
  Details: string;
  HttpError: string;
  HttpStatus: number;
  Message: string;
  Method: string;
  OrthancError: string;
  OrthancStatus: number;
  Uri: string;
};
export interface OrthancServerSuccessData {
  ID: string;
  ParentPatient: string;
  ParentSeries: string;
  ParentStudy: string;
  Path: string;
  Status: 'AlreadyStored' | 'Success';
}

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

export type Details = {
  loc: string[] | number[];
  msg: string;
  type: string;
};

export type ServerResultFormat = {
  uploaded_details: OrthancServerSuccessData;
  predicted_details: OrthancServerSuccessData;
  results: AnyObject[];
};
export type PostImageType = {
  patientID: string;
  file: File | undefined;
};

export type MenuOptionType = {
  title: string;
  icon: string;
  onClick: () => any;
};
export type AiResultError = {
  detail: string;
};
// type Pathogens =
//   | 'Cardiomegaly'
//   | 'Aortic enlargement'
//   | 'Pleural thickening'
//   | 'ILD'
//   | 'Nodule/Mass'
//   | 'Pulmonary fibrosis'
//   | 'Lung Opacity'
//   | 'Atelectasis'
//   | 'Other lesion'
//   | 'Infiltration'
//   | 'Pleural effusion'
//   | 'Calcification'
//   | 'Consolidation'
//   | 'Pneumothorax';

export enum Pathogen {
  Cardiomegaly = 'Cardiomegaly',
  AorticEnlargement = 'Aortic enlargement',
  PleuralThickening = 'Pleural thickening',
  ILD = 'ILD',
  Nodule = 'Nodule/Mass',
  PulmonaryFibrosis = 'Pulmonary fibrosis',
  LungOpacity = 'Lung Opacity',
  Atelectasis = 'Atelectasis',
  OtherLesion = 'Other lesion',
  Inflitration = 'Infiltration',
  PleuralEffusion = 'Pleural effusion',
  Calcification = 'Calcification',
  Consolidation = 'Consolidation',
  Pneumothorax = 'Pneumothorax',
}

interface NameObjType extends AnyObject {
  [key: string]: Pathogen;
}
export type PredType = Record<Pathogen, number>;
export type AiResultType = {
  ID: string;
  ParentPatient: string;
  ParentSeries: string;
  ParentStudy: string;
  Path: string;
  results: {
    name: NameObjType;
    preds: PredType;
  };
};

export interface AuthUser {
  grant_type?: 'password' | string;
  username: string;
  password: string;
  scope?: '' | string | null | undefined;
  client_id?: string | null | undefined;
  client_secret?: string | null | undefined;
}

export type LoginType = {
  access_token: string;
  token_type: string;
};
