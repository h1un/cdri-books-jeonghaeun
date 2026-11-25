type ResultCountProps = {
  label: string;
  count: number;
};

export function ResultCount({ label, count }: ResultCountProps) {
  return (
    <p className="flex items-center gap-4 text-caption font-medium text-text-primary">
      <span>{label}</span>
      <span>
        총 <span className="text-primary">{count.toLocaleString('ko-KR')}</span>건
      </span>
    </p>
  );
}
