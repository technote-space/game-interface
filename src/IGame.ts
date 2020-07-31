import {GameSettings, GaSettings} from './types';

export interface IGame {
  step: number;
  actionStep: number;
  gameSettings: GameSettings;
  gaSettings: GaSettings;
  hasReached: boolean;

  clone(): IGame;

  action(index: number): void;

  perceive(index: number): boolean;

  actionExpression(index: number): string;

  perceiveExpression(index: number): string;

  getFitness(): number;

  draw(target: string | HTMLCanvasElement): void;
}
