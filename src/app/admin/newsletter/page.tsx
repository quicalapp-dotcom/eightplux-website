'use client';

import React, { useState, useEffect } from 'react';
import { Send, Users, Loader2, Check, X, RefreshCw } from 'lucide-react';
import CloudinaryUploader from '@/components/ui/CloudinaryUploader';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
  discountCode: string;
  discountId: string;
  discountUsed: boolean;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state for the luxury newsletter template
  const [subject, setSubject] = useState('');
  const [collectionTitle, setCollectionTitle] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [collectionLink, setCollectionLink] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [product1Image, setProduct1Image] = useState('');
  const [product1Title, setProduct1Title] = useState('');
  const [product1Link, setProduct1Link] = useState('');
  const [product2Image, setProduct2Image] = useState('');
  const [product2Title, setProduct2Title] = useState('');
  const [product2Link, setProduct2Link] = useState('');
  const [product3Image, setProduct3Image] = useState('');
  const [product3Title, setProduct3Title] = useState('');
  const [product3Link, setProduct3Link] = useState('');
  const [product4Image, setProduct4Image] = useState('');
  const [product4Title, setProduct4Title] = useState('');
  const [product4Link, setProduct4Link] = useState('');

  // Load subscribers on page load
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribers');
      const data = await response.json();
      
      if (data.success) {
        setSubscribers(data.data);
      } else {
        setErrorMessage('Failed to load subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setErrorMessage('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  // Generate HTML content from template and form data
  const generateHtmlContent = () => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
  margin:0;
  padding:0;
  background:#f5f5f5;
  font-family:Helvetica, Arial, sans-serif;
}
.container{
  max-width:600px;
  margin:auto;
  background:#ffffff;
}
.header{
  background:#000;
  color:#fff;
  text-align:center;
  padding:30px;
  letter-spacing:4px;
  font-size:22px;
}
.hero img{
  width:100%;
  display:block;
}
.section{
  padding:40px 30px;
}
.title{
  font-size:28px;
  font-weight:bold;
  text-align:center;
  letter-spacing:2px;
}
.subtitle{
  text-align:center;
  color:#666;
  margin-top:10px;
}
.button{
  display:inline-block;
  padding:14px 35px;
  background:#000;
  color:#fff;
  text-decoration:none;
  letter-spacing:2px;
  margin-top:20px;
}
.product-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:15px;
  margin-top:20px;
}
.product img{
  width:100%;
}
.product-title{
  font-size:14px;
  margin-top:8px;
}
.video-section img{
  width:100%;
}
.footer{
  background:#111;
  color:#aaa;
  text-align:center;
  padding:30px;
  font-size:12px;
}
.social{
  margin-top:15px;
}
.social a{
  margin:0 10px;
  color:#aaa;
  text-decoration:none;
}
@media(max-width:600px){
  .product-grid{
    grid-template-columns:1fr;
  }
}
</style>
</head>
<body>
<div class="container">
<div class="header">EIGHTPLUX</div>
${heroImage ? `
<div class="hero">
<a href="${collectionLink || 'https://eightplux.com/shop'}">
<img src="${heroImage}">
</a>
</div>` : ''}
<div class="section">
<div class="title">${collectionTitle || 'NEW SEASON COLLECTION'}</div>
<p class="subtitle">${collectionDescription || 'Discover the latest statement pieces crafted for modern luxury.'}</p>
<center>
<a href="${collectionLink || 'https://eightplux.com/shop'}" class="button">${collectionTitle ? 'SHOP COLLECTION' : 'SHOP NOW'}</a>
</center>
</div>
${videoThumbnail ? `
<div class="video-section">
<a href="${videoLink || 'https://eightplux.com/lookbook-video'}">
<img src="${videoThumbnail}">
</a>
</div>
<div class="section">
<p style="text-align:center; font-size:16px;">
Watch the full runway experience and explore the inspiration behind our latest designs.
</p>
<center>
<a href="${videoLink || 'https://eightplux.com/lookbook-video'}" class="button">WATCH FILM</a>
</center>
</div>` : ''}
<div class="section">
<div class="title">EDITOR'S PICKS</div>
<div class="product-grid">
${product1Image ? `
<div class="product">
<a href="${product1Link || 'https://eightplux.com/shop'}">
<img src="${product1Image}">
</a>
<div class="product-title">${product1Title || 'Product 1'}</div>
</div>` : ''}
${product2Image ? `
<div class="product">
<a href="${product2Link || 'https://eightplux.com/shop'}">
<img src="${product2Image}">
</a>
<div class="product-title">${product2Title || 'Product 2'}</div>
</div>` : ''}
${product3Image ? `
<div class="product">
<a href="${product3Link || 'https://eightplux.com/shop'}">
<img src="${product3Image}">
</a>
<div class="product-title">${product3Title || 'Product 3'}</div>
</div>` : ''}
${product4Image ? `
<div class="product">
<a href="${product4Link || 'https://eightplux.com/shop'}">
<img src="${product4Image}">
</a>
<div class="product-title">${product4Title || 'Product 4'}</div>
</div>` : ''}
</div>
<center>
<a href="https://eightplux.com/shop" class="button">SHOP ALL PRODUCTS</a>
</center>
</div>
<div class="footer">
<p>© 2026 Eightplux</p>
<p>Luxury Fashion Redefined</p>
<p style="margin-top:10px;">7, Tajudeen Anjorin, Onilekere, Ikeja</p>
<div class="social">
<a href="https://instagram.com/eightplux">@eightplux</a>
<a href="https://twitter.com/eightplux">@eightplux</a>
<a href="https://tiktok.com/@eightplux">@eightplux</a>
</div>
<p style="margin-top:20px;">
<a href="{{unsubscribe_link}}" style="color:#aaa;">Unsubscribe</a>
</p>
</div>
</div>
</body>
</html>`;
  };

  // Generate plain text content
  const generateTextContent = () => {
    return `EIGHTPLUX - ${collectionTitle || 'NEW SEASON COLLECTION'}

