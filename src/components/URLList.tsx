import React, { useState, useEffect } from 'react';
import { Trash2, QrCode, ExternalLink } from 'lucide-react';

interface URL {
  LongForm: string;
  ShortCode: string;
  Redirect: number;
  Expired: string;
}

interface URLListProps {
  token: string;
  isPremium: boolean;
}

const URLList: React.FC<URLListProps> = ({ token, isPremium }) => {
  const [urls, setUrls] = useState<URL[]>([]);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);

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

  useEffect(() => {
    fetchUrls();
  }, [token]);

  const deleteUrl = async (shortCode: string) => {
    try {
      const response = await fetch(`https://ch-op.onrender.com/api/short/${shortCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete URL');
      }

      fetchUrls();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchQrCode = async (shortCode: string) => {
    try {
      const response = await fetch(`https://ch-op.onrender.com/qr/${shortCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCode(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {urls.map((url) => (
              <tr key={url.ShortCode}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`https://ch-op.onrender.com/${url.ShortCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {url.ShortCode}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="truncate max-w-md">{url.LongForm}</span>
                    <a
                      href={url.LongForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(url.Expired).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {isPremium && (
                      <button
                        onClick={() => fetchQrCode(url.ShortCode)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <QrCode className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteUrl(url.ShortCode)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6">
            <img src={qrCode} alt="QR Code" className="max-w-xs" />
            <button
              onClick={() => setQrCode(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLList;