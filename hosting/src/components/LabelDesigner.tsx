import { createStyles, Theme, withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ImageIcon from '@material-ui/icons/Image';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import P5 from 'p5';
import { ChangeEvent, createRef, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Order } from '../classes/Order';

const BAG_COLORS = ['white', 'black', 'brown'] as const;

const isValidBagColor = (color: string): color is LabelDesign['bagColor'] => {
  //eslint-disable-next-line
  return BAG_COLORS.includes(color as any);
};

export interface LabelDesign {
  backgroundColor: string;
  bagColor: typeof BAG_COLORS[number];
  font: string;
  logo: string;
  scale: number;
  text: string;
  website: string;
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
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      borderColor: theme.palette.primary.main,
      borderRadius: theme.spacing(1),
      borderWidth: '1px',
      borderStyle: 'solid',
      padding: theme.spacing(2),
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    imageButtons: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-around',
      alignItems: 'center'
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
  order: Order;
  labelDesignRef: MutableRefObject<LabelDesign>;
  setLabelDesign: React.Dispatch<React.SetStateAction<LabelDesign>>;
  label: string;
  setLabel: React.Dispatch<React.SetStateAction<string>>;
  classes: ClassNameMap<string>;
};

export const LabelDesigner = withStyles(styles)(
  ({ order, labelDesignRef, setLabelDesign, label, setLabel, classes }: LabelDesignerInput) => {
    const labelDesign = labelDesignRef.current;
    const labelDimensions = { width: 380, height: 532 } as const;
    const canvasContainer = createRef<HTMLDivElement>();
    const [canvas, setCanvas] = useState<P5 | null>(null);
    const [hasLogo, setHasLogo] = useState(!!labelDesignRef.current.logo);
    const [coffee] = order.coffees;
    const name = coffee?.display('label') || 'ROMO BLEND';
    const weight = coffee?.display('weight') || '250g';

    const centerButton = useRef<HTMLButtonElement | null>(null);

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

    const onScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const scale = !event.target.value ? 0.25 : parseFloat(event.target.value);
      setLabelDesign({ ...labelDesign, scale });
    };

    const onBlurChange = () => {
      if (labelDesign.scale < 0) setLabelDesign({ ...labelDesign, scale: 0 });
      if (labelDesign.scale > 5) setLabelDesign({ ...labelDesign, scale: 5 });
    };

    const onBrandTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelDesign({ ...labelDesign, text: event.target.value });
    };
    const onWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelDesign({ ...labelDesign, website: event.target.value });
    };

    const onFontSelectionChange = (event: SelectChangeEvent) => {
      setLabelDesign({ ...labelDesign, font: event.target.value });
    };

    const onBagColorChange = (event: ChangeEvent<HTMLInputElement>) => {
      const bagColor = event.target.value;
      if (isValidBagColor(bagColor)) setLabelDesign({ ...labelDesign, bagColor });
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
        setHasLogo(!!logo);
        centerButton.current?.click();
      };
      reader.readAsDataURL(file);
    };

    const onCenterLogo = () => {
      setLabelDesign({ ...labelDesign, x: labelDimensions.width / 2, y: 140 });
    };

    const sketch = (p5: P5) => {
      let img: P5.Element | null = null;

      p5.setup = () => {
        p5.createCanvas(labelDimensions.width, labelDimensions.height);
        p5.pixelDensity(2);
        img = p5.createImg(labelDesignRef.current.logo, '');
        img.hide();
        p5.imageMode(p5.CENTER);
      };

      p5.draw = () => {
        p5.background(labelDesignRef.current.backgroundColor);
        p5.noStroke();

        if (img) {
          const { width, height } = img.elt;
          const { x, y, scale } = labelDesignRef.current;
          // const labelCenter = { x: labelDimensions.width / 2, y: 200 };
          p5.image(img, x, y, width * scale, height * scale);
        }

        // draw customer's brand
        p5.fill('black');
        p5.textSize(18);
        p5.textFont(labelDesignRef.current.font);
        p5.textAlign(p5.CENTER);
        p5.text(labelDesignRef.current.text, p5.width / 2, 250);

        // show coffee type
        p5.text(name, p5.width / 2, 340);
        p5.textSize(14);
        p5.text('FILTER COFFEE', p5.width / 2, 370);
        // show website
        p5.text(labelDesignRef.current.website, p5.width / 2, 450);
        // show coffee weight
        p5.text(weight, p5.width / 2, 490);

        // draw separators
        p5.strokeWeight(2);
        p5.stroke(42);
        p5.line(25, 280, p5.width - 25, 280);
        p5.line(25, 420, p5.width - 25, 420);

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
          <div className={classes.imageButtons}>
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
            <Button
              startIcon={<FilterCenterFocusIcon />}
              variant='contained'
              color='primary'
              component='span'
              disabled={!hasLogo}
              onClick={onCenterLogo}
              ref={centerButton}
            >
              <Typography>Center</Typography>
            </Button>
          </div>
          <Typography>Horizontal position</Typography>
          <Slider
            value={labelDesign.x}
            min={-(canvas?.width || labelDimensions.width)}
            max={canvas?.width || labelDimensions.width}
            onChange={onChangeX}
            aria-labelledby='continuous-slider'
          />
          <Typography>Vertical position</Typography>
          <Slider
            value={labelDesign.y}
            min={-(canvas?.height || labelDimensions.height)}
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
                onChange={onScaleChange}
                onBlur={onBlurChange}
                inputProps={{
                  step: 0.01,
                  min: 0,
                  max: 5,
                  type: 'number',
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
              onChange={onFontSelectionChange}
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
            onChange={onBrandTextChange}
            label='Your brand'
            variant='outlined'
            defaultValue={labelDesign.text}
          />
          <TextField
            fullWidth
            onChange={onWebsiteChange}
            label='Your website'
            variant='outlined'
            defaultValue={labelDesign.website}
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
          <FormControl fullWidth component='fieldset'>
            <FormLabel component='legend'>
              <Typography>Bag Color</Typography>
            </FormLabel>
            <RadioGroup
              onChange={onBagColorChange}
              row
              aria-label='bag color'
              name='row-radio-buttons-group'
            >
              <FormControlLabel
                value='white'
                control={<Radio checked={labelDesign.bagColor === 'white'} />}
                label={<Typography>White</Typography>}
              />
              <FormControlLabel
                value='black'
                control={<Radio checked={labelDesign.bagColor === 'black'} />}
                label={<Typography>Black</Typography>}
              />
              <FormControlLabel
                value='brown'
                control={<Radio checked={labelDesign.bagColor === 'brown'} />}
                label={<Typography>Brown</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className={classes.label} ref={canvasContainer}></div>
      </div>
    );
  }
);
