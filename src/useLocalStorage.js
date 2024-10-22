import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "ijinden-deck-builder";

function getStorageValue() {
  if (typeof window !== "undefined") {
    const decksSaved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    const initialValue = decksSaved !== null ? JSON.parse(decksSaved) : [];
    return initialValue;
  }
}

function useLocalStorage() {
  const [decksSaved, setDecksSaved] = useState(() => getStorageValue());

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(decksSaved));
  }, [decksSaved]);

  return [decksSaved, setDecksSaved];
}

export default useLocalStorage;
