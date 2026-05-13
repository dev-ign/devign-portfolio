// Re-export useGSAP from @gsap/react under the project-preferred name.
// All GSAP animations/ScrollTriggers created inside the callback are killed
// automatically on component unmount via gsap.context(). Pass scope for
// selector scoping to a container ref.
export { useGSAP as useGSAPContext } from '@gsap/react';
