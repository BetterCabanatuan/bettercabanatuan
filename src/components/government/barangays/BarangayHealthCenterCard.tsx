import { Phone, Stethoscope } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import { IconTile } from '../../ui/IconTile';
import { formatPhoneForTel } from '../../../data/hotlines';
import type { BarangayHealthCenter } from '../../../data/yamlLoader';
import { cn } from '../../../lib/utils';

interface BarangayHealthCenterCardProps {
  healthCenter: BarangayHealthCenter;
  barangayName: string;
  className?: string;
}

/**
 * The "Health center" card on a barangay detail page.
 *
 * Rendered only for the barangays the Citizen's Charter names as the seat of a
 * City Health Center, so its presence is itself sourced information. Each
 * number is a `tel:` link; the landline row appears only when the charter
 * prints one.
 */
export function BarangayHealthCenterCard({
  healthCenter,
  barangayName,
  className,
}: BarangayHealthCenterCardProps) {
  const lines: Array<{ label: string; number: string }> = [
    { label: 'Mobile', number: healthCenter.phone },
  ];
  if (healthCenter.landline) {
    lines.push({ label: 'Landline', number: healthCenter.landline });
  }

  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <IconTile icon={Stethoscope} tone="success" size="sm" />
          <Heading level={3} className="mb-0">
            Health center
          </Heading>
        </div>
        <Text className="text-gray-700">
          {healthCenter.name} of the City Health Office is based in Barangay{' '}
          {barangayName}.
        </Text>
        <ul className="space-y-2 mt-4">
          {lines.map(line => (
            <li key={line.number}>
              <a
                href={`tel:${formatPhoneForTel(line.number)}`}
                className="flex items-center gap-3 min-h-[44px] text-gray-700 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
              >
                <Phone
                  className="h-4 w-4 text-primary-600 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">{line.number}</span>
                <span className="text-xs text-gray-500">{line.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <Text size="sm" className="text-xs text-gray-500 mt-4 mb-0">
          Source: City Government of Cabanatuan, Citizen&apos;s Charter 2022
          (2nd Edition), p. 344.
        </Text>
      </CardContent>
    </Card>
  );
}

export default BarangayHealthCenterCard;
