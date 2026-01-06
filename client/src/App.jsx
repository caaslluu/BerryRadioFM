import React, { useState, useEffect } from 'react';
import { Sun, Moon, Radio, Music, Power, Square } from 'lucide-react';

const BerryRadio = () => {
  const [isDark, setIsDark] = useState(true);
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState('');
  const [freq, setFreq] = useState(87.5);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const res = await fetch('/api/songs');
      const { songs: data } = await res.json();
      setSongs(data || []);
      if (data?.length) setSelected(data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const play = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ music: selected, frequency: freq.toString() })
      });
      setPlaying(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stop = async () => {
    setLoading(true);
    try {
      await fetch('/api/stop', { method: 'POST' });
      setPlaying(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dark = isDark;
  const bg = dark ? 'from-slate-900 via-slate-800 to-slate-900' : 'from-blue-50 via-white to-blue-50';
  const card = dark ? 'bg-slate-800' : 'bg-white';
  const border = dark ? 'border-slate-700' : 'border-blue-200';
  const text = dark ? 'text-white' : 'text-gray-900';
  const muted = dark ? 'text-slate-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} transition-colors ${text}`}>
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b" style={{backgroundColor: dark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: dark ? '#334155' : '#dbeafe'}}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍓</span>
            <div>
              <h1 className="text-2xl font-bold"><span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">BerryR4DIO</span></h1>
              <p className={`text-xs ${muted}`}>Raspberry Pi FM Transmitter</p>
            </div>
          </div>
          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg transition ${dark ? 'hover:bg-slate-700' : 'hover:bg-blue-100'}`}>
            {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 ${card} border-2 ${border} rounded-2xl p-6 shadow-lg`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Radio size={24} className="text-red-500" />Contrôles</h2>

            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-3 ${muted}`}><Music size={16} className="inline mr-2" />Musiques</label>
              <div className={`border ${border} rounded-xl overflow-auto max-h-56 bg-opacity-50`} style={{backgroundColor: dark ? '#1e293b' : '#f8fafc'}}>
                {songs.length === 0 ? <div className={`p-4 text-center ${muted}`}>Aucune musique trouvée</div> : songs.map(song => (
                  <div key={song} onClick={() => setSelected(song)} className={`p-3 cursor-pointer transition flex items-center gap-2 border-b ${border} last:border-0 ${selected === song ? (dark ? 'bg-red-600 text-white' : 'bg-red-500 text-white') : (dark ? 'hover:bg-slate-700' : 'hover:bg-blue-50')}`}>
                    <input type="radio" checked={selected === song} onChange={() => setSelected(song)} className="w-4 h-4" />
                    <span className="truncate text-sm">{song}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className={`block text-sm font-semibold mb-3 ${muted}`}><Radio size={16} className="inline mr-2" />Fréquence</label>
              <div className={`${dark ? 'bg-slate-700' : 'bg-blue-100'} rounded-xl p-4`}>
                <input type="range" min="87.5" max="108.8" step="0.1" value={freq} onChange={(e) => setFreq(parseFloat(e.target.value))} className="w-full" style={{accentColor: '#ef4444'}} />
                <div className="flex justify-between items-center mt-3">
                  <span className={`text-xs ${muted}`}>87.5</span>
                  <span className="text-2xl font-bold text-red-500">{freq.toFixed(1)} MHz</span>
                  <span className={`text-xs ${muted}`}>108.8</span>
                </div>
              </div>
            </div>

            <div className={`${dark ? 'bg-slate-700' : 'bg-blue-100'} rounded-xl p-4 mb-6`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${muted}`}>État</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${playing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  <span className={`text-sm font-semibold ${playing ? 'text-green-500' : muted}`}>{playing ? 'EN DIRECT' : 'Arrêté'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={play} disabled={loading || playing || !selected} className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${loading || playing || !selected ? 'opacity-50 cursor-not-allowed' : ''} ${dark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                <Power size={18} />{loading ? 'Chargement...' : 'Démarrer'}
              </button>
              <button onClick={stop} disabled={loading || !playing} className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${loading || !playing ? 'opacity-50 cursor-not-allowed' : ''} ${dark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-900'}`}>
                <Square size={18} />Arrêter
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className={`${card} border-2 ${border} rounded-2xl p-6 shadow-lg`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Music size={20} className="text-pink-500" />En lecture</h3>
              <div className={`${dark ? 'bg-slate-700' : 'bg-blue-100'} rounded-xl p-6 text-center`}>
                {playing ? (
                  <>
                    <div className="flex justify-center gap-1 mb-4 h-12 items-end">
                      {[0, 1, 2, 3, 4].map(i => (<div key={i} className="w-1 bg-red-500 rounded-full" style={{height: `${12 + i * 6}px`, animation: `wave ${0.6 + i * 0.05}s ease-in-out infinite`}} />))}
                    </div>
                    <p className={`text-xs ${dark ? 'text-red-400' : 'text-red-600'} font-semibold mb-3`}>🔴 EN DIRECT</p>
                    <p className="font-semibold text-sm mb-2 truncate">{selected}</p>
                    <p className="text-2xl font-bold text-red-500">{freq.toFixed(1)}</p>
                  </>
                ) : (
                  <div className="py-4">
                    <Radio size={32} className="mx-auto mb-2 opacity-30" />
                    <p className={muted + ' text-sm'}>Aucune lecture</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${card} border-2 ${border} rounded-2xl p-6 shadow-lg`}>
              <p className={`text-sm ${muted} mb-4 leading-relaxed`}>Station radio FM sur Raspberry Pi. Sélectionnez une musique et une fréquence pour commencer.</p>
              <a href="https://github.com/caaslluu" target="_blank" rel="noreferrer" className={`block py-2 rounded-lg text-center text-sm font-semibold transition ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-100 hover:bg-blue-200'}`}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-100%); } }`}</style>
    </div>
  );
};

export default BerryRadio;
