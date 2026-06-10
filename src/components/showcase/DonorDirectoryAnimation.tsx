import React from 'react';
import { motion } from 'motion/react';

interface Props {
  className?: string;
}

// Bar data: [x, finalY, finalHeight, opacity] — all bars share baseline y=306
const BARS: [number, number, number, number][] = [
  [596, 280, 26, 0.4],
  [620, 270, 36, 0.5],
  [644, 258, 48, 0.6],
  [668, 265, 41, 0.55],
  [692, 248, 58, 0.7],
  [716, 255, 51, 0.65],
  [740, 240, 66, 0.85],
  [764, 245, 61, 0.75],
  [788, 236, 70, 1.0],
];

// Animation timing constants (all relative to 8s duration)
const ROW_TIMES   = [0, 0.12, 0.18, 0.55, 0.82, 0.90, 1];
const PANEL_TIMES = [0, 0.18, 0.35, 0.82, 0.90, 1];

const DonorDirectoryAnimation: React.FC<Props> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 560"
    className={className}
    aria-hidden="true"
  >
    {/* ── Static base ── */}
    <rect width="900" height="560" fill="#0f0f1a"/>

    {/* Top nav */}
    <rect width="900" height="50" fill="#16162a"/>
    <rect y="50" width="900" height="1" fill="#2a2a44"/>
    <rect x="16" y="15" width="18" height="18" rx="4" fill="#4df0c6" opacity="0.8"/>
    <rect x="42" y="19" width="60" height="10" rx="2" fill="#d0d0f0"/>
    <rect x="160" y="17" width="70" height="16" rx="8" fill="#22223a"/>
    <rect x="240" y="17" width="90" height="16" rx="8" fill="#22223a"/>
    <rect x="240" y="17" width="90" height="16" rx="8" fill="#4df0c6" opacity="0.08"/>
    <rect x="244" y="19" width="82" height="12" rx="6" fill="#1c1c32"/>
    <rect x="254" y="22" width="62" height="8" rx="2" fill="#4df0c6" opacity="0.9"/>
    <rect x="340" y="17" width="70" height="16" rx="8" fill="#22223a"/>
    <rect x="420" y="17" width="80" height="16" rx="8" fill="#22223a"/>
    <rect x="800" y="13" width="80" height="24" rx="12" fill="#4df0c6" opacity="0.2"/>
    <rect x="808" y="18" width="64" height="14" rx="7" fill="#1c1c32"/>
    <rect x="814" y="21" width="52" height="8" rx="2" fill="#4df0c6" opacity="0.8"/>
    <circle cx="775" cy="25" r="11" fill="#22223a"/>
    <rect x="768" y="22" width="14" height="6" rx="2" fill="#6060a0"/>

    {/* Toolbar */}
    <rect x="0" y="51" width="900" height="52" fill="#13132a"/>
    <rect x="0" y="103" width="900" height="1" fill="#2a2a44"/>
    <rect x="20" y="63" width="120" height="14" rx="3" fill="#d0d0f0"/>
    <rect x="20" y="83" width="80" height="8" rx="2" fill="#4040a0" opacity="0.6"/>
    <rect x="220" y="60" width="240" height="32" rx="8" fill="#1c1c32"/>
    <rect x="232" y="71" width="120" height="10" rx="2" fill="#3a3a5a"/>
    <rect x="446" y="68" width="12" height="12" rx="2" fill="#4a4a70" opacity="0.5"/>
    <rect x="480" y="64" width="60" height="24" rx="12" fill="#1c1c32"/>
    <rect x="486" y="70" width="48" height="12" rx="6" fill="none" stroke="#2a2a44" strokeWidth="1"/>
    <rect x="490" y="73" width="36" height="6" rx="2" fill="#5050a0" opacity="0.7"/>
    <rect x="548" y="64" width="76" height="24" rx="12" fill="#4df0c6" opacity="0.15"/>
    <rect x="554" y="70" width="64" height="12" rx="6" fill="none" stroke="#4df0c6" strokeWidth="1" opacity="0.5"/>
    <rect x="558" y="73" width="52" height="6" rx="2" fill="#4df0c6" opacity="0.8"/>
    <rect x="632" y="64" width="68" height="24" rx="12" fill="#1c1c32"/>
    <rect x="638" y="70" width="56" height="12" rx="6" fill="none" stroke="#2a2a44" strokeWidth="1"/>
    <rect x="642" y="73" width="44" height="6" rx="2" fill="#5050a0" opacity="0.7"/>
    <rect x="790" y="62" width="90" height="28" rx="8" fill="#4df0c6" opacity="0.15"/>
    <rect x="790" y="62" width="90" height="28" rx="8" fill="none" stroke="#4df0c6" strokeWidth="1" opacity="0.4"/>
    <rect x="800" y="70" width="70" height="12" rx="3" fill="#4df0c6" opacity="0.8"/>

    {/* Table header */}
    <rect x="0" y="104" width="900" height="36" fill="#161626"/>
    <rect x="0" y="140" width="900" height="1" fill="#2a2a44"/>
    <rect x="20" y="118" width="14" height="14" rx="3" fill="none" stroke="#3a3a5a" strokeWidth="1.5"/>
    <rect x="50" y="121" width="80" height="8" rx="2" fill="#5050a0" opacity="0.8"/>
    <rect x="220" y="121" width="70" height="8" rx="2" fill="#5050a0" opacity="0.8"/>
    <rect x="370" y="121" width="60" height="8" rx="2" fill="#5050a0" opacity="0.8"/>
    <rect x="510" y="121" width="54" height="8" rx="2" fill="#5050a0" opacity="0.8"/>
    <rect x="572" y="121" width="8" height="8" rx="1" fill="#4df0c6" opacity="0.5"/>
    <rect x="640" y="121" width="60" height="8" rx="2" fill="#5050a0" opacity="0.8"/>
    <rect x="770" y="121" width="70" height="8" rx="2" fill="#5050a0" opacity="0.8"/>

    {/* Row 1 — selected */}
    <rect x="0" y="141" width="900" height="44" fill="#16122a"/>
    <rect x="0" y="141" width="3" height="44" fill="#4df0c6"/>
    <rect x="0" y="185" width="900" height="1" fill="#2a2a44"/>
    <rect x="20" y="155" width="14" height="14" rx="3" fill="#4df0c6" opacity="0.9"/>
    <rect x="23" y="159" width="5" height="3" rx="1" fill="#0f0f1a" transform="rotate(-45 23 160)"/>
    <circle cx="62" cy="163" r="12" fill="#2a2a44"/>
    <rect x="56" y="160" width="12" height="6" rx="2" fill="#6060a0"/>
    <rect x="82" y="155" width="100" height="10" rx="2" fill="#d0d0f0"/>
    <rect x="82" y="170" width="130" height="7" rx="2" fill="#5050a0" opacity="0.7"/>
    <rect x="220" y="158" width="70" height="10" rx="2" fill="#4df0c6" opacity="0.9"/>
    <rect x="370" y="158" width="90" height="10" rx="2" fill="#8080c0"/>
    <rect x="510" y="157" width="100" height="12" rx="6" fill="#22223a"/>
    <rect x="512" y="159" width="70" height="8" rx="4" fill="#4df0c6" opacity="0.6"/>
    <rect x="640" y="155" width="56" height="18" rx="9" fill="#4df0c6" opacity="0.15"/>
    <rect x="650" y="160" width="36" height="8" rx="2" fill="#4df0c6" opacity="0.9"/>
    <rect x="770" y="157" width="60" height="16" rx="8" fill="#22223a"/>
    <rect x="778" y="161" width="44" height="8" rx="2" fill="#6060a0"/>

    {/* Row 2 */}
    <rect x="0" y="186" width="900" height="44" fill="#0f0f1a"/>
    <rect x="0" y="230" width="900" height="1" fill="#1e1e32"/>
    <rect x="20" y="200" width="14" height="14" rx="3" fill="none" stroke="#2a2a44" strokeWidth="1.5"/>
    <circle cx="62" cy="208" r="12" fill="#22223a"/>
    <rect x="56" y="205" width="12" height="6" rx="2" fill="#5050a0"/>
    <rect x="82" y="200" width="110" height="10" rx="2" fill="#c0c0e0"/>
    <rect x="82" y="215" width="100" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
    <rect x="220" y="203" width="60" height="10" rx="2" fill="#9090d0"/>
    <rect x="370" y="203" width="80" height="10" rx="2" fill="#6060a0"/>
    <rect x="510" y="202" width="100" height="12" rx="6" fill="#22223a"/>
    <rect x="512" y="204" width="55" height="8" rx="4" fill="#8080c0" opacity="0.5"/>
    <rect x="640" y="200" width="70" height="18" rx="9" fill="#fbbf24" opacity="0.12"/>
    <rect x="650" y="205" width="50" height="8" rx="2" fill="#fbbf24" opacity="0.8"/>
    <rect x="770" y="202" width="60" height="16" rx="8" fill="#22223a"/>
    <rect x="778" y="206" width="44" height="8" rx="2" fill="#6060a0"/>

    {/* ── Row 3 hover highlight (animated) ── */}
    <motion.rect
      x="0" y="231" width="900" height="44"
      fill="#2a1838"
      animate={{ opacity: [0, 0, 0.65, 0.65, 0.65, 0, 0] }}
      transition={{ duration: 8, times: ROW_TIMES, repeat: Infinity }}
    />
    <motion.rect
      x="0" y="231" width="3" height="44"
      fill="#b06ef3"
      animate={{ opacity: [0, 0, 1, 1, 1, 0, 0] }}
      transition={{ duration: 8, times: ROW_TIMES, repeat: Infinity }}
    />
    {/* Row 3 static content */}
    <rect x="0" y="275" width="900" height="1" fill="#1e1e32"/>
    <rect x="20" y="245" width="14" height="14" rx="3" fill="none" stroke="#2a2a44" strokeWidth="1.5"/>
    <circle cx="62" cy="253" r="12" fill="#22223a"/>
    <rect x="56" y="250" width="12" height="6" rx="2" fill="#5050a0"/>
    <rect x="82" y="245" width="90" height="10" rx="2" fill="#c0c0e0"/>
    <rect x="82" y="260" width="120" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
    <rect x="220" y="248" width="80" height="10" rx="2" fill="#b06ef3" opacity="0.9"/>
    <rect x="370" y="248" width="90" height="10" rx="2" fill="#6060a0"/>
    <rect x="510" y="247" width="100" height="12" rx="6" fill="#22223a"/>
    <rect x="512" y="249" width="88" height="8" rx="4" fill="#b06ef3" opacity="0.5"/>
    <rect x="640" y="245" width="62" height="18" rx="9" fill="#b06ef3" opacity="0.12"/>
    <rect x="648" y="250" width="46" height="8" rx="2" fill="#b06ef3" opacity="0.9"/>
    <rect x="770" y="247" width="60" height="16" rx="8" fill="#22223a"/>
    <rect x="778" y="251" width="44" height="8" rx="2" fill="#6060a0"/>

    {/* Cursor tap pulse on row 3 */}
    <motion.circle
      cx="100" cy="253" r="6"
      fill="#b06ef3"
      animate={{ fillOpacity: [0, 0.4, 0, 0], r: [6, 12, 14, 6] }}
      transition={{ duration: 8, times: [0, 0.13, 0.20, 1], repeat: Infinity }}
    />

    {/* Rows 4–6 */}
    <rect x="0" y="276" width="900" height="44" fill="#0f0f1a"/>
    <rect x="0" y="320" width="900" height="1" fill="#1e1e32"/>
    <rect x="20" y="290" width="14" height="14" rx="3" fill="none" stroke="#2a2a44" strokeWidth="1.5"/>
    <circle cx="62" cy="298" r="12" fill="#22223a"/>
    <rect x="56" y="295" width="12" height="6" rx="2" fill="#5050a0"/>
    <rect x="82" y="290" width="105" height="10" rx="2" fill="#c0c0e0"/>
    <rect x="82" y="305" width="90" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
    <rect x="220" y="293" width="65" height="10" rx="2" fill="#9090d0"/>
    <rect x="370" y="293" width="85" height="10" rx="2" fill="#6060a0"/>
    <rect x="510" y="292" width="100" height="12" rx="6" fill="#22223a"/>
    <rect x="512" y="294" width="40" height="8" rx="4" fill="#4040a0" opacity="0.5"/>
    <rect x="640" y="290" width="56" height="18" rx="9" fill="#4df0c6" opacity="0.12"/>
    <rect x="650" y="295" width="36" height="8" rx="2" fill="#4df0c6" opacity="0.8"/>
    <rect x="770" y="292" width="60" height="16" rx="8" fill="#22223a"/>
    <rect x="778" y="296" width="44" height="8" rx="2" fill="#6060a0"/>

    <rect x="0" y="321" width="900" height="44" fill="#131322"/>
    <rect x="0" y="365" width="900" height="1" fill="#1e1e32"/>
    <rect x="20" y="335" width="14" height="14" rx="3" fill="none" stroke="#2a2a44" strokeWidth="1.5"/>
    <circle cx="62" cy="343" r="12" fill="#22223a"/>
    <rect x="56" y="340" width="12" height="6" rx="2" fill="#5050a0"/>
    <rect x="82" y="335" width="95" height="10" rx="2" fill="#c0c0e0"/>
    <rect x="82" y="350" width="110" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
    <rect x="220" y="338" width="50" height="10" rx="2" fill="#9090d0"/>
    <rect x="370" y="338" width="70" height="10" rx="2" fill="#6060a0"/>
    <rect x="510" y="337" width="100" height="12" rx="6" fill="#22223a"/>
    <rect x="512" y="339" width="62" height="8" rx="4" fill="#6060a0" opacity="0.5"/>
    <rect x="640" y="335" width="62" height="18" rx="9" fill="#ef4444" opacity="0.1"/>
    <rect x="650" y="340" width="42" height="8" rx="2" fill="#ef4444" opacity="0.7"/>
    <rect x="770" y="337" width="60" height="16" rx="8" fill="#22223a"/>
    <rect x="778" y="341" width="44" height="8" rx="2" fill="#6060a0"/>

    <rect x="0" y="366" width="900" height="44" fill="#0f0f1a"/>
    <rect x="0" y="410" width="900" height="1" fill="#1e1e32"/>
    <rect x="20" y="380" width="14" height="14" rx="3" fill="none" stroke="#2a2a44" strokeWidth="1.5"/>
    <circle cx="62" cy="388" r="12" fill="#22223a"/>
    <rect x="56" y="385" width="12" height="6" rx="2" fill="#5050a0"/>
    <rect x="82" y="380" width="115" height="10" rx="2" fill="#c0c0e0"/>
    <rect x="82" y="395" width="80" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
    <rect x="220" y="383" width="72" height="10" rx="2" fill="#b06ef3" opacity="0.7"/>
    <rect x="370" y="383" width="92" height="10" rx="2" fill="#6060a0"/>
    <rect x="510" y="382" width="100" height="12" rx="6" fill="#22223a"/>
    <rect x="512" y="384" width="76" height="8" rx="4" fill="#4df0c6" opacity="0.4"/>
    <rect x="640" y="380" width="56" height="18" rx="9" fill="#4df0c6" opacity="0.12"/>
    <rect x="650" y="385" width="36" height="8" rx="2" fill="#4df0c6" opacity="0.8"/>
    <rect x="770" y="382" width="60" height="16" rx="8" fill="#22223a"/>
    <rect x="778" y="386" width="44" height="8" rx="2" fill="#6060a0"/>

    {/* Pagination bar */}
    <rect x="0" y="510" width="900" height="50" fill="#13132a"/>
    <rect x="0" y="510" width="900" height="1" fill="#2a2a44"/>
    <rect x="20" y="522" width="120" height="10" rx="2" fill="#3a3a5a"/>
    <rect x="380" y="519" width="28" height="22" rx="4" fill="#22223a"/>
    <rect x="386" y="524" width="16" height="12" rx="2" fill="#3a3a5a"/>
    <rect x="416" y="519" width="28" height="22" rx="4" fill="#4df0c6" opacity="0.2"/>
    <rect x="422" y="524" width="16" height="12" rx="2" fill="#4df0c6" opacity="0.8"/>
    <rect x="452" y="519" width="28" height="22" rx="4" fill="#22223a"/>
    <rect x="458" y="524" width="16" height="12" rx="2" fill="#3a3a5a"/>
    <rect x="488" y="519" width="28" height="22" rx="4" fill="#22223a"/>
    <rect x="494" y="524" width="16" height="12" rx="2" fill="#3a3a5a"/>
    <rect x="750" y="522" width="130" height="10" rx="2" fill="#3a3a5a"/>

    {/* ── Donor panel — slides in from right ── */}
    <motion.g
      animate={{ x: [340, 340, 0, 0, 340, 340] }}
      transition={{
        duration: 8,
        times: PANEL_TIMES,
        repeat: Infinity,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      }}
    >
      {/* Panel background */}
      <rect x="560" y="104" width="340" height="456" fill="#131328"/>
      <rect x="560" y="104" width="1" height="456" fill="#2a2a44"/>

      {/* Panel header */}
      <rect x="560" y="104" width="340" height="64" fill="#16162e"/>
      <rect x="560" y="168" width="340" height="1" fill="#2a2a44"/>
      <circle cx="600" cy="136" r="20" fill="#22223a"/>
      <rect x="590" y="130" width="20" height="12" rx="4" fill="#3a3a5a"/>
      <rect x="630" y="122" width="120" height="12" rx="3" fill="#d0d0f0"/>
      <rect x="630" y="140" width="160" height="8" rx="2" fill="#5050a0" opacity="0.7"/>
      <rect x="630" y="153" width="80" height="8" rx="2" fill="#4df0c6" opacity="0.7"/>
      <rect x="874" y="112" width="18" height="18" rx="4" fill="#22223a"/>
      <rect x="879" y="117" width="8" height="2" rx="1" fill="#6060a0" transform="rotate(45 879 117)"/>
      <rect x="879" y="124" width="8" height="2" rx="1" fill="#6060a0" transform="rotate(-45 879 124)"/>

      {/* Panel tabs */}
      <rect x="560" y="169" width="340" height="36" fill="#13132a"/>
      <rect x="560" y="205" width="340" height="1" fill="#2a2a44"/>
      <rect x="572" y="180" width="70" height="14" rx="7" fill="#1c1c34"/>
      <rect x="576" y="184" width="62" height="6" rx="3" fill="#6060a0"/>
      <rect x="652" y="180" width="80" height="14" rx="7" fill="#4df0c6" opacity="0.15"/>
      <rect x="656" y="184" width="72" height="6" rx="3" fill="#4df0c6" opacity="0.8"/>
      <rect x="742" y="180" width="60" height="14" rx="7" fill="#1c1c34"/>
      <rect x="746" y="184" width="52" height="6" rx="3" fill="#6060a0"/>

      {/* Giving history label */}
      <rect x="576" y="218" width="80" height="8" rx="2" fill="#4040a0" opacity="0.6"/>

      {/* Chart container */}
      <rect x="576" y="236" width="308" height="80" rx="6" fill="#1c1c32"/>

      {/* Chart baseline */}
      <rect x="580" y="306" width="298" height="1" fill="#2a2a44"/>

      {/* Animated chart bars */}
      {BARS.map(([bx, finalY, finalH, op], i) => {
        const t0 = 0.35 + i * 0.022;
        const t1 = Math.min(t0 + 0.13, 0.78);
        return (
          <motion.rect
            key={bx}
            x={bx}
            width="16"
            rx="2"
            fill="#4df0c6"
            opacity={op}
            animate={{
              height: [0, 0, finalH, finalH, 0],
              y: [306, 306, finalY, finalY, 306],
            }}
            transition={{
              duration: 8,
              times: [0, t0, t1, 0.82, 0.90],
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Stats row */}
      <rect x="576" y="328" width="90" height="44" rx="6" fill="#1c1c32"/>
      <rect x="586" y="338" width="60" height="12" rx="3" fill="#4df0c6" opacity="0.9"/>
      <rect x="586" y="354" width="50" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
      <rect x="676" y="328" width="90" height="44" rx="6" fill="#1c1c32"/>
      <rect x="686" y="338" width="50" height="12" rx="3" fill="#d0d0f0"/>
      <rect x="686" y="354" width="60" height="7" rx="2" fill="#4040a0" opacity="0.6"/>
      <rect x="776" y="328" width="90" height="44" rx="6" fill="#1c1c32"/>
      <rect x="786" y="338" width="55" height="12" rx="3" fill="#b06ef3" opacity="0.9"/>
      <rect x="786" y="354" width="65" height="7" rx="2" fill="#4040a0" opacity="0.6"/>

      {/* Engagement timeline */}
      <rect x="576" y="386" width="80" height="8" rx="2" fill="#4040a0" opacity="0.6"/>
      <rect x="576" y="402" width="308" height="1" fill="#2a2a44"/>
      <circle cx="588" cy="422" r="5" fill="#4df0c6" opacity="0.6"/>
      <rect x="598" y="418" width="150" height="8" rx="2" fill="#9090c0"/>
      <rect x="760" y="418" width="60" height="8" rx="2" fill="#3a3a5a"/>
      <circle cx="588" cy="442" r="5" fill="#2a2a44"/>
      <rect x="595" y="440" width="2" height="14" fill="#2a2a44"/>
      <rect x="598" y="438" width="120" height="8" rx="2" fill="#5050a0" opacity="0.7"/>
      <rect x="760" y="438" width="60" height="8" rx="2" fill="#3a3a5a"/>
      <circle cx="588" cy="458" r="5" fill="#b06ef3" opacity="0.5"/>
      <rect x="598" y="454" width="140" height="8" rx="2" fill="#5050a0" opacity="0.7"/>
      <rect x="760" y="454" width="60" height="8" rx="2" fill="#3a3a5a"/>

      {/* Panel action buttons */}
      <rect x="576" y="490" width="140" height="30" rx="8" fill="#4df0c6" opacity="0.15"/>
      <rect x="576" y="490" width="140" height="30" rx="8" fill="none" stroke="#4df0c6" strokeWidth="1" opacity="0.5"/>
      <rect x="606" y="499" width="80" height="12" rx="3" fill="#4df0c6" opacity="0.9"/>
      <rect x="726" y="490" width="140" height="30" rx="8" fill="#22223a"/>
      <rect x="746" y="499" width="100" height="12" rx="3" fill="#6060a0"/>
    </motion.g>
  </svg>
);

export default DonorDirectoryAnimation;
