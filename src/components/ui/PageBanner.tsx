import { Heading } from './Heading';
import { Text } from './Text';

interface PageBannerProps {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
}

export default function PageBanner({
  eyebrow,
  title,
  description,
  className = '',
}: PageBannerProps) {
  return (
    <div
      className={`relative overflow-hidden bg-primary-900 text-white py-14 md:py-20 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/80 via-primary-900 to-primary-950" />
      <div className="container mx-auto px-4 relative">
        {eyebrow && (
          <p className="text-sm tracking-[0.2em] uppercase text-primary-200 mb-3">
            {eyebrow}
          </p>
        )}
        <Heading className="text-white mb-3 max-w-3xl">
          {title}
        </Heading>
        <Text className="text-white/85 max-w-2xl text-base md:text-lg mb-0">
          {description}
        </Text>
      </div>
    </div>
  );
}
