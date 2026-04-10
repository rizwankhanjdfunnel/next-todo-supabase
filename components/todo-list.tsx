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
    <div className="w-full max-w-md mx-auto mt-10 p-8 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem] shadow-2xl">
      <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-8 tracking-tight">
        <Music className="text-indigo-500" size={32}/> Instruments
      </h1>
      
      <form onSubmit={addInstrument} className="relative mb-8">
        <input 
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a new instrument..."
          className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full py-4 pl-6 pr-16 outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-foreground"
        />
        <button 
          type="submit"
          disabled={!newName.trim()}
          className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:grayscale text-white rounded-full w-12 flex items-center justify-center transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95"
        >
          <Plus size={24} />
        </button>
      </form>

      <ul className="space-y-3">
        {instruments.length === 0 ? (
          <div className="text-center py-10 flex flex-col items-center gap-3 text-foreground/40">
             <Music size={40} className="opacity-20" />
             <p className="text-sm">No instruments found.</p>
          </div>
        ) : (
          instruments.map(instrument => (
            <li 
              key={instrument.id} 
              className="group flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-lg font-medium text-foreground/80">
                  {instrument.name}
                </span>
              </div>
              <button 
                onClick={() => deleteInstrument(instrument.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all active:scale-90"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
