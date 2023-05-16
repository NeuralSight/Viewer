import { DicomMetadataStore, IWebApiDataSource } from '@ohif/core';
import { mapParams } from './qido';
export function createDicomWebApi(dicomWebConfig, userAuthenticationService) {
  const {
    qidoRoot,
    wadoRoot,
    enableStudyLazyLoad,
    supportsFuzzyMatching,
    supportsWildcard,
    supportsReject,
    staticWado,
    singlepart,
  } = dicomWebConfig;

  const qidoDicomWebClient = staticWado
    ? new StaticWadoClient(qidoConfig)
    : new api.DICOMwebClient(qidoConfig);
  console.log('qidoDicomWebClient', qidoDicomWebClient);

  const wadoDicomWebClient = staticWado
    ? new StaticWadoClient(wadoConfig)
    : new api.DICOMwebClient(wadoConfig);

  const implementation = {
    /* Implement this fxn */
    query: {
      studies: {
        mapParams: mapParams.bind(),
        search: async (orginParam: any) => {
          const headers = userAuthenticationService.getAuthorizationHeader();
        },
      },
    },
    retrieve: {},
    store: {},
    reject: {},
    parseRouteParams: {},
    deleteStudyMetadataPromise: {},
    getImageIdsForDisplaySet: {},
    getImageIdsForInstance: {},
  };
  return IWebApiDataSource.create(
    /*Api implementations */
    implementation
  );
}
