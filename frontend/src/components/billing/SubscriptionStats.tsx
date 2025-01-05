import React from 'react';
import { StatsCard } from '../stats/StatsCard';
import { DollarSign, Users, CreditCard } from 'lucide-react';

export function SubscriptionStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Monthly Recurring Revenue"
        value="$54,321"
        icon={DollarSign}
        trend={8}
      />
      <StatsCard
        title="Active Subscriptions"
        value="1,234"
        icon={Users}
        trend={12}
      />
      <StatsCard
        title="Average Revenue Per User"
        value="$44"
        icon={CreditCard}
        trend={5}
      />
    </div>
  );
}