import React from 'react';
import { serviceBranches } from '../config/serviceBranches';
import type { ServiceBranch } from '../types/servicePlanner.types';
import ServiceBranchCard from './ServiceBranchCard';

interface ServiceBranchGridProps {
  onSelect: (branch: ServiceBranch, trigger: HTMLButtonElement) => void;
}

const ServiceBranchGrid: React.FC<ServiceBranchGridProps> = ({ onSelect }) => (
  <div className="services-grid relative z-[1] mx-auto grid w-full max-w-[1240px] auto-rows-fr grid-cols-1 gap-[clamp(16px,1.6vw,28px)] md:grid-cols-2 xl:grid-cols-4">
    {serviceBranches.map(branch => (
      <ServiceBranchCard key={branch.id} branch={branch} onSelect={onSelect} />
    ))}
  </div>
);

export default ServiceBranchGrid;
