import {GameSettings, GaSettings} from './types';

export interface IGame {
  step: number;
  actionStep: number;
  gameSettings: GameSettings;
  gaSettings: GaSettings;
  hasReached: boolean;

  clone(): IGame;

  action(index: number): Promise<void>;

  perceive(index: number): Promise<boolean>;

  actionExpression(index: number): string;

  perceiveExpression(index: number): string;

  getFitness(): number;

  draw(target: string | HTMLCanvasElement): void;
}
