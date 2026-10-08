// Deterministic QR-looking placeholder for mocks. The real image comes from
// PixPayment.qrImageUrl once the API exists.
export function FakeQr({ seed, size = 220 }: { seed: string; size?: number }) {
  const n = 29;
  let h = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = () => ((h = (h * 1103515245 + 12345) >>> 0) >>> 16) & 1;
  const finder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rand()) cells.push([x, y]);
  const eye = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" rx="2" fill="currentColor" />
      <rect x={x + 1} y={y + 1} width="5" height="5" rx="1.4" fill="white" />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.9" fill="currentColor" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="text-[#1d1d1f]" role="img" aria-label="QR Code do Pix">
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="white" />
      {cells.map(([x, y]) => (
        <rect key={`${x}.${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" rx="0.3" fill="currentColor" />
      ))}
      {eye(0, 0)}
      {eye(n - 7, 0)}
      {eye(0, n - 7)}
    </svg>
  );
}
