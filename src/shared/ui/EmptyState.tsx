import { BookIllustration } from './icons/icons';

type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-30 text-center">
      <BookIllustration />
      <p className="text-caption text-text-secondary">{message}</p>
    </div>
  );
}
