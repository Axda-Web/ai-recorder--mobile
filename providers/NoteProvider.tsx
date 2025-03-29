import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type Note, type NewNote } from "@/db/schema";

interface NoteContextType {
  notes: Note[];
  saveNote: (note: NewNote) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateNote: (id: string, newNote: NewNote) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | null>(null);

const STORAGE_KEY = "notes";

export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function initStorage() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNotes(JSON.parse(stored));
        }
      } catch (err) {
        console.error(err);
      }
    }

    initStorage();
  }, []);

  const saveNote = async (newNote: NewNote) => {
    try {
      const updatedNotes = [...notes, newNote];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes as Note[]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter((note) => note.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateNote = async (id: string, newNote: NewNote) => {
    try {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, ...newNote } : note
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const value = {
    notes,
    saveNote,
    deleteNote,
    updateNote,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
}
