export type GaSettings = Partial<{
  populationSize: number,
  islandNumber: number,
  culturalIslandRate: number,
  migrationInterval: number,
  migrationRate: number,
  crossoverTime: number,
  crossoverProbability: number,
  mutationProbability: number,
  mixProbability: number,
  nodeCount: number,
}>;
export type GameSettings = {
  name: string;
  needTestRun?: boolean;
  width: number;
  height: number;
  fps: number;
  actionLimit: number;
  stepLimit?: number;
  perceptionNumber: number
  actionNumber: number;
};
