import P5 from 'p5';
import { createStyles, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { createRef, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const styles = createStyles({
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
    const canvasContainer = createRef<HTMLDivElement>();
    const [canvas, setCanvas] = useState<P5 | null>(null);

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [scale, setScale] = useState(20);

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

    const sketch = (p5: P5) => {
      p5.setup = () => {
        p5.createCanvas(200, 200);
        p5.background('white');
      };

      p5.draw = () => {
        p5.noStroke();
        p5.fill('orange');
        p5.ellipse(50 + x, 50 + y, 50 * p5.map(scale, 0, 100, 0, 5));
        p5.noLoop();
      };
    };

    useEffect(() => {
      if (!canvasContainer.current) return;
      canvas?.remove();
      setCanvas(new P5(sketch, canvasContainer.current));
    }, [canvasContainer.current, x, y, scale]);

    return (
      <div className={classes.container}>
        <div className={classes.controls}>
          <Typography>Horizontal position</Typography>
          <Slider
            value={x}
            onChange={onChangeX}
            aria-labelledby='continuous-slider'
          />
          <Typography>Vertical position</Typography>
          <Slider
            value={y}
            onChange={onChangeY}
            aria-labelledby='continuous-slider'
          />
          <Typography>Scale</Typography>
          <Slider
            value={scale}
            onChange={onChangeScale}
            aria-labelledby='continuous-slider'
          />
        </div>
        <div className={classes.label} ref={canvasContainer}></div>
      </div>
    );
  }
);
