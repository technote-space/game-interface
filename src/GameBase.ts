import {IGame} from './IGame';
import {GameSettings} from './types';

export abstract class GameBase implements IGame {
  public abstract getSettings(): GameSettings;
}
