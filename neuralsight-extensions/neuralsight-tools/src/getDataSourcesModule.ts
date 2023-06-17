import { createDicomWebApi } from './DicomWebDataSource';
import { createDicomJSONApi } from './DicomJSONDataSource';
import { createDicomLocalApi } from './DicomLocalDataSource';

/**
 * //TODO:-> Fetch data from server
 * DataSourceModule should provide a list of data sources to be used in OHIF.
 * DataSources can be used to map the external data formats to the OHIF's
 * native format. DataSources are defined by an object of { name, type, createDataSource }.
 */
export default function getDataSourcesModule({
  servicesManager,
  commandsManager,
  extensionManager,
}) {
  const userAuthenticationService =
    servicesManager.services.userAuthenticationService;
  console.log('userAuthenticationService', userAuthenticationService);
  return [
    {
      name: 'dicomweb',
      type: 'webApi',
      createDataSource: createDicomWebApi,
    },
    {
      name: 'dicomjson',
      type: 'jsonApi',
      createDataSource: createDicomJSONApi,
    },
    {
      name: 'dicomlocal',
      type: 'localApi',
      createDataSource: createDicomLocalApi,
    },
  ];
}

//   return [
//     {
//       name: 'NeuralSightBack',
//       wadoUriRoot: 'https://myserver.com/wado', // replace with neuralsight.backend or frontend's backend i guess i will try with the frontend's one what wado , qido
//       qidoRoot: 'https://myserver.com/qido',
//       wadoRoot: 'https://myserver.com/wado',
//       imageRendering: 'wadouri',
//       thumbnailRendering: 'wadouri',
//       requestOptions: {
//         headers: {
//           Authorization: `Bearer ${ACCESS_TOKEN}`, //How does this access token get here
//         },
//       },
//     },
//   ];
