import React, { useState, useEffect } from 'react';
import Title from '../../components/ai-panel-title';
import Select from '../../components/select-ai-model';
import data from '../../utils/model-test-data.json';
import { SelectType } from '../../../data';
import ListItem from '../../components/item-listing';

import { setStorageItem, getStorageItem } from '../../utils/localStorageAccess';

const SELECTED_MODEL = 'selected_model';

//FIXME: alternative use a localstorage with expiry
type Props = {};
const AISettings = (props: Props) => {
  const id = 'model';
  let modelValues: SelectType[] = [];

  for (let i = 0; i < data.length; i++) {
    let modelObj: SelectType = {
      value: data[i].model_name,
      label: data[i].model_name,
    };
    modelValues = [...modelValues, modelObj];
  }
  const [modelValue, setModelValue] = useState<SelectType | null>(null);

  const handleModelSelected = (value: SelectType) => {
    console.log('value', value);
    setModelValue(value);
    setStorageItem(SELECTED_MODEL, value);
  };

  useEffect(() => {
    let currentData: SelectType = getStorageItem(SELECTED_MODEL);
    setModelValue(() => currentData);
  }, [setModelValue]);
  const currentModel = data.find(
    model => model.model_name === modelValue?.label
  );
  const keys = Object.keys(currentModel || {});

  return (
    <div className="text-white">
      <Title title="model specifications" />
      <div className="w-full mt-4 space-y-3">
        <Select
          selectData={modelValues}
          value={modelValue}
          id={id}
          onChange={handleModelSelected}
          labelText={'Available AI Models'}
        />
        <div>
          {modelValue && currentModel ? (
            <table
              className="border-collapse border-spacing-y-4 border-spacing-x-1 border border-secondary-light table-auto"
              aria-label="model-specifications"
            >
              <tbody>
                {keys.map((key, index) => (
                  <ListItem
                    paddingX="px-3"
                    paddingY="py-1"
                    key={key + index}
                    label={key.replace(/_/g, ' ')}
                    value={currentModel[key]?.replace(/_/g, ' ')}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <p className=" w-full text-lg capitalize text-blue-300">
              select a model
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettings;
