"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Clock, Plus, Edit2, Trash2 } from "lucide-react";

type Log = {
  id: number;
  action_type: 'INSERT' | 'UPDATE' | 'DELETE';
  old_name: string | null;
  new_name: string | null;
  created_at: string;
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchLogs();

    // Supabase Real-time listener for instant ui updates!
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'instrument_logs' }, (payload) => {
        setLogs((current) => [payload.new as Log, ...current]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase.from('instrument_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setLogs(data);
  };

  const getLogIcon = (action: string) => {
    if (action === 'INSERT') return <div className="p-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30"><Plus size={16}/></div>;
    if (action === 'UPDATE') return <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"><Edit2 size={16}/></div>;
    return <div className="p-2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"><Trash2 size={16}/></div>;
  };

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-lg flex-1 overflow-y-auto max-h-[500px] mt-6 shadow-inner">
      <h3 className="text-foreground/80 font-bold mb-6 flex items-center gap-2">
        <Clock size={18} className="text-purple-400" /> Live Activity Logs
      </h3>
      <div className="space-y-4">
        {logs.length === 0 ? <p className="text-foreground/40 text-sm italic">No activity recorded yet.</p> : null}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 items-start border-l-2 border-white/10 pl-6 py-2 relative group hover:border-white/30 transition-colors">
            <div className="absolute -left-[18px] top-1 bg-[#18181b] rounded-full p-1 shadow-lg group-hover:scale-110 transition-transform">
              {getLogIcon(log.action_type)}
            </div>
            <div className="bg-black/20 p-3 rounded-2xl w-full border border-white/5">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {log.action_type === 'INSERT' && <span>Added <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">{log.new_name}</span></span>}
                {log.action_type === 'UPDATE' && <span>Changed <span className="text-white line-through opacity-50 bg-white/5 px-2 py-0.5 rounded-md">{log.old_name}</span> to <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">{log.new_name}</span></span>}
                {log.action_type === 'DELETE' && <span>Deleted <span className="text-white font-bold bg-red-500/10 px-2 py-0.5 rounded-md text-red-200">{log.old_name}</span></span>}
              </p>
              <span className="text-xs text-foreground/40 font-mono mt-2 block opacity-70">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
