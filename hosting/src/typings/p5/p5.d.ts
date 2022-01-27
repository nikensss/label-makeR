import P5 from 'p5';

declare module 'P5' {
  export interface Image {
    canvas: HTMLCanvasElement;
  }
}
