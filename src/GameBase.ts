import {IGame} from './IGame';
import {GameSettings, GaSettings} from './types';

export abstract class GameBase implements IGame {
  private _step: number;
  private _hasFinished: boolean;
  private readonly _gameSettings: GameSettings;
  private readonly _gaSettings: GaSettings;

  protected constructor() {
    this._step         = 0;
    this._hasFinished  = false;
    this._gameSettings = this.getGameSettings();
    this._gaSettings   = this.getGaSettings();
  }

  public get step(): number {
    return this._step;
  }

  public get gameSettings(): GameSettings {
    return this._gameSettings;
  }

  public get gaSettings(): GaSettings {
    return this._gaSettings;
  }

  public get hasReached(): boolean {
    return this._hasFinished || this.step >= this.gameSettings.stepLimit;
  }

  protected onFinished(): void {
    this._hasFinished = true;
  }

  protected abstract getGameSettings(): GameSettings;

  protected abstract getGaSettings(): GaSettings;

  public abstract clone(): IGame;

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

  public actionExpression(index: number): string {
    return `行動${index}`;
  }

  public perceiveExpression(index: number): string {
    return `知覚${index}`;
  }

  protected correctionItemScale(): number {
    // eslint-disable-next-line no-magic-numbers
    return 0.01;
  }

  public getScore(): number {
    // eslint-disable-next-line no-magic-numbers
    return Math.max(0, this.performGetScore() - this.step / this.gameSettings.stepLimit * this.correctionItemScale());
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

    canvas.width  = this.gameSettings.width;
    canvas.height = this.gameSettings.height;

    const style           = canvas.style;
    style.width           = `${this.gameSettings.width}px`;
    style.height          = `${this.gameSettings.height}px`;
    style.backgroundColor = this.getBackgroundColor();

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    // eslint-disable-next-line no-magic-numbers
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels    = imageData.data;
    this.preDrawPixels(pixels);
    this.performDrawPixels(pixels, this.gameSettings.width, this.gameSettings.height);
    // eslint-disable-next-line no-magic-numbers
    context.putImageData(imageData, 0, 0);
    this.performDraw(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected preDrawPixels(pixels: Uint8ClampedArray): void {
    //
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

  protected performDrawPixels(pixels: Uint8ClampedArray): void {
    // eslint-disable-next-line no-magic-numbers,id-length
    for (let y = this.gameSettings.height; --y >= 0;) {
      // eslint-disable-next-line no-magic-numbers,id-length
      for (let x = this.gameSettings.width; --x >= 0;) {
        const index  = (y * this.gameSettings.width + x) * 4; // eslint-disable-line no-magic-numbers
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
