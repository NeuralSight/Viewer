import {
  AiResultError,
  AiResultType,
  AnyObject,
  AIModelInfoType,
  PostImageType,
} from '../../data';
import {
  changeObjToFormData,
  changeObjToFormUrlencoded,
} from './changeObjToFormData';

//if not specified use the defaults;
const NeuralSightBackend = `${process.env.REACT_APP_API_URL}/api/v1/patient`;
const Dicom = process.env.REACT_APP_ORTHANC_URL;

//TOFIX: remove this when not need again
const username = 'asdas';
const password = 'asdasd';

// const headers = new Headers({
//   AcceptEncoding: 'gzip, deflate, br',
//   // AcceptLanguage: "en-US,en;q=0.9"
//   CacheControl: 'no-cache',
//   Connection: 'keep-alive',
//   // ContentLength: 527946,
//   Cookie: 'i18next=en-US',
//   Host: 'localhost:8042',
// });

export const postPatientStudy = async ({
  patientID,
  file,
}: PostImageType): Promise<AnyObject> => {
  const response = await fetch(`${NeuralSightBackend}/dicom/pred  `, {
    method: 'POST',
    body: changeObjToFormData({
      file,
      username,
      password,
      file_refence: patientID,
    }),
  });
  return response;
};

export const getStudyInfoFromImageId = async (
  id: string
): Promise<AnyObject> => {
  console.log('DICOMWeb', Dicom + id);
  const response = await fetch(`${Dicom}/studies/${id}`);
  return response;
};

export const getAIPredResultForStudy = async ({
  uuid,
}: {
  uuid: string;
}): Promise<AiResultType> => {
  const response = await fetch(
    `${NeuralSightBackend}/dicom/{dicom_uuid}?uuid=${uuid}`
  );
  const data = await response.json();
  if (response.status === 200 || response.status === 201) {
    return data as AiResultType;
  } else {
    const error = data as AiResultError;
    throw error;
  }
};

export const postAiModelSetting = async ({
  modelID,
}: {
  modelID: string;
}): Promise<AIModelInfoType[]> => {
  const response = await fetch(`${NeuralSightBackend}/models`, {
    method: 'POST',
    body: changeObjToFormData({
      modelID,
    }),
  });
  const data = await response.json();
  if (response.status === 200 || response.status === 201) {
    return data as AIModelInfoType[];
  } else {
    const error = data as AiResultError;
    throw error;
  }
};
