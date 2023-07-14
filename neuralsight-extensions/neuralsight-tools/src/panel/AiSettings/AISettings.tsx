import React, { useState, useEffect } from 'react';
import Title from '../../components/ai-panel-title';
import Select from '../../components/select-ai-model';
// import data from '../../utils/model-test-data.json';TODO:REMOVE THIS AND TEST DATAS
import { AiResultError, AIModelInfoType, SelectType } from '../../../data';
import ListItem from '../../components/item-listing';
import { useTranslation } from 'react-i18next';
import { Typography } from '@ohif/ui/src';
import {
  CommandsManager,
  ExtensionManager,
  ServicesManager,
} from '@ohif/core/src';
import { setStorageItem, getStorageItem } from '../../utils/localStorageAccess';
import { postAiModelSetting } from '../../utils/api';

const SELECTED_MODEL = 'selected_model';
const REGEX_REPLACE_SPACE = [/_/g, ' '];

//FIXME: alternative use a localstorage with expiry
type Props = {
  servicesManager: ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
};

enum AIModelInfoEnum {
  model_id = 'Model ID',
  model_name = 'Model name',
  organ = 'Organ',
  modality = 'Modality',
  task = 'Task',
  data_desc = 'Data description',
  model_desc = 'Model description',
  additional_info_required = 'Additional info required',
  model_performance = 'Model performance',
  website = 'Website',
  citation = 'Citation',
  version = 'Version',
  active = 'Active Model',
}

const AISettings = (props: Props) => {
  const { t } = useTranslation();
  // TODO remove duplicates btwn model id and model value
  const [modelID, setModelID] = useState<string>('');
  const [AIModelInfo, setAIModelInfo] = useState<AIModelInfoType[]>([]);
  const [error, setError] = useState<AiResultError>();
  const [modelValue, setModelValue] = useState<SelectType | null>(null);

  const handleAiSettings = async () => {
    try {
      const data = await postAiModelSetting({ modelID });
      console.log('data', data);
      setAIModelInfo(data);
    } catch (error) {
      console.log('error', error);
      setError(error);
    }
  };

  const id = 'model';
  let modelValues: SelectType[] = [];

  for (let i = 0; i < AIModelInfo.length; i++) {
    const modelObj: SelectType = {
      value: AIModelInfo[i].model_name,
      label: AIModelInfo[i].model_name, //FIXME: replace model_name with model_id once unique
    };
    modelValues = [...modelValues, modelObj];
  }

  const handleModelSelected = (value: SelectType) => {
    console.log('VALUE', value);
    setModelID(value.label);
    setModelValue(value);
    setStorageItem(SELECTED_MODEL, value);
  };

  useEffect(() => {
    handleAiSettings();
    const currentData: SelectType = getStorageItem(SELECTED_MODEL);
    console.log('currentData', currentData);
    setModelValue(() => currentData);
  }, [setModelValue]);
  const currentModel = AIModelInfo.find(
    model => model.model_name === modelValue?.label //FIXME: use model_id instead
  );

  const keys = Object.keys(currentModel || {});

  return (
    <div className="text-white">
      <Title title="model specifications" />
      <div className="w-full mt-4 space-y-3">
        {error && (
          <Typography className="pl-1 my-2" color="error">
            {t(`ErrorMessage: ${error.detail}`)}
          </Typography>
        )}
        <Select
          selectData={modelValues}
          value={modelValue}
          id={id}
          onChange={handleModelSelected}
          labelText={'Available AI Models'}
        />
        <div className="overflow-x-auto">
          {modelValue && currentModel ? (
            <table
              className="border-collapse border-spacing-y-4 border-spacing-x-1 border border-secondary-light table-auto overflow-x-auto"
              aria-label="model-specifications"
            >
              <col style={{ width: '20%' }} />

              <col style={{ width: '80%' }} />
              {/* <tbody> */}
              {keys.map((key, index) => (
                <ListItem
                  paddingX="px-3"
                  paddingY="py-1"
                  key={key + index}
                  label={key}
                  title={AIModelInfoEnum[key]}
                  value={currentModel && currentModel[key]}
                />
              ))}
              {/* </tbody> */}
            </table>
          ) : (
            <p className=" w-full text-lg capitalize text-blue-300">
              {t('select a model')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISettings;
