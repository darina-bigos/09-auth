'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NoteDetailsClient from '@/app/(private routes)/notes/[id]/NoteDetails.client';

export default function NoteModalClient() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <NoteDetailsClient />
    </Modal>
  );
}
