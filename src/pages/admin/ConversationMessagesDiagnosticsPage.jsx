import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Database, AlertTriangle, Copy, Download } from 'lucide-react';

const sqlSnippet = `-- Show all columns in conversation_messages table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'conversation_messages'
ORDER BY ordinal_position;

-- Show constraints on the table
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND table_name = 'conversation_messages';

-- Show indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'conversation_messages';`;

const Table = ({ columns, rows, empty }) => (
  <div className="overflow-auto rounded-md border border-slate-200 bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 text-slate-600">
        <tr>
          {columns.map((c) => (
            <th key={c} className="px-3 py-2 text-left font-medium border-b border-slate-200">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-3 py-6 text-center text-slate-400">{empty}</td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-slate-50/50">
              {columns.map((c) => (
                <td key={c} className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">{String(row[c] ?? '')}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

const ConversationMessagesDiagnosticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [cols, setCols] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [indexes, setIndexes] = useState([]);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try information_schema.columns
      const { data: c1, error: e1 } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', 'conversation_messages')
        .order('ordinal_position', { ascending: true });

      if (e1) throw e1;
      setCols(c1 || []);

      // table_constraints
      const { data: c2, error: e2 } = await supabase
        .from('information_schema.table_constraints')
        .select('constraint_name, constraint_type')
        .eq('table_schema', 'public')
        .eq('table_name', 'conversation_messages');

      if (e2) throw e2;
      setConstraints(c2 || []);

      // pg_indexes
      const { data: c3, error: e3 } = await supabase
        .from('pg_indexes')
        .select('indexname, indexdef')
        .eq('schemaname', 'public')
        .eq('tablename', 'conversation_messages');

      if (e3) throw e3;
      setIndexes(c3 || []);
    } catch (err) {
      console.warn('Diagnostics query failed:', err?.message);
      setError(err?.message || 'Permission refusée ou vue non exposée');
      setCols([]);
      setConstraints([]);
      setIndexes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const copySQL = async () => {
    try { await navigator.clipboard.writeText(sqlSnippet); } catch {}
  };

  const exportJSON = () => {
    const payload = { columns: cols, constraints, indexes, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation_messages_diagnostics.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">Diagnostics conversation_messages</h1>
            <p className="text-sm text-slate-600">Colonnes, contraintes et index (schéma public)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copySQL}><Copy className="h-4 w-4 mr-2" />Copier SQL</Button>
          <Button variant="outline" size="sm" onClick={exportJSON}><Download className="h-4 w-4 mr-2" />Exporter JSON</Button>
          <Button size="sm" onClick={fetchAll} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Rafraîchir
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 border-amber-300 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Impossible d'interroger les vues système côté client.</p>
              <p className="text-sm text-amber-700 mt-1">Copiez et exécutez le script ci-dessous dans le SQL Editor Supabase (ou via psql) avec un rôle ayant accès:</p>
              <pre className="mt-3 p-3 bg-white border rounded text-xs overflow-auto whitespace-pre-wrap">{sqlSnippet}</pre>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Colonnes</h2>
          <Table
            columns={["column_name", "data_type", "is_nullable", "column_default"]}
            rows={cols}
            empty={loading ? 'Chargement…' : 'Aucune donnée (permissions?)'}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Contraintes</h2>
          <Table
            columns={["constraint_name", "constraint_type"]}
            rows={constraints}
            empty={loading ? 'Chargement…' : 'Aucune donnée'}
          />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">Index</h2>
          <Table
            columns={["indexname", "indexdef"]}
            rows={indexes}
            empty={loading ? 'Chargement…' : 'Aucune donnée'}
          />
        </section>
      </div>
    </div>
  );
};

export default ConversationMessagesDiagnosticsPage;
