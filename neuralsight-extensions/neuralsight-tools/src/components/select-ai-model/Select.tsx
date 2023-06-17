import React from 'react';
import { Select } from '@ohif/ui';
import { SelectType } from '../../../data';

type Props = {
  selectData: SelectType[];
  onChange: (value: SelectType) => void;
  value: SelectType | null;
  id: string;
  labelText?: string;
};

const SelectModels = ({
  selectData,
  onChange,
  labelText,
  value,
  id,
}: Props) => {
  return (
    <div className="space-y-1">
      <label className="text-aqua-pale text-xs capitalize" htmlFor={id}>
        {labelText}
      </label>
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
