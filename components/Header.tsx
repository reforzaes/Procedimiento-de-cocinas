
import React, { useState } from 'react';
import { Search, MapPin, Calendar, User } from 'lucide-react';
import { Project, COLLABORATORS } from '../types';

interface HeaderProps {
  projects: Project[];
  onSelectProject: (id: string, step: number) => void;
  filterCollab: string;
  setFilterCollab: (v: string) => void;
  filterStart: string;
  setFilterStart: (v: string) => void;
  filterEnd: string;
  setFilterEnd: (v: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  projects, onSelectProject, 
  filterCollab, setFilterCollab, 
  filterStart, setFilterStart, 
  filterEnd, setFilterEnd 
}) => {
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
      {/* Top Bar: Solo Texto */}
      <div className="h-[72px] px-4 md:px-8 flex items-center justify-between gap-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#669900] tracking-tighter leading-none italic">LEROY MERLIN</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cocinas • Panel Gestor de Proyectos</span>
          </div>
        </div>

        <div className="flex-1 max-lg relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#669900]" />
          <input 
            type="text"
            placeholder="Buscar por cliente, teléfono o presupuesto..."
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
          <span className="text-xs font-black text-[#669900] uppercase tracking-tighter italic">Gandia 047</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-50/50 border-t px-4 md:px-8 py-3 flex items-center justify-center gap-6 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 text-gray-400" />
          <select 
            value={filterCollab} 
            onChange={(e) => setFilterCollab(e.target.value)}
            className="bg-white border rounded-xl px-3 py-1.5 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-[#669900]/20"
          >
            <option value="all">TODOS LOS COLABORADORES</option>
            {COLLABORATORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="h-4 w-[1px] bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-gray-400" />
          <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-1 text-[10px] font-black uppercase">
            <span className="text-gray-300">DESDE:</span>
            <input type="date" value={filterStart} onChange={(e) => setFilterStart(e.target.value)} className="outline-none" />
            <span className="text-gray-300 ml-2">HASTA:</span>
            <input type="date" value={filterEnd} onChange={(e) => setFilterEnd(e.target.value)} className="outline-none" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
