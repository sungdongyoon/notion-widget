const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// 로컬 스토리지 상태 불러오기
export const loadState = <T = unknown>(key: string): T | null => {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

// 로컬 스토리지 상태 저장
export const saveState = (key: string, state: unknown) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {}
};
