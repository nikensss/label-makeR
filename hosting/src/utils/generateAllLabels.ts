import { Order } from '../classes/Order';
import P5 from 'p5';
import { LabelDesign, LABEL_DIMENSIONS } from '../components/LabelDesigner';

export const generateAllLabels = async (
  labelDesign: LabelDesign,
  order: Order
): Promise<string[]> => {
  return await Promise.all(order.coffees.map(c => generateLabel(labelDesign, c)));
};

const generateLabel = async (
  labelDesign: LabelDesign,
  coffee: Order['coffees'][number]
): Promise<string> => {
  let label = '';
  // create new P5 canvas
  new P5((p5: P5) => {
    let img: P5.Element | null = null;
    p5.setup = () => {
      p5.createCanvas(LABEL_DIMENSIONS.width, LABEL_DIMENSIONS.height);
      p5.pixelDensity(2);
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
        p5.image(img, x, y, width * scale, height * scale);
      }

      // draw customer's brand
      p5.fill('black');
      p5.textSize(18);
      p5.textFont(labelDesign.font);
      p5.textAlign(p5.CENTER);
      p5.text(labelDesign.brand, p5.width / 2, 250);

      // show coffee type
      p5.text(coffee.display('label'), p5.width / 2, 340);
      p5.textSize(14);
      p5.text('FILTER COFFEE', p5.width / 2, 370);
      // show website
      p5.text(labelDesign.website, p5.width / 2, 450);
      // show coffee weight
      p5.text(coffee.display('weight'), p5.width / 2, 490);

      // draw separators
      p5.strokeWeight(2);
      p5.stroke(42);
      p5.line(25, 280, p5.width - 25, 280);
      p5.line(25, 420, p5.width - 25, 420);

      const { canvas } = p5.get();
      label = canvas.toDataURL();
      p5.noLoop();
    };
  });

  while (label === '') {
    await new Promise(res => setTimeout(res, 0));
    if (label !== '') return label;
  }

  throw new Error(`Could not generate label for ${coffee.display('label')}`);
};
