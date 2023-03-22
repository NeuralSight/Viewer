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
}
