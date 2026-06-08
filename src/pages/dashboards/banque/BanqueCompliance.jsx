import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Upload, 
  Eye, 
  Filter, 
  Search, 
  RefreshCw, 
  Calendar, 
  Target, 
  Activity, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Award, 
  Zap, 
  Lock, 
  Unlock, 
  Settings, 
  Bell, 
  Users, 
  Building, 
  MapPin, 
  DollarSign, 
  Percent, 
  Calculator, 
  CreditCard, 
  Banknote, 
  Star, 
  Flag
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const BanqueCompliance = ({ dashboardStats }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [auditInProgress, setAuditInProgress] = useState(false);

  // Scores de conformité
  const [complianceScores, setComplianceScores] = useState({
    globalScore: 94.5,
    kycCompliance: 96.8,
    amlCompliance: 92.3,
    creditRiskCompliance: 97.1,
    dataProtection: 89.7,
    regulatoryReporting: 98.2
  });

  // Rapports réglementaires requis
  const [regulatoryReports, setRegulatoryReports] = useState([
    {
      id: 'RPT-BCEAO-001',
      name: 'Déclaration Mensuelle BCEAO',
      type: 'Déclaration Obligatoire',
      frequency: 'Mensuelle',
      nextDue: '2024-02-05',
      status: 'Prêt',
      completionRate: 100,
      lastSubmission: '2024-01-05',
      criticalLevel: 'Élevé'
    },
    {
      id: 'RPT-CTCB-002',
      name: 'Rapport Risques Crédits',
      type: 'Rapport Prudentiel',
      frequency: 'Trimestrielle',
      nextDue: '2024-04-15',
      status: 'En Cours',
      completionRate: 65,
      lastSubmission: '2024-01-15',
      criticalLevel: 'Moyen'
    },
    {
      id: 'RPT-LAB-003',
      name: 'Déclaration Anti-Blanchiment',
      type: 'Compliance LAB',
      frequency: 'Mensuelle',
      nextDue: '2024-02-10',
      status: 'En Attente',
      completionRate: 85,
      lastSubmission: '2024-01-10',
      criticalLevel: 'Élevé'
    }
  ]);

  // Vérifications KYC des crédits plateforme
  const [kycVerifications, setKycVerifications] = useState([]); // démo retirée

  // Alertes de conformité
  const [complianceAlerts, setComplianceAlerts] = useState([
    {
      id: 'ALT-001',
      type: 'Échéance Proche',
      title: 'Rapport BCEAO dû dans 3 jours',
      description: 'La déclaration mensuelle BCEAO doit être soumise avant le 5 février.',
      priority: 'Élevé',
      dueDate: '2024-02-05',
      status: 'Active'
    },
    {
      id: 'ALT-002',
      type: 'Document Manquant',
      title: 'KYC incomplet - SENEGAL INVEST',
      description: '3 documents manquants pour finaliser la vérification KYC.',
      priority: 'Moyen',
      dueDate: '2024-02-15',
      status: 'Active'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Prêt': return 'bg-green-100 text-green-800';
      case 'En Cours': return 'bg-blue-100 text-blue-800';
      case 'En Attente': return 'bg-yellow-100 text-yellow-800';
      case 'En Retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Élevé': return 'text-red-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Faible': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Très Faible': return 'text-green-700';
      case 'Faible': return 'text-green-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Élevé': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const ReportCard = ({ report }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {report.name}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {report.frequency}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${getPriorityColor(report.criticalLevel)}`}>
                  {report.criticalLevel}
                </div>
                <div className="text-xs text-gray-600">
                  {report.completionRate}%
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{report.type}</p>
                <p className="text-gray-600">ID: {report.id}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression:</span>
                  <span className="font-semibold">{report.completionRate}%</span>
                </div>
                <Progress value={report.completionRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Échéance:</span>
                  <div className="font-semibold text-red-600">
                    {new Date(report.nextDue).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Dernière soumission:</span>
                  <div className="font-semibold text-blue-600">
                    {new Date(report.lastSubmission).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Voir
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec scores principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Score Global</p>
                  <p className="text-2xl font-bold text-green-900">{complianceScores.globalScore}%</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">KYC Compliance</p>
                  <p className="text-2xl font-bold text-blue-900">{complianceScores.kycCompliance}%</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">AML Compliance</p>
                  <p className="text-2xl font-bold text-purple-900">{complianceScores.amlCompliance}%</p>
                </div>
                <Flag className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Rapports Réglementaires</p>
                  <p className="text-2xl font-bold text-yellow-900">{complianceScores.regulatoryReporting}%</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alertes prioritaires */}
      {complianceAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Alertes de Conformité</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {complianceAlerts.length} alerte(s) active(s) nécessitent votre attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Conformité et Rapports Réglementaires</span>
          </CardTitle>
          <CardDescription>
            Gestion de la conformité bancaire et reporting BCEAO pour les crédits fonciers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reports">Rapports</TabsTrigger>
              <TabsTrigger value="kyc">Vérifications KYC</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
            </TabsList>

            {/* Rapports réglementaires */}
            <TabsContent value="reports" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Rapports Réglementaires</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Soumettre
                  </Button>
                </div>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {regulatoryReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </motion.div>
            </TabsContent>

            {/* Vérifications KYC */}
            <TabsContent value="kyc" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vérifications KYC - Crédits Plateforme</h3>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Réf. Plateforme</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut KYC</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Risque</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kycVerifications.map((kyc) => (
                        <TableRow key={kyc.clientId}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{kyc.clientName}</div>
                              <div className="text-sm text-gray-500">{kyc.clientId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800">
                              {kyc.platformRef}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold">
                              {(kyc.creditAmount / 1000000).toFixed(0)}M CFA
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(kyc.kycStatus)}>
                              {kyc.kycStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={kyc.complianceScore} className="h-2 w-16" />
                              <span className="text-sm font-medium">{kyc.complianceScore}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-semibold ${getRiskColor(kyc.riskLevel)}`}>
                              {kyc.riskLevel}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alertes */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <Card key={alert.id} className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {alert.title}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-orange-100 text-orange-800">
                              {alert.type}
                            </Badge>
                            <Badge className={`${getPriorityColor(alert.priority)} bg-gray-100`}>
                              {alert.priority}
                            </Badge>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-600">
                            {new Date(alert.dueDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4">{alert.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm">Traiter</Button>
                        <Button size="sm" variant="outline">Rappeler plus tard</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Audit */}
            <TabsContent value="audit" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Audits Réussis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 mb-2">12</div>
                    <p className="text-green-600">Audits validés</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-700">En Cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 mb-2">3</div>
                    <p className="text-blue-600">Audits en cours</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-yellow-700">Planifiés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-900 mb-2">5</div>
                    <p className="text-yellow-600">Audits à venir</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Conformité Globale</AlertTitle>
                <AlertDescription>
                  La conformité bancaire affiche un excellent score de {complianceScores.globalScore}% 
                  avec tous les rapports BCEAO à jour et les vérifications KYC complètes.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueCompliance;