import React from 'react';
import {
  CommandsManager,
  ExtensionManager,
  ServicesManager,
} from '@ohif/core/src';
import LoginPage from './pages/auth';

type Props = {
  servicesManager: ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
};

export default function getCustomizationModule({
  servicesManager,
  extensionManager,
}: Props) {
  return [
    {
      name: 'loginPage',
      value: {
        id: 'customRoutes',
        routes: [
          {
            path: '/auth',
            children: LoginPage,
          },
        ],
      },
    },
    {
      name: 'customWorklistHeaderComponent',
      value: {
        id: 'worklistHeaderComponent',
        uiType: 'uiType',
        content: function() {
          // if (this.condition && !this.condition(props)) return null;

          // const { instance } = props;
          // const value =
          //   instance && this.attribute
          //     ? instance[this.attribute]
          //     : this.contentF && typeof this.contentF === 'function'
          //     ? this.contentF(props)
          //     : null;
          // if (!value) return null;

          return (
            <span
              className="overlay-item flex flex-row"
              style={{ color: 'gold' }}
              title={this.title || 'header'}
            >
              {/* {this.label && (
                <span className="mr-1 shrink-0">{this.label}</span>
              )} */}
              rIGHT HEADER CUSTOM
              {/* <span className="font-light">{value}</span> */}
            </span>
          );
        },
      },
    },
  ];
}
