import type { ReactNode } from 'react';

function BrowserFrame({ x, y, width, height, children }: {
  x: number;
  y: number;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={width} height={height} rx="10" className="art-window" />
      <path d={`M0 21H${width}`} className="art-rule" />
      <circle cx="12" cy="11" r="2" className="art-lilac" />
      <path d="M20 11h7m5 0h7" className="art-detail" />
      {children}
    </g>
  );
}

function LandingPage() {
  return (
    <BrowserFrame x={18} y={14} width={284} height={152}>
      <path d="M224 11h17m9 0h20" className="art-detail" />
      <g className="art-landing-headline">
        <text x="17" y="48" className="art-caption art-lilac">Launch campaign</text>
        <text x="17" y="72" className="art-title">One clear offer.</text>
        <text x="17" y="90" className="art-copy">Give visitors a next step.</text>
      </g>
      <g className="art-landing-action">
        <rect x="16" y="104" width="89" height="23" rx="5" className="art-lilac" />
        <text x="26" y="119" className="art-button-text">Get started</text>
        <path d="M88 115h7m-3-3 3 3-3 3" className="art-ink-line" />
      </g>
      <rect x="166" y="34" width="103" height="103" rx="8" className="art-violet-panel" />
      <path d="M173 126 238 41h23l-64 85Z" className="art-violet" />
      <path d="M204 126 261 52v44l-23 30Z" className="art-lilac" />
      <circle cx="202" cy="61" r="14" className="art-rose" />
      <path d="M17 139h124" className="art-rule" />
    </BrowserFrame>
  );
}

function BusinessWebsite() {
  return (
    <>
      <BrowserFrame x={18} y={14} width={249} height={144}>
        <path d="M173 11h13m8 0h14m8 0h14" className="art-detail" />
        <path d="m14 41 7-7 7 7-7 7Z" className="art-lilac" />
        <text x="34" y="44" className="art-caption">STUDIO</text>
        <text x="14" y="70" className="art-title">Built to be found.</text>
        <text x="14" y="87" className="art-copy">Meet the team. See the work.</text>
        <rect x="178" y="33" width="54" height="58" rx="5" className="art-violet-panel" />
        <path d="M184 82V61l13-12 12 12v21Zm22 0V65l10-9 10 9v17Z" className="art-lilac" />
        {[['Services', 14], ['Work', 86], ['Contact', 158]].map(([label, x]) => (
          <g key={label} transform={`translate(${x} 104)`}>
            <rect width="65" height="28" rx="5" className="art-panel" />
            <text x="8" y="17" className="art-copy">{label}</text>
          </g>
        ))}
      </BrowserFrame>
      <g className="art-business-phone">
        <rect x="232" y="50" width="68" height="117" rx="11" className="art-foreground" />
        <path d="M255 59h22" className="art-detail" />
        <text x="241" y="76" className="art-caption">STUDIO</text>
        <rect x="240" y="81" width="52" height="25" rx="4" className="art-violet-panel" />
        <path d="M245 101v-9l8-7 8 7v9Zm15 0v-7l6-5 7 5v7Z" className="art-lilac" />
        <text x="242" y="120" className="art-copy">Our services</text>
        <path d="M243 130h43m-43 10h36m-36 10h43" className="art-detail" />
      </g>
    </>
  );
}

function WebsiteRedesign() {
  return (
    <>
      <text x="19" y="26" className="art-caption art-muted">Before</text>
      <text x="175" y="26" className="art-caption art-lilac">After</text>
      <g className="art-redesign-old">
        <BrowserFrame x={18} y={35} width={116} height={111}>
          <rect x="9" y="30" width="98" height="22" rx="3" className="art-panel" />
          <text x="15" y="44" className="art-copy">Home</text>
          <path d="M10 64h93m-93 8h88m-88 8h96m-96 8h75" className="art-detail" />
          <rect x="10" y="96" width="37" height="7" rx="2" className="art-panel" />
        </BrowserFrame>
      </g>
      <path d="M143 94h19m-6-6 6 6-6 6" className="art-accent-line" />
      <g className="art-redesign-new">
        <BrowserFrame x={175} y={35} width={127} height={111}>
          <path d="M99 11h14" className="art-detail" />
          <rect x="12" y="31" width="102" height="37" rx="6" className="art-violet-panel" />
          <path d="M91 62l13-24h9L100 62Z" className="art-lilac" />
          <text x="19" y="54" className="art-small-title">Start here.</text>
          <text x="12" y="82" className="art-copy">A clearer next step.</text>
          <rect x="12" y="90" width="49" height="13" rx="3" className="art-rose" />
          <text x="18" y="99" className="art-button-text art-small">Explore</text>
        </BrowserFrame>
      </g>
    </>
  );
}

