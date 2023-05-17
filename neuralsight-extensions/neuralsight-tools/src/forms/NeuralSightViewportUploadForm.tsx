//TODO: clean the code

import React, { useEffect, useState } from 'react';
import {
  Enums,
  getEnabledElement,
  getOrCreateCanvas,
  StackViewport,
  VolumeViewport,
} from '@cornerstonejs/core';
import { ToolGroupManager } from '@cornerstonejs/tools';
import PropTypes from 'prop-types';

import UploadImageForm from '../components/UploadImageForm';
import { postPatientStudy } from '../utils/api';
import { getEnabledElement as OHIFgetEnabledElement } from '@ohif/extension-cornerstone/src/state';

const DEFAULT_SIZE = 512;
const MAX_TEXTURE_SIZE = 10000;
const VIEWPORT_ID = 'neuralsight-viewport-upload-form';

type Props = {
  onClose: any;
  activeViewportIndex: number;
  cornerstoneViewportService: any;
};

const NeuralSightViewportUploadForm = ({
  onClose,
  activeViewportIndex,
  cornerstoneViewportService,
}: Props) => {
  const enabledElement = OHIFgetEnabledElement(activeViewportIndex);
  const activeViewportElement = enabledElement?.element;
  const activeViewportEnabledElement = getEnabledElement(activeViewportElement);

  const {
    viewportId: activeViewportId,
    renderingEngineId,
  } = activeViewportEnabledElement;

  const toolGroup = ToolGroupManager.getToolGroupForViewport(
    activeViewportId,
    renderingEngineId
  );

  const toolModeAndBindings = Object.keys(toolGroup?.toolOptions || {}).reduce(
    (acc, toolName) => {
      const tool = toolGroup?.toolOptions[toolName];
      const { mode, bindings } = tool;

      return {
        ...acc,
        [toolName]: {
          mode,
          bindings,
        },
      };
    },
    {}
  );

  useEffect(() => {
    return () => {
      Object.keys(toolModeAndBindings).forEach(toolName => {
        const { mode, bindings } = toolModeAndBindings[toolName];
        toolGroup?.setToolMode(toolName, mode, { bindings });
      });
    };
  }, []);

  const enableViewport = viewportElement => {
    if (viewportElement) {
      const { renderingEngine, viewport } = getEnabledElement(
        activeViewportElement
      );

      const viewportInput = {
        viewportId: VIEWPORT_ID,
        element: viewportElement,
        type: viewport.type,
        defaultOptions: {
          background: viewport.defaultOptions.background,
          orientation: viewport.defaultOptions.orientation,
        },
      };

      renderingEngine.enableElement(viewportInput);
    }
  };

  const disableViewport = viewportElement => {
    if (viewportElement) {
      const { renderingEngine } = getEnabledElement(viewportElement);
      return new Promise(resolve => {
        renderingEngine.disableElement(VIEWPORT_ID);
      });
    }
  };

  const updateViewportPreview = (
    uploadViewportElement,
    internalCanvas,
    fileType
  ) =>
    new Promise(resolve => {
      const enabledElement = getEnabledElement(uploadViewportElement);

      const { viewport: uploadViewport, renderingEngine } = enabledElement;

      // Note: Since any trigger of dimensions will update the viewport,
      // we need to resize the offScreenCanvas to accommodate for the new
      // dimensions, this is due to the reason that we are using the GPU offScreenCanvas
      // to render the viewport for the uploadViewport.
      renderingEngine.resize();

      // Trigger the render on the viewport to update the on screen
      uploadViewport.render();

      uploadViewportElement.addEventListener(
        Enums.Events.IMAGE_RENDERED,
        function updateViewport(event) {
          const enabledElement = getEnabledElement(event.target);
          const { viewport } = enabledElement;
          const { element } = viewport;

          const downloadCanvas = getOrCreateCanvas(element);

          const type = 'image/' + fileType;
          const dataUrl = downloadCanvas.toDataURL(type, 1);

          let newWidth = element.offsetHeight;
          let newHeight = element.offsetWidth;

          if (newWidth > DEFAULT_SIZE || newHeight > DEFAULT_SIZE) {
            const multiplier = DEFAULT_SIZE / Math.max(newWidth, newHeight);
            newHeight *= multiplier;
            newWidth *= multiplier;
          }

          resolve({ dataUrl, width: newWidth, height: newHeight });

          uploadViewportElement.removeEventListener(
            Enums.Events.IMAGE_RENDERED,
            updateViewport
          );
        }
      );
    });

  const loadImage = (activeViewportElement, viewportElement, width, height) =>
    new Promise(resolve => {
      if (activeViewportElement && viewportElement) {
        const activeViewportEnabledElement = getEnabledElement(
          activeViewportElement
        );

        if (!activeViewportEnabledElement) {
          return;
        }

        const { viewport } = activeViewportEnabledElement;

        const renderingEngine = cornerstoneViewportService.getRenderingEngine();
        const uploadViewport = renderingEngine.getViewport(VIEWPORT_ID);

        if (uploadViewport instanceof StackViewport) {
          const imageId = viewport.getCurrentImageId();
          const properties = viewport.getProperties();

          uploadViewport.setStack([imageId]).then(() => {
            uploadViewport.setProperties(properties);

            const newWidth = Math.min(width || image.width, MAX_TEXTURE_SIZE);
            const newHeight = Math.min(
              height || image.height,
              MAX_TEXTURE_SIZE
            );

            resolve({ width: newWidth, height: newHeight });
          });
        } else if (uploadViewport instanceof VolumeViewport) {
          const actors = viewport.getActors();
          // uploadViewport.setActors(actors);
          actors.forEach(actor => {
            uploadViewport.addActor(actor);
          });

          uploadViewport.setCamera(viewport.getCamera());
          uploadViewport.render();

          const newWidth = Math.min(width || image.width, MAX_TEXTURE_SIZE);
          const newHeight = Math.min(height || image.height, MAX_TEXTURE_SIZE);

          resolve({ width: newWidth, height: newHeight });
        }
      }
    });

  // Todo: REMOVE
  // toggle annotations
  const toggleAnnotations = (
    toggle,
    viewportElement,
    activeViewportElement
  ) => {
    const activeViewportEnabledElement = getEnabledElement(
      activeViewportElement
    );

    const uploadViewportElement = getEnabledElement(viewportElement);

    const {
      viewportId: activeViewportId,
      renderingEngineId,
    } = activeViewportEnabledElement;
    const { viewportId: uploadViewportId } = uploadViewportElement;

    if (!activeViewportEnabledElement || !uploadViewportElement) {
      return;
    }

    const toolGroup = ToolGroupManager.getToolGroupForViewport(
      activeViewportId,
      renderingEngineId
    );

    // add the viewport to the toolGroup
    toolGroup.addViewport(uploadViewportId);

    Object.keys(toolGroup._toolInstances).forEach(toolName => {
      // make all tools Enabled so that they can not be interacted with
      // in the download viewport
      if (toggle && toolName !== 'Crosshairs') {
        try {
          toolGroup.setToolEnabled(toolName);
        } catch (e) {
          console.log(e);
        }
      } else {
        toolGroup.setToolDisabled(toolName);
      }
    });
  };

  return (
    <UploadImageForm
      onClose={onClose}
      defaultSize={DEFAULT_SIZE}
      canvasClass={'cornerstone-canvas'}
      activeViewportElement={activeViewportElement}
      enableViewport={enableViewport}
      disableViewport={disableViewport}
      updateViewportPreview={updateViewportPreview}
      loadImage={loadImage}
      // to get the function from utils
      uploadImage={postPatientStudy}
    />
  );
};

NeuralSightViewportUploadForm.propTypes = {
  onClose: PropTypes.func,
  activeViewportIndex: PropTypes.number.isRequired,
};

export default NeuralSightViewportUploadForm;
