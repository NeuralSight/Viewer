
// THIS FILE IS AUTOGENERATED AS PART OF THE EXTENSION AND MODE PLUGIN PROCESS.
// IT SHOULD NOT BE MODIFIED MANUALLY 
const extensions = [];
const modes = [];

// Not required any longer
window.extensions = extensions;
window.modes = modes;

extensions.push("@ohif/extension-default");
extensions.push("@ohif/extension-cornerstone");
extensions.push("extension-neuralsight-tools");
modes.push("@ohif/mode-longitudinal");
modes.push("@ohif/mode-tmtv");
modes.push("@ohif/mode-microscopy");
modes.push("custom-viewer");


// Add a dynamic runtime loader
async function loadModule(module) {
  if (typeof module !== 'string') return module;
  if( module==="@ohif/extension-default") {
    const imported = await import("@ohif/extension-default");
    return imported.default;
  }
  if( module==="@ohif/extension-cornerstone") {
    const imported = await import("@ohif/extension-cornerstone");
    return imported.default;
  }
  if( module==="@ohif/extension-measurement-tracking") {
    const imported = await import("@ohif/extension-measurement-tracking");
    return imported.default;
  }
  if( module==="@ohif/extension-cornerstone-dicom-sr") {
    const imported = await import("@ohif/extension-cornerstone-dicom-sr");
    return imported.default;
  }
  if( module==="@ohif/extension-cornerstone-dicom-seg") {
    const imported = await import("@ohif/extension-cornerstone-dicom-seg");
    return imported.default;
  }
  if( module==="@ohif/extension-dicom-microscopy") {
    const imported = await import("@ohif/extension-dicom-microscopy");
    return imported.default;
  }
  if( module==="@ohif/extension-dicom-pdf") {
    const imported = await import("@ohif/extension-dicom-pdf");
    return imported.default;
  }
  if( module==="@ohif/extension-dicom-video") {
    const imported = await import("@ohif/extension-dicom-video");
    return imported.default;
  }
  if( module==="@ohif/extension-tmtv") {
    const imported = await import("@ohif/extension-tmtv");
    return imported.default;
  }
  if( module==="@ohif/extension-test") {
    const imported = await import("@ohif/extension-test");
    return imported.default;
  }
  if( module==="@ohif/extension-cornerstone-dicom-rt") {
    const imported = await import("@ohif/extension-cornerstone-dicom-rt");
    return imported.default;
  }
  if( module==="extension-neuralsight-tools") {
    const imported = await import("extension-neuralsight-tools");
    return imported.default;
  }
  if( module==="@ohif/mode-longitudinal") {
    const imported = await import("@ohif/mode-longitudinal");
    return imported.default;
  }
  if( module==="@ohif/mode-tmtv") {
    const imported = await import("@ohif/mode-tmtv");
    return imported.default;
  }
  if( module==="@ohif/mode-microscopy") {
    const imported = await import("@ohif/mode-microscopy");
    return imported.default;
  }
  if( module==="@ohif/mode-test") {
    const imported = await import("@ohif/mode-test");
    return imported.default;
  }
  if( module==="@ohif/mode-basic-dev-mode") {
    const imported = await import("@ohif/mode-basic-dev-mode");
    return imported.default;
  }
  if( module==="custom-viewer") {
    const imported = await import("custom-viewer");
    return imported.default;
  }
  return (await import(module)).default;
}

// Import a list of items (modules or string names)
// @return a Promise evaluating to a list of modules
export default function importItems(modules) {
  return Promise.all(modules.map(loadModule));
}

export { loadModule, modes, extensions, importItems };

