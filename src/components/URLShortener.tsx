import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface URLShortenerProps {
  token: string;
  isPremium: boolean;
}

const URLShortener: React.FC<URLShortenerProps> = ({ token, isPremium }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [redirectType, setRedirectType] = useState('permanent');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const body: any = { long: longUrl };
      if (customAlias) body.short = customAlias;
      if (redirectType === 'temporary') body.redirect = 'temporary';

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://ch-op.onrender.com/api/short', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      setShortUrl(data.short_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700">
            Long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            placeholder="https://example.com/very/long/url"
          />
        </div>

        {token && (
          <>
            <div>
              <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
                Custom Alias {!isPremium && '(min 6 characters)'}
              </label>
              <input
                type="text"
                id="customAlias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="custom-alias"
                minLength={isPremium ? 4 : 6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Redirect Type
              </label>
              <select
                value={redirectType}
                onChange={(e) => setRedirectType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="permanent">Permanent</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Shorten URL
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {shortUrl && (
        <div className="mt-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-500"
            >
              {shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLShortener;