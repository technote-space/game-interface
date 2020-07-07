import {IGame} from './IGame';
import {GameSettings} from './types';

export abstract class GameBase implements IGame {
  private _step: number;
  private readonly _settings: GameSettings;

  protected constructor() {
    this._step     = 0;
    this._settings = this.getSettings();
  }

  public get step(): number {
    return this._step;
  }

  public get settings(): GameSettings {
    return this._settings;
  }

  public get hasReached(): boolean {
    return this.step >= this.settings.stepLimit;
  }

  protected abstract getSettings(): GameSettings;

  public async reset(): Promise<void> {
    this._step = 0;
    await this.performReset();
  }

  protected abstract performReset(): Promise<void>;

  public async action(index: number): Promise<void> | never {
    if (this.hasReached) {
      throw new Error('The step has reached to limit');
    }

    this._step++;
    await this.performAction(index);
  }

  protected abstract performAction(index: number): Promise<void>;

  public async perceive(index: number): Promise<boolean> | never {
    if (this.hasReached) {
      throw new Error('The step has reached to limit');
    }

    this._step++;
    return this.performPerceive(index);
  }

  protected abstract performPerceive(index: number): Promise<boolean>;

  protected correctionItemScale(): number {
    // eslint-disable-next-line no-magic-numbers
    return 0.01;
  }

  public getScore(): number {
    return this.performGetScore() - this.step / this.settings.stepLimit * this.correctionItemScale();
  }

  protected abstract performGetScore(): number;

  private static getCanvas(target: string | HTMLCanvasElement): HTMLCanvasElement {
    if (typeof target === 'string') {
      return document.getElementById(target) as HTMLCanvasElement;
    }

    return target;
  }

  public draw(target: string | HTMLCanvasElement): void {
    const canvas = GameBase.getCanvas(target);
    if (!canvas) {
      return;
    }

    canvas.width  = this.settings.width;
    canvas.height = this.settings.height;

    const style           = canvas.style;
    style.width           = `${this.settings.width}px`;
    style.height          = `${this.settings.height}px`;
    style.backgroundColor = this.getBackgroundColor();

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    // eslint-disable-next-line no-magic-numbers
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels    = imageData.data;
    this.performDrawPixels(pixels, this.settings.width, this.settings.height);
    // eslint-disable-next-line no-magic-numbers
    context.putImageData(imageData, 0, 0);
    this.performDraw(context);
  }

  protected getBackgroundColor(): string {
    return '#FFF';
  }

  // eslint-disable-next-line id-length,@typescript-eslint/no-unused-vars
  protected getPixelColor(x: number, y: number): [number, ...number[]] | undefined {
    return undefined;
  }

  protected parseColors(colors: [number, ...number[]]): { red: number; green: number; blue: number; alpha: number } {
    if (colors.length === 1) { // eslint-disable-line no-magic-numbers
      return {
        red: colors[0],
        green: colors[0],
        blue: colors[0],
        alpha: 255,
      };
    } else if (colors.length === 2) { // eslint-disable-line no-magic-numbers
      return {
        red: colors[0],
        green: colors[0],
        blue: colors[0],
        alpha: colors[1],
      };
    } else if (colors.length === 3) { // eslint-disable-line no-magic-numbers
      return {
        red: colors[0],
        green: colors[1],
        blue: colors[2],
        alpha: 255,
      };
    }

    return {
      red: colors[0],
      green: colors[1],
      blue: colors[2],
      alpha: colors[3],
    };
  }

  protected performDrawPixels(pixels: Uint8ClampedArray, width: number, height: number): void {
    // eslint-disable-next-line no-magic-numbers,id-length
    for (let y = height; --y >= 0;) {
      // eslint-disable-next-line no-magic-numbers,id-length
      for (let x = width; --x >= 0;) {
        const index  = (y * width + x) * 4; // eslint-disable-line no-magic-numbers
        const colors = this.getPixelColor(x, y);
        if (!colors) {
          continue;
        }

        const {red, green, blue, alpha} = this.parseColors(colors);
        pixels[index]                   = red;
        pixels[index + 1]               = green; // eslint-disable-line no-magic-numbers
        pixels[index + 2]               = blue; // eslint-disable-line no-magic-numbers
        pixels[index + 3]               = alpha; // eslint-disable-line no-magic-numbers
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected performDraw(context: CanvasRenderingContext2D): void {
    //
  }
}
