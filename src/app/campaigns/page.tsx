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
      <CampaignHero 
        image="/caa.jpg" 
      />

      {/* 2. First Feature Row */}
      <CampaignFeatureRow 
        leftImage="/middle.jpg" 
        rightImage="/17.png" 
      />

      {/* 3. Interactive Hero with CTAs */}
      <CampaignInteractiveHero 
        image="/sportbg.gif" 
      />

      {/* 4. Second Feature Row */}
      <CampaignFeatureRow 
        leftImage="/20.png" 
        rightImage="/21.png" 
      />

      {/* 5. Interactive Banner */}
      <CampaignBanner 
        image="/casualbg.gif" 
        showButtons={true}
      />

      {/* 6. Third Feature Row (Orange Collection) */}
      <CampaignFeatureRow 
        leftImage="/22.png" 
        rightImage="/23.png" 
      />

      {/* 7. Stage Section */}
      <WorldSection
        image="/community.gif"
      />

      {/* 8. Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}
