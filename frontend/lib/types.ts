export type TargetStatus = "not_started" | "in_progress" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  created_at: string;
}

export interface Target {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string | null;
  status: TargetStatus;
  scope_phases: boolean[];
  phase_status: number[];
  progress_pct: number;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  target_id: string;
  phase_index: number;
  content: string;
  updated_at: string;
}

export interface TargetTypeMeta {
  key: string;
  label: string;
  placeholder: string;
}

export interface PhaseMeta {
  num: string;
  name: string;
  desc: string;
}

export interface Meta {
  target_types: TargetTypeMeta[];
  phases: PhaseMeta[];
  specialties: string[];
}

export interface ToolCommand {
  label: string;
  command: string;
  desc?: string | null;
}

export interface ToolGroup {
  name: string;
  tag?: string | null;
  commands: ToolCommand[];
}

export interface ReportResult {
  title: string;
  content: string;
}
