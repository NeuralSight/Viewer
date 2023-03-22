import React, {
  useCallback,
  useEffect,
  useState,
  createRef,
  useRef,
  ChangeEvent,
} from 'react';
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

  // const [filename, setFilename] = useState(DEFAULT_FILENAME);
  // const [fileType, setFileType] = useState(['jpg']);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | undefined>();

  // const [dimensions, setDimensions] = useState({
  //   width: defaultSize,
  //   height: defaultSize,
  // });

  // const [showAnnotations, setShowAnnotations] = useState(true);

  // const [keepAspect, setKeepAspect] = useState(true);
  // const [aspectMultiplier, setAspectMultiplier] = useState({
  //   width: 1,
  //   height: 1,
  // });

  // const [viewportElement, setViewportElement] = useState();
  // const [viewportElementDimensions, setViewportElementDimensions] = useState({
  //   width: defaultSize,
  //   height: defaultSize,
  // });

  // const [downloadCanvas, setDownloadCanvas] = useState({
  //   ref: createRef(),
  //   width: defaultSize,
  //   height: defaultSize,
  // });

  // const [viewportPreview, setViewportPreview] = useState({
  //   src: null,
  //   width: defaultSize,
  //   height: defaultSize,
  // });

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

  // const onKeepAspectToggle = () => {
  //   const { width, height } = dimensions;
  //   const aspectMultiplier = { ...aspectMultiplier };
  //   if (!keepAspect) {
  //     const base = Math.min(width, height);
  //     aspectMultiplier.width = width / base;
  //     aspectMultiplier.height = height / base;
  //     setAspectMultiplier(aspectMultiplier);
  //   }

  //   setKeepAspect(!keepAspect);
  // };

  // parameters will go here
  const upload = () => {
    uploadImage();
  };

  // const onDimensionsChange = (value, dimension) => {
  //   const oppositeDimension = dimension === 'height' ? 'width' : 'height';
  //   const sanitizedTargetValue = value.replace(/\D/, '');
  //   const isEmpty = sanitizedTargetValue === '';
  //   const newDimensions = { ...dimensions };
  //   const updatedDimension = isEmpty
  //     ? ''
  //     : Math.min(sanitizedTargetValue, maximumSize);

  //   if (updatedDimension === dimensions[dimension]) {
  //     return;
  //   }

  //   newDimensions[dimension] = updatedDimension;

  //   if (keepAspect && newDimensions[oppositeDimension] !== '') {
  //     newDimensions[oppositeDimension] = Math.round(
  //       newDimensions[dimension] * aspectMultiplier[oppositeDimension]
  //     );
  //   }

  //   // In current code, keepAspect is always `true`
  //   // And we always start w/ a square width/height
  //   setDimensions(newDimensions);

  //   // Only update if value is non-empty
  //   if (!isEmpty) {
  //     setViewportElementDimensions(newDimensions);
  //     setDownloadCanvas(state => ({
  //       ...state,
  //       ...newDimensions,
  //     }));
  //   }
  // };

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

  // const validSize = useCallback(
  //   value => (value >= minimumSize ? value : minimumSize),
  //   [minimumSize]
  // );

  // const loadAndUpdateViewports = useCallback(async () => {
  //   const { width: scaledWidth, height: scaledHeight } = await loadImage(
  //     activeViewportElement,
  //     viewportElement,
  //     dimensions.width,
  //     dimensions.height
  //   );

  //   // toggleAnnotations(showAnnotations, viewportElement, activeViewportElement);

  //   const scaledDimensions = {
  //     height: validSize(scaledHeight),
  //     width: validSize(scaledWidth),
  //   };

  //   setViewportElementDimensions(scaledDimensions);
  //   // setDownloadCanvas(state => ({
  //   //   ...state,
  //   //   ...scaledDimensions,
  //   // }));

  //   const {
  //     dataUrl,
  //     width: viewportElementWidth,
  //     height: viewportElementHeight,
  //   } = await updateViewportPreview(
  //     viewportElement,
  //     downloadCanvas.ref.current,
  //     fileType
  //   );

  //   setViewportPreview(state => ({
  //     ...state,
  //     src: dataUrl,
  //     width: validSize(viewportElementWidth),
  //     height: validSize(viewportElementHeight),
  //   }));
  // }, [
  //   loadImage,
  //   activeViewportElement,
  //   viewportElement,
  //   dimensions.width,
  //   dimensions.height,
  //   toggleAnnotations,
  //   // showAnnotations,
  //   validSize,
  //   updateViewportPreview,
  //   downloadCanvas.ref,
  //   fileType,
  // ]);

  // useEffect(() => {
  //   // enableViewport(viewportElement);

  //   // return () => {
  //   //   disableViewport(viewportElement);
  //   // };
  // }, [disableViewport, enableViewport, viewportElement]);

  // useEffect(() => {
  //   if (refreshViewport.current !== null) {
  //     clearTimeout(refreshViewport.current);
  //   }

  //   refreshViewport.current = setTimeout(() => {
  //     refreshViewport.current = null;
  //     // loadAndUpdateViewports();
  //   }, REFRESH_VIEWPORT_TIMEOUT);
  // }, [
  //   activeViewportElement,
  //   viewportElement,
  //   // showAnnotations,
  //   dimensions,
  //   loadImage,
  //   toggleAnnotations,
  //   updateViewportPreview,

  //   minimumSize,
  //   maximumSize,
  //   loadAndUpdateViewports,
  // ]);

  // useEffect(() => {
  //   const { width, height } = dimensions;
  //   const hasError = {
  //     width: width < minimumSize,
  //     height: height < minimumSize,
  //     filename: !filename,
  //   };

  //   setError({ ...hasError });
  // }, [dimensions, filename, minimumSize]);

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
      </div>

      <div className="flex flex-col mt-6">
        <div className="flex">
          {/* <div className="w-1/4 pl-6 ml-6 border-l border-secondary-dark">
            <div>
              <InputLabelWrapper
                sortDirection="none"
                label={t('File Type')}
                isSortable={false}
                onLabelClick={() => {}}
              >
                <Select
                  className="mt-2 text-white"
                  isClearable={false}
                  value={fileType}
                  data-cy="file-type"
                  onChange={value => {
                    setFileType([value.value]);
                  }}
                  hideSelectedOptions={false}
                  options={FILE_TYPE_OPTIONS}
                  placeholder="File Type"
                />
              </InputLabelWrapper>
            </div>
            <div className="mt-4 ml-2">
              <label htmlFor="show-annotations" className="flex items-center">
                <input
                  id="show-annotations"
                  data-cy="show-annotations"
                  type="checkbox"
                  className="mr-2"
                  checked={showAnnotations}
                  onChange={event => setShowAnnotations(event.target.checked)}
                />
                <Typography>{t('Show Annotations')}</Typography>
              </label>
            </div>
          </div> */}
        </div>
      </div>

      <div className="mt-8">
        <div
          className="p-4 rounded bg-secondary-dark border-secondary-primary"
          data-cy="image-preview"
        >
          <Typography variant="h5">{t('Image preview')}</Typography>
          {/* {activeViewportElement && (
            <div
              className="mx-auto my-2"
              style={{
                height: viewportElementDimensions.height,
                width: viewportElementDimensions.width,
              }}
              ref={ref => setViewportElement(ref)}
            ></div>
          )} */}
          <img
            alt="No preview"
            src={preview}
            className="mx-auto my-2"
            style={{
              maxHeight: defaultSize,
              width: 'auto',
            }}
          />

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
