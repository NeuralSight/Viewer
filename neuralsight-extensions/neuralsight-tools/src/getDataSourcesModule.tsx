import { createDicomWebApi } from './DicomWebDataSource/index.js';
import { createDicomJSONApi } from './DicomJSONDataSource/index.js';

/**
 * TODO: Fetch data from server
 * DataSourceModule should provide a list of data sources to be used in OHIF.
 * DataSources can be used to map the external data formats to the OHIF's
 * native format. DataSources are defined by an object of { name, type, createDataSource }.
 */
export default function getDataSourcesModule({
  servicesManager,
  commandsManager,
  extensionManager,
}) {
  return [
    {
      name: 'neuralsightdicomweb',
      type: 'webApi',
      createDataSource: createDicomWebApi,
    },
    {
      name: 'neuralsightdicomjson',
      type: 'jsonApi',
      createDataSource: createDicomJSONApi,
    },
  ];
}
