import { createStyles, Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import P5 from 'p5';
import { createRef, MutableRefObject, useEffect, useState } from 'react';

export interface LabelDesign {
  backgroundColor: string;
  font: string;
  logo: string;
  scale: number;
  text: string;
  x: number;
  y: number;
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '65%',
      height: '70%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      [theme.breakpoints.down('md')]: {
        width: '80%'
      },
      [theme.breakpoints.down('sm')]: {
        width: '95%'
      }
    },
    controls: {
      'width': '100%',
      'height': '100%',
      'display': 'flex',
      'justifyContent': 'center',
      'alignItems': 'center',
      'flexDirection': 'column',
      'borderColor': theme.palette.primary.main,
      'borderRadius': theme.spacing(1),
      'borderWidth': '1px',
      'borderStyle': 'solid',
      'padding': theme.spacing(2),
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    label: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    input: {
      display: 'none'
    }
  });

type LabelDesignerInput = {
  labelDesignRef: MutableRefObject<LabelDesign>;
  labelDesign: LabelDesign;
  setLabelDesign: React.Dispatch<React.SetStateAction<LabelDesign>>;
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  classes: ClassNameMap<string>;
};

export const LabelDesigner = withStyles(styles)(
  ({
    labelDesignRef,
    labelDesign,
    setLabelDesign,
    label,
    setLabel,
    classes
  }: LabelDesignerInput) => {
    const labelDimensions = { width: 380, height: 532 } as const;
    const canvasContainer = createRef<HTMLDivElement>();
    const [canvas, setCanvas] = useState<P5 | null>(null);

    const onChange = (key: keyof Pick<LabelDesign, 'x' | 'y' | 'scale'>) => {
      return (...args: unknown[]) => {
        const [, value] = args;
        if (typeof value !== 'number') return;
        setLabelDesign({ ...labelDesign, [key]: value });
      };
    };

    const onChangeX = onChange('x');
    const onChangeY = onChange('y');
    const onChangeScale = onChange('scale');
    const onBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const backgroundColor = event.target.value;
      setLabelDesign({ ...labelDesign, backgroundColor });
    };

    const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const scale = !event.target.value ? 0.25 : parseFloat(event.target.value);
      setLabelDesign({ ...labelDesign, scale });
    };

    const handleBlur = () => {
      if (labelDesign.scale < 0) setLabelDesign({ ...labelDesign, scale: 0 });
      if (labelDesign.scale > 5) setLabelDesign({ ...labelDesign, scale: 5 });
    };

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelDesign({ ...labelDesign, text: event.target.value });
    };

    const handleFontSelection = (event: SelectChangeEvent) => {
      setLabelDesign({ ...labelDesign, font: event.target.value });
    };

    const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const logo = e.target?.result;
        if (typeof logo !== 'string') {
          return setLabelDesign({ ...labelDesign, logo: '' });
        }
        setLabelDesign({ ...labelDesign, logo });
      };
      reader.readAsDataURL(file);
    };

    const sketch = (p5: P5) => {
      let img: P5.Element | null = null;

      p5.setup = () => {
        p5.createCanvas(labelDimensions.width, labelDimensions.height);
        p5.pixelDensity(2);
        img = p5.createImg(labelDesignRef.current.logo, '');
        img.hide();
      };

      p5.draw = () => {
        p5.background(labelDesignRef.current.backgroundColor);
        p5.noStroke();

        if (img) {
          const { width, height } = img.elt;
          const { x, y, scale } = labelDesignRef.current;
          p5.image(img, x, y, width * scale, height * scale);
        }

        p5.fill('white');
        p5.rect(0, 400, p5.width, p5.height - 400);
        p5.fill('black');
        p5.textSize(25);
        p5.textFont(labelDesignRef.current.font);
        p5.textAlign(p5.CENTER);
        p5.text(labelDesignRef.current.text, p5.width / 2, 450);

        const { canvas } = p5.get();
        const data = canvas.toDataURL();
        if (data !== label) setLabel(canvas.toDataURL());
      };
    };

    useEffect(() => {
      if (!canvasContainer.current) return;
      canvas?.remove();
      setCanvas(new P5(sketch, canvasContainer.current));
    }, [canvasContainer.current, labelDesign.logo]);

    return (
      <div className={classes.container}>
        <div className={classes.controls}>
          <div>
            <input
              accept='image/*'
              className={classes.input}
              id='contained-button-file'
              multiple
              type='file'
              onChange={onFile}
            />
            <label htmlFor='contained-button-file'>
              <Button
                startIcon={<ImageIcon />}
                variant='contained'
                color='primary'
                component='span'
              >
                <Typography>Upload logo</Typography>
              </Button>
            </label>
          </div>
          <Typography>Horizontal position</Typography>
          <Slider
            value={labelDesign.x}
            min={0}
            max={canvas?.width || labelDimensions.width}
            onChange={onChangeX}
            aria-labelledby='continuous-slider'
          />
          <Typography>Vertical position</Typography>
          <Slider
            value={labelDesign.y}
            min={0}
            max={canvas?.height || labelDimensions.height}
            onChange={onChangeY}
            aria-labelledby='continuous-slider'
          />
          <Typography>Scale</Typography>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs>
              <Slider
                value={labelDesign.scale}
                min={0}
                max={5}
                step={0.01}
                onChange={onChangeScale}
                aria-labelledby='continuous-slider'
              />
            </Grid>
            <Grid item>
              <Input
                value={labelDesign.scale}
                margin='dense'
                onChange={handleScaleChange}
                onBlur={handleBlur}
                inputProps={{
                  'step': 0.01,
                  'min': 0,
                  'max': 5,
                  'type': 'number',
                  'aria-labelledby': 'input-slider'
                }}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth>
            <InputLabel>Font</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={labelDesign.font}
              label='Font'
              onChange={handleFontSelection}
              style={{ fontFamily: labelDesignRef.current.font }}
            >
              <MenuItem value={'Source Code Pro'} style={{ fontFamily: 'Source Code Pro' }}>
                Source Code Pro
              </MenuItem>
              <MenuItem value={'Montserrat'} style={{ fontFamily: 'Montserrat' }}>
                Montserrat
              </MenuItem>
              <MenuItem value={'Oswald'} style={{ fontFamily: 'Oswald' }}>
                Oswald
              </MenuItem>
              <MenuItem value={'Roboto Slab'} style={{ fontFamily: 'Roboto Slab' }}>
                Roboto Slab
              </MenuItem>
              <MenuItem value={'Zen Old Mincho'} style={{ fontFamily: 'Zen Old Mincho' }}>
                Zen Old Mincho
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            onChange={onChangeText}
            id='outlined-basic'
            label='Label text'
            variant='outlined'
            defaultValue={labelDesign.text}
          />
          <Grid container spacing={2} alignItems='center'>
            <Grid item>
              <label style={{ cursor: 'pointer' }} htmlFor='background-color-input'>
                <Typography>Background color</Typography>
              </label>
            </Grid>
            <Grid item xs>
              <input
                id='background-color-input'
                value={labelDesign.backgroundColor}
                onChange={onBackgroundColorChange}
                type={'color'}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.label} ref={canvasContainer}></div>
      </div>
    );
  }
);
