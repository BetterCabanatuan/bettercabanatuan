import { cn } from '../../lib/utils';

type SectionProps = React.ComponentPropsWithoutRef<'section'>;

export default function Section({
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section className={cn('py-12 bg-white', className)} {...props}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
