import React, { useEffect, useState, useRef, ChangeEvent } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Typography,
  Input,
  Tooltip,
  IconButton,
  Icon,
  Select,
  InputLabelWrapper,
  Button,
} from '@ohif/ui';

const FILE_TYPE_OPTIONS = [
  {
    value: 'jpg',
    label: 'jpg',
  },
  {
    value: 'png',
    label: 'png',
  },

  // add option for checking dicom files
  // {
  //   value: 'dicom',
  //   label: '',
  // },
];

const DEFAULT_FILENAME = 'image';

const REFRESH_VIEWPORT_TIMEOUT = 100;

type Props = {
  activeViewportElement?: Element;
  onClose: any;
  updateViewportPreview?: any;
  enableViewport?: any;
  disableViewport?: any;
  loadImage?: any;
  uploadImage: any;
  defaultSize?: number;
  minimumSize?: number;
  maximumSize?: number;
  canvasClass?: string;
};

const UploadImageForm = ({
  activeViewportElement,
  onClose,
  updateViewportPreview,
  enableViewport,
  disableViewport,
  loadImage,
  uploadImage,
  defaultSize,
  canvasClass,
}: Props): React.ReactNode => {
  const { t } = useTranslation('Modals');

  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  interface AnyObject {
    [key: string]: any;
  }
  interface BooleanObject extends AnyObject {
    [key: string]: boolean;
  }

  //  update this file errors increase
  type ErrorTypes = 'filename' | 'size' | 'format';

  const [error, setError] = useState<BooleanObject>({
    filename: false,
    size: false,
    format: false,
  });

  const hasError = Object.values(error).includes(true);

  const refreshViewport = useRef(null);

  // parameters will go here
  const upload = () => {
    uploadImage();
  };

  const error_messages = {
    filename: 'No file selected.',
    size: 'size cannot exceed 100mbs.',
    format: 'format allowed are JPG, PNG, DICOM only!',
  };

  const renderErrorHandler = (errorType: ErrorTypes) => {
    if (!error[errorType]) {
      return null;
    }

    return (
      // Type errors due to required defaults why not put defaults?
      <Typography className="pl-1 mt-2" color="error">
        {error_messages[errorType]}
      </Typography>
    );
  };

  // Image preview
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // check if the user as selected the right size
    if (e.target.files[0].size > 10000000) {
      setSelectedFile(undefined);
      renderErrorHandler('size');
    }
    // get the first file only
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div>
      <Typography variant="h6">{t('Please select a CT image.')}</Typography>

      <div className="mt-4 ml-2">
        <input
          id="file"
          type="file"
          className="mr-2"
          onChange={handleSelectFile}
        />
        {/* render file error messages */}
        {renderErrorHandler('filesize')}
        {renderErrorHandler('filename')}
        {renderErrorHandler('format')}
        {renderErrorHandler('zip')}
      </div>

      <div className="mt-8">
        <div
          className="p-4 rounded bg-secondary-dark border-secondary-primary"
          data-cy="image-preview"
        >
          <Typography variant="h5">{t('Image preview')}</Typography>

          {/* we can use the active viewport later if the docto ant the images on the view port probed*/}
          {/* {!activeViewportElement && (
            <Typography className="mt-4">
              {t('Active viewport has no displayed image')}
            </Typography>
          )} */}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          data-cy="cancel-btn"
          variant="outlined"
          size="initial"
          color="black"
          border="secondary"
          onClick={onClose}
          className="p-2"
        >
          {t('Cancel')}
        </Button>
        <Button
          className="ml-2"
          disabled={hasError}
          onClick={upload}
          color="primary"
          data-cy="download-btn"
        >
          {t('Upload')}
        </Button>
      </div>
    </div>
  );
};

export default UploadImageForm;
