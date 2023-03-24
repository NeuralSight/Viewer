import React from 'react';

type Props = {
  value: string;
  label: string;
};

const ListItem = ({ value, label }: Props) => {
  return (
    <tr className="">
      <td className="text-blue-300  text-xs font-medium whitespace-normal">
        {label}
      </td>
      <td className="text-common-bright text-xs">{value}</td>
    </tr>
  );
};

export default ListItem;
