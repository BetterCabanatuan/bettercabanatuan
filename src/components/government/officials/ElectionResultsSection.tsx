import { CheckCircle2, ExternalLink, Vote } from 'lucide-react';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import { electionResultsData } from '../../../data/yamlLoader';

function formatVotes(value: number): string {
  return new Intl.NumberFormat('en-PH').format(value);
}

function CandidateRow({
  name,
  party,
  votes,
  won,
}: {
  name: string;
  party: string;
  votes: number;
  won: boolean;
}) {
  return (
    <li className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        {won ? (
          <CheckCircle2
            className="h-4 w-4 text-success-600 shrink-0 mt-0.5"
            aria-label="Elected"
          />
        ) : (
          <span className="h-4 w-4 shrink-0 mt-0.5 rounded-full border-2 border-gray-200" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500">{party}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 tabular-nums whitespace-nowrap">
        {formatVotes(votes)}
      </p>
    </li>
  );
}

export default function ElectionResultsSection() {
  const [mayor, viceMayor, councilors] = electionResultsData.contests;

  return (
    <div className="mt-12">
      <div className="flex items-start gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-700 shrink-0">
          <Vote className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <Heading id="election-results-heading" level={2} className="mb-2">
            {electionResultsData.title}
          </Heading>
          <Text className="text-gray-600 mb-0 max-w-3xl">
            {electionResultsData.description}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {[mayor, viceMayor].map(contest => (
          <div
            key={contest.position}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <Heading level={3} className="text-base mb-0">
                {contest.position}
              </Heading>
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                {contest.margin !== undefined
                  ? `Margin: ${formatVotes(contest.margin)}`
                  : `${contest.seats} seat${contest.seats === 1 ? '' : 's'}`}
              </span>
            </div>
            <Text className="text-sm text-gray-500 mb-2">
              Total votes: {formatVotes(contest.totalVotes ?? 0)}
            </Text>
            <ul>
              {contest.candidates.map(candidate => (
                <CandidateRow
                  key={candidate.name}
                  name={candidate.name}
                  party={candidate.party}
                  votes={candidate.votes}
                  won={candidate.won}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 mt-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <Heading level={3} className="text-base mb-0">
            {councilors.position}
          </Heading>
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {councilors.seats} seats
          </span>
        </div>
        {councilors.note && (
          <Text className="text-sm text-gray-500 mb-2">{councilors.note}</Text>
        )}
        <ul>
          {councilors.candidates.map(candidate => (
            <CandidateRow
              key={candidate.name}
              name={candidate.name}
              party={candidate.party}
              votes={candidate.votes}
              won={candidate.won}
            />
          ))}
        </ul>
      </div>

      <div className="flex justify-end w-full mt-4">
        <a
          href={electionResultsData.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors duration-150 hover:bg-primary-50 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          Source: {electionResultsData.sourceName}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
