import type { TargetTypeMeta } from "@/lib/types";

export const TYPE_VISUALS: Record<string, { icon: string; color: string }> = {
  host: { icon: "monitor", color: "#7C5CFF" },
  domain: { icon: "globe", color: "#22C55E" },
  company: { icon: "building", color: "#F59E0B" },
  person: { icon: "user", color: "#3B82F6" },
  network: { icon: "network", color: "#8B5CF6" },
  mobile: { icon: "phone", color: "#EC4899" },
  api: { icon: "zap", color: "#F97316" },
  cloud: { icon: "cloud", color: "#06B6D4" },
  wifi: { icon: "wifi", color: "#10B981" },
};

export function typeVisual(type: string) {
  return TYPE_VISUALS[type] || { icon: "target", color: "#7C5CFF" };
}

export function typeLabel(type: string, types: TargetTypeMeta[]): string {
  return types.find((t) => t.key === type)?.label ?? type;
}

export function statusLabel(status: string): string {
  switch (status) {
    case "completed":
      return "Concluído";
    case "in_progress":
      return "Em progresso";
    default:
      return "Não iniciado";
  }
}

export function statusColors(status: string): { color: string; bg: string; line: string } {
  switch (status) {
    case "completed":
      return { color: "#22C55E", bg: "#22C55E15", line: "#22C55E" };
    case "in_progress":
      return { color: "#FBBF24", bg: "#FBBF2415", line: "#FBBF24" };
    default:
      return { color: "#64748B", bg: "#64748B15", line: "#1E293B" };
  }
}

const VAR_DEFAULTS: Record<string, string> = {
  "{PORTS}": "80,443",
  "{CVE}": "CVE-XXXX-XXXX",
  "{EXPLOIT}": "exploit/module",
  "{LHOST}": "YOUR_IP",
  "{SERVICE}": "SERVICE",
  "{TOKEN}": "YOUR_TOKEN",
  "{JWT_TOKEN}": "YOUR_JWT",
  "{USER}": "admin",
  "{HASH}": "NTLM_HASH",
  "{DOMAIN}": "DOMAIN",
  "{BSSID}": "XX:XX:XX:XX:XX:XX",
  "{CHANNEL}": "6",
};

export function replaceVars(address: string, command: string): string {
  let result = command.replaceAll("{TARGET}", address || "TARGET");
  for (const [token, value] of Object.entries(VAR_DEFAULTS)) {
    result = result.replaceAll(token, value);
  }
  return result;
}
