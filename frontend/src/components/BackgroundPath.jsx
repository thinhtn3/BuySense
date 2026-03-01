export default function BackgroundPath() {
  return (
    <svg
      className="bg-path-svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Main zig-zag dashed route — sweeps left-to-right 4 times top-to-bottom */}
      <path
        className="bg-path-line"
        d="
          M 50 0
          C 82 5, 88 14, 78 22
          C 68 30, 12 32, 20 44
          C 28 56, 84 59, 74 70
          C 64 81, 14 82, 22 92
          C 30 102, 76 104, 80 118
        "
        fill="none"
        vectorEffect="non-scaling-stroke"
      />

      {/* Start pin — top */}
      <g className="bg-path-pin bg-path-pin--start" vectorEffect="non-scaling-stroke">
        <path
          className="bg-path-pin-shape"
          d="M 50 -4 C 47 -4, 44 -2, 44 1 C 44 5, 50 9, 50 9 C 50 9, 56 5, 56 1 C 56 -2, 53 -4, 50 -4 Z"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="50" cy="1" r="1.4" className="bg-path-pin-dot" vectorEffect="non-scaling-stroke" />
      </g>

      {/* End pin — bottom */}
      <g className="bg-path-pin bg-path-pin--end" vectorEffect="non-scaling-stroke">
        <circle cx="80" cy="112" r="2.2" className="bg-path-pin-end-circle" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
