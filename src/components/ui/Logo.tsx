export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="504" height="504" rx="148" fill="white" stroke="#14141f" strokeWidth="2"/>
      <circle cx="120" cy="400" r="48" fill="white" stroke="#14141f" strokeWidth="2"/>
      <circle cx="400" cy="120" r="48" fill="white" stroke="#14141f" strokeWidth="2"/>
      <path
        d="M120 400 C135 310 200 265 260 255 C320 245 380 200 400 125"
        stroke="#14141f"
        strokeWidth="36"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}