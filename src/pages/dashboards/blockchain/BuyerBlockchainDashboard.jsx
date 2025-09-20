import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WalletConnect from '@/components/web3/WalletConnect';
import terangaBlockchain, { terangaBlockchain as blockchain } from '@/services/TerangaBlockchainService';
import { Coins, Network, Zap, Shield, FileCheck2, ExternalLink, Loader2 } from 'lucide-react';

const Stat = ({ icon: Icon, label, value, hint }) => (
  <Card>
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-primary"/>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </div>
      {hint && <Badge variant="secondary">{hint}</Badge>}
    </CardContent>
  </Card>
);

export default function BuyerBlockchainDashboard() {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [gasPrice, setGasPrice] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      if (!blockchain?.provider) await blockchain.initialize();
      const addr = await blockchain.getWalletAddress();
      const net = await blockchain.getNetworkInfo();
      const gp = await blockchain.getGasPrice();
      let bal = '0';
      try { bal = await blockchain.getTokenBalance(addr); } catch {}
      let actives = [];
      try { actives = await blockchain.getActiveListings(); } catch {}
      setAddress(addr);
      setNetwork(net);
      setGasPrice(gp);
      setTokenBalance(bal);
      setListings(actives.slice(0,5));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const mintProof = async () => {
    setMinting(true);
    try {
      // Placeholder mint to demonstrate capability
      const tokenURI = 'ipfs://QmProofPlaceholder';
      const tx = await blockchain.contracts?.nft?.mint(address, tokenURI);
      if (tx) {
        await tx.wait();
        window.safeGlobalToast?.({ title: 'NFT de preuve émis' });
      } else {
        window.safeGlobalToast?.({ title: 'Contrat NFT non configuré', variant: 'destructive' });
      }
    } catch (e) {
      window.safeGlobalToast?.({ title: 'Échec du mint', description: e.message, variant: 'destructive' });
    } finally {
      setMinting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Blockchain</h1>
          <p className="text-muted-foreground">Statut du portefeuille, réseau, soldes, et activités on-chain.</p>
        </div>
        <div className="min-w-[260px]">
          <WalletConnect />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat icon={Network} label="Réseau" value={network?.current?.name || '—'} hint={`ChainId ${network?.current?.chainId || '-'}`}/>
        <Stat icon={Coins} label="Solde TERANGA" value={`${parseFloat(tokenBalance).toFixed(4)} TGA`} hint="Token utilitaire"/>
        <Stat icon={Zap} label="Prix du gas" value={gasPrice ? `${gasPrice} gwei` : '—'} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Effectuez des opérations Web3 utiles pour vos démarches foncières.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={load} variant="outline"><RefreshIcon/> Rafraîchir</Button>
          <Button onClick={mintProof} disabled={!address || minting}>
            {minting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Shield className="mr-2 h-4 w-4"/>}
            Émettre un NFT de preuve
          </Button>
          <a href={network?.current?.blockExplorer} target="_blank" rel="noreferrer">
            <Button variant="outline"><ExternalLink className="mr-2 h-4 w-4"/> Ouvrir l'explorateur</Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listings actifs (marché)</CardTitle>
          <CardDescription>Dernières propriétés listées sur la marketplace on-chain.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">Chargement...</div>
          ) : listings.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">Aucun listing actif.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {listings.map((l) => (
                <Card key={l.listingId}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Token #{l.tokenId}</div>
                      <div className="text-sm text-muted-foreground">{l.property?.title || 'Propriété'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">{l.price} MATIC</div>
                      <div className="text-xs text-muted-foreground">#{l.listingId}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RefreshIcon() { return <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.13-3.36L23 10"/><path d="M1 14l5.36 4.36A9 9 0 0020.49 15"/></svg>; }