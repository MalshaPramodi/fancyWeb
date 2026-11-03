type IconName = 'snow' | 'shuffle' | 'arrow' | 'plus' | 'ribbon'
const paths: Record<IconName, string> = {
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9 5l3 3 3-3M9 19l3-3 3 3',
  shuffle:
    'M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 3-2 5-5m2-2c2-3 3-5 5-5h3m-4-4 4 4-4 4',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  plus: 'M12 5v14M5 12h14',
  ribbon:
    'M12 12C2 12 2 2 6 4c3 1 6 8 6 8Zm0 0c10 0 10-10 6-8-3 1-6 8-6 8ZM12 12l-4 9m4-9 4 9',
}

export function LineIcon({
  name,
  className = 'size-4',
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
