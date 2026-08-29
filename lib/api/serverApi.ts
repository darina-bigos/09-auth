import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const options = await getAuthHeaders();
    const response = await api.get<User | null>('/auth/session', options);
    return response.data || null;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const options = await getAuthHeaders();
  const response = await api.get<User>('/users/me', options);
  return response.data;
};

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  tag?: string;
}): Promise<Note[]> => {
  const options = await getAuthHeaders();

  const cleanParams = Object.fromEntries(
    Object.entries({ ...params, perPage: 12 }).filter(
      entry => entry[1] !== undefined && entry[1] !== ''
    )
  );

  const response = await api.get<Note[]>('/notes', {
    ...options,
    params: cleanParams,
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const options = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, options);
  return response.data;
};
