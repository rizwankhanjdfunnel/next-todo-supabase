"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Music, Edit2, Check, X } from "lucide-react";

type Instrument = {
  id: number;
  name: string;
};

export default function InstrumentsList() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchInstruments();
    
    // Subscribe to DB changes to keep list in sync automatically
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instruments' }, () => {
         fetchInstruments();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel) };
  }, []);

  const fetchInstruments = async () => {
    const { data } = await supabase.from("instruments").select("*").order("id", { ascending: false });
    if (data) setInstruments(data);
  };

  const addInstrument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const { data } = await supabase.from("instruments").insert([{ name: newName }]);
    setNewName("");
    // We let realtime trigger the fetch update so UI stays synced with Server state
  };

  const startEdit = (instrument: Instrument) => {
    setEditingId(instrument.id);
    setEditName(instrument.name);
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editingId) return setEditingId(null);
    await supabase.from("instruments").update({ name: editName }).match({ id: editingId });
    setEditingId(null);
  };

  const deleteInstrument = async (id: number) => {
    await supabase.from("instruments").delete().match({ id });
  };

  return (
    <div className="w-full p-8 bg-[#18181b]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute -top-[50%] -left-[50%] w-full h-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 mb-6">
         <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Music className="text-purple-400" size={26}/> 
               My Instruments
            </h2>
            <p className="text-foreground/50 text-sm mt-1">Manage and edit your collection.</p>
         </div>
      </div>
      
      <form onSubmit={addInstrument} className="relative mb-6 z-10 flex gap-2">
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New instrument..."
          className="flex-1 bg-black/40 border border-white/10 rounded-2xl py-3 pl-5 outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-foreground/40 shadow-inner"
        />
        <button 
          type="submit"
          disabled={!newName.trim()}
          className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white rounded-2xl px-5 transition-all shadow-lg active:scale-95 flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> Add
        </button>
      </form>

      <ul className="space-y-3 z-10 relative">
        {instruments.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/5">
             <Music size={32} className="mx-auto mb-3 opacity-30" />
             <p className="text-white/50">Your gallery is empty.</p>
          </div>
        ) : (
          instruments.map((instrument) => (
            <li 
              key={instrument.id} 
              className="group flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-2xl hover:bg-black/50 transition-all hover:border-white/10"
            >
              {editingId === instrument.id ? (
                <div className="flex-1 flex gap-2 mr-4">
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-4 py-2 outline-none text-white focus:border-purple-500"
                    autoFocus
                  />
                  <button onClick={saveEdit} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/40 rounded-xl"><Check size={20} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2 bg-white/5 text-foreground/50 hover:bg-white/10 hover:text-white rounded-xl"><X size={20} /></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-1 overflow-hidden pr-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center shrink-0">
                       <Music size={16} className="text-purple-300" />
                    </div>
                    <span className="text-lg font-medium text-white/90 truncate">
                      {instrument.name}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all">
                    <button onClick={() => startEdit(instrument)} className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-xl transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteInstrument(instrument.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
