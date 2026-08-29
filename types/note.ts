export type NoteTag = 'Work' | 'Personal' | 'Shopping' | 'Meeting' | 'Todo';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export type NewNoteData = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
