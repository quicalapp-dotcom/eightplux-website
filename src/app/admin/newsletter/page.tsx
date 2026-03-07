'use client';

import React, { useState, useEffect } from 'react';
import { Send, Users, Loader2, Check, X, RefreshCw, Image as ImageIcon, Video, Link as LinkIcon, Bold, Italic, List, ListOrdered } from 'lucide-react';
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

  // Form state
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');

  // Load subscribers on page load
  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Helper functions for rich text editing
  const insertHtml = (html: string) => {
    setHtmlContent(prev => prev + html);
  };

  const insertImage = (url: string) => {
    const imgHtml = `<img src="${url}" alt="Newsletter image" style="max-width: 100%; height: auto; margin: 10px 0;" />`;
    insertHtml(imgHtml);
  };

  const insertVideo = (url: string) => {
    const videoHtml = `<video src="${url}" controls style="max-width: 100%; height: auto; margin: 10px 0;"></video>`;
    insertHtml(videoHtml);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    if (url && text) {
      const linkHtml = `<a href="${url}" style="color: #C72f32; text-decoration: none;" target="_blank" rel="noopener noreferrer">${text}</a>`;
      insertHtml(linkHtml);
    }
  };

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

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !htmlContent || !textContent) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setSending(true);
    setSuccessMessage('');
    setErrorMessage('');
    setSentCount(0);
    setFailedCount(0);

    try {
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
        setHtmlContent('');
        setTextContent('');
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
          <p className="text-sm text-gray-600">Send an email to all active subscribers</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rich Text Content (HTML)
            </label>
            
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-300 rounded-md mb-2">
              <button
                type="button"
                onClick={() => insertHtml('<strong>bold</strong>')}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertHtml('<em>italic</em>')}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertHtml('<ul><li>list item</li></ul>')}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertHtml('<ol><li>list item</li></ol>')}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-md"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              
              <CloudinaryUploader
                label="Insert Image"
                onUpload={(result) => insertImage(result.secure_url)}
                accept="image/*"
                maxSize={5}
                compact={true}
              />
              
              <CloudinaryUploader
                label="Insert Video"
                onUpload={(result) => insertVideo(result.secure_url)}
                accept="video/*"
                maxSize={20}
                isVideo={true}
                compact={true}
              />
            </div>

            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              placeholder="Enter HTML version of the email. You can also use the toolbar to add formatting and media."
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              HTML content should include complete email structure with doctype, html, head, and body tags.
            </p>
          </div>

          <div>
            <label htmlFor="textContent" className="block text-sm font-medium text-gray-700 mb-1">
              Plain Text Content
            </label>
            <textarea
              id="textContent"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter plain text version of the email"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
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
