import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type { ServiceBranchId } from '@/features/service-planner/types/servicePlanner.types';

export type HomeNavMode = 'general' | 'contextual';
export type HomeSection = 'intro' | 'services' | 'projects' | 'process' | 'faq' | 'contact';

export interface HomeNavigationState {
  mode: HomeNavMode;
  activeSection: HomeSection;
  contextTitle?: 'Services' | 'Projects';
  activeService?: ServiceBranchId;
  progress: number;
}

interface HomeNavigationController {
  setServiceContext: (activeService: ServiceBranchId | undefined, progress: number) => void;
}

interface HomeNavigationContextValue extends HomeNavigationController {
  state: HomeNavigationState;
}

const INITIAL_STATE: HomeNavigationState = {
  mode: 'general',
  activeSection: 'intro',
  progress: 0,
};

const sectionOrder: Array<{ id: string; section: HomeSection }> = [
  { id: 'services', section: 'services' },
  { id: 'projects', section: 'projects' },
  { id: 'process', section: 'process' },
  { id: 'inquiry', section: 'contact' },
  { id: 'faq', section: 'faq' },
  { id: 'contact', section: 'contact' },
];

const HomeNavigationContext = createContext<HomeNavigationContextValue | null>(null);

export const deriveHomeNavigationState = (
  activeSection: HomeSection,
  progress = 0,
  activeService?: ServiceBranchId,
): HomeNavigationState => {
  if (activeSection === 'services' || activeSection === 'projects') {
    return {
      mode: 'contextual',
      activeSection,
      contextTitle: activeSection === 'services' ? 'Services' : 'Projects',
      ...(activeService ? { activeService } : {}),
      progress: Math.min(1, Math.max(0, progress)),
    };
  }

  return {
    mode: 'general',
    activeSection,
    progress: 0,
  };
};

const useActiveHomeSection = (): HomeSection => {
  const [activeSection, setActiveSection] = useState<HomeSection>('intro');

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        // Existing Home anchors settle 96px below the viewport top. This
        // semantic marker stays just below the locked 88px navbar edge.
        const marker = Math.min(120, Math.max(104, window.innerHeight * 0.13));
        let nextSection: HomeSection = 'intro';

        sectionOrder.forEach(({ id, section }) => {
          const element = document.getElementById(id);
          if (element && element.getBoundingClientRect().top <= marker) {
            nextSection = section;
          }
        });

        setActiveSection(current => (current === nextSection ? current : nextSection));
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return activeSection;
};

/**
 * Owns the single navigation state shared by the navbar and immersive service
 * sequence. High-frequency chapter progress is quantized before entering React,
 * while GSAP continues to own the visual interpolation.
 */
export const HomeNavigationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const activeSection = useActiveHomeSection();
  const [serviceState, setServiceState] = useState<{
    activeService?: ServiceBranchId;
    progress: number;
  }>({ progress: 0 });

  const setServiceContext = useCallback((activeService: ServiceBranchId | undefined, progress: number) => {
    const normalizedProgress = Math.round(Math.min(1, Math.max(0, progress)) * 100) / 100;
    setServiceState(current => (
      current.activeService === activeService && current.progress === normalizedProgress
        ? current
        : { activeService, progress: normalizedProgress }
    ));
  }, []);

  const state = useMemo(
    () => deriveHomeNavigationState(
      activeSection,
      serviceState.progress,
      serviceState.activeService,
    ),
    [activeSection, serviceState.activeService, serviceState.progress],
  );

  const value = useMemo<HomeNavigationContextValue>(
    () => ({ state, setServiceContext }),
    [setServiceContext, state],
  );

  return React.createElement(HomeNavigationContext.Provider, { value }, children);
};

export const useHomeNavigationState = (): HomeNavigationState =>
  useContext(HomeNavigationContext)?.state ?? INITIAL_STATE;

const fallbackController: HomeNavigationController = {
  setServiceContext: () => undefined,
};

export const useHomeNavigationController = (): HomeNavigationController => {
  const context = useContext(HomeNavigationContext);
  return context ?? fallbackController;
};
