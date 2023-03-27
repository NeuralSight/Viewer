import React from 'react';
import Title from '../../components/ai-panel-title';
import ListItem from '../../components/item-listing/ListItem';
import testData from '../../utils/pathogen.json';

type Props = {
  commandsManager: object;
  extensionManager: object;
  servicesManager: object;
};

const AIReport = (props: Props): React.ReactNode => {
  return (
    <div className="text-white">
      <Title title="AI Findings" />
      <div className="w-full mt-4 space-y-3">
        {testData ? (
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
              {testData.map((data, index) => (
                <ListItem
                  key={index}
                  label={Object.keys(data)[0]}
                  value={`${data[Object.keys(data)[0]]?.percentage}%` || ''}
                  paddingX="px-3"
                  paddingY="py-3"
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
  );
};

export default AIReport;