function Ecommerce() {
  return (
    <BrowserFrame x={18} y={14} width={284} height={152}>
      <text x="14" y="44" className="art-small-title">Objects for everyday</text>
      <path d="M17 55h250" className="art-rule" />
      <rect x="13" y="65" width="73" height="49" rx="6" className="art-violet-panel" />
      <path d="M34 82h32l3 24H31Zm7 0v-5a9 9 0 0 1 18 0v5" className="art-product" />
      <text x="15" y="127" className="art-copy">Canvas tote</text>
      <text x="15" y="140" className="art-caption">$34</text>
      <g className="art-shop-selection">
        <rect x="96" y="65" width="73" height="49" rx="6" className="art-panel" />
        <path d="M124 83h18v20h-18Zm4-12h10v12h-10Zm2-4h6v4h-6Z" className="art-rose" />
        <text x="98" y="127" className="art-copy">Hand wash</text>
        <text x="98" y="140" className="art-caption">$28</text>
      </g>
      <rect x="182" y="65" width="89" height="75" rx="7" className="art-foreground" />
      <g className="art-shop-cart">
        <text x="191" y="81" className="art-caption">Your bag</text>
        <circle cx="255" cy="78" r="7" className="art-rose" />
        <text x="191" y="100" className="art-copy">Total</text>
        <g className="art-before-update">
          <text x="255" y="81" textAnchor="middle" className="art-button-text art-small">1</text>
          <text x="239" y="100" className="art-caption">$34</text>
        </g>
        <g className="art-after-update">
          <text x="255" y="81" textAnchor="middle" className="art-button-text art-small">2</text>
          <text x="239" y="100" className="art-caption">$62</text>
        </g>
        <rect x="190" y="109" width="73" height="21" rx="4" className="art-lilac" />
        <text x="203" y="123" className="art-button-text">Checkout</text>
      </g>
    </BrowserFrame>
  );
}

function WebApp() {
  return (
    <BrowserFrame x={18} y={14} width={284} height={152}>
      <path d="M73 21v131" className="art-rule" />
      <text x="11" y="44" className="art-caption">Workspace</text>
      <rect x="8" y="54" width="56" height="20" rx="4" className="art-violet-panel" />
      <text x="14" y="67" className="art-copy">Overview</text>
      <text x="14" y="89" className="art-copy">Queue</text>
      <text x="14" y="108" className="art-copy">Reports</text>
      <rect x="85" y="31" width="83" height="39" rx="5" className="art-panel" />
      <rect x="175" y="31" width="94" height="39" rx="5" className="art-panel" />
      <text x="93" y="45" className="art-copy">Open</text>
      <text x="93" y="63" className="art-small-title">12</text>
      <text x="183" y="45" className="art-copy">Queued</text>
      <text x="183" y="63" className="art-small-title">04</text>
      <rect x="85" y="80" width="118" height="58" rx="5" className="art-foreground" />
      <path d="M94 100h101m-101 13h101m-101 13h101" className="art-rule" />
      <path d="m94 124 17-8 17 1 15-15 15 4 18-13 18-5v41H94Z" className="art-chart-fill" />
      <path d="m94 124 17-8 17 1 15-15 15 4 18-13 18-5" className="art-accent-line" />
      <path d="m94 124 17-8 17 1 15-15 15 4 18-13 18-5" pathLength="1" className="art-highlight-line art-app-chart" />
      <text x="212" y="93" className="art-caption">Queue</text>
      <path d="M215 104h47m-47 12h47m-47 12h47" className="art-detail" />
      <circle cx="262" cy="104" r="2.5" className="art-lilac" />
      <circle cx="262" cy="116" r="2.5" className="art-rose" />
    </BrowserFrame>
  );
}

