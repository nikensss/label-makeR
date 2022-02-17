import { Order } from '../classes/Order';
import P5 from 'p5';
import { LabelDesign, LABEL_DIMENSIONS } from '../components/LabelDesigner';

export const generateAllLabels = async (
  labelDesign: LabelDesign,
  order: Order
): Promise<string[]> => {
  return await Promise.all([
    ...order.selections.map(c => generateFrontLabel(labelDesign, c)),
    generateBackLabel(labelDesign)
  ]);
};

const generateFrontLabel = (
  labelDesign: LabelDesign,
  coffee: Order['selections'][number]
): Promise<string> => {
  return new Promise((res, rej) => {
    try {
      const upscale = 5;
      new P5((p5: P5) => {
        let img: P5.Element | null = null;
        p5.setup = () => {
          p5.createCanvas(LABEL_DIMENSIONS.width * upscale, LABEL_DIMENSIONS.height * upscale);
          img = p5.createImg(labelDesign.logo, '');
          img.hide();
          p5.imageMode(p5.CENTER);
        };

        p5.draw = () => {
          p5.background(labelDesign.backgroundColor);
          p5.noStroke();

          if (img) {
            const { width, height } = img.elt;
            const { x, y, scale } = labelDesign;
            p5.image(
              img,
              x * upscale,
              y * upscale,
              width * scale * upscale,
              height * scale * upscale
            );
          }

          // draw customer's brand
          p5.fill('black');
          p5.textSize(18 * upscale);
          p5.textFont(labelDesign.font);
          p5.textAlign(p5.CENTER);
          p5.text(labelDesign.brand, p5.width / 2, 250 * upscale);

          // show coffee type
          p5.text(coffee.display('label'), p5.width / 2, 340 * upscale);
          p5.textSize(14 * upscale);
          p5.text('FILTER COFFEE', p5.width / 2, 370 * upscale);
          // show website
          p5.text(labelDesign.website, p5.width / 2, 450 * upscale);
          // show coffee weight
          p5.text(coffee.display('weight'), p5.width / 2, 490 * upscale);

          // draw separators
          p5.strokeWeight(2 * upscale);
          p5.stroke(42);
          p5.line(25 * upscale, 280 * upscale, p5.width - 25 * upscale, 280 * upscale);
          p5.line(25 * upscale, 420 * upscale, p5.width - 25 * upscale, 420 * upscale);

          const { canvas } = p5.get() as unknown as { canvas: HTMLCanvasElement };
          const label = canvas.toDataURL();
          if (label !== '') {
            p5.noLoop();
            p5.remove();
            res(label);
          }
        };
      });
    } catch (ex) {
      rej(ex);
    }
  });
};

const generateBackLabel = async (labelDesign: LabelDesign): Promise<string> => {
  return new Promise((res, rej) => {
    try {
      const upscale = 5;
      new P5((p5: P5) => {
        p5.setup = () => {
          p5.createCanvas(LABEL_DIMENSIONS.width * upscale, LABEL_DIMENSIONS.height * upscale);
          p5.pixelDensity(upscale);
        };

        p5.draw = () => {
          p5.background(labelDesign.backgroundColor);

          p5.fill('black');
          p5.textSize(18 * upscale);
          p5.textFont(labelDesign.font);
          p5.textAlign(p5.CENTER);
          p5.text(labelDesign.description, p5.width / 2, 250 * upscale);

          const { canvas } = p5.get() as unknown as { canvas: HTMLCanvasElement };
          const label = canvas.toDataURL();
          if (label !== '') {
            p5.noLoop();
            p5.remove();
            res(label);
          }
        };
      });
    } catch (ex) {
      rej(ex);
    }
  });
};
