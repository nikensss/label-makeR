import P5 from 'p5';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { createRef, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

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
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    button: {
      margin: theme.spacing(1)
    },
    label: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

type LabelDesignerInput = { classes: ClassNameMap<string> };

export const LabelDesigner = withStyles(styles)(
  ({ classes }: LabelDesignerInput) => {
    const labelDimensions = { width: 380, height: 532 } as const;
    const canvasContainer = createRef<HTMLDivElement>();
    const [canvas, setCanvas] = useState<P5 | null>(null);
    const [labelPixels, setLabelPixels] = useState(new ImageData(1, 1));

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [scale, setScale] = useState(1);
    const [labelText, setLabelText] = useState('Freshly roasted coffee');

    const onChangeX = (...args: unknown[]) => {
      const [, value] = args;
      if (typeof value !== 'number') return;
      setX(value);
    };

    const onChangeY = (...args: unknown[]) => {
      const [, value] = args;
      if (typeof value !== 'number') return;
      setY(value);
    };
    const onChangeScale = (...args: unknown[]) => {
      const [, value] = args;
      if (typeof value !== 'number') return;
      setScale(value);
    };

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLabelText(event.target.value);
    };

    const sketch = (p5: P5) => {
      p5.setup = () => {
        p5.createCanvas(labelDimensions.width, labelDimensions.height);
        p5.pixelDensity(10);
        p5.background(120, 120, 140);
      };

      p5.draw = () => {
        p5.noStroke();
        p5.fill('orange');
        p5.ellipse(x, y, 50 * scale);
        p5.fill('white');
        p5.rect(0, 400, p5.width, p5.height - 400);
        p5.fill('black');
        p5.textSize(25);
        p5.textFont('helvetica');
        p5.textAlign(p5.CENTER);
        p5.text(labelText, p5.width / 2, 450);
        p5.noLoop();
      };
    };

    const getCanvasPixels = (canvas: P5 | null) => {
      return canvas?.drawingContext.canvas
        .getContext('2d')
        ?.getImageData(0, 0, labelDimensions.width, labelDimensions.height);
    };

    useEffect(() => {
      if (!canvasContainer.current) return;

      canvas?.remove();
      setCanvas(new P5(sketch, canvasContainer.current));

      const imageData = getCanvasPixels(canvas);
      if (imageData) setLabelPixels(imageData);
      console.log({ labelPixels: labelPixels.data.length });
    }, [x, y, scale, labelText]);

    return (
      <div className={classes.container}>
        <div className={classes.controls}>
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
          <Slider
            value={scale}
            min={0}
            max={10}
            step={0.01}
            onChange={onChangeScale}
            aria-labelledby='continuous-slider'
          />
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