${collectionDescription || 'Discover the latest statement pieces crafted for modern luxury.'}

SHOP NOW: ${collectionLink || 'https://eightplux.com/shop'}

${videoLink ? `WATCH OUR LATEST FILM: ${videoLink}` : ''}

EDITOR'S PICKS:
${product1Title ? `${product1Title}: ${product1Link}\n` : ''}
${product2Title ? `${product2Title}: ${product2Link}\n` : ''}
${product3Title ? `${product3Title}: ${product3Link}\n` : ''}
${product4Title ? `${product4Title}: ${product4Link}\n` : ''}

SHOP ALL PRODUCTS: https://eightplux.com/shop

Luxury Fashion Redefined
© 2026 Eightplux

Address: 7, Tajudeen Anjorin, Onilekere, Ikeja

Follow us:
Instagram: @eightplux
Twitter: @eightplux
TikTok: @eightplux

To unsubscribe: {{unsubscribe_link}}`;
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject) {
      setErrorMessage('Please fill in the email subject');
      return;
    }

    setSending(true);
    setSuccessMessage('');
    setErrorMessage('');
    setSentCount(0);
    setFailedCount(0);

    try {
      const htmlContent = generateHtmlContent();
      const textContent = generateTextContent();

      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          htmlContent,
          textContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(data.message);
        setSentCount(data.sentCount);
        setFailedCount(data.failedCount);
        
        // Reset form
        setSubject('');
        setCollectionTitle('');
        setCollectionDescription('');
        setCollectionLink('');
        setHeroImage('');
        setVideoThumbnail('');
        setVideoLink('');
        setProduct1Image('');
        setProduct1Title('');
        setProduct1Link('');
        setProduct2Image('');
        setProduct2Title('');
        setProduct2Link('');
        setProduct3Image('');
        setProduct3Title('');
        setProduct3Link('');
        setProduct4Image('');
        setProduct4Title('');
        setProduct4Link('');
      } else {
        setErrorMessage(data.error || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      setErrorMessage('Failed to send newsletter. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Newsletter Management</h1>
        <button
          onClick={fetchSubscribers}
          disabled={loading || sending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Subscribers
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold text-green-600">{sentCount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Failed</p>
              <p className="text-2xl font-bold text-red-600">{failedCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Send Newsletter Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Send Newsletter</h2>
          <p className="text-sm text-gray-600">Send an email to all active subscribers using the luxury template</p>
        </div>
        
        <form onSubmit={handleSendNewsletter} className="p-6 space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Collection Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-3">Collection Section</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Title</label>
                <input
                  type="text"
                  value={collectionTitle}
                  onChange={(e) => setCollectionTitle(e.target.value)}
                  placeholder="e.g., New Season Collection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Link</label>
                <input
                  type="url"
                  value={collectionLink}
                  onChange={(e) => setCollectionLink(e.target.value)}
                  placeholder="https://eightplux.com/collection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Description</label>
              <textarea
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                placeholder="Describe your collection"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
              <CloudinaryUploader
                label="Upload Hero Image"
                onUpload={(result) => setHeroImage(result.secure_url)}
                accept="image/*"
                maxSize={5}
                compact={true}
              />
              {heroImage && (
                <img src={heroImage} alt="Hero" className="mt-2 w-32 h-32 object-cover rounded-md" />
              )}
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-3">Video Section (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Link</label>
                <input
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://eightplux.com/video"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail</label>
              <CloudinaryUploader
                label="Upload Thumbnail"
                onUpload={(result) => setVideoThumbnail(result.secure_url)}
                accept="image/*"
                maxSize={5}
                compact={true}
              />
              {videoThumbnail && (
                <img src={videoThumbnail} alt="Video Thumbnail" className="mt-2 w-32 h-32 object-cover rounded-md" />
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-3">Editors Picks (Products)</h3>
            
            {/* Product 1 */}
            <div className="border border-gray-200 p-3 rounded-md mb-3">
              <h4 className="font-medium mb-2 text-sm">Product 1</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={product1Title}
                    onChange={(e) => setProduct1Title(e.target.value)}
                    placeholder="Product title"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={product1Link}
                    onChange={(e) => setProduct1Link(e.target.value)}
                    placeholder="Product URL"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                  <CloudinaryUploader
                    label="Upload Image"
                    onUpload={(result) => setProduct1Image(result.secure_url)}
                    accept="image/*"
                    maxSize={5}
                    compact={true}
                  />
                </div>
              </div>
              {product1Image && (
                <img src={product1Image} alt="Product 1" className="mt-2 w-24 h-24 object-cover rounded-md" />
              )}
            </div>

            {/* Product 2 */}
            <div className="border border-gray-200 p-3 rounded-md mb-3">
              <h4 className="font-medium mb-2 text-sm">Product 2</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={product2Title}
                    onChange={(e) => setProduct2Title(e.target.value)}
                    placeholder="Product title"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={product2Link}
                    onChange={(e) => setProduct2Link(e.target.value)}
                    placeholder="Product URL"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                  <CloudinaryUploader
                    label="Upload Image"
                    onUpload={(result) => setProduct2Image(result.secure_url)}
                    accept="image/*"
                    maxSize={5}
                    compact={true}
                  />
                </div>
              </div>
              {product2Image && (
                <img src={product2Image} alt="Product 2" className="mt-2 w-24 h-24 object-cover rounded-md" />
              )}
            </div>

            {/* Product 3 */}
            <div className="border border-gray-200 p-3 rounded-md mb-3">
              <h4 className="font-medium mb-2 text-sm">Product 3</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={product3Title}
                    onChange={(e) => setProduct3Title(e.target.value)}
                    placeholder="Product title"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={product3Link}
                    onChange={(e) => setProduct3Link(e.target.value)}
                    placeholder="Product URL"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                  <CloudinaryUploader
                    label="Upload Image"
                    onUpload={(result) => setProduct3Image(result.secure_url)}
                    accept="image/*"
                    maxSize={5}
                    compact={true}
                  />
                </div>
              </div>
              {product3Image && (
                <img src={product3Image} alt="Product 3" className="mt-2 w-24 h-24 object-cover rounded-md" />
              )}
            </div>

            {/* Product 4 */}
            <div className="border border-gray-200 p-3 rounded-md">
              <h4 className="font-medium mb-2 text-sm">Product 4</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={product4Title}
                    onChange={(e) => setProduct4Title(e.target.value)}
                    placeholder="Product title"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={product4Link}
                    onChange={(e) => setProduct4Link(e.target.value)}
                    placeholder="Product URL"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                  <CloudinaryUploader
                    label="Upload Image"
                    onUpload={(result) => setProduct4Image(result.secure_url)}
                    accept="image/*"
                    maxSize={5}
                    compact={true}
                  />
                </div>
              </div>
              {product4Image && (
                <img src={product4Image} alt="Product 4" className="mt-2 w-24 h-24 object-cover rounded-md" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Newsletter
                </>
              )}
            </button>

            {successMessage && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <X className="w-4 h-4" />
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Subscribers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Subscribers</h2>
          <p className="text-sm text-gray-600">List of all active newsletter subscribers</p>
        </div>

        <div className="p-6 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading subscribers...</span>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No subscribers yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">{subscriber.email}</p>
                    <p className="text-sm text-gray-500">
                      Subscribed on {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Source: {subscriber.source}</p>
                    {subscriber.discountCode && (
                      <p className="text-xs font-mono bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        {subscriber.discountCode}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
