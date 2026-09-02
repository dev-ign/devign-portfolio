export const formatTimeline = (range?: [number, number]) =>
  range ? `${range[0]}–${range[1]} weeks` : 'Confirmed after review';
