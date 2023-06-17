import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
};

const Title = ({ title }: Props) => {
  const { t } = useTranslation('Titles');
  return (
    <div className="flex justify-between px-2 py-1 bg-secondary-main">
      <span className="text-sm font-thin tracking-widest text-white uppercase">
        {t(title)}
      </span>
    </div>
  );
};

export default Title;
