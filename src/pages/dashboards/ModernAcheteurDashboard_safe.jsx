import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Zap, 
  Shield, 
  Layers, 
  Coins, 
  TrendingUp, 
  ArrowRight, 
  Building2, 
  Users, 
  FileText, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Lock 
} from 'lucide-react';

// Safer imports with error handling
let useAuth, supabase, terangaBlockchain;

try {
  const authModule = require('../../context/AuthContext');
  useAuth = authModule.useAuth;
} catch (error) {
  console.error('Failed to import AuthContext:', error);
  useAuth = () => ({ user: null });
}

try {
  const supabaseModule = require('../../lib/supabase');
  supabase = supabaseModule.supabase;
} catch (error) {
  console.error('Failed to import supabase:', error);
  supabase = null;
}

try {
  const blockchainModule = require('../../services/TerangaBlockchainService');
  terangaBlockchain = blockchainModule.terangaBlockchain;
} catch (error) {
  console.error('Failed to import TerangaBlockchainService:', error);
  terangaBlockchain = {
    getWalletAddress: () => Promise.resolve(null),
    connectWallet: () => Promise.resolve(false)
  };
}

const ModernAcheteurDashboard = () => {
  console.log('🚀 ModernAcheteurDashboard component initializing...');
  
  // Safe hook usage
  let user = null;
  let navigate = () => {};
  
  try {
    const auth = useAuth();
    user = auth?.user || null;
  } catch (error) {
    console.error('useAuth hook error:', error);
  }
  
  try {
    navigate = useNavigate();
  } catch (error) {
    console.error('useNavigate hook error:', error);
  }
  
  console.log('✅ Hooks initialized, user:', user?.email);
  
  // États blockchain avec valeurs par défaut sûres
  const [walletBalance, setWalletBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [nftCount, setNftCount] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // États traditionnels
  const [favCount, setFavCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);

  // KPIs Blockchain avec protection d'erreur
  const blockchainKpis = React.useMemo(() => {
    console.log('📊 Building blockchain KPIs...', { walletBalance, tokenBalance, nftCount, stakingRewards });
    
    try {
      const safeWalletBalance = Number(walletBalance) || 0;
      const safeTokenBalance = Number(tokenBalance) || 0;
      const safeNftCount = Number(nftCount) || 0;
      const safeStakingRewards = Number(stakingRewards) || 0;

      return [
        {
          title: 'Balance Wallet',
          value: `${safeWalletBalance.toLocaleString()} FCFA`,
          icon: Wallet,
          gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
          trend: 12.5
        },
        {
          title: 'Tokens TERANGA',
          value: `${safeTokenBalance.toLocaleString()} TRG`,
          icon: Coins,
          gradient: 'bg-gradient-to-br from-purple-600 to-purple-800',
          trend: 8.3
        },
        {
          title: 'NFT Immobiliers',
          value: safeNftCount,
          icon: Layers,
          gradient: 'bg-gradient-to-br from-green-600 to-green-800',
          trend: 25.0
        },
        {
          title: 'Rewards Staking',
          value: `${safeStakingRewards.toLocaleString()} FCFA`,
          icon: TrendingUp,
          gradient: 'bg-gradient-to-br from-orange-600 to-orange-800',
          trend: 15.2
        }
      ];
    } catch (error) {
      console.error('❌ Error building blockchain KPIs:', error);
      return [
        {
          title: 'Balance Wallet',
          value: '0 FCFA',
          icon: Wallet,
          gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
          trend: 0
        }
      ];
    }
  }, [walletBalance, tokenBalance, nftCount, stakingRewards]);

  // Services blockchain avec protection d'erreur
  const blockchainServices = [
    {
      title: 'Tokenisation NFT',
      subtitle: 'Propriétés certifiées blockchain',
      icon: Layers,
      color: 'bg-blue-600/20',
      onClick: () => {
        try {
          navigate('/nft-properties');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'Smart Contracts',
      subtitle: 'Contrats automatisés',
      icon: FileText,
      color: 'bg-purple-600/20',
      onClick: () => {
        try {
          navigate('/smart-contracts');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'DeFi Staking',
      subtitle: 'Revenus passifs garantis',
      icon: TrendingUp,
      color: 'bg-green-600/20',
      onClick: () => {
        try {
          navigate('/staking');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'Escrow Décentralisé',
      subtitle: 'Transactions sécurisées',
      icon: Shield,
      color: 'bg-orange-600/20',
      onClick: () => {
        try {
          navigate('/escrow');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'DAO Gouvernance',
      subtitle: 'Votes communautaires',
      icon: Users,
      color: 'bg-indigo-600/20',
      onClick: () => {
        try {
          navigate('/dao');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'Coffre-fort Crypto',
      subtitle: 'Stockage sécurisé',
      icon: ShieldCheck,
      color: 'bg-red-600/20',
      onClick: () => {
        try {
          navigate('/vault');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    }
  ];

  // Méthodes de paiement crypto
  const paymentMethods = [
    {
      title: 'Paiement Crypto Instant',
      subtitle: 'Bitcoin, Ethereum, USDC',
      icon: CreditCard,
      color: 'bg-blue-600/20',
      features: ['Transactions instantanées', 'Frais réduits', 'Sécurité maximale'],
      buttonText: 'Configurer',
      action: () => {
        try {
          navigate('/payment/crypto');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'DeFi Échelonné',
      subtitle: 'Paiements programmables',
      icon: Clock,
      color: 'bg-green-600/20',
      features: ['Échéancier flexible', 'Taux avantageux', 'Collateral intelligent'],
      buttonText: 'Explorer',
      action: () => {
        try {
          navigate('/payment/defi-installments');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    },
    {
      title: 'Hybride Traditionnel+',
      subtitle: 'Garantie tokenisée',
      icon: Lock,
      color: 'bg-purple-600/20',
      features: ['Garantie NFT', 'Virement classique', 'Assurance blockchain'],
      buttonText: 'En savoir plus',
      action: () => {
        try {
          navigate('/payment/hybrid');
        } catch (error) {
          console.error('Navigation error:', error);
        }
      }
    }
  ];

  useEffect(() => {
    const loadBlockchainData = async () => {
      console.log('🔄 Loading blockchain data...');
      
      if (!user) {
        console.log('❌ No user found');
        return;
      }
      
      try {
        // Simulation de données blockchain sécurisée
        const mockWalletBalance = Math.floor(Math.random() * 1000000);
        const mockTokenBalance = Math.floor(Math.random() * 50000);
        const mockNftCount = Math.floor(Math.random() * 10);
        const mockStakingRewards = Math.floor(Math.random() * 100000);
        
        setWalletBalance(mockWalletBalance);
        setTokenBalance(mockTokenBalance);
        setNftCount(mockNftCount);
        setStakingRewards(mockStakingRewards);
        
        console.log('✅ Mock blockchain data loaded');

        // Données traditionnelles avec Supabase
        if (supabase) {
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();

            const { count: favCount } = await supabase
              .from('favorites')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);
            setFavCount(favCount || 0);

            const { count: requestsCount } = await supabase
              .from('requests')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);
            setRequestsCount(requestsCount || 0);
            
            console.log('✅ Supabase data loaded');
          } catch (supabaseError) {
            console.error('Supabase error:', supabaseError);
          }
        }

        // Vérifier la connexion wallet avec protection
        if (terangaBlockchain && typeof terangaBlockchain.getWalletAddress === 'function') {
          try {
            const address = await terangaBlockchain.getWalletAddress();
            if (address) {
              setWalletAddress(address);
              setIsWalletConnected(true);
              console.log('✅ Wallet connected:', address);
            } else {
              console.log('ℹ️ No wallet address found');
            }
          } catch (walletError) {
            console.log('⚠️ Wallet non connecté:', walletError?.message || 'Unknown error');
            setIsWalletConnected(false);
          }
        }
        
      } catch (error) {
        console.error('❌ Erreur chargement données:', error);
      }
    };

    loadBlockchainData();
  }, [user]);

  const handleConnectWallet = async () => {
    try {
      if (terangaBlockchain && typeof terangaBlockchain.connectWallet === 'function') {
        await terangaBlockchain.connectWallet();
      }
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
    }
  };

  // Calcul sécurisé de la valeur totale du portefeuille
  const totalValue = React.useMemo(() => {
    try {
      const safeWalletBalance = Number(walletBalance) || 0;
      const safeTokenBalance = Number(tokenBalance) || 0;
      return safeWalletBalance + safeTokenBalance;
    } catch (error) {
      console.error('Error calculating total value:', error);
      return 0;
    }
  }, [walletBalance, tokenBalance]);

  console.log('✅ Component render ready');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">
            Dashboard Blockchain <span className="text-blue-400">DeFi</span>
          </h1>
          <p className="text-blue-200">
            Votre plateforme d'investissement immobilier décentralisée
          </p>
        </motion.div>

        {/* Wallet Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 backdrop-blur border border-blue-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Status Wallet</h3>
                <p className="text-blue-200 text-sm">
                  {isWalletConnected ? 'Connecté et sécurisé' : 'Non connecté'}
                </p>
              </div>
            </div>
            
            {isWalletConnected ? (
              <div className="text-right">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">En ligne</span>
                </div>
                <span className="text-blue-200 text-sm">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connecté'}
                </span>
              </div>
            ) : (
              <button 
                onClick={handleConnectWallet}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Connecter Wallet</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* KPIs Blockchain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {blockchainKpis.map((kpi, index) => (
            <div
              key={kpi.title}
              className={`${kpi.gradient} rounded-xl p-6 text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <kpi.icon className="w-8 h-8" />
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">
                    +{kpi.trend}%
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">{kpi.value}</h3>
                <p className="text-white/80 text-sm">{kpi.title}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/20 backdrop-blur border border-blue-500/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Portfolio Blockchain</h2>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Valeur totale</p>
              <p className="text-3xl font-bold text-white">
                {totalValue.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </motion.div>

        {/* Services Blockchain */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {blockchainServices.map((service, index) => (
            <motion.div
              key={service.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={service.onClick}
              className={`${service.color} backdrop-blur border border-white/10 rounded-xl p-6 cursor-pointer transition-all hover:border-blue-500/40`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{service.title}</h3>
                  <p className="text-white/70 text-sm">{service.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center text-blue-400 text-sm font-medium">
                <span>Découvrir</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Méthodes de Paiement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white text-center">
            Solutions de Paiement <span className="text-blue-400">Crypto</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.title}
                whileHover={{ scale: 1.02 }}
                className={`${method.color} backdrop-blur border border-white/10 rounded-xl p-6`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{method.title}</h3>
                    <p className="text-white/70 text-sm">{method.subtitle}</p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {method.features.map((feature, idx) => (
                    <li key={idx} className="text-white/80 text-sm flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={method.action}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {method.buttonText}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernAcheteurDashboard;