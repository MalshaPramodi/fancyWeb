export function ClosingBox() {
  return (
    <svg
      viewBox="0 0 260 220"
      fill="none"
      strokeWidth="1"
      className="mx-auto h-44 w-52"
      aria-hidden="true"
    >
      <rect
        x="46"
        y="90"
        width="168"
        height="110"
        rx="3"
        className="fill-cream stroke-evergreen/60"
      />
      <rect
        x="124"
        y="90"
        width="14"
        height="110"
        className="fill-gold-soft stroke-gold"
      />
      <g className="closing-box-lid">
        <rect
          x="40"
          y="78"
          width="180"
          height="18"
          rx="2"
          className="fill-ivory stroke-evergreen/60"
        />
        <rect
          x="124"
          y="78"
          width="14"
          height="18"
          className="fill-gold-soft stroke-gold"
        />
        <path
          d="M131 78c-33-2-48-29-28-27 13 1 28 27 28 27Zm0 0c33-2 48-29 28-27-13 1-28 27-28 27Zm0 0-13 14m13-14 13 14"
          className="stroke-gold"
        />
      </g>
    </svg>
  )
}
