import LoginModal from './modals/LoginModal';
import {
  CommandsManager,
  ExtensionManager,
  ServicesManager,
} from '@ohif/core/src';

type Props = {
  servicesManager: ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
};

export default function getCustomizationModule({
  servicesManager,
  extensionManager,
}: Props) {
  return {
    id: 'auth',
    routes: [
      {
        path: '/auth',
        children: LoginModal,
      },
    ],
  };
}
