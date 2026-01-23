import { useOnlineStatus } from "@shared/hooks/useOnlineStatus";

export function OnlineStatusWrapper() {
  useOnlineStatus();
  return null;
}
