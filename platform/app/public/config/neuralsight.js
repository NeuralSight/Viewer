const OrthancServer = 'https://orthanc.neuralsight.ai/dicom-web'; //FIXME: use env instead
const NeuralSightUrl = 'https://neuralsight.ai'; //FIXME: use env instead

window.config = {
  routerBasename: '/', //router base name
  // oidc: [
  //   {
  //     //     // ~ REQUIRED
  //     //     // Authorization Server URL
  //     //     authority: 'https://backend.neuralsight.ai', //neuralsight is the authority here
  //     //     client_id: 'ohif-viewer',
  //     //     redirect_uri: 'http://localhost:3000', // `OHIFStandaloneViewer.js` i think this where to redirect
  //     //     response_type: 'code', // "Authorization Code Flow"
  //     //     scope: '', // email profile openid
  //     //     // ~ OPTIONAL
  //     //     post_logout_redirect_uri: 'http://localhost:3000/auth',
  //   },
  // ],
  // whiteLabeling
  whiteLabeling: {
    createLogoComponentFn: function(React) {
      return React.createElement(
        'a',
        {
          target: '_self',
          rel: 'noopener noreferrer',
          className: 'line-through flex justify-center my-auto items-center',
          href: '',
        },
        React.createElement('img', {
          src: '../assets/Gif_Logo.gif',
          className: 'w-12 h-10',
        }),
        React.createElement(
          'div',
          {
            className:
              'text-common-light uppercase text-md font-normal h-full align-middle ',
          },
          'neuralsight'
        )
      );
    },
  },
  extensions: [],
  modes: [],
  customizationService: {
    loginPage: 'extension-neuralsight-tools.customizationModule.loginPage',
    // helloPage: '@ohif/extension-default.customizationModule.helloPage',
    // datasources: '@ohif/extension-default.customizationModule.datasources',

    // custom header
    worklistHeaderComponent:
      'extension-neuralsight-tools.customizationModule.customWorklistHeaderComponent',
  },
  showStudyList: true,
  // some windows systems have issues with more than 3 web workers
  maxNumberOfWebWorkers: 3,
  // below flag is for performance reasons, but it might not work for all servers
  omitQuotationForMultipartRequest: true,
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  maxNumRequests: {
    interaction: 100,
    thumbnail: 75,
    prefetch: 10,
  },
  // filterQueryParam: false,
  dataSources: [
    {
      friendlyName: 'dcmjs DICOMWeb Server',
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'dicomweb',
      configuration: {
        name: 'DCM4CHEE',
        // server
        wadoUriRoot: OrthancServer,
        qidoRoot: OrthancServer,
        wadoRoot: OrthancServer,
        qidoSupportsIncludeField: false,
        supportsReject: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: false,
        supportsWildcard: true,
        staticWado: true,
        singlepart: 'bulkdata,video,pdf',
        // whether the data source should use retrieveBulkData to grab metadata,
        // and in case of relative path, what would it be relative to, options
        // are in the series level or study level (some servers like series some study)
        bulkDataURI: {
          enabled: true,
          relativeResolution: 'studies',
        },
      },
    },
    {
      friendlyName: 'dicom json',
      namespace: '@ohif/extension-default.dataSourcesModule.dicomjson',
      sourceName: 'dicomjson',
      configuration: {
        name: 'json',
      },
    },
    {
      friendlyName: 'dicom local',
      namespace: '@ohif/extension-default.dataSourcesModule.dicomlocal',
      sourceName: 'dicomlocal',
      configuration: {},
    },
  ],
  httpErrorHandler: error => {
    // This is 429 when rejected from the public idc sandbox too often.
    const { request: xhr, response, status, statusCode } = error;
    const { responseType, statusText } = xhr;

    console.log('XHR', xhr);
    // In local files, status is 0 upon success in Firefox
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(
        'statusText: ' + statusText,
        // 'response: ' + response,
        'responseType: ' + responseType
      );
    } else {
      console.warn('Likely CORS error');
    }

    //WARNING
    console.warn(statusCode);

    //TODO: Could use services manager here to bring up a dialog/modal if needed.
    console.warn('test, navigate to https://ohif.org/');
    //TODO: alternatively if not authenticated the the user by bring a service manager here to bring up a login modal
    //Check if the httpErrorStatus is 403 and redirect to neuralsight check if token is available
    if (status === 403) {
      window.location.replace(`${document.baseURI.split('/')[0]}/auth`);
    }
    if (status === 401) {
      console.log('send response password');
      window.location.replace(`${document.baseURI.split('/')[0]}/auth`);
    }
  },
  defaultDataSourceName: 'dicomweb',
  hotkeys: [
    {
      commandName: 'incrementActiveViewport',
      label: 'Next Viewport',
      keys: ['right'],
    },
    {
      commandName: 'decrementActiveViewport',
      label: 'Previous Viewport',
      keys: ['left'],
    },
    { commandName: 'rotateViewportCW', label: 'Rotate Right', keys: ['r'] },
    { commandName: 'rotateViewportCCW', label: 'Rotate Left', keys: ['l'] },
    { commandName: 'invertViewport', label: 'Invert', keys: ['i'] },
    {
      commandName: 'flipViewportHorizontal',
      label: 'Flip Horizontally',
      keys: ['h'],
    },
    {
      commandName: 'flipViewportVertical',
      label: 'Flip Vertically',
      keys: ['v'],
    },
    { commandName: 'scaleUpViewport', label: 'Zoom In', keys: ['+'] },
    { commandName: 'scaleDownViewport', label: 'Zoom Out', keys: ['-'] },
    { commandName: 'fitViewportToWindow', label: 'Zoom to Fit', keys: ['='] },
    { commandName: 'resetViewport', label: 'Reset', keys: ['space'] },
    { commandName: 'nextImage', label: 'Next Image', keys: ['down'] },
    { commandName: 'previousImage', label: 'Previous Image', keys: ['up'] },
    // {
    //   commandName: 'previousViewportDisplaySet',
    //   label: 'Previous Series',
    //   keys: ['pagedown'],
    // },
    // {
    //   commandName: 'nextViewportDisplaySet',
    //   label: 'Next Series',
    //   keys: ['pageup'],
    // },
    {
      commandName: 'setToolActive',
      commandOptions: { toolName: 'Zoom' },
      label: 'Zoom',
      keys: ['z'],
    },
    // ~ Window level presets
    {
      commandName: 'windowLevelPreset1',
      label: 'W/L Preset 1',
      keys: ['1'],
    },
    {
      commandName: 'windowLevelPreset2',
      label: 'W/L Preset 2',
      keys: ['2'],
    },
    {
      commandName: 'windowLevelPreset3',
      label: 'W/L Preset 3',
      keys: ['3'],
    },
    {
      commandName: 'windowLevelPreset4',
      label: 'W/L Preset 4',
      keys: ['4'],
    },
    {
      commandName: 'windowLevelPreset5',
      label: 'W/L Preset 5',
      keys: ['5'],
    },
    {
      commandName: 'windowLevelPreset6',
      label: 'W/L Preset 6',
      keys: ['6'],
    },
    {
      commandName: 'windowLevelPreset7',
      label: 'W/L Preset 7',
      keys: ['7'],
    },
    {
      commandName: 'windowLevelPreset8',
      label: 'W/L Preset 8',
      keys: ['8'],
    },
    {
      commandName: 'windowLevelPreset9',
      label: 'W/L Preset 9',
      keys: ['9'],
    },
  ],
};
