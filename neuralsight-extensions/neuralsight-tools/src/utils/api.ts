import { AnyObject, PostImageType } from '../../data';
import {
  changeObjToFormData,
  changeObjToFormUrlencoded,
} from './changeObjToFormData';

// trying with orthanc

const NeuralSightBackend = '/api/v1/patient/dicom'; //TODO: should be in an enironment
const Dicom = `https://orthanc.neuralsight.ai/studies/`;
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

// post and predict a patient dicom images
export const postPatientStudy = async ({
  patientID,
  file,
}: PostImageType): Promise<AnyObject> => {
  const response = await fetch(
    `https://backend.neuralsight.ai${NeuralSightBackend}/pred  `,
    {
      method: 'POST',
      body: changeObjToFormData({
        file,
        username,
        password,
        file_refence: patientID,
      }),
    }
  );
  return response;
};

// get studies info
export const getStudyInfoFromImageId = async (
  id: string
): Promise<AnyObject> => {
  console.log('DICOMWeb', Dicom + id);
  const response = await fetch(`${Dicom}${id}`);
  return response;
};
