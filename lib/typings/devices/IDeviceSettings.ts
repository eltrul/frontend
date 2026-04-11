export type ISprayMode = "humidity" | "timer";
export const sprayMode = ["humidity", "timer"];

export interface IDeviceSettings {
   sprayMode: ISprayMode;
   sprayInterval: number;
   sprayThresehold: number;
}
