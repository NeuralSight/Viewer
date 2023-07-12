import { ServicesManager } from '@ohif/core';
import NeuralSightViewportUploadForm from './modals/NeuralSightViewportUploadModal';

/**
 * CommandsModule should provide a list of commands that will be available in OHIF
 * for Modes to consume and use in the viewports. Each command is defined by
 * an object of { actions, definitions, defaultContext } where actions is an
 * object of functions, definitions is an object of available commands, their
 * options, and defaultContext is the default context for the command to run against.
 */
function getCommandsModule({
  servicesManager,
  commandsManager,
  extensionManager,
}) {
  // const { t } = useTranslation('Modals');
  const {
    viewportGridService,
    toolGroupService,
    cineService,
    toolbarService,
    uiDialogService,
    cornerstoneViewportService,
    hangingProtocolService,
    uiNotificationService,
    uiModalService,
  } = (servicesManager as ServicesManager).services;

  return {
    definitions: {
      showUploadViewportModal: {
        commandFn: () => {
          // viewportGridService gets the active ViewPort
          const { activeViewportIndex } = viewportGridService.getState();
          //

          if (uiModalService) {
            uiModalService.show({
              title: 'Upload Image for AI probing',
              content: NeuralSightViewportUploadForm,
              contentProps: {
                activeViewportIndex,
                onClose: uiModalService.hide,
                cornerstoneViewportService,
              },
            });
          }
        },
        options: {
          // command options comes
        },
        context: 'NEURALSIGHT', // optional
      },
    },
    // defaultContext: 'ACTIVE_VIEWPORT::DICOMSR',
  };
}

export default getCommandsModule;
