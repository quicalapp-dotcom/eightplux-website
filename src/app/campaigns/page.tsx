'use client';

import React from 'react';
import CampaignHero from '@/components/campaign/CampaignHero';
import CampaignFeatureRow from '@/components/campaign/CampaignFeatureRow';
import CampaignInteractiveHero from '@/components/campaign/CampaignInteractiveHero';
import CampaignBanner from '@/components/campaign/CampaignBanner';

export default function CampaignsPage() {
  return (
    <main className="bg-white min-h-screen pt-16">
      {/* 1. Hero Section */}
      <CampaignHero 
        image="/Model2.jpg" 
      />

      {/* 2. First Feature Row */}
      <CampaignFeatureRow 
        leftImage="/lt.jpg" 
        rightImage="/Model3.jpg" 
      />

      {/* 3. Interactive Hero with CTAs */}
      <CampaignInteractiveHero 
        image="/middle.jpg" 
      />

      {/* 4. Second Feature Row */}
      <CampaignFeatureRow 
        leftImage="/tees.jpg" 
        rightImage="/tops.jpg" 
      />

      {/* 5. Bottom Banner */}
      <CampaignBanner 
        image="/rt.jpg" 
      />
    </main>
  );
}
