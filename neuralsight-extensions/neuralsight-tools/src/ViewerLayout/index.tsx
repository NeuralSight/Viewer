import React, { useEffect, useState } from 'react';
import PropTypes, { any } from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
  removeItemFromStorage,
  getStorageItemWithExpiry,
} from '../utils/localStorageAccess';
import {
  SidePanel,
  ErrorBoundary,
  UserPreferences,
  useModal,
  LoadingIndicatorProgress,
  Button,
  ButtonEnums,
  Icon,
} from '@ohif/ui';
import i18n from '@ohif/i18n';
import {
  ServicesManager,
  HangingProtocolService,
  hotkeys,
  ExtensionManager,
  CommandsManager,
  HotkeysManager,
  UserAuthenticationService,
} from '@ohif/core/src';
import Header from '../components/Header/Header';
import AboutModal from '../components/AboutModal';
import NeuralSightViewportUploadModal from '../modals/NeuralSightViewportUploadModal';
import { useAppConfig } from '@state';
import Toolbar from '../Toolbar/Toolbar';
import LoginModal from '../modals/LoginModal';

const { availableLanguages, defaultLanguage, currentLanguage } = i18n;

type T = any;

type PropTypes = {
  extensionManager: ExtensionManager;
  servicesManager: ServicesManager;
  hotkeysManager: HotkeysManager;
  commandsManager: CommandsManager;
  viewports: any;
  ViewportGridComp: any;
  leftPanels: Array<T>;
  rightPanels: Array<T>;
  leftPanelDefaultClosed: boolean;
  rightPanelDefaultClosed: boolean;
};

