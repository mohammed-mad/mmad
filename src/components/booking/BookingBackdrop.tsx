/** Line-art ornaments for the navy booking band: a leafy branch, dot grids and a hand-drawn arrow. Decorative only. */
export default function BookingBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Branch growing in from the bottom-left corner: leaves alternate along the stem, each joined at its base */}
      <svg className="absolute -bottom-14 -left-10 h-[150px] w-[150px] text-navy-light/25 lg:-bottom-12 lg:h-[230px] lg:w-[230px]" viewBox="0 0 230 230" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 226Q96 160 196 44" />
        <path d="M51 194.5Q74.1 223.2 112.6 201.2Q79.6 171.4 51 194.5Z" />
        <path d="M78.9 168.6Q102.5 143.5 77.2 110.6Q53.8 145 78.9 168.6Z" />
        <path d="M107.8 140.1Q128.6 162.9 159.8 142.5Q130.6 119.3 107.8 140.1Z" />
        <path d="M135.7 111.1Q153.4 90.3 131.9 65.3Q114.9 93.5 135.7 111.1Z" />
        <path d="M162.5 82Q179.3 98.8 202.5 82Q179.3 65.2 162.5 82Z" />
        <path d="M196 44Q222.1 42.1 224.7 10.7Q194.1 17.9 196 44Z" />
        <g strokeWidth="1.4">
          <path d="M51 194.5L95.3 199.3" />
          <path d="M78.9 168.6L77.7 126.9" />
          <path d="M107.8 140.1L145.2 141.8" />
          <path d="M135.7 111.1L133 78.1" />
          <path d="M162.5 82L191.3 82" />
          <path d="M196 44L216.7 20" />
        </g>
      </svg>

      {/* Dot grid peeking out above the card */}
      <div className="absolute right-4 top-6 hidden h-[110px] w-[170px] bg-dots-light bg-[length:12px_12px] lg:block xl:right-[6%]" />

      {/* Dot grid under the details column */}
      <div className="absolute bottom-8 right-6 h-[70px] w-[120px] bg-dots-light bg-[length:12px_12px] lg:bottom-10 lg:left-[38%] lg:right-auto" />

      {/* Hand-drawn arrow leading from the details to the card */}
      <svg className="absolute left-[41%] top-[92px] hidden h-[90px] w-[150px] text-sun xl:block" viewBox="0 0 150 90" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 70c22-40 58-58 110-52" strokeDasharray="1 9" />
        <path d="M100 6l18 12-14 16" />
      </svg>
    </div>
  );
}
