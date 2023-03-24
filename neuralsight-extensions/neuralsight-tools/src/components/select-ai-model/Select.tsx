import React from 'react';
import { Select } from '@ohif/ui';
import { SelectType } from '../../../data';

type Props = {
  selectData: SelectType[];
  onChange: (value: SelectType) => void;
  value: SelectType | null;
  id: string;
};

const SelectModels = ({ selectData, onChange, value, id }: Props) => {
  return (
    <div>
      <Select
        id={id}
        isClearable={false}
        onChange={onChange}
        options={selectData}
        menuPlacement="auto"
        value={value}
        placeholder={'Select Model...'}
      />
    </div>
  );
};

export default SelectModels;
