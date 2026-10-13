import { Info } from 'lucide-react';

export function Disclaimer() {
  return (
    <p className="flex items-start gap-2 text-xs text-gray-500">
      <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      StealthAdvisor is an educational demo. Its statements come from simple rules applied to past prices and are not
      financial advice. Past performance does not predict future results.
    </p>
  );
}
