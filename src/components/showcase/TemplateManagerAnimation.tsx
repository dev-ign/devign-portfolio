import React from 'react';
import { motion } from 'motion/react';

interface Props {
  className?: string;
}

const DUR = 8;

const TemplateManagerAnimation: React.FC<Props> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 900 560"
    className={className}
    aria-hidden="true"
  >
    {/* ── Static background ── */}
    <rect width="900" height="560" fill="#0f0f1a" />

    {/* ── Top nav bar ── */}
    <rect width="900" height="50" fill="#16162a" />
    <rect y="50" width="900" height="1" fill="#2a2a44" />
    {/* Logo icon */}
    <rect x="16" y="15" width="18" height="18" rx="4" fill="#7B8CDE" opacity="0.85" />
    <rect x="19" y="18" width="5" height="5" rx="1" fill="#0f0f1a" opacity="0.35" />
    <rect x="25" y="18" width="5" height="5" rx="1" fill="#0f0f1a" opacity="0.35" />
    <rect x="19" y="24" width="5" height="5" rx="1" fill="#0f0f1a" opacity="0.35" />
    {/* App name */}
    <rect x="42" y="20" width="100" height="10" rx="2" fill="#d0d0f0" />
    {/* Nav tabs */}
    <rect x="200" y="17" width="72" height="16" rx="8" fill="#22223a" />
    <rect x="207" y="21" width="58" height="8" rx="2" fill="#5050a0" opacity="0.7" />
    <rect x="282" y="17" width="90" height="16" rx="8" fill="#7B8CDE" opacity="0.14" />
    <rect x="282" y="17" width="90" height="16" rx="8" fill="none" stroke="#7B8CDE" strokeWidth="1" opacity="0.4" />
    <rect x="289" y="21" width="76" height="8" rx="2" fill="#7B8CDE" opacity="0.9" />
    <rect x="382" y="17" width="72" height="16" rx="8" fill="#22223a" />
    <rect x="389" y="21" width="58" height="8" rx="2" fill="#5050a0" opacity="0.7" />
    {/* User avatar */}
    <circle cx="864" cy="25" r="13" fill="#22223a" />
    <rect x="856" y="21" width="16" height="8" rx="3" fill="#3a3a5a" />
    <rect x="828" y="16" width="22" height="18" rx="4" fill="#22223a" />
    <rect x="833" y="21" width="12" height="8" rx="2" fill="#3a3a5a" />

    {/* ── Sidebar ── */}
    <rect x="0" y="51" width="188" height="509" fill="#0d0d1e" />
    <rect x="188" y="51" width="1" height="509" fill="#2a2a44" />

    {/* Templates nav — active */}
    <rect x="8" y="62" width="172" height="26" rx="5" fill="#7B8CDE" opacity="0.12" />
    <rect x="8" y="62" width="3" height="26" rx="1" fill="#7B8CDE" opacity="0.9" />
    <rect x="20" y="69" width="12" height="12" rx="3" fill="#7B8CDE" opacity="0.75" />
    <rect x="38" y="72" width="64" height="8" rx="2" fill="#7B8CDE" opacity="0.9" />

    {/* Settings nav */}
    <rect x="20" y="103" width="12" height="12" rx="3" fill="#3a3a5a" />
    <rect x="38" y="106" width="50" height="8" rx="2" fill="#4a4a6a" opacity="0.8" />

    {/* Users nav */}
    <rect x="20" y="131" width="12" height="12" rx="3" fill="#3a3a5a" />
    <rect x="38" y="134" width="38" height="8" rx="2" fill="#4a4a6a" opacity="0.8" />

    {/* Section divider */}
    <rect x="12" y="152" width="164" height="1" fill="#22223a" />

    {/* LIBRARIES label */}
    <rect x="12" y="161" width="54" height="7" rx="2" fill="#4040a0" opacity="0.5" />

    {/* ── Annual Fund folder — animated highlight ── */}
    <motion.rect
      x={1} y={173} width={186} height={30}
      fill="#7B8CDE"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 0, 0.13, 0.13, 0, 0] }}
      transition={{ duration: DUR, times: [0, 0.375, 0.43, 0.46, 0.875, 0.9375, 1], repeat: Infinity }}
    />
    <motion.rect
      x={1} y={173} width={3} height={30}
      fill="#7B8CDE"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 0, 1, 1, 0, 0] }}
      transition={{ duration: DUR, times: [0, 0.375, 0.43, 0.46, 0.875, 0.9375, 1], repeat: Infinity }}
    />
    {/* Annual Fund folder icon + label */}
    <rect x="18" y="183" width="14" height="10" rx="2" fill="#5050a0" opacity="0.75" />
    <rect x="18" y="181" width="8" height="4" rx="1" fill="#5050a0" opacity="0.75" />
    <rect x="38" y="185" width="74" height="8" rx="2" fill="#9090c0" />

    {/* ── Success pill — animated ── */}
    <motion.g
      animate={{
        opacity: [0, 0, 1, 1, 0, 0],
        y: [6, 6, 0, 0, -2, -2],
      }}
      transition={{ duration: DUR, times: [0, 0.625, 0.6875, 0.875, 0.9375, 1], repeat: Infinity }}
    >
      <rect x="12" y="207" width="168" height="20" rx="10" fill="#7B8CDE" opacity="0.18" />
      <rect x="12" y="207" width="168" height="20" rx="10" fill="none" stroke="#7B8CDE" strokeWidth="1" opacity="0.45" />
      <circle cx="25" cy="217" r="5" fill="#7B8CDE" opacity="0.25" />
      <circle cx="25" cy="217" r="5" fill="none" stroke="#7B8CDE" strokeWidth="1" opacity="0.8" />
      <path d="M 22 217 L 24 219.5 L 28 215" stroke="#7B8CDE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
      <rect x="36" y="213" width="136" height="8" rx="2" fill="#7B8CDE" opacity="0.85" />
    </motion.g>

    {/* Year-End folder */}
    <rect x="18" y="241" width="14" height="10" rx="2" fill="#3a3a5a" opacity="0.7" />
    <rect x="18" y="239" width="8" height="4" rx="1" fill="#3a3a5a" opacity="0.7" />
    <rect x="38" y="244" width="58" height="8" rx="2" fill="#5a5a7a" />

    {/* Events folder */}
    <rect x="18" y="275" width="14" height="10" rx="2" fill="#3a3a5a" opacity="0.7" />
    <rect x="18" y="273" width="8" height="4" rx="1" fill="#3a3a5a" opacity="0.7" />
    <rect x="38" y="278" width="44" height="8" rx="2" fill="#5a5a7a" />

    {/* Stewardship folder */}
    <rect x="18" y="309" width="14" height="10" rx="2" fill="#3a3a5a" opacity="0.7" />
    <rect x="18" y="307" width="8" height="4" rx="1" fill="#3a3a5a" opacity="0.7" />
    <rect x="38" y="312" width="78" height="8" rx="2" fill="#5a5a7a" />

    {/* ── Main toolbar ── */}
    <rect x="189" y="51" width="711" height="44" fill="#13132a" />
    <rect x="189" y="95" width="711" height="1" fill="#2a2a44" />
    <rect x="210" y="63" width="136" height="12" rx="3" fill="#d0d0f0" />
    <rect x="210" y="81" width="200" height="8" rx="2" fill="#4040a0" opacity="0.55" />
    {/* Filter tabs */}
    <rect x="508" y="59" width="74" height="26" rx="13" fill="#7B8CDE" opacity="0.15" />
    <rect x="508" y="59" width="74" height="26" rx="13" fill="none" stroke="#7B8CDE" strokeWidth="1" opacity="0.45" />
    <rect x="521" y="68" width="48" height="8" rx="2" fill="#7B8CDE" opacity="0.85" />
    <rect x="590" y="59" width="74" height="26" rx="13" fill="#22223a" />
    <rect x="601" y="68" width="52" height="8" rx="2" fill="#4a4a6a" opacity="0.8" />
    <rect x="672" y="59" width="74" height="26" rx="13" fill="#22223a" />
    <rect x="683" y="68" width="52" height="8" rx="2" fill="#4a4a6a" opacity="0.8" />
    {/* New Template button */}
    <rect x="766" y="59" width="116" height="26" rx="7" fill="#7B8CDE" opacity="0.18" />
    <rect x="766" y="59" width="116" height="26" rx="7" fill="none" stroke="#7B8CDE" strokeWidth="1" opacity="0.45" />
    <rect x="783" y="67" width="82" height="10" rx="2" fill="#7B8CDE" opacity="0.9" />

    {/* ── Table header ── */}
    <rect x="189" y="96" width="711" height="34" fill="#161626" />
    <rect x="189" y="130" width="711" height="1" fill="#2a2a44" />
    <rect x="218" y="112" width="100" height="8" rx="2" fill="#4040a0" opacity="0.65" />
    <rect x="418" y="112" width="72" height="8" rx="2" fill="#4040a0" opacity="0.65" />
    <rect x="556" y="112" width="82" height="8" rx="2" fill="#4040a0" opacity="0.65" />
    <rect x="678" y="112" width="52" height="8" rx="2" fill="#4040a0" opacity="0.65" />

    {/* ── Row 1 (static) ── */}
    <rect x="189" y="131" width="711" height="47" fill="#0f0f1a" />
    <rect x="189" y="178" width="711" height="1" fill="#1e1e32" />
    <rect x="206" y="143" width="28" height="22" rx="4" fill="#22223a" />
    <rect x="210" y="147" width="20" height="14" rx="2" fill="#2e2e4a" />
    <rect x="246" y="143" width="116" height="10" rx="2" fill="#c0c0e0" />
    <rect x="246" y="158" width="158" height="7" rx="2" fill="#4040a0" opacity="0.5" />
    <rect x="418" y="145" width="74" height="14" rx="7" fill="#22223a" />
    <rect x="426" y="149" width="58" height="6" rx="3" fill="#5050a0" opacity="0.7" />
    <rect x="556" y="149" width="78" height="8" rx="2" fill="#5050a0" opacity="0.55" />
    <rect x="678" y="144" width="60" height="16" rx="8" fill="#4df0c6" opacity="0.1" />
    <rect x="688" y="149" width="40" height="6" rx="2" fill="#4df0c6" opacity="0.65" />
    <circle cx="820" cy="154" r="3" fill="#3a3a5a" />
    <circle cx="832" cy="154" r="3" fill="#3a3a5a" />
    <circle cx="844" cy="154" r="3" fill="#3a3a5a" />

    {/* ── Row 2 (static) ── */}
    <rect x="189" y="179" width="711" height="47" fill="#131322" />
    <rect x="189" y="226" width="711" height="1" fill="#1e1e32" />
    <rect x="206" y="191" width="28" height="22" rx="4" fill="#22223a" />
    <rect x="210" y="195" width="20" height="14" rx="2" fill="#2e2e4a" />
    <rect x="246" y="191" width="132" height="10" rx="2" fill="#c0c0e0" />
    <rect x="246" y="206" width="104" height="7" rx="2" fill="#4040a0" opacity="0.5" />
    <rect x="418" y="193" width="86" height="14" rx="7" fill="#22223a" />
    <rect x="426" y="197" width="70" height="6" rx="3" fill="#5050a0" opacity="0.7" />
    <rect x="556" y="197" width="68" height="8" rx="2" fill="#5050a0" opacity="0.55" />
    <rect x="678" y="192" width="68" height="16" rx="8" fill="#fbbf24" opacity="0.1" />
    <rect x="688" y="197" width="48" height="6" rx="2" fill="#fbbf24" opacity="0.65" />
    <circle cx="820" cy="202" r="3" fill="#3a3a5a" />
    <circle cx="832" cy="202" r="3" fill="#3a3a5a" />
    <circle cx="844" cy="202" r="3" fill="#3a3a5a" />

    {/* ── Row 3 (ACTIVE) ── */}
    <rect x="189" y="227" width="711" height="47" fill="#0f0f1a" />
    <motion.rect
      x={189} y={227} width={711} height={47}
      fill="#191530"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{ duration: DUR, times: [0, 0.125, 0.1875, 0.875, 0.9375, 1], repeat: Infinity }}
    />
    <motion.rect
      x={189} y={227} width={3} height={47}
      fill="#7B8CDE"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{ duration: DUR, times: [0, 0.125, 0.1875, 0.875, 0.9375, 1], repeat: Infinity }}
    />
    <rect x="189" y="274" width="711" height="1" fill="#1e1e32" />
    {/* Row 3 content */}
    <rect x="206" y="239" width="28" height="22" rx="4" fill="#22223a" />
    <rect x="210" y="243" width="20" height="14" rx="2" fill="#7B8CDE" opacity="0.28" />
    <rect x="246" y="239" width="122" height="10" rx="2" fill="#d0d0f0" />
    <rect x="246" y="254" width="172" height="7" rx="2" fill="#4040a0" opacity="0.5" />
    <rect x="418" y="241" width="94" height="14" rx="7" fill="#7B8CDE" opacity="0.15" />
    <rect x="426" y="245" width="78" height="6" rx="3" fill="#7B8CDE" opacity="0.8" />
    <rect x="556" y="245" width="72" height="8" rx="2" fill="#5050a0" opacity="0.55" />
    <rect x="678" y="240" width="58" height="16" rx="8" fill="#7B8CDE" opacity="0.15" />
    <rect x="688" y="245" width="38" height="6" rx="2" fill="#7B8CDE" opacity="0.8" />
    <circle cx="820" cy="250" r="3" fill="#5050a0" opacity="0.8" />
    <circle cx="832" cy="250" r="3" fill="#5050a0" opacity="0.8" />
    <circle cx="844" cy="250" r="3" fill="#5050a0" opacity="0.8" />

    {/* Cursor tap pulse on action dots */}
    <motion.circle
      cx={832} cy={250} r={6}
      fill="#7B8CDE"
      initial={{ fillOpacity: 0, r: 6 }}
      animate={{ fillOpacity: [0, 0.45, 0, 0], r: [6, 15, 18, 6] }}
      transition={{ duration: DUR, times: [0, 0.265, 0.32, 1], repeat: Infinity }}
    />

    {/* ── Row 4 (static) ── */}
    <rect x="189" y="275" width="711" height="47" fill="#131322" />
    <rect x="189" y="322" width="711" height="1" fill="#1e1e32" />
    <rect x="206" y="287" width="28" height="22" rx="4" fill="#22223a" />
    <rect x="210" y="291" width="20" height="14" rx="2" fill="#2e2e4a" />
    <rect x="246" y="287" width="98" height="10" rx="2" fill="#c0c0e0" />
    <rect x="246" y="302" width="128" height="7" rx="2" fill="#4040a0" opacity="0.5" />
    <rect x="418" y="289" width="74" height="14" rx="7" fill="#22223a" />
    <rect x="426" y="293" width="58" height="6" rx="3" fill="#5050a0" opacity="0.7" />
    <rect x="556" y="293" width="86" height="8" rx="2" fill="#5050a0" opacity="0.55" />
    <rect x="678" y="288" width="58" height="16" rx="8" fill="#ef4444" opacity="0.1" />
    <rect x="688" y="293" width="38" height="6" rx="2" fill="#ef4444" opacity="0.6" />
    <circle cx="820" cy="298" r="3" fill="#3a3a5a" />
    <circle cx="832" cy="298" r="3" fill="#3a3a5a" />
    <circle cx="844" cy="298" r="3" fill="#3a3a5a" />

    {/* ── Row 5 (static) ── */}
    <rect x="189" y="323" width="711" height="47" fill="#0f0f1a" />
    <rect x="189" y="370" width="711" height="1" fill="#1e1e32" />
    <rect x="206" y="335" width="28" height="22" rx="4" fill="#22223a" />
    <rect x="210" y="339" width="20" height="14" rx="2" fill="#2e2e4a" />
    <rect x="246" y="335" width="110" height="10" rx="2" fill="#c0c0e0" />
    <rect x="246" y="350" width="86" height="7" rx="2" fill="#4040a0" opacity="0.5" />
    <rect x="418" y="337" width="82" height="14" rx="7" fill="#22223a" />
    <rect x="426" y="341" width="66" height="6" rx="3" fill="#5050a0" opacity="0.7" />
    <rect x="556" y="341" width="64" height="8" rx="2" fill="#5050a0" opacity="0.55" />
    <rect x="678" y="336" width="60" height="16" rx="8" fill="#4df0c6" opacity="0.1" />
    <rect x="688" y="341" width="40" height="6" rx="2" fill="#4df0c6" opacity="0.65" />
    <circle cx="820" cy="346" r="3" fill="#3a3a5a" />
    <circle cx="832" cy="346" r="3" fill="#3a3a5a" />
    <circle cx="844" cy="346" r="3" fill="#3a3a5a" />

    {/* ── Action dropdown menu ── */}
    <motion.g
      animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
      transition={{ duration: DUR, times: [0, 0.25, 0.3125, 0.875, 0.9375, 1], repeat: Infinity }}
    >
      <rect x="711" y="207" width="164" height="90" rx="8" fill="#1c1c34" />
      <rect x="711" y="207" width="164" height="90" rx="8" fill="none" stroke="#2e2e50" strokeWidth="1" />
      {/* Copy to Library — highlighted */}
      <rect x="715" y="211" width="156" height="26" rx="5" fill="#7B8CDE" opacity="0.16" />
      <rect x="727" y="219" width="96" height="8" rx="2" fill="#7B8CDE" opacity="0.9" />
      <rect x="835" y="218" width="8" height="8" rx="1" fill="#7B8CDE" opacity="0.4" />
      <rect x="837" y="216" width="8" height="8" rx="1" fill="#7B8CDE" opacity="0.22" />
      {/* Divider */}
      <rect x="719" y="239" width="148" height="1" fill="#2a2a44" />
      {/* Move to... */}
      <rect x="727" y="248" width="66" height="8" rx="2" fill="#7070a0" opacity="0.8" />
      {/* Divider */}
      <rect x="719" y="260" width="148" height="1" fill="#2a2a44" />
      {/* Set as Default */}
      <rect x="727" y="270" width="86" height="8" rx="2" fill="#7070a0" opacity="0.8" />
    </motion.g>

    {/* ── Template ghost ── */}
    {/*
      Ghost card children at x=246, y=233, w=180, h=32. Center: x=336, y=249.
      Annual Fund folder center: x=94, y=188. Delta: x=-242, y=-61.
    */}
    <motion.g
      animate={{
        x: [0, 0, 0, -242, -242, 0],
        y: [0, 0, 0, -61, -61, 0],
        opacity: [0, 0, 0.78, 0, 0, 0],
      }}
      transition={{
        duration: DUR,
        times: [0, 0.5, 0.515, 0.625, 0.64, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        repeat: Infinity,
      }}
    >
      <rect x="246" y="233" width="180" height="32" rx="5" fill="#7B8CDE" opacity="0.22" />
      <rect x="246" y="233" width="180" height="32" rx="5" fill="none" stroke="#7B8CDE" strokeWidth="1" opacity="0.55" />
      <rect x="254" y="240" width="18" height="18" rx="3" fill="#7B8CDE" opacity="0.35" />
      <rect x="257" y="244" width="10" height="2" rx="1" fill="#7B8CDE" opacity="0.8" />
      <rect x="257" y="248" width="8" height="2" rx="1" fill="#7B8CDE" opacity="0.6" />
      <rect x="278" y="240" width="80" height="8" rx="2" fill="#7B8CDE" opacity="0.8" />
      <rect x="278" y="253" width="60" height="6" rx="2" fill="#7B8CDE" opacity="0.5" />
    </motion.g>
  </svg>
);

export default TemplateManagerAnimation;
