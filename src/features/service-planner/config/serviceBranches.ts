import { websitesBranch } from './branches/websites';
import { webApplicationsBranch } from './branches/webApplications';
import { brandingMarketingBranch } from './branches/brandingMarketing';
import { motionVideoBranch } from './branches/motionVideo';
import type { ServiceBranch, ServiceBranchId } from '../types/servicePlanner.types';

export const serviceBranches: ServiceBranch[] = [
  websitesBranch,
  webApplicationsBranch,
  brandingMarketingBranch,
  motionVideoBranch,
];

export const serviceBranchMap = serviceBranches.reduce<Record<ServiceBranchId, ServiceBranch>>(
  (map, branch) => {
    map[branch.id] = branch;
    return map;
  },
  {} as Record<ServiceBranchId, ServiceBranch>,
);

export const getServiceBranch = (branchId: ServiceBranchId) => serviceBranchMap[branchId];
