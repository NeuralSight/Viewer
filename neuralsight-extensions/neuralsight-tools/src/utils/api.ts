import {
  changeObjToFormData,
  changeObjToFormUrlencoded,
} from './changeObjToFormData';

// trying with orthanc

//FIXME: move url to env variables
const Uri = 'http://54.87.225.137'; 
const NeuralSightBackend = "/api/v1/patient/dicom"
const Dicom = `${Uri}:3000/dicom-web`
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
export const postPatientStudy = async ({ patientId, file }) => {
  const response = await fetch(`${Uri}${NeuralSightBackend}/pred  `, {
    method: 'POST',
    body: changeObjToFormData({
      file,
      username,
      password,
    }),
  });
  return response;
};

// get studies info
export const getStudyInfoFromImageId = async (path: string) => {
  console.log("DICOMWeb", Dicom)
  const response = await fetch(Dicom);
  return response;
};
