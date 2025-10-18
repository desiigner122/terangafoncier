import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, TrendingUp, Gift, Shield, Headphones } from 'lucide-react';

export function PaymentGuideVendeur() {
  const [activeTab, setActiveTab] = useState('how-it-works');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">💰 Comment Payer Votre Abonnement</h1>
          <p className="text-xl text-gray-300">
            Guide complet pour les vendeurs - Comprendre les plans et les paiements
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'how-it-works', label: '🎯 Comment ça marche' },
            { id: 'payment-methods', label: '💳 Moyens de paiement' },
            { id: 'faq', label: '❓ FAQ' },
            { id: 'support', label: '📞 Support' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* How It Works */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-6">
              <Card className="bg-slate-700 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Le Processus en 4 Étapes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: '📝 Créer votre compte',
                      description: 'Inscrivez-vous sur Teranga Foncier avec votre email et mot de passe. Vous recevrez un compte GRATUIT plan Free automatiquement.',
                      icon: '📝'
                    },
                    {
                      step: 2,
                      title: '🔍 Choisir un plan',
                      description: 'Allez dans Paramètres → Abonnement. Explorez les plans (Free, Basic, Pro, Enterprise) selon vos besoins.',
                      icon: '🔍'
                    },
                    {
                      step: 3,
                      title: '💳 Payer',
                      description: 'Cliquez sur "Choisir ce plan". Pour les plans payants, vous serez redirigé vers la page de paiement Stripe sécurisée.',
                      icon: '💳'
                    },
                    {
                      step: 4,
                      title: '✅ Actif immédiatement',
                      description: 'Après le paiement réussi, votre nouveau plan est actif immédiatement. Accédez à toutes les fonctionnalités!',
                      icon: '✅'
                    }
                  ].map(item => (
                    <div key={item.step} className="flex gap-4 p-4 bg-slate-600 rounded-lg">
                      <div className="text-3xl flex-shrink-0">{item.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {item.step}. {item.title}
                        </h3>
                        <p className="text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Plans Comparison */}
              <Card className="bg-slate-700 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    Comparaison des Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-500">
                        <tr>
                          <th className="text-left py-2">Fonctionnalité</th>
                          <th className="px-4 py-2">Free</th>
                          <th className="px-4 py-2">Basic</th>
                          <th className="px-4 py-2">Pro</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {[
                          ['Annonces', '5', '50', 'Illimitées'],
                          ['Demandes/mois', '100', '1 000', 'Illimitées'],
                          ['Stockage', '5 GB', '50 GB', 'Illimité'],
                          ['Photos IA', '❌', '✅', '✅'],
                          ['Support', 'Email', 'Prioritaire', '24/7'],
                          ['Prix/mois', '0 CFA', '4 990 CFA', '9 990 CFA'],
                        ].map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-600">
                            <td className="py-2">{row[0]}</td>
                            <td className="px-4 py-2 text-center">{row[1]}</td>
                            <td className="px-4 py-2 text-center">{row[2]}</td>
                            <td className="px-4 py-2 text-center text-green-400 font-semibold">{row[3]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === 'payment-methods' && (
            <div className="space-y-6">
              <Card className="bg-slate-700 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    Moyens de Paiement Acceptés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: '💳 Stripe (Carte Bancaire)',
                      description: 'Visa, Mastercard, American Express',
                      features: ['Paiement sécurisé 3D Secure', 'Récepissé instant', 'Remboursement en 7 jours'],
                      icon: '💳'
                    },
                    {
                      name: '📱 Wave (Sénégal)',
                      description: 'Portefeuille mobile Orange Money, Free Money, Tigo Cash',
                      features: ['Paiement sans compte bancaire', 'Frais réduits', 'Confirmation instantanée'],
                      icon: '📱'
                    },
                    {
                      name: '🏦 Virement Bancaire',
                      description: 'Pour les professionnels et entreprises',
                      features: ['Facture automatique', 'Délai 2-3 jours ouvrables', 'Documentation'],
                      icon: '🏦'
                    },
                    {
                      name: '🎁 Codes Promo',
                      description: 'Codes de réduction et offres spéciales',
                      features: ['Réduction jusqu\'à 50%', 'Essais gratuits', 'Promotions saisonnières'],
                      icon: '🎁'
                    }
                  ].map((method, idx) => (
                    <div key={idx} className="p-4 bg-slate-600 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">{method.icon} {method.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{method.description}</p>
                      <ul className="text-sm space-y-1 text-gray-400">
                        {method.features.map((feature, fidx) => (
                          <li key={fidx}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              {[
                {
                  q: '❓ Je suis en plan Free, puis-je passer à Pro directement?',
                  a: 'Oui! Vous pouvez passer à n\'importe quel plan à tout moment. Si vous passez à un plan supérieur en cours de mois, le paiement sera au prorata.'
                },
                {
                  q: '❓ Que se passe-t-il après mon paiement?',
                  a: 'Votre plan est activé immédiatement. Vous recevez une facture par email et un reçu Stripe. Vous pouvez télécharger vos factures depuis votre compte.'
                },
                {
                  q: '❓ Mon paiement a échoué, que faire?',
                  a: 'Vérifiez que votre carte est valide et que vous avez suffisamment de fonds. Vous pouvez réessayer ou utiliser un autre moyen de paiement. Contactez notre support si le problème persiste.'
                },
                {
                  q: '❓ Y a-t-il des frais additionnels ou cachés?',
                  a: 'Non! Le prix affichés est ce que vous payez. Les frais bancaires varient selon votre banque. Consultez vos relevés bancaires pour les frais exacts.'
                },
                {
                  q: '❓ Puis-je annuler mon abonnement?',
                  a: 'Oui! Vous pouvez revenir au plan Free à tout moment depuis vos paramètres. Les fonds ne sont pas remboursés pour le mois en cours, mais votre plan gratuit reste actif.'
                },
                {
                  q: '❓ Qu\'est-ce qu\'une facture Supabase?',
                  a: 'Si vous utilisez les services API avancés au-delà de votre quota inclus, vous pouvez recevoir une facture Supabase directe. Cela dépend de votre usage. Communiquez avec nous pour plus de détails.'
                }
              ].map((item, idx) => (
                <Card key={idx} className="bg-slate-700 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-base">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-300">{item.a}</CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Support */}
          {activeTab === 'support' && (
            <Card className="bg-slate-700 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-6 h-6 text-cyan-400" />
                  Besoin d\'aide?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: '📧',
                      title: 'Email',
                      contact: 'support@terangafoncier.sn',
                      time: 'Réponse en 24h'
                    },
                    {
                      icon: '💬',
                      title: 'Chat Live',
                      contact: 'Disponible 9h-18h (GMT+1)',
                      time: 'Réponse immédiate'
                    },
                    {
                      icon: '📞',
                      title: 'Téléphone',
                      contact: '+221 77 123 45 67',
                      time: 'Lun-Ven 9h-18h'
                    }
                  ].map((support, idx) => (
                    <div key={idx} className="p-4 bg-slate-600 rounded-lg text-center">
                      <div className="text-3xl mb-2">{support.icon}</div>
                      <h3 className="font-bold mb-1">{support.title}</h3>
                      <p className="text-sm text-gray-300 mb-2">{support.contact}</p>
                      <p className="text-xs text-gray-400">{support.time}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">🆘 Problème de Paiement Urgent?</h3>
                  <p className="mb-4">Neanmoins que votre paiement a échoué et vous avez besoin d\'aide immédiatement?</p>
                  <Button className="bg-white text-orange-600 hover:bg-gray-100">
                    Contactez le Support Paiement
                  </Button>
                </div>

                <div className="bg-slate-600 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">📚 Documentation Utile:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <a href="/docs/billing" className="text-blue-400 hover:underline">Facturation & Factures</a></li>
                    <li>• <a href="/docs/payment-methods" className="text-blue-400 hover:underline">Moyens de paiement détaillés</a></li>
                    <li>• <a href="/docs/api-pricing" className="text-blue-400 hover:underline">Tarification API & usage</a></li>
                    <li>• <a href="/docs/plans" className="text-blue-400 hover:underline">Tous les plans détaillés</a></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à commencer?</h2>
          <p className="text-gray-300 mb-6">Inscrivez-vous gratuitement et activez votre compte Free dès maintenant!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              🚀 S\'inscrire Maintenant
            </Button>
            <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-900">
              📖 Voir les Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentGuideVendeur;
