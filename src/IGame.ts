import {GameSettings} from './types';

export interface IGame {
  step: number;
  settings: GameSettings;
  hasReached: boolean;

  reset(): Promise<void>;

  action(index: number): Promise<void>;

  perceive(index: number): Promise<boolean>;

  actionExpression(index: number): string;

  perceiveExpression(index: number): string;

  getScore(): number;

  draw(target: string | HTMLCanvasElement): void;
}
