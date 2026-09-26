interface SectionJumpNavItem {
  id: string;
  label: string;
}

interface SectionJumpNavProps {
  items: SectionJumpNavItem[];
  label?: string;
}

export default function SectionJumpNav({
  items,
  label = 'On this page',
}: SectionJumpNavProps) {
  return (
    <nav
      aria-label={label}
      className="mb-8 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-200"
    >
      <p className="mb-2 px-1 text-sm font-semibold text-gray-900">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-flex min-h-11 items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-primary-700 ring-1 ring-gray-200 transition-[background-color,color,box-shadow] duration-150 hover:bg-primary-50 hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
