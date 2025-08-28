import React from 'react';
import { ConfirmModal } from './confirmModal';

interface TestStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  topicTitle?: string;
}

export const TestStartModal: React.FC<TestStartModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  topicTitle = "bu mavzu"
}) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Testni boshlaysizmi?"
      message={`${topicTitle} bo'yicha testni boshlamoqchimisiz? Test boshlanganidan keyin ortga qaytib bo'lmaydi.`}
      confirmText="Testni boshlash"
      cancelText="Bekor qilish"
      confirmButtonClass="bg-[#6a81ff] hover:bg-[#5a71ef]"
    />
  );
};