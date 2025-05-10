import { Building2 } from 'lucide-react';
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" aria-label="InfraCost Logo">
      <Building2 className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold text-primary">InfraCost</span>
    </div>
  );
}
