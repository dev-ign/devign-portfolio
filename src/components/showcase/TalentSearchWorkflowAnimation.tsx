import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAPContext } from '@/hooks/useGSAPContext';
import { prefersReducedMotion } from '@/utils/deviceDetect';

interface Props {
  className?: string;
}

type Talent = {
  name: string;
  age: number;
  role: string;
  image: string;
};

const assetPath = (fileName: string) => `/talent-workflow/${fileName}`;

const talent: Talent[] = [
  { name: 'Rosa Maria', age: 28, role: 'Dancer', image: assetPath('talent-01.png') },
  { name: 'Mara C.', age: 24, role: 'Actor', image: assetPath('talent-02.png') },
  { name: 'Eli Stone', age: 31, role: 'Model', image: assetPath('talent-03.png') },
  { name: 'Nico K.', age: 26, role: 'Host', image: assetPath('talent-04.png') },
  { name: 'Sofia L.', age: 29, role: 'Dancer', image: assetPath('talent-05.png') },
  { name: 'Tao Reed', age: 33, role: 'Actor', image: assetPath('talent-06.png') },
  { name: 'Iris Vale', age: 27, role: 'Model', image: assetPath('talent-07.png') },
  { name: 'June Bell', age: 22, role: 'Singer', image: assetPath('talent-08.png') },
  { name: 'Leo Gray', age: 30, role: 'Dancer', image: assetPath('talent-09.png') },
  { name: 'Ana Noor', age: 25, role: 'Actor', image: assetPath('talent-10.png') },
  { name: 'Kai Moon', age: 28, role: 'Model', image: assetPath('talent-11.png') },
  { name: 'Mila West', age: 23, role: 'Dancer', image: assetPath('talent-12.png') },
];

const drawerImages = [
  'drawer-01.png',
  'drawer-02.png',
  'drawer-03.png',
  'drawer-04.png',
  'drawer-05.png',
  'drawer-06.png',
].map(assetPath);

