import {
  CommandsManager,
  ExtensionManager,
  ServicesManager,
} from '@ohif/core/src';
import React, { useState } from 'react';
import { getStorageItemWithExpiry } from '../../utils/localStorageAccess';
import LoginForm from '../../components/LoginForm';

type Props = {
  servicesManager: ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
};

export default function LoginPage({
  servicesManager,
  commandsManager,
  extensionManager,
}: Props) {
  const [authToken, setAuthToken] = useState<string | null>(
    getStorageItemWithExpiry('token') || null
  );
  return (
    <div className="h-full w-full">
      <LoginForm
        isOpen={true}
        servicesManager={servicesManager}
        setAuthToken={setAuthToken}
      />
    </div>
  );
}
