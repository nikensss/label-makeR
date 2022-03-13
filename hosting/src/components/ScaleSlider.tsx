import { Slider, Typography } from '@material-ui/core';

type ScaleSliderTypes = {
  onChangeScale: (value: number) => void;
};
export default function ScaleSlider({ onChangeScale }: ScaleSliderTypes) {
  const onChange = (event: any, value: number | number[]) => {
    if (typeof value !== 'number') return;
    const scaledValue = (value + 101) / 415;
    onChangeScale(scaledValue);
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
}
