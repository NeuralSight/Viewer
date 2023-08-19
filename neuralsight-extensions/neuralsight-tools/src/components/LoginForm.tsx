import React, {
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Button, ButtonEnums, Typography, Input, Modal } from '@ohif/ui/src';
import {
  ServicesManager,
  ExtensionManager,
  CommandsManager,
} from '@ohif/core/src';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { AuthUser, Details } from '../../data';
import { loginUser } from '../utils/api';

import { setStorageItemWithExpiry } from '../utils/localStorageAccess';

type Props = {
  servicesManager: ServicesManager;
  extensionManager?: ExtensionManager;
  commandsManager?: CommandsManager;
  isOpen: boolean;
  shouldCloseOnEsc?: boolean;
  setAuthToken: Dispatch<SetStateAction<null | string>>;
};

const LoginForm = (props: Props): ReactElement => {
  type ErrorTypes = 'email' | 'detail' | 'password' | 'server';
  type Error = Record<ErrorTypes, boolean>;
  const IntialErrorState: Error = {
    email: false,
    password: false,
    server: false,
    detail: false,
  };
  useEffect(() => {
    const { userAuthenticationService } = props.servicesManager.services;
    // const {
    //   getAuthorizationHeader,
    //   getUser,
    //   setUser,
    //   reset,
    //   setServiceImplementation,
    // } = userAuthenticationService;
  }, []);

  const [error, setError] = useState<Error>(IntialErrorState);
  const [serverErr, setServerErr] = useState<{ detail: string }>();
  const hasError = Object.values(error).includes(true);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [remember, setIsRemembered] = useState(false);
  const { t } = useTranslation();
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    // check if the email and password
    if (!email.includes('@')) {
      setError(initState => ({
        ...initState,
        email: true,
      }));
    } else {
      setError(initState => ({
        ...initState,
        email: false,
      }));
    }

    if (password.length < 6) {
      setError(initState => ({
        ...initState,
        password: true,
      }));
    } else {
      setError(initState => ({
        ...initState,
        email: false,
      }));
    }
    // login here
    const authDetails: AuthUser = {
      username: email,
      password: password,
    };
    try {
      const data = await loginUser(authDetails);
      if (data.access_token) {
        //This the recommended way of passing auth token though doesnot work
        // setServiceImplementation({
        //   getAuthorizationHeader: () => ({
        //     Authorization: 'Bearer ' + data.access_token,
        //   }),
        // // });
        // getAuthorizationHeader(data.access_token);
        //FIXME alternatively store in the sessionStorage of which both are not secure
        setStorageItemWithExpiry(
          'token',
          data.access_token,
          30 * 1000 * 60 * 60 //time of the token to expire and get deleted
        );
        props.setAuthToken(data.access_token);
      } else {
        const error = { detail: 'token was not found' };
        throw error;
      }
    } catch (error) {
      console.error('error', error);
      setError(initState => ({
        ...initState,
        server: true,
      }));
      setServerErr(error);
    }
    setIsLoading(false);
  };
  const renderErrorHandler = (
    errorType: ErrorTypes,
    errorDetails?: Details[],
    errorMessage?: string
  ) => {
    const error_messages: Record<ErrorTypes, string | null> = {
      email: 'email is required',
      password: 'password must be more than 6 characters',
      detail: null,
      server: 'incorrect password or email, try again!',
    };

    if (!error[errorType]) {
      return null;
    }
    if (error['detail']) {
      const errorMsgArr = errorDetails as Details[];

      console.error('errorMsgArr', errorMsgArr);
      return (
        // Type errors due to required defaults why not put defaults?
        <div className="flex flex-col gap-2">
          {errorMsgArr.map((err: Details, index: number) => (
            <Typography className="pl-1 my-2" color="error" key={index}>
              {t(`${index}). ErrorType: ${err.type}, Details:${err.msg}`)}
            </Typography>
          ))}
        </div>
      );
    }
    return (
      // Type errors due to required defaults why not put defaults?
      <Typography className="pl-1 mt-2" color="error">
        {t(errorMessage || error_messages[errorType])}
      </Typography>
    );
  };

  // Timeout for errors
  React.useEffect(() => {
    setTimeout(() => {
      setError(IntialErrorState);
    }, 30000);
  }, [IntialErrorState, setError]);

  return (
    <div className="max-w-md">
      <Modal
        isOpen={props.isOpen}
        shouldCloseOnEsc={props.shouldCloseOnEsc || false}
        shouldCloseOnOverlayClick={false}
        // title={t('Login To NeuralSightViewer')}
      >
        <form onSubmit={handleLogin} className="px-12 py-8 space-y-4">
          <div className="flex flex-col space-y-2 text-center justify-center w-full items-center">
            {/* Inputs */}
            {/* Logo section */}
            <div className="rounded-full w-16 h-16 border border-slate-500/50 p-1 flex items-center justify-center">
              <Logo />
            </div>
            {/* Welcome Text */}
            <h3 className="text-4xl tracking-widest text-slate-900">
              {t('Hello Again!')}
            </h3>
            {/* Description Text */}
            <p className="text-base lowercase text-slate-400">
              {t(' Welcome back, please enter your details')}
            </p>
          </div>
          {renderErrorHandler('server', undefined, serverErr?.detail)}
          <div className="justify-center items-center space-y-1">
            <Input
              labelClassName=""
              label={t('email')}
              id="email"
              name="email"
              type="email"
              className=""
              onChange={({ target }) => setEmail(target.value)}
            />
            {renderErrorHandler('email')}
          </div>
          <div className="justify-center items-center space-y-1">
            <Input
              labelClassName=""
              label={t('password')}
              id="password"
              name="password"
              type="password"
              className=""
              onChange={({ target }) => setPassword(target.value)}
            />
            {renderErrorHandler('password')}
          </div>
          <div className="w-full flex justify-between px-4 items-center">
            <div></div>
            <a href={`${process.env.REACT_APP_FRONTEND_URL}/auth/reset`}>
              <p className="cursor-pointer font-medium text-sm lg:text-base lowercase text-primary-light hover:text-primary-dark transition-all duration-200 ">
                {t('forgot password?')}
              </p>
            </a>
          </div>

          <div className="flex justify-center items-center">
            <Button
              className=" w-full"
              disabled={email.length < 1 || password.length < 6}
              size={ButtonEnums.size.medium}
              type={ButtonEnums.type.primary}
              name={'upload'}
            >
              {isLoading ? t('Logging In...') : t('Login')}
            </Button>
          </div>
        </form>
        <div className="mt-6 px-10">
          <p className="text-sm lg:text-base text-slate-400 font-medium">
            {t('Want to give it a try? ')}
            <a href="mailto:info@neurallabs.africa?subject=Request Of A Demo &body=i would like to request a demo">
              <span className="cursor-pointer capitalize text-primary-light hover:text-primary-dark transition-all duration-200">
                {t('Request a Demo')}
              </span>
            </a>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default LoginForm;
