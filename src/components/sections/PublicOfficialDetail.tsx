import { Link } from 'react-router-dom';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import { getOfficialById, councilors } from '../../data/publicOfficials';
import {
  Crown,
  Gavel,
  Landmark,
  ChevronLeft,
  Calendar,
  Building2,
  Mail,
  Phone,
  Users,
  Award,
} from 'lucide-react';

interface PublicOfficialDetailProps {
  officialId: string;
}

export default function PublicOfficialDetail({
  officialId,
}: PublicOfficialDetailProps) {
  const official = getOfficialById(officialId);

  if (!official) {
    return (
      <div>
        <Banner
          type="error"
          title="Official not found"
          description="The public official you are looking for does not exist."
          icon
        />
        <div className="mt-6">
          <Link
            to="/government/officials"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Public Officials
          </Link>
        </div>
      </div>
    );
  }

  const isMayor = official.position === 'City Mayor';
  const isViceMayor = official.position === 'Vice Mayor';

  // Get related officials (other councilors, excluding current)
  const relatedOfficials = councilors
    .filter(c => c.id !== officialId)
    .slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/government/officials"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all public officials
        </Link>

        <div className="flex items-center gap-3 mb-3">
          {isMayor ? (
            <Crown className="h-8 w-8 text-yellow-600" />
          ) : isViceMayor ? (
            <Landmark className="h-8 w-8 text-primary-600" />
          ) : (
            <Gavel className="h-8 w-8 text-blue-600" />
          )}
          <Heading>{official.name}</Heading>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              isMayor
                ? 'bg-yellow-100 text-yellow-800'
                : isViceMayor
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-blue-100 text-blue-800'
            }`}
          >
            {official.position}
          </span>
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
            <Calendar className="h-3 w-3 inline mr-1" />
            {official.term}
          </span>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* About */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <Heading level={3} className="mb-4">
                About
              </Heading>
              <Text className="text-gray-700 mb-4">{official.description}</Text>
              {official.bio && (
                <Text className="text-gray-700 mb-0">{official.bio}</Text>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact & Details */}
        <div>
          <Card className="h-full">
            <CardContent className="p-6">
              <Heading level={3} className="mb-4">
                Details
              </Heading>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Position</div>
                    <div className="text-sm font-medium text-gray-900">
                      {official.position}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-500">Term</div>
                    <div className="text-sm font-medium text-gray-900">
                      {official.term}
                    </div>
                  </div>
                </div>

                {official.contact?.office && (
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Office</div>
                      <div className="text-sm font-medium text-gray-900">
                        {official.contact.office}
                      </div>
                    </div>
                  </div>
                )}

                {official.contact?.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="text-sm font-medium text-gray-900">
                        {official.contact.phone}
                      </div>
                    </div>
                  </div>
                )}

                {official.contact?.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-sm font-medium text-gray-900">
                        {official.contact.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Committees */}
      {official.committees && official.committees.length > 0 && (
        <div className="mb-8">
          <Heading level={3} className="mb-4">
            Committee Assignments
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {official.committees.map(committee => (
              <Card key={committee} className="h-full">
                <CardContent className="p-4 flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {committee}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Related Officials */}
      {relatedOfficials.length > 0 && (
        <div>
          <Heading level={3} className="mb-4">
            Other City Councilors
          </Heading>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedOfficials.map(o => (
              <Link key={o.id} to={`/government/officials/${o.id}`}>
                <Card hoverable className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gavel className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium text-gray-900">{o.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {o.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
