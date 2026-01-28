import { useState } from 'react';
import { BarChart3, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuth } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PollOption {
  id: string;
  option_text: string;
  display_order: number;
  votes_count?: number;
}

interface Poll {
  id: string;
  question: string;
  is_multiple_choice: boolean;
  ends_at: string | null;
  options: PollOption[];
  total_votes: number;
  user_voted: boolean;
  user_voted_options: string[];
}

export function ActivePolls() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: polls, isLoading } = useQuery({
    queryKey: ['active-polls', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch active polls
      const { data: pollsData, error: pollsError } = await supabase
        .from('polls')
        .select('*')
        .eq('is_active', true)
        .limit(3);

      if (pollsError) throw pollsError;
      if (!pollsData || pollsData.length === 0) return [];

      // Fetch options and votes for each poll
      const pollsWithDetails = await Promise.all(
        pollsData.map(async (poll) => {
          // Get options
          const { data: options } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id)
            .order('display_order');

          // Get all votes for this poll to calculate counts
          const { data: allVotes } = await supabase
            .from('poll_votes')
            .select('option_id')
            .eq('poll_id', poll.id);

          // Get user's votes
          const { data: userVotes } = await supabase
            .from('poll_votes')
            .select('option_id')
            .eq('poll_id', poll.id)
            .eq('user_id', user.id);

          // Count votes per option
          const voteCounts: Record<string, number> = {};
          allVotes?.forEach((vote) => {
            voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1;
          });

          const optionsWithCounts = options?.map((opt) => ({
            ...opt,
            votes_count: voteCounts[opt.id] || 0,
          })) || [];

          return {
            ...poll,
            options: optionsWithCounts,
            total_votes: allVotes?.length || 0,
            user_voted: (userVotes?.length || 0) > 0,
            user_voted_options: userVotes?.map((v) => v.option_id) || [],
          } as Poll;
        })
      );

      return pollsWithDetails;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <section className="py-16 bg-card border-y border-border/50">
        <div className="kraken-container">
          <div className="text-center py-8">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('sections', 'activePolls')}</h3>
            <p className="text-muted-foreground mb-4">{t('poll', 'loginToVote')}</p>
            <Button variant="outline" asChild>
              <Link to="/login">{t('nav', 'login')}</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-card border-y border-border/50">
        <div className="kraken-container">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="kraken-card p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!polls || polls.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-card border-y border-border/50">
      <div className="kraken-container">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl sm:text-3xl font-bold">{t('sections', 'activePolls')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PollCard({ poll }: { poll: Poll }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const voteMutation = useMutation({
    mutationFn: async (optionIds: string[]) => {
      for (const optionId of optionIds) {
        const { error } = await supabase.from('poll_votes').insert({
          poll_id: poll.id,
          option_id: optionId,
          user_id: user!.id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-polls'] });
    },
  });

  const handleOptionClick = (optionId: string) => {
    if (poll.user_voted) return;

    if (poll.is_multiple_choice) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      voteMutation.mutate(selectedOptions);
    }
  };

  const maxVotes = Math.max(...poll.options.map((o) => o.votes_count || 0), 1);

  return (
    <div className="kraken-card p-6 animate-fade-in">
      <h3 className="font-semibold text-lg mb-4 line-clamp-2">{poll.question}</h3>

      <div className="space-y-3 mb-4">
        {poll.options.map((option) => {
          const percentage = poll.total_votes > 0
            ? Math.round(((option.votes_count || 0) / poll.total_votes) * 100)
            : 0;
          const isSelected = selectedOptions.includes(option.id);
          const isVoted = poll.user_voted_options.includes(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={poll.user_voted}
              className={cn(
                'w-full relative rounded-lg border transition-all duration-200 text-left overflow-hidden',
                poll.user_voted
                  ? 'cursor-default'
                  : 'cursor-pointer hover:border-primary/50',
                isSelected && !poll.user_voted && 'border-primary bg-primary/5',
                isVoted && 'border-primary/50'
              )}
            >
              {/* Progress bar background */}
              {poll.user_voted && (
                <div
                  className="absolute inset-0 bg-primary/10 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">{option.option_text}</span>
                <div className="flex items-center gap-2">
                  {poll.user_voted && (
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  )}
                  {isVoted && <Check className="h-4 w-4 text-primary" />}
                  {isSelected && !poll.user_voted && (
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {poll.user_voted ? (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          {t('poll', 'voted')} • {poll.total_votes} {t('poll', 'totalVotes').toLowerCase()}
        </p>
      ) : (
        <Button
          onClick={handleVote}
          disabled={selectedOptions.length === 0 || voteMutation.isPending}
          className="w-full kraken-btn-glow"
        >
          {t('poll', 'vote')}
        </Button>
      )}
    </div>
  );
}
