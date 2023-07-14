import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  label: string;
  title: string;
  paddingX:
    | 'px-0'
    | 'px-0.5'
    | 'px-1'
    | 'px-1.5'
    | 'px-2'
    | 'px-3'
    | 'px-4'
    | 'px-5'
    | 'px-6'
    | 'pl-0'
    | 'pl-0.5'
    | 'pl-1'
    | 'pl-1.5'
    | 'pl-2'
    | 'pl-3'
    | 'pl-4'
    | 'pl-5'
    | 'pl-6'
    | 'pr-0'
    | 'pr-0.5'
    | 'pr-1'
    | 'pr-1.5'
    | 'pr-2'
    | 'pr-3'
    | 'pr-4'
    | 'pr-5'
    | 'pr-6';
  paddingY:
    | 'py-0'
    | 'py-0.5'
    | 'py-1'
    | 'py-1.5'
    | 'py-2'
    | 'py-3'
    | 'py-4'
    | 'py-5'
    | 'py-6'
    | 'pt-0'
    | 'pt-0.5'
    | 'pt-1'
    | 'pt-1.5'
    | 'pt-2'
    | 'pt-3'
    | 'pt-4'
    | 'pt-5'
    | 'pt-6'
    | 'pb-0'
    | 'pb-0.5'
    | 'pb-1'
    | 'pb-1.5'
    | 'pb-2'
    | 'pb-3'
    | 'pb-4'
    | 'pb-5'
    | 'pb-6';
  valueClass?: string;
  labelClass?: string;
};

const ListItem = ({
  value,
  label,
  paddingX,
  paddingY,
  title,
  valueClass = '',
  labelClass = '',
}: Props): ReactElement => {
  const { t } = useTranslation();
  return (
    <tr className="border border-secondary-light">
      <td
        title={title}
        className={`${labelClass}trucate ... text-blue-300 text-xs font-medium whitespace-normal ${paddingX} ${paddingY}`}
        style={{ verticalAlign: 'top' }}
      >
        {t(label)}
      </td>
      <td
        className={`${valueClass} text-common-bright text-xs ${paddingX} ${paddingY}`}
      >
        {t(value)}
      </td>
    </tr>
  );
};

export default ListItem;
