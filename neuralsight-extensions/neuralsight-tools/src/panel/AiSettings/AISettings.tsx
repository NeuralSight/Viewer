import React, { useState, useId } from 'react';
import Title from '../../components/ai-panel-title';
import Select from '../../components/select-ai-model';
import data from '../../utils/model-test-data.json';
import { SelectType, UniqueModelInfoDataType } from '../../../data';

import { setStorageItem, getStorageItem } from '../../utils/localStorageAccess';

const SELECTED_MODEL = 'selected_model';

type Props = {};
const AISettings = (props: Props) => {
  const id = 'model';
  let modelNames: SelectType[] = [];
  for (let i = 0; i < data.length; i++) {
    let modelObj: SelectType = {
      value: data[i].model_name,
      label: data[i].model_name,
    };
    modelNames = [...modelNames, modelObj];
  }
  const currentModel = modelNames.find(
    model => getStorageItem(SELECTED_MODEL).model_name === model.label
  );
  console.log('currentModel', currentModel);

  console.log('modelsName', modelNames);
  const [modelName, setModelName] = useState<SelectType | null>(modelNames[0]);
  const handleModelSelected = (value: SelectType) => {
    console.log('value', value);
    setModelName(value);
    setStorageItem(
      SELECTED_MODEL,
      data.find(item => item.model_name === value.label)
    );
  };
  return (
    <div className="text-white">
      <Title title="settings" />
      <div className="w-full mt-4">
        <Select
          selectData={modelNames}
          value={modelName}
          id={id}
          onChange={handleModelSelected}
        />
      </div>
    </div>
  );
};

export default AISettings;
