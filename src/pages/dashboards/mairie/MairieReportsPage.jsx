
import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { BarChart, PieChart, Download, FileText, Calendar } from 'lucide-react';
    import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend, Pie, Cell, ComposedChart, Line } from 'recharts';
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";


    const attributionData = [
      { name: 'Jan', Attribuées: 4, Rejetées: 1, En_cours: 5 },
      { name: 'Fév', Attribuées: 7, Rejetées: 2, En_cours: 6 },
      { name: 'Mar', Attribuées: 5, Rejetées: 3, En_cours: 4 },
      { name: 'Avr', Attribuées: 8, Rejetées: 1, En_cours: 7 },
      { name: 'Mai', Attribuées: 6, Rejetées: 2, En_cours: 5 },
    ];

    const requestTypeData = [
      { name: 'Attribution', value: 45 },
      { name: 'Permis de construire', value: 28 },
      { name: 'Certificat d\'urbanisme', value: 15 },
      { name: 'Autre', value: 12 },
    ];
    const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#6b7280'];

    const MairieReportsPage = () => {
      const handleExport = (reportType) => {
        alert(`Exportation du rapport "${reportType}" en cours... (simulation)`);
      };

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-12 px-4 space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center"><BarChart className="mr-3 h-8 w-8 text-primary"/>Rapports & Statistiques</h1>
              <p className="text-muted-foreground">Analysez les activités et performances de la gestion foncière communale.</p>
            </div>
            <div className="flex items-center gap-2">
                <Select defaultValue="3m">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">7 derniers jours</SelectItem>
                        <SelectItem value="30d">30 derniers jours</SelectItem>
                        <SelectItem value="3m">3 derniers mois</SelectItem>
                        <SelectItem value="1y">Cette année</SelectItem>
                    </SelectContent>
                </Select>
                <Button>
                    <Calendar className="mr-2 h-4 w-4" /> Appliquer
                </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Statut des Demandes d'Attribution</CardTitle>
                <CardDescription>Évolution mensuelle des dossiers traités.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={attributionData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Attribuées" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Rejetées" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="En_cours" stroke="#f97316" strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
                <Button variant="outline" className="w-full mt-4" onClick={() => handleExport('Statut des demandes')}>
                  <Download className="mr-2 h-4 w-4" /> Exporter les données
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition des Types de Demandes</CardTitle>
                <CardDescription>Vue globale des types de requêtes reçues.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={requestTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                        {requestTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <Button variant="outline" className="w-full mt-4" onClick={() => handleExport('Répartition des demandes')}>
                  <Download className="mr-2 h-4 w-4" /> Exporter les données
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
                <CardTitle>Génération de Rapports Personnalisés</CardTitle>
                <CardDescription>Créez des documents PDF ou CSV pour vos archives ou réunions.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="secondary" size="lg" className="h-auto py-4" onClick={() => handleExport('Rapport d\'occupation des sols')}>
                    <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 mb-2" />
                        <span className="text-sm font-semibold">Rapport d'Occupation des Sols</span>
                    </div>
                </Button>
                <Button variant="secondary" size="lg" className="h-auto py-4" onClick={() => handleExport('Rapport des litiges')}>
                    <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 mb-2" />
                        <span className="text-sm font-semibold">Rapport sur les Litiges</span>
                    </div>
                </Button>
                <Button variant="secondary" size="lg" className="h-auto py-4" onClick={() => handleExport('Rapport financier des taxes')}>
                     <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 mb-2" />
                        <span className="text-sm font-semibold">Rapport Financier (Taxes)</span>
                    </div>
                </Button>
            </CardContent>
          </Card>

        </motion.div>
      );
    };

    export default MairieReportsPage;
