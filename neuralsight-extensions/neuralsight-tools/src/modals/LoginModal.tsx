import React, { Dispatch, ReactElement, SetStateAction } from 'react';
import LoginForm from '../components/LoginForm';
import {
  ServicesManager,
  ExtensionManager,
  CommandsManager,
} from '@ohif/core/src';

type Props = {
  isOpen: boolean;
  setAuthToken: Dispatch<SetStateAction<null | string>>;
  managers?: {
    servicesManager: ServicesManager;
    extensionManager?: ExtensionManager;
    commandsManager?: CommandsManager;
  };
};

const LoginModal = (props: Props): ReactElement => {
  return (
    <LoginForm
      {...props.managers}
      isOpen={props.isOpen}
      setAuthToken={props.setAuthToken}
    />
  );
};

export default LoginModal;
