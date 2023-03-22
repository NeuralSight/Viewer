import AiReport from './panel/AiReport';
import AISettings from './panel/AiSettings';
/* * PanelModule should provide a list of panels that will be available in OHIF
 * for Modes to consume and render. Each panel is defined by a {name,
 * iconName, iconLabel, label, component} object. Example of a panel module
 * is the StudyBrowserPanel that is provided by the default extension in OHIF.
 */
function getPanelModule({
  servicesManager,
  commandsManager,
  extensionManager,
}) {
  return [
    {
      name: 'aiReport',
      iconName: 'ai-report',
      iconLabel: 'AI Report',
      label: 'AI findings',
      component: AiReport,
    },
    {
      name: 'aiSettings',
      iconName: 'ai-setting',
      iconLabel: 'AI Setting',
      label: 'AI settings',
      component: AISettings,
    },
  ];
}
export default getPanelModule;
