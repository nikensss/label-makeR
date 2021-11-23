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

export interface Labels {
  front: string;
  back: string;
}

export interface LabelDesign {
  backgroundColor: string;
  bagColor: typeof BAG_COLORS[number];
  font: string;
  logo: string;
  scale: number;
  brand: string;
  description: string;
  website: string;
  x: number;
  y: number;
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '75%',
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
  labels: Labels;
  setLabels: React.Dispatch<React.SetStateAction<Labels>>;
  classes: ClassNameMap<string>;
};

export const LABEL_DIMENSIONS = { width: 380, height: 532 } as const;

export const LabelDesigner = withStyles(styles)(
  ({ order, labelDesignRef, setLabelDesign, labels, setLabels, classes }: LabelDesignerInput) => {
    const labelDesign = labelDesignRef.current;
    const frontLabelCanvasRef = createRef<HTMLDivElement>();
    const backLabelCanvasRef = createRef<HTMLDivElement>();
    const [frontLabelCanvas, setFrontLabelCanvas] = useState<P5 | null>(null);
    const [backLabelCanvas, setBackLabelCanvas] = useState<P5 | null>(null);
    const [hasLogo, setHasLogo] = useState(!!labelDesignRef.current.logo);
    const [coffee] = order.coffees;
    const name = coffee?.display('label') || 'ROMO BLEND';
    const weight = coffee?.display('weight') || '0.25 kg';
    const [frontLabel, setFrontLabel] = useState('');
    const [backLabel, setBackLabel] = useState('');

    const centerButton = useRef<HTMLButtonElement | null>(null);

    const onChange = (key: keyof Pick<LabelDesign, 'x' | 'y' | 'scale'>) => {
      return (...args: unknown[]) => {
        const [, value] = args;
        if (typeof value !== 'number') return;
        setLabelDesign({ ...labelDesignRef.current, [key]: value });
      };
    };

    const onChangeScale = onChange('scale');
    const onBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const backgroundColor = event.target.value;
      setLabelDesign({ ...labelDesignRef.current, backgroundColor });
    };

    const onScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const scale = !event.target.value ? 0.25 : parseFloat(event.target.value);
      setLabelDesign({ ...labelDesignRef.current, scale });
    };

    const onBlurChange = () => {
      if (labelDesign.scale < 0) setLabelDesign({ ...labelDesignRef.current, scale: 0 });
      if (labelDesign.scale > 5) setLabelDesign({ ...labelDesignRef.current, scale: 5 });
    };

    const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelDesign({ ...labelDesignRef.current, brand: event.target.value });
    };

    const onWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelDesign({ ...labelDesignRef.current, website: event.target.value });
    };

    const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelDesign({ ...labelDesignRef.current, description: event.target.value });
    };

    const onFontSelectionChange = (event: SelectChangeEvent) => {
      setLabelDesign({ ...labelDesignRef.current, font: event.target.value });
    };

    const onBagColorChange = (event: ChangeEvent<HTMLInputElement>) => {
      const bagColor = event.target.value;
      if (isValidBagColor(bagColor)) {
        setLabelDesign({ ...labelDesignRef.current, bagColor });
      }
    };

    const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const logo = e.target?.result;
        if (typeof logo !== 'string') {
          return setLabelDesign({ ...labelDesignRef.current, logo: '' });
        }
        setLabelDesign({ ...labelDesignRef.current, logo });
        setHasLogo(!!logo);
        centerButton.current?.click();
      };
      reader.readAsDataURL(file);
    };

    const onCenterLogo = () => {
      setLabelDesign({ ...labelDesignRef.current, x: LABEL_DIMENSIONS.width / 2, y: 110 });
    };

    const frontLabelSketch = (p5: P5) => {
      let img: P5.Element | null = null;
      const dragged: { x: number | null; y: number | null } = { x: null, y: null };
      let dragStartedOutsideImage = true;

      const mouseIsOnImage = (): boolean => {
        if (!img) return false;

        const { width, height } = img.elt;
        const { x, y, scale } = labelDesignRef.current;
        const effectiveWidth = width * scale;
        const effectiveHeight = height * scale;
        const m = { x: p5.mouseX, y: p5.mouseY };

        const xIsOnImage = x - effectiveWidth / 2 < m.x && m.x < x + effectiveWidth / 2;
        const yIsOnImage = y - effectiveHeight / 2 < m.y && m.y < y + effectiveHeight / 2;
        return xIsOnImage && yIsOnImage;
      };

      p5.setup = () => {
        p5.createCanvas(LABEL_DIMENSIONS.width, LABEL_DIMENSIONS.height);
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
          p5.image(img, x, y, width * scale, height * scale);
        }

        // draw customer's brand
        p5.fill('black');
        p5.textSize(18);
        p5.textFont(labelDesignRef.current.font);
        p5.textAlign(p5.CENTER);
        p5.text(labelDesignRef.current.brand, p5.width / 2, 250);

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
        setFrontLabel(canvas.toDataURL());
      };

      p5.mouseDragged = () => {
        if (!mouseIsOnImage()) return;
        if (dragStartedOutsideImage) return;

        if (dragged.x !== null && dragged.y !== null) {
          setLabelDesign({
            ...labelDesignRef.current,
            x: labelDesignRef.current.x + (p5.mouseX - dragged.x),
            y: labelDesignRef.current.y + (p5.mouseY - dragged.y)
          });
        }

        dragged.x = p5.mouseX;
        dragged.y = p5.mouseY;
      };

      p5.mousePressed = () => {
        dragStartedOutsideImage = !mouseIsOnImage();
      };

      p5.mouseReleased = () => {
        [dragged.x, dragged.y] = [null, null];
      };
    };

    const backLabelSketch = (p5: P5) => {
      p5.setup = () => {
        p5.createCanvas(LABEL_DIMENSIONS.width, LABEL_DIMENSIONS.height);
        p5.pixelDensity(2);
      };

      p5.draw = () => {
        p5.background(labelDesignRef.current.backgroundColor);

        p5.fill('black');
        p5.textSize(18);
        p5.textFont(labelDesignRef.current.font);
        p5.textAlign(p5.CENTER);
        p5.text(labelDesignRef.current.description, p5.width / 2, 250);

        const { canvas } = p5.get();
        setBackLabel(canvas.toDataURL());
      };
    };

    useEffect(() => setLabels({ front: frontLabel, back: backLabel }), [frontLabel, backLabel]);

    useEffect(() => {
      if (!frontLabelCanvasRef.current || !backLabelCanvasRef.current) return;
      frontLabelCanvas?.remove();
      backLabelCanvas?.remove();
      setFrontLabelCanvas(new P5(frontLabelSketch, frontLabelCanvasRef.current));
      setBackLabelCanvas(new P5(backLabelSketch, backLabelCanvasRef.current));
    }, [frontLabelCanvasRef.current, backLabelCanvasRef.current, labelDesignRef.current.logo]);

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
          <Typography>Scale</Typography>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs>
              <Slider
                value={labelDesignRef.current.scale}
                min={0}
                max={5}
                step={0.01}
                onChange={onChangeScale}
                aria-labelledby='continuous-slider'
              />
            </Grid>
            <Grid item>
              <Input
                value={labelDesignRef.current.scale}
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
              labelId='font-select-label'
              id='font-select'
              value={labelDesignRef.current.font}
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
            onChange={onBrandChange}
            label='Your brand'
            variant='outlined'
            defaultValue={labelDesignRef.current.brand}
          />
          <TextField
            fullWidth
            onChange={onWebsiteChange}
            label='Your website'
            variant='outlined'
            defaultValue={labelDesignRef.current.website}
          />
          <TextField
            fullWidth
            onChange={onDescriptionChange}
            label='Your description'
            variant='outlined'
            defaultValue={labelDesignRef.current.description}
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
                value={labelDesignRef.current.backgroundColor}
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
                control={<Radio checked={labelDesignRef.current.bagColor === 'white'} />}
                label={<Typography>White</Typography>}
              />
              <FormControlLabel
                value='black'
                control={<Radio checked={labelDesignRef.current.bagColor === 'black'} />}
                label={<Typography>Black</Typography>}
              />
              <FormControlLabel
                value='brown'
                control={<Radio checked={labelDesignRef.current.bagColor === 'brown'} />}
                label={<Typography>Brown</Typography>}
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div className={classes.label} ref={frontLabelCanvasRef}></div>
        <div className={classes.label} ref={backLabelCanvasRef}></div>
      </div>
    );
  }
);
