import { useState } from 'react';
import toast from 'react-hot-toast';

export const useAI = () => {
  const [aiProvider] = useState(() => localStorage.getItem('ai_provider') || 'gemini');
  const [apiKeyInput] = useState(() => {
    const provider = localStorage.getItem('ai_provider') || 'gemini';
    return localStorage.getItem(provider === 'gemini' ? 'gemini_api_key' : 'azure_api_key') || '';
  });
  const [azureEndpoint] = useState(() => localStorage.getItem('azure_endpoint') || '');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const callAI = async (prompt) => {
    if (!apiKeyInput) {
      toast.error('API Anahtarı Gerekli');
      return null;
    }
    setIsAiLoading(true);
    try {
      let responseText = '';
      if (aiProvider === 'gemini') {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKeyInput },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      } else {
        if (!azureEndpoint) throw new Error('Endpoint Gerekli');
        const response = await fetch(azureEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': apiKeyInput },
          body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        responseText = data.choices?.[0]?.message?.content;
      }
      return responseText;
    } catch (error) {
      toast.error(`Hata: ${error.message}`);
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  return { callAI, isAiLoading };
};
