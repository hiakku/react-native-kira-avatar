import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, DEFAULT, parseStorage, SavedAvatar } from "./model";
type Store = {
  avatar: Avatar;
  ready: boolean;
  error: string;
  saved: SavedAvatar[];
  canUndo: boolean;
  canRedo: boolean;
  change: (a: Avatar) => void;
  undo: () => void;
  redo: () => void;
  save: (name: string) => void;
  open: (a: Avatar) => void;
  remove: (id: string) => void;
  retry: () => void;
};
const Context = createContext<Store | null>(null);
const KEY = "kira.collection.v1";
export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<Avatar[]>([DEFAULT]);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState<SavedAvatar[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const queue = useRef(Promise.resolve());
  const avatar = history[index];
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        const data = raw ? parseStorage(raw) : { draft: DEFAULT, saved: [] };
        if (alive) {
          setHistory([data.draft]);
          setIndex(0);
          setSaved(data.saved);
          setReady(true);
        }
      })
      .catch(() => {
        if (alive)
          setError(
            "Your collection could not be loaded. Reopen the app to retry. Your saved data has not been replaced.",
          );
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    const value = JSON.stringify({ version: 1, draft: avatar, saved });
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(KEY, value))
      .then(() => setError(""))
      .catch(() =>
        setError("Changes could not be saved. Keep Kira open and tap Retry."),
      );
  }, [avatar, saved, ready, attempt]);
  const change = useCallback(
    (next: Avatar) => {
      if (!ready || JSON.stringify(next) === JSON.stringify(avatar)) return;
      const past = history.slice(0, index + 1);
      const all = [...past, next].slice(-60);
      setHistory(all);
      setIndex(all.length - 1);
    },
    [avatar, history, index, ready],
  );
  const save = (name: string) => {
    if (!ready) return;
    setSaved((old) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim() || "My character",
        avatar: { ...avatar },
        updatedAt: new Date().toISOString(),
      },
      ...old,
    ]);
  };
  return (
    <Context.Provider
      value={{
        avatar,
        ready,
        error,
        saved,
        change,
        canUndo: index > 0,
        canRedo: index < history.length - 1,
        undo: () => setIndex((x) => Math.max(0, x - 1)),
        redo: () => setIndex((x) => Math.min(history.length - 1, x + 1)),
        save,
        open: change,
        remove: (id) => setSaved((old) => old.filter((x) => x.id !== id)),
        retry: () => setAttempt((x) => x + 1),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStudio() {
  const store = useContext(Context);
  if (!store) throw new Error("StudioProvider missing");
  return store;
}
