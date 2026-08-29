'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import css from './NotesPage.module.css'; // за потреби уточніть шлях до стилів

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Дебаунс пошукового запиту
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Скидання на 1 сторінку при зміні пошуку
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data } = useQuery({
    queryKey: ['notes', debouncedSearch, page, tag],
    queryFn: () => fetchNotes({ search: debouncedSearch, page, tag }),
    placeholderData: keepPreviousData,
    retry: 1,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
      </header>

      {/* Рендеримо NoteList лише за наявності нотаток */}
      {notes.length > 0 && <NoteList notes={notes} />}

      {/* Пагінація відображається тільки якщо сторінок більше ніж 1 */}
      {totalPages > 1 && (
        <Pagination pageCount={totalPages} currentPage={page} onPageChange={setPage} />
      )}

      <Link href="/notes/action/create" className={css.createBtn}>
        Create Note
      </Link>
    </main>
  );
}
