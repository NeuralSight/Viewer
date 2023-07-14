import React, { useEffect, useState } from 'react';
import Title from '../../components/ai-panel-title';
import ListItem from '../../components/item-listing/ListItem';
// import testData from '../../utils/pathogen.json'; TODO: REMOVE THIS AND TEST DATAS
import { useTranslation } from 'react-i18next';
import {
  CommandsManager,
  ExtensionManager,
  ServicesManager,
} from '@ohif/core/src';
import { getAIPredResultForStudy } from '../../utils/api';
import { AiResultError, AiResultType } from '../../../data';
import { Typography } from '@ohif/ui/src';
import { formatValueToPercentage } from '../../utils/FloatToPercentageString';

type Props = {
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
  servicesManager: ServicesManager;
};

const AIReport = (props: Props): React.ReactNode => {
  const { t } = useTranslation();

  // FIXME: use window object to get StudyInstanceUIDs but update and use ohig internal getter method if any instead incase the start using ssr
  const urlArr = document.baseURI.split('?');
  const URL = urlArr[0]; //Base Url
  const StudyInstanceUIDs = urlArr[1].split('=')[1]; //StudyInstanceUIDs
  const [id, setID] = useState(StudyInstanceUIDs);
  const [AIresult, setAIResult] = useState<AiResultType>();
  const [error, setError] = useState<AiResultError>();
  // do a get request here
  const handleGetResult = async () => {
    try {
      const data = await getAIPredResultForStudy({ uuid: id });
      setAIResult(data);
    } catch (error) {
      setError(error);
    }
  };

  // console.log('Airesult', AIresult?.results);
  // console.log('error', error);
  useEffect(() => {
    handleGetResult();
  }, []);

  return (
    <div className="text-white">
      <Title title="AI Findings" />
      <div className="w-full mt-4 space-y-3">
        {error && (
          <Typography className="pl-1 my-2" color="error">
            {t(`ErrorMessage: ${error.detail}`)}
          </Typography>
        )}
        {AIresult ? (
          <table
            className="border-collapse border-spacing-y-4 border-spacing-x-1 border border-secondary-light table-fixed w-full"
            aria-label="model-specifications"
          >
            <thead className="capitalize font-bold text-sm text-">
              <tr className="border border-secondary-light ">
                <td className="p-3">pathogens</td>
                <td className="p-3">percentage</td>
              </tr>
            </thead>
            <tbody>
              {AIresult?.results.preds &&
              Object.values(AIresult.results.preds).length > 0 ? (
                Object.keys(AIresult.results.preds).map((data, index) => (
                  <ListItem
                    key={data + index}
                    label={t(data)}
                    value={formatValueToPercentage(
                      AIresult.results.preds[data]
                    )}
                    paddingX="px-3"
                    paddingY="py-3"
                  />
                ))
              ) : (
                <tr className="border border-secondary-light">
                  <td
                    colSpan={2}
                    className="text-blue-300 text-sm font-medium whitespace-normal px-3 py-3"
                  >
                    {t('No problem incounter in this Study look okay 👍')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <p className=" w-full text-lg capitalize text-blue-300">
            {t('select a model and upload a image!')}
          </p>
        )}
      </div>
    </div>
  );
};

export default AIReport;
