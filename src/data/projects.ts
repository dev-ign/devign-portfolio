import urgeProjectImage from '../assets/urge-project.png';
import chancletazoProjectImage from '../assets/chancletazo-project.png';
import swProjectImage from '../assets/sw-project.png';
import givzeyProjectImage from '../assets/givzey-project.png';
import givzeyDemoImage from '../assets/givzey-demo.png';
import gradumProjectImage from '../assets/gradum-project.png';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  link?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: 'urge-talent',
    title: 'URGE Talent',
    description: 'Talent search and curation platform with advanced filtering and profile management.',
    image: urgeProjectImage,
    category: 'Web Application',
    link: 'https://www.allbooked.co/',
  },
  {
    id: 'small-wrld-music',
    title: 'Small Wrld Music',
    description: 'Music discovery platform with featured tracks, beats, and interactive player.',
    image: swProjectImage,
    category: 'Music Platform',
    link: 'https://swsmusicgroup.com/',
  },
  {
    id: 'givzey-landing',
    title: 'Givzey Landing',
    description: 'A Marketing landing page for Givzey. An AI-powered platform for fundraising.',
    image: givzeyProjectImage,
    category: 'Markting Site',
    link: '',
    demo: givzeyDemoImage,
  },
  {
    id: 'el-chancletazo',
    title: 'El Chancletazo',
    description: 'Dominican food restaurant website featuring menu items and preorder functionality.',
    image: chancletazoProjectImage,
    category: 'Restaurant Website',
    link: '',
  },
  {
    id: 'gradum-group',
    title: 'Gradum Group',
    description:
      'Engineering-led advisory and execution platform for technical, operational, and infrastructure complexity.',
    image: gradumProjectImage,
    category: 'Marketing Site - Lead Gen',
    link: '',
  },
];
