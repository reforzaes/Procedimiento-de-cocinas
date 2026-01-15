
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  projects: Project[];
  onSelectProject: (id: string, step: number) => void;
}

const Header: React.FC<HeaderProps> = ({ projects, onSelectProject }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredResults = query.trim().length > 0 
    ? projects.filter(p => 
        (p.clientName?.toLowerCase().includes(query.toLowerCase()) || '') ||
        (p.phone?.includes(query) || '') ||
        (p.budgetNumber?.toLowerCase().includes(query.toLowerCase()) || '')
      )
    : [];

  return (
    <header className="bg-white border-b sticky top-0 z-[60] shadow-md">
      <div className="h-[72px] px-4 md:px-8 flex items-center justify-between gap-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-[#669900] tracking-tighter leading-none italic uppercase">LEROY MERLIN</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 border-t border-gray-100 pt-0.5">Gestor de Proyectos de Cocinas</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#669900]" />
          <input 
            type="text"
            placeholder="Buscar por cliente o presupuesto..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#669900]/20 transition-all text-sm font-medium"
          />
          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
              {filteredResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onSelectProject(p.id, p.currentStep); setQuery(''); setShowResults(false); }}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 flex items-center justify-between border-b last:border-0 transition-colors"
                >
                  <div>
                    <p className="font-bold text-gray-900">{p.clientName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.phone} • Paso {p.currentStep}</p>
                  </div>
                  <span className="text-xs font-black text-[#669900] italic">#{p.id.substr(0,4)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <MapPin className="w-4 h-4 text-[#669900]" />
          <span className="text-xs font-black text-[#669900] uppercase tracking-tighter italic leading-none pt-0.5">Gandia 047</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
