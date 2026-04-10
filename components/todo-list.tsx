"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trash2, Plus, Music } from "lucide-react";

type Instrument = {
  id: number;
  name: string;
};

export default function InstrumentsList() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [newName, setNewName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    // Fetching the instruments you added in the database
    const { data, error } = await supabase.from("instruments").select("*").order("id", { ascending: false });
    if (data) setInstruments(data);
  };

  const addInstrument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const tempId = Date.now();
    const newItem = { id: tempId, name: newName };
    setInstruments([newItem, ...instruments]);
    setNewName("");

    const { data, error } = await supabase
      .from("instruments")
      .insert([{ name: newItem.name }])
      .select();
      
    if (data && data[0]) {
      setInstruments((current) => 
        current.map(item => item.id === tempId ? data[0] : item)
      );
    } else {
        fetchInstruments();
    }
  };

  const deleteInstrument = async (id: number) => {
    setInstruments(instruments.filter(item => item.id !== id));
    await supabase.from("instruments").delete().match({ id });
  };

  return (
    <div className="w-full p-8 bg-[#18181b]/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative inner glow */}
      <div className="absolute -top-[50%] -left-[50%] w-full h-full bg-purple-500/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <Music className="text-purple-400" size={26}/> 
               My Instruments
            </h2>
            <p className="text-foreground/50 text-sm mt-1">Here is your complete collection.</p>
         </div>
      </div>
      
      <form onSubmit={addInstrument} className="relative mb-8 z-10">
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Type to add a new instrument..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder:text-foreground/40 shadow-inner"
        />
        <button 
          type="submit"
          disabled={!newName.trim()}
          className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 disabled:opacity-50 disabled:grayscale text-white rounded-xl px-4 flex items-center justify-center transition-all shadow-lg active:scale-95"
        >
          <span className="hidden sm:block font-medium mr-2">Add</span>
          <Plus size={20} />
        </button>
      </form>

      <ul className="space-y-3 z-10 relative">
        {instruments.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4 text-foreground/40 bg-black/20 rounded-2xl border border-dashed border-white/5">
             <div className="p-4 bg-white/5 rounded-full"><Music size={32} className="opacity-50" /></div>
             <p className="font-medium text-white/50">Your gallery is empty.<br/><span className="text-sm font-normal">Add your first instrument above!</span></p>
          </div>
        ) : (
          instruments.map((instrument, index) => (
            <li 
              key={instrument.id} 
              style={{ animationDelay: `${index * 50}ms` }}
              className="group flex items-center justify-between p-5 bg-black/30 border border-white/5 rounded-2xl hover:bg-black/50 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex items-center gap-5 flex-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center shadow-inner">
                   <Music size={16} className="text-purple-300/80" />
                </div>
                <span className="text-lg font-medium text-white/90">
                  {instrument.name}
                </span>
              </div>
              <button 
                onClick={() => deleteInstrument(instrument.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
