import React, { ReactElement } from 'react';

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
    | 'px-6';
  paddingY:
    | 'py-0'
    | 'py-0.5'
    | 'py-1'
    | 'py-1.5'
    | 'py-2'
    | 'py-3'
    | 'py-4'
    | 'py-5'
    | 'py-6';
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
  return (
    <tr className="border border-secondary-light">
      <td
        title={title}
        className={`${labelClass} truncate ... text-blue-300 text-xs font-medium whitespace-normal ${paddingX} ${paddingY}`}
        style={{ verticalAlign: 'top' }}
      >
        {label}
      </td>
      <td
        className={`${valueClass} text-common-bright text-xs  ${paddingX} ${paddingY}`}
      >
        {value}
      </td>
    </tr>
  );
};

export default ListItem;
