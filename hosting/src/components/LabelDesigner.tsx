import P5 from 'p5';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { createRef, useEffect, useRef, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';

const styles = (theme: Theme) =>
  createStyles({
    container: {
      width: '65%',
      height: '70%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
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

type LabelDesignerInput = { classes: ClassNameMap<string> };

export const LabelDesigner = withStyles(styles)(
  ({ classes }: LabelDesignerInput) => {
    const labelDimensions = { width: 380, height: 532 } as const;
    const canvasContainer = createRef<HTMLDivElement>();
    const [canvas, setCanvas] = useState<P5 | null>(null);

    const [logo, setLogo] = useState('');
    const logoRef = useRef(logo);
    logoRef.current = logo;

    const [x, setX] = useState(0);
    const xRef = useRef(x);
    xRef.current = x;

    const [y, setY] = useState(0);
    const yRef = useRef(y);
    yRef.current = y;

    const [scale, setScale] = useState(0.25);
    const scaleRef = useRef(scale);
    scaleRef.current = scale;

    const [labelText, setLabelText] = useState('Freshly roasted coffee');
    const labelTextRef = useRef(labelText);
    labelTextRef.current = labelText;

    type SetState = React.Dispatch<React.SetStateAction<number>>;

    const onChange = (change: SetState) => {
      return (...args: unknown[]) => {
        const [, value] = args;
        if (typeof value !== 'number') return;
        change(value);
      };
    };

    const onChangeX = onChange(setX);
    const onChangeY = onChange(setY);
    const onChangeScale = onChange(setScale);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setScale(event.target.value === '' ? 0.25 : Number(event.target.value));
    };

    const handleBlur = () => {
      if (scale < 0) setScale(0);
      if (scale > 5) setScale(5);
    };

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelText(event.target.value);
    };

    const onFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result !== 'string') return setLogo('');
        setLogo(result);
      };
      reader.readAsDataURL(file);
    };

    const sketch = (p5: P5) => {
      let img: P5.Element | null = null;

      p5.setup = () => {
        p5.createCanvas(labelDimensions.width, labelDimensions.height);
        p5.pixelDensity(10);
        img = p5.createImg(logoRef.current, '');
        img.hide();
      };

      p5.draw = () => {
        p5.background(120, 120, 140);
        p5.noStroke();
        if (img) {
          const { width, height } = img.elt;
          const [x, y, scale] = [xRef.current, yRef.current, scaleRef.current];
          p5.image(img, x, y, width * scale, height * scale);
        }
        p5.fill('white');
        p5.rect(0, 400, p5.width, p5.height - 400);
        p5.fill('black');
        p5.textSize(25);
        p5.textFont('helvetica');
        p5.textAlign(p5.CENTER);
        p5.text(labelTextRef.current, p5.width / 2, 450);
      };
    };

    useEffect(() => {
      if (!canvasContainer.current) return;
      canvas?.remove();
      setCanvas(new P5(sketch, canvasContainer.current));
    }, [canvasContainer.current, logo]);

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
              <Button variant='contained' color='primary' component='span'>
                Upload logo
              </Button>
            </label>
          </div>
          <Typography>Horizontal position</Typography>
          <Slider
            value={x}
            min={0}
            max={canvas?.width || labelDimensions.width}
            onChange={onChangeX}
            aria-labelledby='continuous-slider'
          />
          <Typography>Vertical position</Typography>
          <Slider
            value={y}
            min={0}
            max={canvas?.height || labelDimensions.height}
            onChange={onChangeY}
            aria-labelledby='continuous-slider'
          />
          <Typography>Scale</Typography>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs>
              <Slider
                value={scale}
                min={0}
                max={5}
                step={0.01}
                onChange={onChangeScale}
                aria-labelledby='continuous-slider'
              />
            </Grid>
            <Grid item>
              <Input
                value={scale}
                margin='dense'
                onChange={handleInputChange}
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
          <TextField
            fullWidth
            onChange={onChangeText}
            id='outlined-basic'
            label='Label text'
            variant='outlined'
            defaultValue={labelText}
          />
          <Button
            className={classes.button}
            onClick={() => canvas?.save('coffee_label.png')}
            color='primary'
            startIcon={<SaveIcon />}
            size='large'
            variant='outlined'>
            Save label
          </Button>
        </div>
        <div className={classes.label} ref={canvasContainer}></div>
      </div>
    );
  }
);
