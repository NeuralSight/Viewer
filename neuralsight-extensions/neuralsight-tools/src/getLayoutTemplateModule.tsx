import ViewerLayout from './ViewerLayout';
/*
TODO: Use this instead of OHIF extension one
- Define layout for the viewer in mode configuration.
- Pass in the viewport types that can populate the viewer.
- Init layout based on the displaySets and the objects.
*/

export default function({
  servicesManager,
  extensionManager,
  commandsManager,
  hotkeysManager,
}) {
  function ViewerLayoutWithServices(props) {
    return ViewerLayout({
      servicesManager,
      extensionManager,
      commandsManager,
      hotkeysManager,
      ...props,
    });
  }

  return [
    {
      name: 'neuralsightLayout',
      id: 'neuralsightLayout',
      component: ViewerLayoutWithServices,
    },
  ];
}
