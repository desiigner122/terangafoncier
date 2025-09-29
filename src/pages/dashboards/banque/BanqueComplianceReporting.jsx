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

const BanqueComplianceReporting = ({ dashboardStats }) => {
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
    },
    {
      id: 'RPT-GDPR-004',
      name: 'Rapport Protection Données',
      type: 'RGPD Compliance',
      frequency: 'Annuelle',
      nextDue: '2024-12-31',
      status: 'Planifié',
      completionRate: 25,
      lastSubmission: '2023-12-31',
      criticalLevel: 'Faible'
    }
  ]);

  // Contrôles de conformité pour crédits fonciers
  const [creditComplianceChecks, setCreditComplianceChecks] = useState([
    {
      id: 'CHK-001',
      creditId: 'PLC-2024-001',
      clientName: 'Mamadou FALL',
      checkType: 'KYC Verification',
      status: 'Conforme',
      score: 98,
      lastCheck: '2024-01-20',
      issues: [],
      platformRef: 'TER-2024-001'
    },
    {
      id: 'CHK-002',
      creditId: 'PLC-2024-002',
      clientName: 'Société SENEGAL INVEST',
      checkType: 'AML Screening',
      status: 'Alerte Mineure',
      score: 89,
      lastCheck: '2024-01-22',
      issues: ['Vérification source revenus requise'],
      platformRef: 'TER-2024-002'
    },
    {
      id: 'CHK-003',
      creditId: 'PLC-2024-003',
      clientName: 'Fatou MBAYE',
      checkType: 'Credit Risk Assessment',
      status: 'Conforme',
      score: 95,
      lastCheck: '2024-01-25',
      issues: [],
      platformRef: 'TER-2024-003'
    }
  ]);

  // Alertes de conformité
  const [complianceAlerts, setComplianceAlerts] = useState([
    {
      id: 'ALT-001',
      type: 'Échéance Rapport',
      severity: 'Élevé',
      message: 'Déclaration BCEAO due dans 3 jours',
      dueDate: '2024-02-05',
      actionRequired: true
    },
    {
      id: 'ALT-002',
      type: 'Seuil Dépassé',
      severity: 'Moyen',
      message: 'Ratio concentration risque approche limite réglementaire',
      threshold: '85%',
      actionRequired: false
    },
    {
      id: 'ALT-003',
      type: 'Document Manquant',
      severity: 'Faible',
      message: '2 dossiers crédits manquent justificatifs KYC complémentaires',
      count: 2,
      actionRequired: true
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Conforme': return 'bg-green-100 text-green-800';
      case 'Prêt': return 'bg-green-100 text-green-800';
      case 'En Cours': return 'bg-blue-100 text-blue-800';
      case 'En Attente': return 'bg-yellow-100 text-yellow-800';
      case 'Alerte Mineure': return 'bg-orange-100 text-orange-800';
      case 'Non Conforme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Élevé': return 'text-red-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Faible': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCriticalColor = (level) => {
    switch (level) {
      case 'Élevé': return 'border-l-red-500';
      case 'Moyen': return 'border-l-yellow-500';
      case 'Faible': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const ReportCard = ({ report }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className={`h-full hover:shadow-lg transition-all duration-300 border-l-4 ${getCriticalColor(report.criticalLevel)}`}>
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
                  <Badge variant="outline">
                    {report.frequency}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">
                  {report.completionRate}%
                </div>
                <div className="text-xs text-gray-600">
                  Complété
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{report.type}</p>
                <p className="text-red-600 text-xs">
                  Échéance: {new Date(report.nextDue).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-semibold">{report.completionRate}%</span>
                </div>
                <Progress value={report.completionRate} className="h-2" />
              </div>

              <div className="pt-2 border-t text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Dernière soumission:</span>
                  <span>{new Date(report.lastSubmission).toLocaleDateString('fr-FR')}</span>
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
      {/* Header avec scores de conformité */}
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
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Reporting</p>
                  <p className="text-2xl font-bold text-orange-900">{complianceScores.regulatoryReporting}%</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alertes de conformité */}
      {complianceAlerts.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertes de Conformité</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.severity === 'Élevé' ? 'bg-red-500' :
                      alert.severity === 'Moyen' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getSeverityColor(alert.severity)} bg-transparent`}>
                      {alert.severity}
                    </Badge>
                    {alert.actionRequired && (
                      <Button size="sm" variant="outline">
                        Action Requise
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Conformité & Reporting Bancaire</span>
          </CardTitle>
          <CardDescription>
            Gestion de la conformité réglementaire et reporting pour crédits fonciers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reports">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reports">Rapports</TabsTrigger>
              <TabsTrigger value="compliance">Contrôles</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Rapports Réglementaires */}
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
                    Générer Rapport
                  </Button>
                </div>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                layout
              >
                {regulatoryReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </motion.div>
            </TabsContent>

            {/* Contrôles de Conformité */}
            <TabsContent value="compliance" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contrôles Crédits Plateforme</h3>
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Nouveau Contrôle
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crédit ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Type Contrôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Dernière Vérif.</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditComplianceChecks.map((check) => (
                        <TableRow key={check.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{check.creditId}</div>
                              <div className="text-xs text-gray-500">{check.platformRef}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{check.clientName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{check.checkType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(check.status)}>
                              {check.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{check.score}%</span>
                              <div className={`w-2 h-2 rounded-full ${
                                check.score >= 95 ? 'bg-green-500' :
                                check.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(check.lastCheck).toLocaleDateString('fr-FR')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <RefreshCw className="h-3 w-3" />
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

            {/* Audit */}
            <TabsContent value="audit" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Audits Programmés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 mb-2">3</div>
                    <p className="text-blue-600">Ce trimestre</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Conformité Moyenne</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 mb-2">{complianceScores.globalScore}%</div>
                    <p className="text-green-600">Score global</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-purple-700">Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-900 mb-2">7</div>
                    <p className="text-purple-600">Actions correctives</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Award className="h-4 w-4" />
                <AlertTitle>Certification Bancaire</AlertTitle>
                <AlertDescription>
                  La banque maintient une excellente conformité réglementaire avec un score global de {complianceScores.globalScore}%. 
                  Tous les rapports obligatoires sont à jour et les contrôles KYC/AML sont conformes aux standards BCEAO.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Évolution Conformité</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Janvier 2024</span>
                        <span className="font-semibold text-green-600">92.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Février 2024</span>
                        <span className="font-semibold text-green-600">{complianceScores.globalScore}%</span>
                      </div>
                      <Progress value={complianceScores.globalScore} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      <span>Objectifs 2024</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score Global {'>'} 95%</span>
                        <span className="text-green-600 font-semibold">✓</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">0 Rapport en Retard</span>
                        <span className="text-green-600 font-semibold">✓</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Certification ISO 27001</span>
                        <span className="text-yellow-600 font-semibold">En Cours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueComplianceReporting;