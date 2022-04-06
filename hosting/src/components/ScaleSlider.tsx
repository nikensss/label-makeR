import { Slider, Typography } from '@material-ui/core';
import { ChangeEvent } from 'react';

type ScaleSliderTypes = {
  onChangeScale: (value: number) => void;
};
export const ScaleSlider = ({ onChangeScale }: ScaleSliderTypes) => {
  const onChange = (event: ChangeEvent<{ name?: string }>, value: number | number[]) => {
    if (typeof value !== 'number') return;
    onChangeScale(reScaleValue(value));
  };

  // This is meant to translate a human-friendly number to a tech-ready value
  const reScaleValue = (value: number): number => {
    return (value + 101) / 415;
  };

  return (
    <>
      <Typography>Logo Size</Typography>
      <Slider
        defaultValue={1}
        min={-100}
        max={100}
        step={1}
        valueLabelDisplay='auto'
        onChange={onChange}
      />
    </>
  );
};
