import { createStyles, Theme, withStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import P5 from 'p5';
import { ChangeEvent, createRef, MutableRefObject, useEffect, useState } from 'react';
import { Order } from '../classes/Order';
import { BagColourSelector } from './BagColourSelector';
import ButtonCenter from './ButtonCenter';
import ButtonUploadLogo from './ButtonUploadLogo';
import { ColourSelector } from './ColourSelector';
import FontSelector from './FontSelector';
import ScaleSlider from './ScaleSlider';
import TextInput from './TextInput';

export const BAG_COLORS = ['white', 'black', 'brown'] as const;

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
      alignItems: 'center',
      padding: '10px'
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
  ({ order, labelDesignRef, setLabelDesign, setLabels, classes }: LabelDesignerInput) => {
    const frontLabelCanvasRef = createRef<HTMLDivElement>();
    const backLabelCanvasRef = createRef<HTMLDivElement>();
    const [frontLabelCanvas, setFrontLabelCanvas] = useState<P5 | null>(null);
    const [backLabelCanvas, setBackLabelCanvas] = useState<P5 | null>(null);
    const [hasLogo, setHasLogo] = useState(!!labelDesignRef.current.logo);
    const [coffee] = order.selections;
    const name = coffee?.display('label') || 'ROMO BLEND';
    const weight = coffee?.display('weight') || '0.25 kg';
    const [frontLabel, setFrontLabel] = useState('');
    const [backLabel, setBackLabel] = useState('');

    const onChangeScale = (value: number) => {
      setLabelDesign({ ...labelDesignRef.current, scale: value });
    };
    const onBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const backgroundColor = event.target.value;
      setLabelDesign({ ...labelDesignRef.current, backgroundColor });
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

    const onFontSelectionChange = (
      event: ChangeEvent<{ name?: string | undefined; value: unknown }>
    ) => {
      if (typeof event.target.value === 'string')
        setLabelDesign({ ...labelDesignRef.current, font: event.target.value });
    };

    const onBagColorChange = (event: ChangeEvent<HTMLInputElement>) => {
      const bagColor = event.target.value;
      if (isValidBagColor(bagColor)) {
        setLabelDesign({ ...labelDesignRef.current, bagColor });
      }
    };

    const addLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        centerLogo();
      };
      reader.readAsDataURL(file);
    };

    const centerLogo = () => {
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

        const { canvas } = p5.get() as unknown as { canvas: HTMLCanvasElement };
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

        const { canvas } = p5.get() as unknown as { canvas: HTMLCanvasElement };
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
            <ButtonUploadLogo addLogo={addLogo} />
            <ButtonCenter hasLogo={hasLogo} centerLogo={centerLogo} />
          </div>
          <ScaleSlider onChangeScale={onChangeScale} />
          <FontSelector
            onFontSelectionChange={onFontSelectionChange}
            selectedFont={labelDesignRef.current.font}
          />
          <TextInput
            defaultValue={labelDesignRef.current.brand}
            onChange={onBrandChange}
            label='Brand name'
          />
          <TextInput
            defaultValue={labelDesignRef.current.website}
            onChange={onWebsiteChange}
            label='Website'
          />
          <TextInput
            defaultValue={labelDesignRef.current.description}
            onChange={onDescriptionChange}
            label='Description'
          />
          <ColourSelector
            defaultValue={labelDesignRef.current.backgroundColor}
            onChange={onBackgroundColorChange}
          />
          <BagColourSelector onChange={onBagColorChange} />
        </div>
        <div className={classes.label} ref={frontLabelCanvasRef}></div>
        <div className={classes.label} ref={backLabelCanvasRef}></div>
      </div>
    );
  }
);
