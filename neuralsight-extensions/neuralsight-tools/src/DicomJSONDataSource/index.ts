import { DicomMetadataStore, IWebApiDataSource } from '@ohif/core';
import OHIF from '@ohif/core';

const metadataProvider = OHIF.classes.MetadataProvider;

//TODO:-> FINISH THIS
// https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6
export function createDicomJSONApi(dicomJsonConfig, userAuthenticationService) {
  const {
    qidoRoot,
    wadoRoot,
    enableStudyLazyLoad,
    supportsFuzzyMatching,
    supportsWildcard,
    supportsReject,
    staticWado,
    singlepart,
  } = dicomJsonConfig;

  const qidoConfig = {
    url: qidoRoot,
    staticWado,
    singlepart,
    headers: userAuthenticationService.getAuthorizationHeader(),
    errorInterceptor: errorHandler.getHTTPErrorHandler(),
  };

  const wadoConfig = {
    url: wadoRoot,
    staticWado,
    singlepart,
    headers: userAuthenticationService.getAuthorizationHeader(),
    errorInterceptor: errorHandler.getHTTPErrorHandler(),
  };
  const implementation = {
    /* Implement this fxn */
    query,
    retrieve,
    store,
    reject,
    parseRouteParams,
    deleteStudyMetadataPromise,
    getImageIdsForDisplaySet,
    getImageIdsForInstance,
  };
  return IWebApiDataSource.create(implementation);
}
