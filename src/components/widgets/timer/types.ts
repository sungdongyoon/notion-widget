export interface ApplyTimeProps {
  hour: number;
  minute: number;
  second: number;
}

export type PersistState =
  | {
      mode: "running";
      deadline: number;
      remainMs?: number;
      initialMs: number;
      color?: string;
      label?: string;
      timeFormat: "hourFormat" | "minuteFormat";
    }
  | {
      mode: "paused";
      remainMs: number;
      initialMs: number;
      color?: string;
      label?: string;
      timeFormat: "hourFormat" | "minuteFormat";
    }
  | {
      mode: "stopped";
      remainMs: number;
      initialMs: number;
      color?: string;
      label?: string;
      timeFormat: "hourFormat" | "minuteFormat";
    };
