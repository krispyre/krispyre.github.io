type ActionType = "switch" | "stroke";
type LightMode = "dark" | "light";

interface Point {
  x: number;
  y: number;
}

interface CanvasAction {
  type: ActionType;
  pointList?: Point[]; // only for stroke
  currentLightMode: LightMode; // stroke is drawn in this mode OR is switched to this mode
}
