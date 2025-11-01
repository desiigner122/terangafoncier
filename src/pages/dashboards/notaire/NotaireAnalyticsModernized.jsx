import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	BarChart3,
	LineChart,
	PieChart,
	TrendingUp,
	ShieldCheck,
	Users,
	Cpu,
	RefreshCw,
	AlertTriangle,
	CheckCircle2,
	Activity,
	Gauge,
	Zap
} from 'lucide-react';

import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';

const periodOptions = [
	{ value: 'monthly', label: 'Mensuel' },
	{ value: 'weekly', label: 'Hebdomadaire' },
	{ value: 'yearly', label: 'Annuel' }
];

const NotaireAnalyticsModernized = () => {
	const { dashboardStats: contextStats } = useOutletContext() || {};
	const { user } = useAuth();

	const [period, setPeriod] = useState('monthly');
	const [analytics, setAnalytics] = useState([]);
	const [revenueData, setRevenueData] = useState([]);
	const [complianceChecks, setComplianceChecks] = useState([]);
	const [distribution, setDistribution] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTab, setActiveTab] = useState('performance');

	useEffect(() => {
		if (user) {
			loadAnalyticsData(true);
		}
	}, [user, period]);

	const latestMetrics = useMemo(() => analytics?.[0] || null, [analytics]);

	const loadAnalyticsData = async (initial = false) => {
		if (!user) return;
		initial ? setIsLoading(true) : setIsRefreshing(true);

		try {
			const [analyticsResult, revenueResult, complianceResult, distributionResult] = await Promise.all([
				NotaireSupabaseService.getAnalytics(user.id, period),
				NotaireSupabaseService.getRevenueData(user.id, 6),
				NotaireSupabaseService.getComplianceChecks(user.id),
				NotaireSupabaseService.getActTypesDistribution(user.id)
			]);

			if (analyticsResult?.success) {
				setAnalytics(analyticsResult.data || []);
			}

			if (revenueResult?.success) {
				setRevenueData(revenueResult.data || []);
			}

			if (complianceResult?.success) {
				setComplianceChecks(complianceResult.data || []);
			}

			if (distributionResult?.success) {
				setDistribution(distributionResult.data || []);
			}
		} catch (error) {
			console.error('Erreur chargement analytics notaire:', error);
			window.safeGlobalToast?.({
				title: 'Erreur de chargement',
				description: "Impossible d'actualiser les métriques analytiques.",
				variant: 'destructive'
			});
		} finally {
			initial ? setIsLoading(false) : setIsRefreshing(false);
		}
	};

	const formatCurrency = (amount) => {
		if (!amount || Number.isNaN(Number(amount))) return '0 FCFA';
		try {
			return new Intl.NumberFormat('fr-FR', {
				style: 'currency',
				currency: 'XOF',
				maximumFractionDigits: 0
			}).format(amount);
		} catch (error) {
			return `${amount.toLocaleString('fr-FR')} FCFA`;
		}
	};

		const formatPercent = (value, fractionDigits = 1) => {
			if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
			const numeric = Number(value);
			const normalized = Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
			return `${normalized.toFixed(fractionDigits)}%`;
	};

	const computeRevenueGrowth = useMemo(() => {
		if (!revenueData.length || revenueData.length < 2) return 0;
		const ordered = [...revenueData];
		const latest = ordered[ordered.length - 1]?.revenue || 0;
		const previous = ordered[ordered.length - 2]?.revenue || 0;
		if (!previous) return 0;
		return ((latest - previous) / previous) * 100;
	}, [revenueData]);

	const complianceAverage = useMemo(() => {
		if (complianceChecks.length) {
			const sum = complianceChecks.reduce((acc, item) => acc + (item.compliance_score || 0), 0);
			return Math.round(sum / complianceChecks.length);
		}
		return latestMetrics?.compliance_score || contextStats?.complianceScore || 0;
	}, [complianceChecks, latestMetrics, contextStats]);

	const satisfactionAverage = useMemo(() => {
		if (latestMetrics?.client_satisfaction) return latestMetrics.client_satisfaction;
		return contextStats?.clientSatisfaction || 0;
	}, [latestMetrics, contextStats]);

		const onTimeRate = latestMetrics?.on_time_completion_rate ?? 0;
		const onTimeProgress = Math.min(100, Math.max(0, Math.abs(onTimeRate) <= 1 ? onTimeRate * 100 : onTimeRate));
		const conversionRate = (latestMetrics?.completed_acts || 0) / Math.max(1, latestMetrics?.total_acts || 1);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
			</div>
		);
	}

	return (
		<motion.div
			className="space-y-4 sm:space-y-6"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="flex flex-wrap gap-4 items-center justify-between">
				<div>
					<h2 className="text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Analytics avancés</h2>
					<p className="text-gray-600">Analyse des performances, conformité et productivité notariale.</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Select value={period} onValueChange={setPeriod}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Période" />
						</SelectTrigger>
						<SelectContent>
							{periodOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button variant="outline" onClick={() => loadAnalyticsData(false)} disabled={isRefreshing}>
						<RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
						Actualiser
					</Button>
				</div>
			</div>

			<div className="grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Revenus consolidés</CardTitle>
						<TrendingUp className="h-5 w-5 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold">{formatCurrency(latestMetrics?.monthly_revenue || contextStats?.monthlyRevenue || 0)}</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
							Variation
							<span className={`font-semibold ${computeRevenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
								{computeRevenueGrowth >= 0 ? '+' : ''}{computeRevenueGrowth.toFixed(1)}%
							</span>
							sur la période
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Conformité moyenne</CardTitle>
						<ShieldCheck className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold">{complianceAverage}%</div>
						<Progress value={complianceAverage} className="mt-3" />
						<p className="text-xs text-muted-foreground mt-2">
							{complianceChecks.length} contrôles effectués ce trimestre
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Satisfaction client</CardTitle>
						<Users className="h-5 w-5 text-violet-600" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold">{satisfactionAverage ? `${satisfactionAverage.toFixed(1)} / 5` : '—'}</div>
						<Progress value={Math.min(100, (satisfactionAverage || 0) / 5 * 100)} className="mt-3" />
						<p className="text-xs text-muted-foreground mt-2">Indice de fidélisation {formatPercent(latestMetrics?.client_retention_rate || 0)}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Utilisation technologique</CardTitle>
						<Cpu className="h-5 w-5 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-xl sm:text-2xl lg:text-3xl font-bold">{latestMetrics?.documents_authenticated || contextStats?.documentsAuthenticated || 0}</div>
						<p className="text-xs text-muted-foreground">Documents blockchain authentifiés</p>
						<div className="mt-3 grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-gray-500">
							<div>Transactions blockchain<br /><span className="font-semibold text-gray-900">{latestMetrics?.blockchain_transactions || 0}</span></div>
							<div>Requêtes IA assistant<br /><span className="font-semibold text-gray-900">{latestMetrics?.ai_assistant_queries || 0}</span></div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
					<TabsTrigger value="performance">Performance</TabsTrigger>
					<TabsTrigger value="conformite">Conformité</TabsTrigger>
					<TabsTrigger value="productivite">Productivité</TabsTrigger>
				</TabsList>

				<TabsContent value="performance" className="space-y-4 mt-4">
					<div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle>Tendance des honoraires</CardTitle>
								<CardDescription>Comparatif des honoraires perçus sur 6 mois</CardDescription>
							</CardHeader>
							<CardContent>
								{revenueData.length ? (
									<div className="h-56 flex items-end gap-3">
										{revenueData.map((item) => (
											<div key={item.month} className="flex-1">
												<div className="flex flex-col items-center justify-end h-full">
													<div
														className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
														style={{ height: `${Math.max(10, (item.revenue / (Math.max(...revenueData.map((el) => el.revenue), 1) || 1)) * 100)}%` }}
													/>
													<div className="mt-3 text-xs font-medium text-gray-700">{item.month}</div>
													<div className="text-[11px] text-gray-500">{formatCurrency(item.revenue)}</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="h-48 flex flex-col items-center justify-center text-sm text-gray-500">
										<BarChart3 className="h-6 w-6 mb-2 text-emerald-500" />
										Aucun historique de revenus disponible sur la période sélectionnée
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Qualité de traitement</CardTitle>
								<CardDescription>Durées et taux de finalisation</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="p-4 border rounded-lg">
									<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
										<Gauge className="h-4 w-4 text-amber-600" /> Durée moyenne
									</div>
									<div className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
										{latestMetrics?.avg_completion_days || contextStats?.avgCompletionDays || 0} jours
									</div>
									<p className="text-[10px] sm:text-xs text-gray-500">Objectif: 30 jours</p>
								</div>
								<div className="p-4 border rounded-lg">
									<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
										<CheckCircle2 className="h-4 w-4 text-emerald-600" /> Respect des délais
									</div>
																			<div className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
																				{formatPercent(onTimeRate)}
																			</div>
																			<Progress value={onTimeProgress} className="mt-3" />
								</div>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Historique analytique</CardTitle>
							<CardDescription>Dernières valeurs enregistrées dans Supabase</CardDescription>
						</CardHeader>
						<CardContent>
							{analytics.length ? (
								<ScrollArea className="h-72">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Date</TableHead>
												<TableHead>Actes</TableHead>
												<TableHead>Revenus</TableHead>
												<TableHead>Clients actifs</TableHead>
												<TableHead>Satisfaction</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{analytics.map((entry) => (
												<TableRow key={`${entry.metric_date}-${entry.metric_type}`}>
													<TableCell>{new Date(entry.metric_date).toLocaleDateString('fr-FR')}</TableCell>
													<TableCell>
														<div className="flex flex-col">
															<span className="font-medium text-gray-900">{entry.total_acts || 0} actes</span>
															<span className="text-[10px] sm:text-xs text-gray-500">{entry.completed_acts || 0} finalisés</span>
														</div>
													</TableCell>
													<TableCell>{formatCurrency(entry.monthly_revenue || 0)}</TableCell>
													<TableCell>{entry.active_clients || 0}</TableCell>
													<TableCell>{entry.client_satisfaction ? `${entry.client_satisfaction.toFixed(1)} / 5` : '—'}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</ScrollArea>
							) : (
								<div className="text-sm text-gray-500">
									Les analytics seront disponibles dès la création de vos premiers actes.
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="conformite" className="space-y-4 mt-4">
					<div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Contrôles récents</CardTitle>
								<CardDescription>Suivi des audits de conformité effectués</CardDescription>
							</CardHeader>
							<CardContent>
								{complianceChecks.length ? (
									<ScrollArea className="h-72 pr-4">
										<div className="space-y-3">
											{complianceChecks.slice(0, 8).map((check) => (
												<div key={check.id} className="p-4 border rounded-lg hover:shadow-sm transition-all">
													<div className="flex items-start justify-between">
														<div>
															<div className="font-semibold text-gray-900">{check.check_type}</div>
															<div className="text-[10px] sm:text-xs text-gray-500">{new Date(check.checked_at).toLocaleString('fr-FR')}</div>
															{check.act?.title && (
																<div className="text-[10px] sm:text-xs text-gray-600 mt-1">Acte: {check.act.title}</div>
															)}
														</div>
														<Badge className={check.check_status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
															{check.check_status}
														</Badge>
													</div>
													<div className="mt-3">
														<div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
															<span>Score</span>
															<span>{check.compliance_score || 0}%</span>
														</div>
														<Progress value={check.compliance_score || 0} className="h-1.5 mt-1" />
													</div>
													{check.critical_issues ? (
														<div className="mt-3 text-xs text-red-600 flex items-center gap-2">
															<AlertTriangle className="h-3 w-3" /> {check.critical_issues} points critiques à traiter
														</div>
													) : (
														<div className="mt-3 text-xs text-emerald-600 flex items-center gap-2">
															<CheckCircle2 className="h-3 w-3" /> Conforme
														</div>
													)}
												</div>
											))}
										</div>
									</ScrollArea>
								) : (
									<div className="h-48 flex flex-col items-center justify-center text-sm text-gray-500">
										<ShieldCheck className="h-5 w-5 mb-2 text-blue-600" />
										Aucun contrôle disponible pour le moment
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Répartition par type d'acte</CardTitle>
								<CardDescription>Identification des risques clés par typologie</CardDescription>
							</CardHeader>
							<CardContent>
								{distribution.length ? (
									<div className="space-y-4">
										{distribution.map((item) => (
											<div key={item.name} className="space-y-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span
															className="h-2 w-2 rounded-full"
															style={{ backgroundColor: item.color || '#2563eb' }}
														/>
														<span className="text-xs sm:text-sm font-medium text-gray-800">{item.name}</span>
													</div>
													<div className="text-[10px] sm:text-xs text-gray-500">{item.count} actes</div>
												</div>
												<Progress value={item.value} className="h-1.5" />
												<div className="text-[10px] sm:text-xs text-gray-500">{item.value}% du volume total</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-sm text-gray-500">
										Les données de répartition seront visibles dès la validation des premiers actes.
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="productivite" className="space-y-4 mt-4">
					<div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle>Productivité des équipes</CardTitle>
								<CardDescription>Suivi des volumes traités et de l'engagement client</CardDescription>
							</CardHeader>
							<CardContent>
								{latestMetrics ? (
									<div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
										<div className="p-4 border rounded-lg bg-gradient-to-br from-amber-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
												<Activity className="h-4 w-4" /> Actes traités
											</div>
											<div className="mt-2 text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{latestMetrics.total_acts || 0}</div>
											<p className="text-[10px] sm:text-xs text-gray-500">{latestMetrics.new_acts || 0} nouveaux actes créés</p>
										</div>
										<div className="p-4 border rounded-lg bg-gradient-to-br from-emerald-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
												<Users className="h-4 w-4" /> Clients actifs
											</div>
											<div className="mt-2 text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{latestMetrics.active_clients || 0}</div>
											<p className="text-[10px] sm:text-xs text-gray-500">{latestMetrics.new_clients || 0} nouveaux clients</p>
										</div>
										<div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
												<PieChart className="h-4 w-4" /> Répartition actes
											</div>
											<div className="mt-2 text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{distribution.reduce((acc, item) => acc + (item.count || 0), 0)}</div>
											<p className="text-[10px] sm:text-xs text-gray-500">{distribution.length} typologies actives</p>
										</div>
										<div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
												<LineChart className="h-4 w-4" /> Honoraires moyens
											</div>
											<div className="mt-2 text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
												{formatCurrency(latestMetrics.avg_act_value || 0)}
											</div>
											<p className="text-[10px] sm:text-xs text-gray-500">par acte finalisé</p>
										</div>
									</div>
								) : (
									<div className="h-48 flex flex-col items-center justify-center text-sm text-gray-500">
										<Zap className="h-5 w-5 mb-2 text-amber-500" />
										Les données de productivité seront visibles après les premiers enregistrements.
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Indicateurs clés</CardTitle>
								<CardDescription>Suivi condensé de la performance opérationnelle</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								<div className="flex items-center justify-between border rounded-lg p-3">
									<div className="flex items-center gap-2">
										<TrendingUp className="h-4 w-4 text-emerald-600" /> Taux de conversion
									</div>
														<span className="font-semibold text-gray-900">
																				{formatPercent(conversionRate)}
														</span>
								</div>
								<div className="flex items-center justify-between border rounded-lg p-3">
									<div className="flex items-center gap-2">
										<Gauge className="h-4 w-4 text-amber-600" /> Dossiers actifs
									</div>
									<span className="font-semibold text-gray-900">{latestMetrics?.active_cases || contextStats?.activeCases || 0}</span>
								</div>
								<div className="flex items-center justify-between border rounded-lg p-3">
									<div className="flex items-center gap-2">
										<Cpu className="h-4 w-4 text-blue-600" /> Automatisation IA
									</div>
									<span className="font-semibold text-gray-900">{latestMetrics?.ai_assistant_queries || 0} requêtes</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
};

export default NotaireAnalyticsModernized;
