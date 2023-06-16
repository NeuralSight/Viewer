// import { ServicesManager } from '@ohif/core';
/**
 * TODO: use this instead of edit longitudinal
 * ToolbarModule should provide a list of tool buttons that will be available in OHIF
 * for Modes to consume and use in the toolbar. Each tool button is defined by
 * {name, defaultComponent, clickHandler }. Examples include radioGroupIcons and
 * splitButton toolButton that the default extension is providing.
 */
export default function getToolbarModule({
  servicesManager,
  commandsManager,
  extensionManager,
}) {
  // return [
  //   {
  //     name: 'AIProbe',
  //     id: 'AIProbe',
  //     type: 'ohif.action',
  //     props: {
  //       type: 'action',
  //       icon: 'tool-ai-probe',
  //       label: 'AIProbe',
  //       commands: [
  //         {
  //           commandName: 'showUploadViewportModal',
  //           commandOptions: {},
  //           context: 'NEURALSIGHT',
  //         },
  //       ],
  //     },
  //   },
  // ];
  // const { toolbarService } = (servicesManager as ServiceManger).services;
  // toolbarService.init(extensionManager);
  // toolbarService.addButtons(toolButtons);
  // toolbarService.createButtonSection('primary', ['AIProbe']);
}