function OngoingSupport() {
  return (
    <BrowserFrame x={18} y={14} width={284} height={152}>
      <circle cx="32" cy="50" r="15" className="art-health-panel" />
      <path d="m25 50 5 5 9-10" className="art-health-line" />
      <text x="55" y="48" className="art-small-title">System health</text>
      <text x="55" y="63" className="art-copy art-health">Operational</text>
      <path d="M17 74h250" className="art-rule" />
      {[
        { label: 'Performance', y: 91, status: 'Reviewed' },
        { label: 'Monitoring', y: 133, status: 'Active' },
      ].map(({ label, y, status }) => (
        <g key={label} transform={`translate(0 ${y})`}>
          <circle cx="20" cy="-3" r="3" className="art-health" />
          <text x="31" className="art-copy">{label}</text>
          <text x="211" className="art-copy art-health">{status}</text>
        </g>
      ))}
      <circle cx="20" cy="109" r="3" className="art-before-update art-muted" />
      <path d="m16 109 3 3 6-7" className="art-after-update art-health-line" />
      <text x="31" y="112" className="art-copy">Updates</text>
      <text x="211" y="112" className="art-before-update art-copy">Queued</text>
      <text x="211" y="112" className="art-after-update art-copy art-health">Applied</text>
      <rect x="120" y="106" width="73" height="6" rx="3" className="art-panel" />
      <rect x="120" y="106" width="46" height="6" rx="3" className="art-health art-support-progress" />
    </BrowserFrame>
  );
}

function MotionDesign() {
  return (
    <BrowserFrame x={18} y={14} width={284} height={152}>
      <text x="202" y="15" className="art-copy">Motion studio</text>
      <rect x="15" y="29" width="254" height="66" rx="6" className="art-foreground" />
      <path d="M108 89 150 36h88l-42 53Z" className="art-violet-panel" />
      <path d="M151 89 194 36h39l-43 53Z" className="art-lilac" />
      <g className="art-motion-disc">
        <circle cx="153" cy="63" r="20" className="art-rose" />
        <path d="M144 48h7v30h-7Zm10 0h4v30h-4Zm7 0h2v30h-2Z" className="art-violet" />
      </g>
      <path d="M73 78 107 43h12L85 78Z" className="art-violet" />
      <path d="m23 104 9 5-9 5Z" className="art-lilac" />
      <path d="M40 109h8m7 0h13" className="art-detail" />
      <path d="M89 109h174" className="art-rule" />
      <rect x="17" y="120" width="86" height="8" rx="3" className="art-violet" />
      <rect x="107" y="120" width="103" height="8" rx="3" className="art-lilac" />
      <rect x="74" y="134" width="113" height="8" rx="3" className="art-violet-panel" />
      <rect x="191" y="134" width="75" height="8" rx="3" className="art-rose" />
      <g className="art-motion-playhead">
        <path d="m142 104 8 0-4 5Z" className="art-rose" />
        <path d="M146 107v39" className="art-highlight-line" />
      </g>
    </BrowserFrame>
  );
}

function ProductDesign() {
  return (
    <BrowserFrame x={18} y={14} width={284} height={152}>
      <text x="14" y="43" className="art-caption">Type &amp; form</text>
      <text x="142" y="43" className="art-caption">Palette</text>
      <text x="13" y="106" className="art-specimen">Aa</text>
      <path d="M14 115h102m-102 9h76" className="art-rule" />
      <path d="M128 31v105" className="art-rule" />
      <g className="art-design-palette">
        <rect x="142" y="53" width="22" height="26" rx="4" className="art-highlight" />
        <rect x="171" y="53" width="22" height="26" rx="4" className="art-lilac" />
        <rect x="200" y="53" width="22" height="26" rx="4" className="art-rose" />
        <rect x="229" y="53" width="22" height="26" rx="4" className="art-violet" />
      </g>
      <text x="142" y="99" className="art-caption">Components</text>
      <rect x="141" y="109" width="69" height="23" rx="5" className="art-lilac" />
      <text x="153" y="124" className="art-button-text">Primary</text>
      <rect x="217" y="109" width="40" height="23" rx="5" className="art-panel" />
      <path d="M227 121h19m-14-5-5 5 5 5" className="art-accent-line" />
    </BrowserFrame>
  );
}

const illustrations = {
  'landing-page': LandingPage,
  'business-website': BusinessWebsite,
  'website-redesign': WebsiteRedesign,
  ecommerce: Ecommerce,
  'web-app': WebApp,
  'ongoing-support': OngoingSupport,
  'video-motion': MotionDesign,
  'graphic-product-design': ProductDesign,
};

export type ServiceIllustrationId = keyof typeof illustrations;

export default function ServiceIllustration({ id }: { id: ServiceIllustrationId }) {
  const Artwork = illustrations[id];

  return (
    <div className="studio-service-art" data-service-art={id} aria-hidden="true">
      <svg viewBox="0 0 320 180" width="320" height="180" focusable="false">
        <Artwork />
      </svg>
    </div>
  );
}
