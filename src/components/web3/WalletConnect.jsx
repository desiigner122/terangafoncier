import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Link as LinkIcon, Wallet, Network, CheckCircle, Loader2 } from 'lucide-react';
import terangaBlockchain, { terangaBlockchain as blockchain } from '@/services/TerangaBlockchainService';

const shorten = (addr) => addr ? `${addr.slice(0,6)}...${addr.slice(-4)}` : '';

export default function WalletConnect({ compact = false }) {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!blockchain || !blockchain.provider) return;
    try {
      const addr = await blockchain.getWalletAddress();
      const net = await blockchain.getNetworkInfo();
      setAddress(addr);
      setNetwork(net);
    } catch {}
  };

  useEffect(() => { refresh(); }, []);

  const onConnect = async () => {
    setLoading(true);
    try {
      await blockchain.initialize();
      await refresh();
      window.safeGlobalToast?.({ title: 'Portefeuille connecté' });
    } catch (e) {
      window.safeGlobalToast?.({ variant: 'destructive', title: 'Connexion échouée', description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(address); window.safeGlobalToast?.({ title: 'Adresse copiée' }); } catch {}
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {address ? (
          <>
            <span className="text-sm font-mono">{shorten(address)}</span>
            <Button size="sm" variant="outline" onClick={copy}><Copy className="w-4 h-4"/></Button>
          </>
        ) : (
          <Button size="sm" onClick={onConnect} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wallet className="mr-2 h-4 w-4"/>}
            Connect Wallet
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6 text-primary"/>
          {address ? (
            <div>
              <div className="font-semibold">{shorten(address)}</div>
              <div className="text-xs text-muted-foreground">{network?.current?.name || 'Réseau inconnu'}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Aucun portefeuille connecté</div>
          )}
        </div>
        {address ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={copy}><Copy className="w-4 h-4 mr-2"/>Copier</Button>
            <a href={network?.current?.blockExplorer} target="_blank" rel="noreferrer">
              <Button variant="outline"><LinkIcon className="w-4 h-4 mr-2"/>Explorer</Button>
            </a>
          </div>
        ) : (
          <Button onClick={onConnect} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wallet className="mr-2 h-4 w-4"/>}
            Connect Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
