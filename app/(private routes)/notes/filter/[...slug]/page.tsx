import type { Metadata } from 'next';
import NotesClient from './Notes.client'; // Перевірте шлях до вашого NotesClient

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] || 'all';

  const capitalizedFilter = filter.charAt(0).toUpperCase() + filter.slice(1);

  return {
    title: `${capitalizedFilter} Notes | NoteHub`,
    description: `Filter and view all your ${filter} notes in NoteHub.`,
    openGraph: {
      title: `${capitalizedFilter} Notes | NoteHub`,
      description: `Filter and view all your ${filter} notes in NoteHub.`,
      url: `https://notehub.com/notes/filter/${filter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${capitalizedFilter} Notes`,
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] === 'all' ? undefined : slug?.[0];

  return <NotesClient tag={tag} />;
}
