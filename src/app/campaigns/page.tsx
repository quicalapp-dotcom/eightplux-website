'use client';

import React from 'react';
import CampaignHero from '@/components/campaign/CampaignHero';
import CampaignFeatureRow from '@/components/campaign/CampaignFeatureRow';
import CampaignInteractiveHero from '@/components/campaign/CampaignInteractiveHero';
import CampaignBanner from '@/components/campaign/CampaignBanner';
import NewsletterSection from '@/components/home/NewsletterSection';
import WorldSection from '@/components/home/WorldSection';

export default function CampaignsPage() {
  return (
    <main className="bg-white min-h-screen pt-16 font-tt">
      {/* 1. Hero Section */}
      <CampaignHero />

      {/* 2. First Feature Row */}
      <CampaignFeatureRow
        rowId="campaign_feature_row_1"
        defaultLeftImage="/middle.jpg"
        defaultRightImage="/17.png"
      />

      {/* 3. Interactive Hero with CTAs */}
      <CampaignInteractiveHero />

      {/* 4. Second Feature Row */}
      <CampaignFeatureRow
        rowId="campaign_feature_row_2"
        defaultLeftImage="/20.png"
        defaultRightImage="/21.png"
      />

      {/* 5. Interactive Banner */}
      <CampaignBanner />

      {/* 6. Third Feature Row (Orange Collection) */}
      <CampaignFeatureRow
        rowId="campaign_feature_row_3"
        defaultLeftImage="/22.png"
        defaultRightImage="/23.png"
      />

      {/* 7. Stage Section */}
      <WorldSection />

      {/* 8. Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}
