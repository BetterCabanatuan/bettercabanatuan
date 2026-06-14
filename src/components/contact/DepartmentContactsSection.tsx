import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Clock, ExternalLink, Phone, Search } from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  departmentContactsData,
  type DepartmentContactLine,
} from '../../data/departmentContacts';
import { formatPhoneForTel } from '../../data/hotlines';

function ContactRow({ contact }: { contact: DepartmentContactLine }) {
  const { t } = useTranslation('common');

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors">
      <td className="py-3.5 px-4 text-sm text-gray-900 align-top">
        <div className="font-medium">{contact.name}</div>
        {contact.departmentSlug && (
          <Link
            to={`/government/departments/${contact.departmentSlug}`}
            className="inline-flex items-center gap-1 mt-1 text-xs text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded"
          >
            {t('departmentContacts.viewDepartment')}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </td>
      <td className="py-3.5 px-4 text-sm align-top whitespace-nowrap">
        <a
          href={`tel:${formatPhoneForTel(contact.phone)}`}
          className="inline-flex items-center gap-2 min-h-[44px] text-primary-700 hover:text-primary-800 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors"
        >
          <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
          {contact.phone}
        </a>
      </td>
    </tr>
  );
}

export default function DepartmentContactsSection() {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return departmentContactsData.contacts;

    return departmentContactsData.contacts.filter(
      contact =>
        contact.name.toLowerCase().includes(normalized) ||
        contact.phone.includes(normalized)
    );
  }, [query]);

  return (
    <section
      id="department-contacts"
      aria-labelledby="department-contacts-heading"
      className="mb-12 scroll-mt-28"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600 mb-1">
            {t('departmentContacts.eyebrow')}
          </p>
          <Heading level={2} id="department-contacts-heading" className="mb-2">
            {t('departmentContacts.title')}
          </Heading>
          <Text className="text-gray-600 mb-0 max-w-2xl">
            {t('departmentContacts.description')}
          </Text>
        </div>
      </div>

      <Card className="mb-4 border-primary-100 bg-primary-50/40">
        <CardContent className="p-4 flex items-start gap-3">
          <Clock
            className="h-5 w-5 text-primary-600 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <Text className="text-sm text-gray-700 mb-0">
            {departmentContactsData.officeHours}
          </Text>
        </CardContent>
      </Card>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('departmentContacts.searchPlaceholder')}
          aria-label={t('departmentContacts.searchPlaceholder')}
          className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-primary-600"
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4" aria-hidden="true" />
                      {t('departmentContacts.officeColumn')}
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {t('departmentContacts.numberColumn')}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <ContactRow
                      key={`${contact.name}-${contact.phone}`}
                      contact={contact}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-8 px-4 text-center text-sm text-gray-500"
                    >
                      {t('departmentContacts.noResults')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Text className="text-xs text-gray-500 mt-3 mb-0">
        {t('departmentContacts.showing', {
          count: filteredContacts.length,
          total: departmentContactsData.contacts.length,
        })}
      </Text>
    </section>
  );
}
