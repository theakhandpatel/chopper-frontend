import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, Globe } from 'lucide-react';

interface Analytics {
  'url-id': number;
  ip_address: string;
  'user-agent': string;
  referrer: string;
  accessed_at: string;
}

interface AnalyticsProps {
  token: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ token }) => {
  const [selectedUrl, setSelectedUrl] = useState('');
  const [urls, setUrls] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUrls();
  }, [token]);

  const fetchUrls = async () => {
    try {
      const response = await fetch('https://ch-op.onrender.com/api/short/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      setUrls(data.urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchAnalytics = async (shortCode: string) => {
    try {
      const response = await fetch(`https://ch-op.onrender.com/api/stats/${shortCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    if (selectedUrl) {
      fetchAnalytics(selectedUrl);
    }
  }, [selectedUrl]);

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="urlSelect" className="block text-sm font-medium text-gray-700">
          Select URL to view analytics
        </label>
        <select
          id="urlSelect"
          value={selectedUrl}
          onChange={(e) => setSelectedUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a URL</option>
          {urls.map((url) => (
            <option key={url.ShortCode} value={url.ShortCode}>
              {url.ShortCode} - {url.LongForm}
            </option>
          ))}
        </select>
      </div>

      {selectedUrl && analytics.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Total Clicks</h3>
                <BarChart className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.length}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Unique Visitors</h3>
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {new Set(analytics.map(a => a.ip_address)).size}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Last Click</h3>
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {new Date(analytics[analytics.length - 1].accessed_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Click History</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referrer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.accessed_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.ip_address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry['user-agent']}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.referrer || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedUrl && analytics.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No analytics data available for this URL yet.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;