const TalentSearchWorkflowAnimation: React.FC<Props> = ({ className }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAPContext(() => {
    const root = rootRef.current;
    if (!root) return;

    const cards = gsap.utils.toArray<HTMLElement>('.talent-workflow-card', root);
    const checks = gsap.utils.toArray<HTMLElement>('.talent-workflow-check', root);
    const overlay = root.querySelector<HTMLElement>('.talent-workflow-feature-overlay');
    const toolbar = root.querySelector<HTMLElement>('.talent-workflow-toolbar');
    const controlbar = root.querySelector<HTMLElement>('.talent-workflow-controlbar');
    const search = root.querySelector<HTMLElement>('.talent-workflow-search');
    const grid = root.querySelector<HTMLElement>('.talent-workflow-grid');
    const drawer = root.querySelector<HTMLElement>('.talent-workflow-drawer');
    const drawerItems = gsap.utils.toArray<HTMLElement>('.talent-workflow-drawer-item', root);
    const thumbs = gsap.utils.toArray<HTMLElement>('.talent-workflow-thumb', root);
    const nextButton = root.querySelector<HTMLElement>('.talent-workflow-next');
    const selectButton = root.querySelector<HTMLElement>('.talent-workflow-select');
    const profilePrimary = root.querySelector<HTMLElement>('.talent-workflow-profile-primary');
    const profileAlt = root.querySelector<HTMLElement>('.talent-workflow-profile-alt');

    const setSelected = (indexes: number[]) => {
      cards.forEach((card, index) => card.classList.toggle('is-selected', indexes.includes(index)));
      checks.forEach((check, index) => check.classList.toggle('is-checked', indexes.includes(index)));
    };

    if (prefersReducedMotion()) {
      setSelected([0, 3, 7]);
      gsap.set(drawer, { autoAlpha: 1, xPercent: 0 });
      gsap.set(grid, { filter: 'blur(1.2px)', opacity: 0.72 });
      gsap.set([toolbar, controlbar, search, cards, drawerItems, thumbs], { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(profilePrimary, { autoAlpha: 1 });
      gsap.set(profileAlt, { autoAlpha: 0 });
      return;
    }

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.55,
      defaults: { ease: 'power2.out' },
    });

    gsap.set(cards, { autoAlpha: 0, y: 10, scale: 0.985 });
    gsap.set([toolbar, controlbar, search], { autoAlpha: 0, y: -5 });
    gsap.set(drawer, { autoAlpha: 0, xPercent: 105 });
    gsap.set(drawerItems, { autoAlpha: 0, y: 8 });
    gsap.set(thumbs, { autoAlpha: 0, y: 8, scale: 0.96 });
    gsap.set(profileAlt, { autoAlpha: 0 });
    gsap.set(overlay, { opacity: 0.84 });
    setSelected([]);

    tl.to([toolbar, controlbar], { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.04 }, 0)
      .to(search, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.08)
      .to(cards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.035, duration: 0.45 }, 0.18)
      .to(cards[0], { scale: 1.035, duration: 0.34, ease: 'power2.out' }, 1.12)
      .to(overlay, { opacity: 0.96, duration: 0.28 }, 1.12)
      .call(() => setSelected([0]), [], 1.2)
      .to(cards[0], { scale: 1, duration: 0.44, ease: 'power3.out' }, 1.44)
      .to(grid, { filter: 'blur(1.15px)', opacity: 0.72, duration: 0.45 }, 1.62)
      .to(drawer, { autoAlpha: 1, xPercent: 0, duration: 0.62, ease: 'power3.out' }, 1.68)
      .to(drawerItems, { autoAlpha: 1, y: 0, stagger: 0.035, duration: 0.36 }, 1.94)
      .to(thumbs, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.045, duration: 0.4 }, 2.2)
      .to(nextButton, { scale: 0.94, duration: 0.11, ease: 'power2.inOut' }, 3.25)
      .to(nextButton, { scale: 1, duration: 0.24, ease: 'power3.out' }, 3.36)
      .to(profilePrimary, { autoAlpha: 0, y: -4, duration: 0.16 }, 3.52)
      .fromTo(profileAlt, { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.26 }, 3.74)
      .to(profileAlt, { autoAlpha: 0, y: -4, duration: 0.16 }, 4.25)
      .to(profilePrimary, { autoAlpha: 1, y: 0, duration: 0.26 }, 4.46)
      .to(selectButton, { scale: 0.94, duration: 0.1, ease: 'power2.inOut' }, 5.03)
      .to(selectButton, { scale: 1, duration: 0.24, ease: 'power3.out' }, 5.13)
      .call(() => setSelected([0, 3, 7]), [], 5.16)
      .to([cards[3], cards[7]], { scale: 1.035, duration: 0.22, stagger: 0.04, yoyo: true, repeat: 1 }, 5.16)
      .to(drawer, { autoAlpha: 0, xPercent: 105, duration: 0.52, ease: 'power3.inOut' }, 6.36)
      .to(grid, { filter: 'blur(0px)', opacity: 1, duration: 0.4 }, 6.42)
      .call(() => setSelected([]), [], 6.84)
      .to(overlay, { opacity: 0.84, duration: 0.24 }, 6.84)
      .to(cards, { scale: 1, duration: 0.24 }, 6.84)
      .to([toolbar, controlbar, search, cards], { autoAlpha: 0, y: 6, duration: 0.34, stagger: 0.01 }, 7.35);

    return () => {
      tl.kill();
    };
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className={`talent-workflow ${className || ''}`} aria-hidden="true">
      <div className="talent-workflow-shell">
        <header className="talent-workflow-topbar">
          <div className="talent-workflow-logo">URGE</div>
          <div className="talent-workflow-avatar" />
        </header>

        <nav className="talent-workflow-controlbar">
          <div className="talent-workflow-controlbar-main">
            <span className="talent-workflow-control is-active">
              <img src={assetPath('icon-nav-search.svg')} alt="" />
            </span>
            <span className="talent-workflow-control">
              <img src={assetPath('icon-folder.svg')} alt="" />
            </span>
            <span className="talent-workflow-control-divider" />
            <span className="talent-workflow-control">
              <img src={assetPath('icon-support.svg')} alt="" />
            </span>
          </div>
          <span className="talent-workflow-control mt-2">
            <img src={assetPath('icon-day.svg')} alt="" />
          </span>
        </nav>

        <div className="talent-workflow-app">
          <section className="talent-workflow-heading">
            <h4>Talent Search</h4>
            <p>Search through a large list of talent and curate your talent packages</p>
          </section>

          <div className="talent-workflow-toolbar">
            <div className="talent-workflow-toggle">
              <span className="talent-workflow-icon is-muted">
                <img src={assetPath('icon-list.svg')} alt="" />
              </span>
              <span className="talent-workflow-icon is-active">
                <img src={assetPath('icon-grid.svg')} alt="" />
              </span>
            </div>
            <div className="talent-workflow-search">
              <img className="talent-workflow-search-icon" src={assetPath('icon-search.svg')} alt="" />
              <span>Search name</span>
            </div>
            <button type="button" className="talent-workflow-filter" tabIndex={-1} aria-label="Filter">
              <img src={assetPath('icon-filter.svg')} alt="" />
            </button>
          </div>

          <div className="talent-workflow-stage">
            <div className="talent-workflow-grid">
              {talent.map((person, index) => (
                <article key={person.name} className="talent-workflow-card">
                  <img src={person.image} alt="" draggable={false} />
                  <span className="talent-workflow-check" />
                  {index === 0 && (
                    <div className="talent-workflow-feature-overlay">
                      <strong>{person.name}</strong>
                      <span>Age: {person.age}</span>
                      <em>{person.role}</em>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <aside className="talent-workflow-drawer">
              <div className="talent-workflow-drawer-nav talent-workflow-drawer-item">
                <div>
                  <button type="button" tabIndex={-1}>Back</button>
                  <button type="button" className="talent-workflow-next" tabIndex={-1}>Next</button>
                </div>
                <span className="talent-workflow-close" />
              </div>

              <div className="talent-workflow-profile talent-workflow-drawer-item">
                <div className="talent-workflow-profile-primary">
                  <h5>Rosa Maria</h5>
                  <p>rosarosamaria@gmail.com</p>
                </div>
                <div className="talent-workflow-profile-alt">
                  <h5>Mara Carter</h5>
                  <p>mara.carter@studio.co</p>
                </div>
              </div>

              <dl className="talent-workflow-stats talent-workflow-drawer-item">
                <div><dt>Age</dt><dd>5ft 4in</dd></div>
                <div><dt>Weight</dt><dd>120 lbs</dd></div>
                <div><dt>Hair color</dt><dd>Brown</dd></div>
                <div><dt>Eye Color</dt><dd>Brown</dd></div>
              </dl>

              <div className="talent-workflow-thumbs">
                {drawerImages.map((image, index) => (
                  <img key={`thumb-${index}`} className="talent-workflow-thumb" src={image} alt="" draggable={false} />
                ))}
              </div>

              <button type="button" className="talent-workflow-select talent-workflow-drawer-item" tabIndex={-1}>
                Select
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentSearchWorkflowAnimation;
