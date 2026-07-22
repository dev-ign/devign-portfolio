import {
  donorDirectoryCaptureOrder,
  donorDirectorySanitizationChecklist,
  donorDirectorySectionVisualMap,
  donorDirectoryVisualAssets,
  existingDonorDirectoryReferences,
  getDonorDirectoryVisualAsset,
} from './donorDirectoryVisualAssets';

test('defines a complete, uniquely named Donor Directory visual inventory', () => {
  expect(donorDirectoryVisualAssets).toHaveLength(15);
  expect(new Set(donorDirectoryVisualAssets.map((asset) => asset.id)).size).toBe(
    donorDirectoryVisualAssets.length
  );

  donorDirectoryVisualAssets.forEach((asset) => {
    expect(asset.id).toMatch(/^donor-directory-/);
    expect(asset.section).toBeTruthy();
    expect(asset.title).toBeTruthy();
    expect(asset.purpose).toBeTruthy();
    expect(asset.recommendedAspectRatio).toBeTruthy();
    expect(asset.source).toBeTruthy();
    expect(asset.privacyNotes.length).toBeGreaterThan(0);
    expect(asset.captureInstructions.length).toBeGreaterThan(0);
    expect(asset.annotationNotes.length).toBeGreaterThan(0);
  });
});

test('maps every case-study section and preserves the requested capture order', () => {
  expect(donorDirectorySectionVisualMap.map(({ section }) => section)).toEqual([
    'Hero',
    'Opportunity',
    'Design Principles',
    'Experience — Finding the Right Donor',
    'Experience — Working With Large Data Sets',
    'Experience — Making Complex Tables Feel Simple',
    'Experience — Donor Context',
    'Experience — Donor History',
    'Experience — Next Action',
    'Experience — Context Preservation',
    'Experience — Bulk Actions',
    'Building Reusable Components',
    'Designing for Engineering',
    'Accessibility & Polish',
    'Impact',
  ]);
  expect(donorDirectoryCaptureOrder[0]).toBe('donor-directory-hero');
  expect(donorDirectoryCaptureOrder[1]).toBe('donor-directory-drawer-overview');
  expect(donorDirectoryCaptureOrder[3]).toBe('donor-directory-row-to-drawer-sequence');
  expect(donorDirectoryCaptureOrder[4]).toBe('donor-directory-search-filter-sequence');
  expect(donorDirectoryCaptureOrder[donorDirectoryCaptureOrder.length - 1]).toBe(
    'donor-directory-impact-summary'
  );
});

test('keeps existing artwork separate from final production evidence', () => {
  expect(existingDonorDirectoryReferences).toHaveLength(2);
  existingDonorDirectoryReferences.forEach((reference) => {
    expect(reference.suitableForFinalCaseStudy).toBe(false);
  });
  expect(donorDirectorySanitizationChecklist.length).toBeGreaterThanOrEqual(8);
  expect(getDonorDirectoryVisualAsset('donor-directory-impact-summary').status).toBe('available');
});

test('marks the approved reconstructed visual groups as available', () => {
  [
    'donor-directory-hero',
    'donor-directory-drawer-overview',
    'donor-directory-history-timeline',
    'donor-directory-request-first-draft',
    'donor-directory-row-to-drawer-sequence',
    'donor-directory-component-sheet',
    'donor-directory-state-grid',
    'donor-directory-design-to-production',
    'donor-directory-accessibility-details',
    'donor-directory-impact-summary',
  ].forEach((assetId) => {
    expect(getDonorDirectoryVisualAsset(assetId as Parameters<typeof getDonorDirectoryVisualAsset>[0]).status)
      .toBe('available');
  });
  expect(getDonorDirectoryVisualAsset('donor-directory-table-anatomy').status)
    .toBe('needs-recreation');
});
