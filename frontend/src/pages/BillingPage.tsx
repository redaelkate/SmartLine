import React from 'react';
import { SubscriptionStats } from '../components/billing/SubscriptionStats';
import { InvoiceList } from '../components/billing/InvoiceList';
import { PaymentMethods } from '../components/billing/PaymentMethods';

export function BillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
        <p className="text-gray-600 mt-1">Manage billing and view revenue</p>
      </div>

      <SubscriptionStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <InvoiceList />
        <PaymentMethods />
      </div>
    </div>
  );
}