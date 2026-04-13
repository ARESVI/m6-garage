'use client';

import { useEffect, useRef, useState } from 'react';

interface MediaItem {
  id: string;
  url: string;
  tip: string;
  dosyaAdi?: string;
}

export default function ServiceMediaSection({ serviceId }: { serviceId: string }) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    fetch(`/api/services/${serviceId}/media`)
      .then(r => r.json())
      .then(data => setMedia(Array.isArray(data) ? data : []));
  };

  useEffect(() => { load(); }, [serviceId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      await fetch(`/api/services/${serviceId}/media`, { method: 'POST', body: fd });
    }
    setUploading(false);
    load();
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (mediaId: string) => {
    await fetch(`/api/services/${serviceId}/media`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId }),
    });
    load();
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-900">📎 Fotoğraf & Video</p>
        <label className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
          {uploading ? 'Yükleniyor...' : '+ Ekle'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {media.map(item => (
            <div key={item.id} className="relative group">
              {item.tip === 'photo' ? (
                <img
                  src={item.url}
                  alt={item.dosyaAdi || 'foto'}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90"
                  onClick={() => setLightbox(item)}
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-20 object-cover rounded cursor-pointer"
                  onClick={() => setLightbox(item)}
                />
              )}
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              {item.tip === 'video' && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">▶</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4"
          onClick={() => setLightbox(null)}
        >
          {lightbox.tip === 'photo' ? (
            <img src={lightbox.url} alt="" className="max-w-full max-h-full object-contain rounded" />
          ) : (
            <video src={lightbox.url} controls autoPlay className="max-w-full max-h-full rounded" onClick={e => e.stopPropagation()} />
          )}
          <button className="absolute top-4 right-4 text-white text-3xl font-bold">×</button>
        </div>
      )}
    </div>
  );
}
