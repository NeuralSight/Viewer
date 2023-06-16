import {
  changeObjToFormData,
  changeObjToFormUrlencoded,
} from './changeObjToFormData';

// TODO: send data to backend

// trying with orthanc

const Uri = 'http://3.237.22.171/api/v1/patient/dicom';
const DICOM = '/dicom-web';

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
export const postPatientStudy = async ({ patientId, file }) => {
  const response = await fetch(`${Uri}/instances`, {
    method: 'POST',
    body: file,
  });
  return response;
};

// get studies info
export const getStudyInfoFromImageId = async (id: string) => {
  const response = await fetch(`${Uri}/studies/${id}`);
  return response;
};