function ViewerLayout({
  // From Extension Module Params
  extensionManager,
  servicesManager,
  hotkeysManager,
  commandsManager,
  // From Modes
  viewports,
  ViewportGridComp,
  leftPanels = [],
  rightPanels = [],
  leftPanelDefaultClosed = false,
  rightPanelDefaultClosed = false,
}: PropTypes): React.FunctionComponent {
  const [appConfig] = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const onClickReturnButton = () => {
    const { pathname } = location;
    const dataSourceIdx = pathname.indexOf('/', 1);
    // const search =
    //   dataSourceIdx === -1
    //     ? undefined
    //     : `datasources=${pathname.substring(dataSourceIdx + 1)}`;

    // Todo: Handle parameters in a better way.
    const query = new URLSearchParams(window.location.search);
    const configUrl = query.get('configUrl');

    const searchQuery = new URLSearchParams();
    if (dataSourceIdx !== -1) {
      searchQuery.append('datasources', pathname.substring(dataSourceIdx + 1));
    }

    if (configUrl) {
      searchQuery.append('configUrl', configUrl);
    }

    navigate({
      pathname: '/',
      search: decodeURIComponent(searchQuery.toString()),
    });
  };

  const { t } = useTranslation();
  const { show, hide } = useModal();

  const [showLoadingIndicator, setShowLoadingIndicator] = useState(
    appConfig.showLoadingIndicator
  );

  const {
    hangingProtocolService,
    viewportGridService,
    uiModalService,
    cornerstoneViewportService,
    userAuthenticationService,
  } = servicesManager.services;

  const { hotkeyDefinitions, hotkeyDefaults } = hotkeysManager;
  const versionNumber = process.env.VERSION_NUMBER;
  const commitHash = process.env.COMMIT_HASH;
  const { activeViewportIndex } = viewportGridService.getState();

  const menuOptions = [
    // {
    //   title: t('Header:AiProbe'),
    //   icon: 'tool-ai-probe',
    //   onClick: () => {
    //     show({
    //       content: NeuralSightViewportUploadModal,
    //       title: t('Upload Image for AI probing'),

    //       contentProps: {
    //         activeViewportIndex,
    //         onClose: uiModalService.hide,
    //         cornerstoneViewportService,
    //       },
    //     });
    //   },
    // },
    {
      title: t('Header:About'),
      icon: 'info',
      onClick: () =>
        show({
          content: AboutModal,
          title: 'About Neuralsight Viewer',
          contentProps: {
            versionNumber,
            commitHash,
          },
        }),
    },
    {
      title: t('Header:Preferences'),
      icon: 'settings',
      onClick: () =>
        show({
          title: t('UserPreferencesModal:User Preferences'),
          content: UserPreferences,
          contentProps: {
            hotkeyDefaults: hotkeysManager.getValidHotkeyDefinitions(
              hotkeyDefaults
            ),
            hotkeyDefinitions,
            currentLanguage: currentLanguage(),
            availableLanguages,
            defaultLanguage,
            onCancel: () => {
              hotkeys.stopRecord();
              hotkeys.unpause();
              hide();
            },
            onSubmit: ({ hotkeyDefinitions, language }) => {
              i18n.changeLanguage(language.value);
              hotkeysManager.setHotkeys(hotkeyDefinitions);
              hide();
            },
            onReset: () => hotkeysManager.restoreDefaultBindings(),
            hotkeysModule: hotkeys,
          },
        }),
    },
  ];

  //TODO: ENABLE THIS logout and login using OIDC
  if (appConfig.oidc) {
    menuOptions.push({
      title: t('Header:Logout'),
      icon: 'power-off',
      onClick: async () => {
        navigate(
          `/logout?redirect_uri=${encodeURIComponent(window.location.href)}`
        );
      },
    });
  }

  /**
   * Set body classes (tailwindcss) that don't allow vertical
   * or horizontal overflow (no scrolling). Also guarantee window
   * is sized to our viewport.
   */
  useEffect(() => {
    document.body.classList.add('bg-black');
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('bg-black');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const getComponent = id => {
    const entry = extensionManager.getModuleEntry(id);

    if (!entry) {
      throw new Error(
        `${id} is not a valid entry for an extension module, please check your configuration or make sure the extension is registered.`
      );
    }

    let content;
    if (entry && entry.component) {
      content = entry.component;
    } else {
      throw new Error(
        `No component found from extension ${id}. Check the reference string to the extension in your Mode configuration`
      );
    }

    return { entry, content };
  };

  const getPanelData = id => {
    const { content, entry } = getComponent(id);

    return {
      id: entry.id,
      iconName: entry.iconName,
      iconLabel: entry.iconLabel,
      label: entry.label,
      name: entry.name,
      content,
    };
  };

  useEffect(() => {
    userAuthenticationService.handleUnauthenticated();
    const { unsubscribe } = hangingProtocolService.subscribe(
      HangingProtocolService.EVENTS.PROTOCOL_CHANGED,

      // Todo: right now to set the loading indicator to false, we need to wait for the
      // hangingProtocolService to finish applying the viewport matching to each viewport,
      // however, this might not be the only approach to set the loading indicator to false. we need to explore this further.
      () => {
        setShowLoadingIndicator(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [hangingProtocolService]);

  const getViewportComponentData = viewportComponent => {
    const { entry } = getComponent(viewportComponent.namespace);

    return {
      component: entry.component,
      displaySetsToDisplay: viewportComponent.displaySetsToDisplay,
    };
  };

  const leftPanelComponents = leftPanels.map(getPanelData);
  const rightPanelComponents = rightPanels.map(getPanelData);
  const viewportComponents = viewports.map(getViewportComponentData);

  // TOFIX: remove this either user secure means to store on not store at all
  // const {
  //   getAuthorizationHeader,
  //   getUser,
  //   setUser,
  //   reset,
  //   setServiceImplementation,
  // } = servicesManager.services
  //   .userAuthenticationService as typeof UserAuthenticationService;
  // console.log('getUser()', getUser());
  useEffect(() => {
    setAuthToken(getStorageItemWithExpiry('token'));
  }, [setAuthToken]);

  // setServiceImplementation({
  //   getAuthorizationHeader: () => ({
  //     Authorization: 'Bearer ' + getStorageItemWithExpiry('token'),
  //   }),
  // });

  return (
    <div>
      <Header
        isSticky={true}
        menuOptions={menuOptions}
        isReturnEnabled={!!appConfig.showStudyList}
        onClickReturnButton={onClickReturnButton}
        WhiteLabeling={appConfig.whiteLabeling}
        rightSideItems={
          <>
            <Button
              type={ButtonEnums.type.primary}
              size={ButtonEnums.size.medium}
              className="mr-3 px-2"
              onClick={() => {
                show({
                  content: NeuralSightViewportUploadModal,
                  title: t('Upload Image for AI probing'),
                  contentProps: {
                    activeViewportIndex,
                    onClose: uiModalService.hide,
                    cornerstoneViewportService,
                  },
                });
              }}
            >
              <span className="mr-1">AI Predict</span>
              <Icon name="tool-ai-probe" className="h-5 w-5" />
            </Button>
            {/*TODO: Move logout functionality to be added*/}
            <Button
              type={ButtonEnums.type.secondary}
              size={ButtonEnums.size.medium}
              className="mr-3 px-2"
              onClick={() => {
                removeItemFromStorage('token');
                setAuthToken(null);
              }}
            >
              <span className="mr-1">Logout</span>
              <Icon name="power-off" className="h-5 w-5" />
            </Button>
          </>
        }
      >
        <ErrorBoundary context="Primary Toolbar">
          <div className="relative flex justify-center">
            <Toolbar servicesManager={servicesManager} />
          </div>
        </ErrorBoundary>
      </Header>
      <div
        className="bg-black flex flex-row items-stretch w-full overflow-hidden flex-nowrap relative"
        style={{
          height: 'calc(100vh - 52px',
        }}
      >
        <React.Fragment>
          {/*TODO: Once authentication works show this */}
          {authToken && (
            <LoginModal
              isOpen={!authToken}
              setAuthToken={setAuthToken}
              managers={{
                servicesManager,
                extensionManager,
                commandsManager,
              }}
            />
          )}

          {showLoadingIndicator && (
            <LoadingIndicatorProgress className="h-full w-full bg-black" />
          )}
          {/* LEFT SIDEPANELS */}
          {leftPanelComponents.length ? (
            <ErrorBoundary context="Left Panel">
              <SidePanel
                side="left"
                activeTabIndex={leftPanelDefaultClosed ? null : 0}
                tabs={leftPanelComponents}
                servicesManager={servicesManager}
              />
            </ErrorBoundary>
          ) : null}
          {/* TOOLBAR + GRID */}
          <div className="flex flex-col flex-1 h-full">
            <div className="flex items-center justify-center flex-1 h-full overflow-hidden bg-black relative">
              <ErrorBoundary context="Grid">
                <ViewportGridComp
                  servicesManager={servicesManager}
                  viewportComponents={viewportComponents}
                  commandsManager={commandsManager}
                />
              </ErrorBoundary>
            </div>
          </div>
          {rightPanelComponents.length ? (
            <ErrorBoundary context="Right Panel">
              <SidePanel
                side="right"
                activeTabIndex={rightPanelDefaultClosed ? null : 0}
                tabs={rightPanelComponents}
                servicesManager={servicesManager}
              />
            </ErrorBoundary>
          ) : null}
        </React.Fragment>
      </div>
    </div>
  );
}

export default ViewerLayout;
