import React from 'react';
import Title from '../../components/ai-panel-title';

type Props = {
  commandsManager: object;
  extensionManager: object;
  servicesManager: object;
};

const AIReport = (props: Props): React.ReactNode => {
  return (
    <div className="text-white">
      <Title title="ai Findings" />
    </div>
  );
};

export default AIReport;
