interface FuriganaTextProps {
  text: string;
  reading?: string;
  toggle?: boolean;
}

export default function FuriganaText({
  text,
  reading,
  toggle = true,
}: FuriganaTextProps) {
  if (!toggle || !reading || reading === text) {
    return <span>{text}</span>;
  }

  return (
    <ruby>
      {text}
      <rt className="text-xs text-zinc-500 dark:text-zinc-400">{reading}</rt>
    </ruby>
  );
}
