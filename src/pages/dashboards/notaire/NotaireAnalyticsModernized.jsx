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
import supabase from '@/lib/supabaseClient';
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

// Statuts "actifs" (dossiers en cours) vs "finalisés" selon le schéma réel notarial_acts.
const ACTIVE_STATUSES = ['draft', 'in_progress', 'signed'];

const ACT_TYPE_LABELS = {
	vente_immobiliere: 'Ventes immobilières',
	succession: 'Successions',
	donation: 'Donations',
	acte_propriete: 'Actes de propriété',
	hypotheque: 'Hypothèques',
	constitution_societe: 'Constitutions société',
	servitude: 'Servitudes',
	partage: 'Partages'
};

const ACT_TYPE_COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

const getISOWeek = (date) => {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
	return { year: d.getUTCFullYear(), week };
};

const NotaireAnalyticsModernized = () => {
	const { dashboardStats: contextStats } = useOutletContext() || {};
	const { user } = useAuth();

	const [period, setPeriod] = useState('monthly');
	const [acts, setActs] = useState([]);
	const [complianceChecks, setComplianceChecks] = useState([]);
	const [techCounts, setTechCounts] = useState({ documentsAuthenticated: 0, blockchainTransactions: 0, aiQueries: 0 });
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTab, setActiveTab] = useState('performance');

	useEffect(() => {
		if (user) {
			loadAnalyticsData(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const loadAnalyticsData = async (initial = false) => {
		if (!user) return;
		initial ? setIsLoading(true) : setIsRefreshing(true);

		try {
			const [actsResult, complianceResult, docsResult, blockchainResult, aiResult] = await Promise.all([
				supabase
					.from('notarial_acts')
					.select('id, act_type, status, notary_fees, amount, client_id, client_satisfaction, signed_at, created_at')
					.eq('notaire_id', user.id)
					.order('created_at', { ascending: false }),
				supabase
					.from('compliance_checks')
					.select('id, check_type, compliance_score, status, act_id, created_at')
					.eq('notaire_id', user.id)
					.order('created_at', { ascending: false }),
				supabase
					.from('document_authentication')
					.select('id', { count: 'exact', head: true })
					.eq('notaire_id', user.id)
					.eq('verification_status', 'verified'),
				supabase
					.from('blockchain_transactions')
					.select('id', { count: 'exact', head: true })
					.eq('user_id', user.id),
				supabase
					.from('ai_chat_history')
					.select('id', { count: 'exact', head: true })
					.eq('user_id', user.id)
			]);

			if (!actsResult.error) setActs(actsResult.data || []);
			if (!complianceResult.error) setComplianceChecks(complianceResult.data || []);

			setTechCounts({
				documentsAuthenticated: docsResult.error ? 0 : docsResult.count || 0,
				blockchainTransactions: blockchainResult.error ? 0 : blockchainResult.count || 0,
				aiQueries: aiResult.error ? 0 : aiResult.count || 0
			});
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
			return `${Number(amount).toLocaleString('fr-FR')} FCFA`;
		}
	};

	const formatPercent = (value, fractionDigits = 1) => {
		if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
		const numeric = Number(value);
		const normalized = Math.abs(numeric) <= 1 ? numeric * 100 : numeric;
		return `${normalized.toFixed(fractionDigits)}%`;
	};

	// Regroupement réel des actes par période (mois / semaine ISO / année) à partir de created_at.
	const aggregates = useMemo(() => {
		const bucketOf = (dateStr) => {
			const d = new Date(dateStr);
			if (period === 'yearly') {
				return { key: `${d.getFullYear()}`, label: `${d.getFullYear()}` };
			}
			if (period === 'weekly') {
				const { year, week } = getISOWeek(d);
				return { key: `${year}-W${String(week).padStart(2, '0')}`, label: `S${week}` };
			}
			return {
				key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
				label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
			};
		};

		const map = new Map();
		acts.forEach((act) => {
			if (!act.created_at) return;
			const { key, label } = bucketOf(act.created_at);
			if (!map.has(key)) {
				map.set(key, {
					key,
					label,
					totalActs: 0,
					completedActs: 0,
					revenue: 0,
					clients: new Set(),
					satisfactionSum: 0,
					satisfactionCount: 0
				});
			}
			const bucket = map.get(key);
			bucket.totalActs += 1;
			if (act.status === 'completed') {
				bucket.completedActs += 1;
				bucket.revenue += Number(act.notary_fees) || 0;
			}
			if (act.client_id) bucket.clients.add(act.client_id);
			if (act.client_satisfaction !== null && act.client_satisfaction !== undefined) {
				bucket.satisfactionSum += Number(act.client_satisfaction);
				bucket.satisfactionCount += 1;
			}
		});

		return Array.from(map.values())
			.map((b) => ({
				key: b.key,
				label: b.label,
				totalActs: b.totalActs,
				completedActs: b.completedActs,
				revenue: b.revenue,
				activeClients: b.clients.size,
				satisfaction: b.satisfactionCount ? b.satisfactionSum / b.satisfactionCount : null
			}))
			.sort((a, b) => a.key.localeCompare(b.key));
	}, [acts, period]);

	const revenueSeries = useMemo(() => {
		const windowSize = period === 'yearly' ? 5 : period === 'weekly' ? 8 : 6;
		return aggregates.slice(-windowSize);
	}, [aggregates, period]);

	const revenueGrowth = useMemo(() => {
		if (aggregates.length < 2) return null;
		const latest = aggregates[aggregates.length - 1].revenue;
		const previous = aggregates[aggregates.length - 2].revenue;
		if (!previous) return null;
		return ((latest - previous) / previous) * 100;
	}, [aggregates]);

	// Agrégats globaux réels sur notarial_acts.
	const totals = useMemo(() => {
		const totalActs = acts.length;
		const completedActs = acts.filter((a) => a.status === 'completed').length;
		const activeActs = acts.filter((a) => ACTIVE_STATUSES.includes(a.status)).length;

		const now = new Date();
		const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
		const monthlyRevenue = acts
			.filter((a) => a.status === 'completed' && a.created_at?.startsWith(currentKey))
			.reduce((sum, a) => sum + (Number(a.notary_fees) || 0), 0);
		const newActsThisMonth = acts.filter((a) => a.created_at?.startsWith(currentKey)).length;

		const satScores = acts
			.filter((a) => a.client_satisfaction !== null && a.client_satisfaction !== undefined)
			.map((a) => Number(a.client_satisfaction));
		const satisfaction = satScores.length ? satScores.reduce((s, v) => s + v, 0) / satScores.length : null;

		const completedFees = acts.filter((a) => a.status === 'completed').map((a) => Number(a.notary_fees) || 0);
		const avgActValue = completedFees.length ? completedFees.reduce((s, v) => s + v, 0) / completedFees.length : 0;

		const uniqueClients = new Set(acts.map((a) => a.client_id).filter(Boolean)).size;
		const conversionRate = totalActs ? completedActs / totalActs : 0;

		// Durée de traitement réelle : signed_at - created_at pour les actes signés/finalisés.
		const durations = acts
			.filter((a) => (a.status === 'completed' || a.status === 'signed') && a.signed_at && a.created_at)
			.map((a) => (new Date(a.signed_at) - new Date(a.created_at)) / 86400000)
			.filter((d) => d >= 0);
		const avgCompletionDays = durations.length
			? Math.round(durations.reduce((s, v) => s + v, 0) / durations.length)
			: null;
		const onTimeRate = durations.length
			? (durations.filter((d) => d <= 30).length / durations.length) * 100
			: null;

		return {
			totalActs,
			completedActs,
			activeActs,
			monthlyRevenue,
			newActsThisMonth,
			satisfaction,
			avgActValue,
			uniqueClients,
			conversionRate,
			avgCompletionDays,
			onTimeRate
		};
	}, [acts]);

	const distribution = useMemo(() => {
		const counts = {};
		acts.forEach((a) => {
			const type = a.act_type || 'autre';
			counts[type] = (counts[type] || 0) + 1;
		});
		const total = acts.length || 1;
		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.map(([type, count], index) => ({
				name: ACT_TYPE_LABELS[type] || type,
				count,
				value: Math.round((count / total) * 100),
				color: ACT_TYPE_COLORS[index % ACT_TYPE_COLORS.length]
			}));
	}, [acts]);

	const complianceAverage = useMemo(() => {
		if (complianceChecks.length) {
			const sum = complianceChecks.reduce((acc, item) => acc + (Number(item.compliance_score) || 0), 0);
			return Math.round(sum / complianceChecks.length);
		}
		return contextStats?.complianceScore ?? null;
	}, [complianceChecks, contextStats]);

	const monthlyRevenueDisplay = totals.monthlyRevenue || contextStats?.monthlyRevenue || 0;
	const satisfactionValue = totals.satisfaction ?? contextStats?.clientSatisfaction ?? null;
	const avgCompletionDisplay = totals.avgCompletionDays ?? contextStats?.avgCompletionDays ?? null;
	const onTimeProgress = totals.onTimeRate === null ? 0 : Math.min(100, Math.max(0, totals.onTimeRate));
	const maxRevenue = Math.max(...revenueSeries.map((el) => el.revenue), 1) || 1;

	const complianceStatusBadge = (status) => {
		if (status === 'passed') return 'bg-emerald-100 text-emerald-700';
		if (status === 'failed') return 'bg-red-100 text-red-700';
		return 'bg-amber-100 text-amber-700';
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
			</div>
		);
	}

	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="flex flex-wrap gap-4 items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold text-gray-900">Analytics avancés</h2>
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

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Revenus consolidés</CardTitle>
						<TrendingUp className="h-5 w-5 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{formatCurrency(monthlyRevenueDisplay)}</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
							Variation
							<span className={`font-semibold ${revenueGrowth === null ? 'text-gray-500' : revenueGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
								{revenueGrowth === null ? '—' : `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%`}
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
						<div className="text-3xl font-bold">{complianceAverage === null ? '—' : `${complianceAverage}%`}</div>
						<Progress value={complianceAverage || 0} className="mt-3" />
						<p className="text-xs text-muted-foreground mt-2">
							{complianceChecks.length} contrôle{complianceChecks.length > 1 ? 's' : ''} de conformité effectué{complianceChecks.length > 1 ? 's' : ''}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Satisfaction client</CardTitle>
						<Users className="h-5 w-5 text-violet-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{satisfactionValue === null ? '—' : `${Number(satisfactionValue).toFixed(0)}%`}</div>
						<Progress value={Math.min(100, Number(satisfactionValue) || 0)} className="mt-3" />
						<p className="text-xs text-muted-foreground mt-2">Indice moyen de satisfaction déclarée</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Utilisation technologique</CardTitle>
						<Cpu className="h-5 w-5 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{techCounts.documentsAuthenticated || contextStats?.documentsAuthenticated || 0}</div>
						<p className="text-xs text-muted-foreground">Documents authentifiés</p>
						<div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
							<div>Transactions blockchain<br /><span className="font-semibold text-gray-900">{techCounts.blockchainTransactions}</span></div>
							<div>Requêtes IA assistant<br /><span className="font-semibold text-gray-900">{techCounts.aiQueries}</span></div>
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
								<CardDescription>Honoraires perçus sur les actes finalisés</CardDescription>
							</CardHeader>
							<CardContent>
								{revenueSeries.length ? (
									<div className="h-56 flex items-end gap-3">
										{revenueSeries.map((item) => (
											<div key={item.key} className="flex-1">
												<div className="flex flex-col items-center justify-end h-full">
													<div
														className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-300"
														style={{ height: `${Math.max(10, (item.revenue / maxRevenue) * 100)}%` }}
													/>
													<div className="mt-3 text-xs font-medium text-gray-700">{item.label}</div>
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
									<div className="mt-2 text-2xl font-bold text-gray-900">
										{avgCompletionDisplay === null ? '—' : `${avgCompletionDisplay} jours`}
									</div>
									<p className="text-xs text-gray-500">Objectif: 30 jours</p>
								</div>
								<div className="p-4 border rounded-lg">
									<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
										<CheckCircle2 className="h-4 w-4 text-emerald-600" /> Respect des délais
									</div>
									<div className="mt-2 text-2xl font-bold text-gray-900">
										{formatPercent(totals.onTimeRate)}
									</div>
									<Progress value={onTimeProgress} className="mt-3" />
								</div>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Historique analytique</CardTitle>
							<CardDescription>Agrégats réels par période à partir de vos actes</CardDescription>
						</CardHeader>
						<CardContent>
							{aggregates.length ? (
								<ScrollArea className="h-72">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Période</TableHead>
												<TableHead>Actes</TableHead>
												<TableHead>Revenus</TableHead>
												<TableHead>Clients actifs</TableHead>
												<TableHead>Satisfaction</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{[...aggregates].reverse().map((entry) => (
												<TableRow key={entry.key}>
													<TableCell>{entry.label}</TableCell>
													<TableCell>
														<div className="flex flex-col">
															<span className="font-medium text-gray-900">{entry.totalActs} actes</span>
															<span className="text-xs text-gray-500">{entry.completedActs} finalisés</span>
														</div>
													</TableCell>
													<TableCell>{formatCurrency(entry.revenue)}</TableCell>
													<TableCell>{entry.activeClients}</TableCell>
													<TableCell>{entry.satisfaction === null ? '—' : `${Number(entry.satisfaction).toFixed(0)}%`}</TableCell>
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
					<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
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
															<div className="font-semibold text-gray-900">{check.check_type || 'Contrôle de conformité'}</div>
															<div className="text-xs text-gray-500">{check.created_at ? new Date(check.created_at).toLocaleString('fr-FR') : '—'}</div>
														</div>
														<Badge className={complianceStatusBadge(check.status)}>
															{check.status || 'pending'}
														</Badge>
													</div>
													<div className="mt-3">
														<div className="flex items-center justify-between text-xs text-gray-500">
															<span>Score</span>
															<span>{check.compliance_score || 0}%</span>
														</div>
														<Progress value={check.compliance_score || 0} className="h-1.5 mt-1" />
													</div>
													{check.status === 'failed' ? (
														<div className="mt-3 text-xs text-red-600 flex items-center gap-2">
															<AlertTriangle className="h-3 w-3" /> Points de non-conformité à traiter
														</div>
													) : check.status === 'passed' ? (
														<div className="mt-3 text-xs text-emerald-600 flex items-center gap-2">
															<CheckCircle2 className="h-3 w-3" /> Conforme
														</div>
													) : (
														<div className="mt-3 text-xs text-amber-600 flex items-center gap-2">
															<AlertTriangle className="h-3 w-3" /> Contrôle en attente
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
														<span className="text-sm font-medium text-gray-800">{item.name}</span>
													</div>
													<div className="text-xs text-gray-500">{item.count} actes</div>
												</div>
												<Progress value={item.value} className="h-1.5" />
												<div className="text-xs text-gray-500">{item.value}% du volume total</div>
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
								{totals.totalActs ? (
									<div className="grid gap-4 sm:grid-cols-2">
										<div className="p-4 border rounded-lg bg-gradient-to-br from-amber-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
												<Activity className="h-4 w-4" /> Actes traités
											</div>
											<div className="mt-2 text-3xl font-bold text-gray-900">{totals.totalActs}</div>
											<p className="text-xs text-gray-500">{totals.newActsThisMonth} nouveaux actes ce mois</p>
										</div>
										<div className="p-4 border rounded-lg bg-gradient-to-br from-emerald-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
												<Users className="h-4 w-4" /> Clients actifs
											</div>
											<div className="mt-2 text-3xl font-bold text-gray-900">{totals.uniqueClients}</div>
											<p className="text-xs text-gray-500">clients distincts sur vos actes</p>
										</div>
										<div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
												<PieChart className="h-4 w-4" /> Répartition actes
											</div>
											<div className="mt-2 text-3xl font-bold text-gray-900">{distribution.reduce((acc, item) => acc + (item.count || 0), 0)}</div>
											<p className="text-xs text-gray-500">{distribution.length} typologie{distribution.length > 1 ? 's' : ''} active{distribution.length > 1 ? 's' : ''}</p>
										</div>
										<div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-white">
											<div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
												<LineChart className="h-4 w-4" /> Honoraires moyens
											</div>
											<div className="mt-2 text-3xl font-bold text-gray-900">
												{formatCurrency(totals.avgActValue || 0)}
											</div>
											<p className="text-xs text-gray-500">par acte finalisé</p>
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
										{formatPercent(totals.conversionRate)}
									</span>
								</div>
								<div className="flex items-center justify-between border rounded-lg p-3">
									<div className="flex items-center gap-2">
										<Gauge className="h-4 w-4 text-amber-600" /> Dossiers actifs
									</div>
									<span className="font-semibold text-gray-900">{totals.activeActs || contextStats?.activeCases || 0}</span>
								</div>
								<div className="flex items-center justify-between border rounded-lg p-3">
									<div className="flex items-center gap-2">
										<Cpu className="h-4 w-4 text-blue-600" /> Automatisation IA
									</div>
									<span className="font-semibold text-gray-900">{techCounts.aiQueries} requêtes</span>
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
