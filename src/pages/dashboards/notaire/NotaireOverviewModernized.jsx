import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
	FileText,
	Activity,
	ShieldCheck,
	DollarSign,
	Users,
	TrendingUp,
	RefreshCw,
	CheckCircle,
	Clock,
	BarChart3,
	AlertTriangle,
	Target,
	Calendar,
	ClipboardCheck,
	Layers,
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
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';

// Statuts RÉELS de notarial_acts : draft | in_progress | signed | completed | cancelled
const statusStyles = {
	draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-700' },
	in_progress: { label: 'En cours', className: 'bg-blue-100 text-blue-800' },
	signed: { label: 'Signé', className: 'bg-purple-100 text-purple-800' },
	completed: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800' },
	cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800' }
};

// Progression dérivée du statut réel (pas de colonne progress dans le schéma)
const statusProgress = {
	draft: 15,
	in_progress: 50,
	signed: 80,
	completed: 100,
	cancelled: 0
};

const actTypeLabels = {
	vente_immobiliere: 'Ventes Immobilières',
	succession: 'Successions',
	donation: 'Donations',
	acte_propriete: 'Actes de Propriété',
	hypotheque: 'Hypothèques',
	constitution_societe: 'Constitutions Société',
	servitude: 'Servitudes',
	partage: 'Partages'
};

const distributionColors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

const ACTIVE_STATUSES = ['draft', 'in_progress', 'signed'];

const NotaireOverviewModernized = () => {
	const { dashboardStats: contextStats } = useOutletContext() || {};
	const { user } = useAuth();

	const defaultStats = useMemo(
		() => ({
			totalCases: contextStats?.totalCases || 0,
			activeCases: contextStats?.activeCases || 0,
			completedCases: contextStats?.completedCases || 0,
			monthlyRevenue: contextStats?.monthlyRevenue || 0,
			documentsAuthenticated: contextStats?.documentsAuthenticated || 0,
			complianceScore: contextStats?.complianceScore || 0,
			clientSatisfaction: contextStats?.clientSatisfaction || 0,
			avgCompletionDays: contextStats?.avgCompletionDays || 0,
			uniqueClients: contextStats?.uniqueClients || 0
		}),
		[contextStats]
	);

	const [stats, setStats] = useState(defaultStats);
	const [revenueData, setRevenueData] = useState([]);
	const [recentActs, setRecentActs] = useState([]);
	const [acts, setActs] = useState([]);
	const [distribution, setDistribution] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [activeTab, setActiveTab] = useState('pipeline');

	useEffect(() => {
		setStats(defaultStats);
	}, [defaultStats]);

	useEffect(() => {
		if (user) {
			loadOverviewData(true);
		}
	}, [user]);

	const loadOverviewData = async (initial = false) => {
		if (!user) return;
		initial ? setIsLoading(true) : setIsRefreshing(true);

		try {
			// Source principale : tous les actes notariés du notaire (colonnes RÉELLES)
			const [actsRes, docsRes, complianceRes, clientsRes] = await Promise.all([
				supabase
					.from('notarial_acts')
					.select('id, act_type, reference, client_id, client_name, status, notary_fees, amount, client_satisfaction, signed_at, created_at')
					.eq('notaire_id', user.id)
					.order('created_at', { ascending: false }),
				supabase
					.from('document_authentication')
					.select('id', { count: 'exact', head: true })
					.eq('notaire_id', user.id)
					.eq('verification_status', 'verified'),
				supabase
					.from('compliance_checks')
					.select('compliance_score')
					.eq('notaire_id', user.id),
				supabase
					.from('clients_notaire')
					.select('id', { count: 'exact', head: true })
					.eq('notaire_id', user.id)
			]);

			const allActs = actsRes.data || [];
			setActs(allActs);

			// KPI dérivés des actes réels
			const activeCases = allActs.filter((act) => ACTIVE_STATUSES.includes(act.status)).length;
			const completedActs = allActs.filter((act) => act.status === 'completed');
			const currentMonth = new Date().toISOString().substring(0, 7);
			const monthlyRevenue = completedActs
				.filter((act) => (act.created_at || '').startsWith(currentMonth))
				.reduce((sum, act) => sum + (Number(act.notary_fees) || 0), 0);

			// Satisfaction client réelle (échelle 0-100)
			const satisfactionScores = allActs
				.map((act) => act.client_satisfaction)
				.filter((v) => v !== null && v !== undefined);
			const avgSatisfaction = satisfactionScores.length
				? satisfactionScores.reduce((sum, v) => sum + Number(v), 0) / satisfactionScores.length
				: 0;

			// Durée moyenne réelle : signed_at - created_at des actes complétés/signés
			const durations = completedActs
				.filter((act) => act.signed_at && act.created_at)
				.map((act) => (new Date(act.signed_at) - new Date(act.created_at)) / (1000 * 60 * 60 * 24))
				.filter((d) => d >= 0);
			const avgCompletionDays = durations.length
				? durations.reduce((sum, d) => sum + d, 0) / durations.length
				: 0;

			// Conformité réelle (moyenne des compliance_score)
			const complianceScores = (complianceRes.data || [])
				.map((c) => c.compliance_score)
				.filter((v) => v !== null && v !== undefined);
			const avgCompliance = complianceScores.length
				? complianceScores.reduce((sum, v) => sum + Number(v), 0) / complianceScores.length
				: 0;

			setStats((prev) => ({
				...prev,
				totalCases: allActs.length,
				activeCases,
				completedCases: completedActs.length,
				monthlyRevenue,
				documentsAuthenticated: docsRes.count || 0,
				complianceScore: Math.round(avgCompliance),
				clientSatisfaction: avgSatisfaction,
				avgCompletionDays: Math.round(avgCompletionDays),
				uniqueClients: clientsRes.count || new Set(allActs.map((a) => a.client_id).filter(Boolean)).size
			}));

			// Revenus des 6 derniers mois (actes complétés)
			setRevenueData(buildRevenueData(completedActs, 6));

			// Actes récents (8 derniers, déjà triés desc)
			setRecentActs(allActs.slice(0, 8));

			// Répartition par type d'acte
			setDistribution(buildDistribution(allActs));
		} catch (error) {
			console.error("Erreur chargement vue d'ensemble notaire:", error);
			window.safeGlobalToast?.({
				title: 'Erreur de chargement',
				description: 'Impossible de récupérer les statistiques en temps réel.',
				variant: 'destructive'
			});
		} finally {
			initial ? setIsLoading(false) : setIsRefreshing(false);
		}
	};

	const buildRevenueData = (completedActs, monthsBack) => {
		const buckets = {};
		const now = new Date();
		for (let i = monthsBack - 1; i >= 0; i -= 1) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
			buckets[key] = {
				month: d.toLocaleDateString('fr-FR', { month: 'short' }),
				revenue: 0,
				cases: 0
			};
		}
		completedActs.forEach((act) => {
			const key = (act.created_at || '').substring(0, 7);
			if (buckets[key]) {
				buckets[key].revenue += Number(act.notary_fees) || 0;
				buckets[key].cases += 1;
			}
		});
		return Object.values(buckets);
	};

	const buildDistribution = (allActs) => {
		if (!allActs.length) return [];
		const counts = {};
		allActs.forEach((act) => {
			const type = act.act_type || 'autre';
			counts[type] = (counts[type] || 0) + 1;
		});
		const total = allActs.length;
		return Object.entries(counts).map(([type, count], index) => ({
			name: actTypeLabels[type] || type,
			count,
			value: Math.round((count / total) * 100),
			color: distributionColors[index % distributionColors.length]
		}));
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

	const formatDate = (date) => {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
	};

	const getStatusBadge = (status) => {
		const normalized = status?.toLowerCase();
		return statusStyles[normalized] || { label: status || 'Inconnu', className: 'bg-slate-100 text-slate-700' };
	};

	// client_satisfaction est sur une échelle 0-100 dans le schéma réel
	const formatSatisfaction = (value) => {
		if (!value && value !== 0) return '—';
		return `${Math.round(value)} %`;
	};

	const getProgress = (status) => statusProgress[status?.toLowerCase()] ?? 0;

	const getActLabel = (act) =>
		act.reference || act.client_name || actTypeLabels[act.act_type] || act.act_type || 'Acte sans référence';

	const upcomingCases = useMemo(() => {
		if (!acts?.length) return [];
		return acts
			.filter((item) => ACTIVE_STATUSES.includes(item.status))
			.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
			.slice(0, 6);
	}, [acts]);

	const pipelineStats = useMemo(() => {
		const base = { total: 0, inProgress: 0, awaitingSignature: 0, documentation: 0, blocked: 0, completed: 0 };
		if (!acts?.length) return base;

		return acts.reduce((acc, current) => {
			acc.total += 1;
			const status = current.status?.toLowerCase();

			if (status === 'completed') {
				acc.completed += 1;
			} else if (status === 'signed') {
				acc.awaitingSignature += 1;
			} else if (status === 'draft') {
				acc.documentation += 1;
			} else if (status === 'cancelled') {
				acc.blocked += 1;
			} else {
				acc.inProgress += 1;
			}
			return acc;
		}, base);
	}, [acts]);

	const revenueMax = Math.max(...revenueData.map((item) => item.revenue), 0) || 1;

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
					<h2 className="text-3xl font-bold text-gray-900">Tableau de bord global</h2>
					<p className="text-gray-600">
						Vision consolidée de l'activité notariale avec données Supabase en temps réel.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
						<CheckCircle className="h-4 w-4" />
						Données réelles actives
					</Badge>
					<Button
						variant="outline"
						onClick={() => loadOverviewData(false)}
						disabled={isRefreshing}
					>
						<RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
						Actualiser
					</Button>
				</div>
			</div>

			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Actes actifs</CardTitle>
						<FileText className="h-5 w-5 text-amber-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stats.activeCases}</div>
						<p className="text-xs text-muted-foreground">
							{stats.totalCases} actes suivis • {pipelineStats.completed} finalisés
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Revenus du mois</CardTitle>
						<DollarSign className="h-5 w-5 text-emerald-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
						<p className="text-xs text-muted-foreground">
							{revenueData.length ? `${revenueData[revenueData.length - 1]?.cases || 0} actes complétés` : 'En attente de données'}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Conformité globale</CardTitle>
						<ShieldCheck className="h-5 w-5 text-blue-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{stats.complianceScore || 0}%</div>
						<p className="text-xs text-muted-foreground">Documents authentifiés : {stats.documentsAuthenticated}</p>
						<Progress value={stats.complianceScore || 0} className="mt-3" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Satisfaction client</CardTitle>
						<Users className="h-5 w-5 text-violet-600" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">{formatSatisfaction(stats.clientSatisfaction || 0)}</div>
						<p className="text-xs text-muted-foreground">{stats.uniqueClients || 0} clients servis</p>
						<Progress
							value={Math.min(100, stats.clientSatisfaction || 0)}
							className="mt-3"
						/>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
				<Card className="xl:col-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Tendances financières</CardTitle>
								<CardDescription>Evolution des honoraires collectés sur les 6 derniers mois</CardDescription>
							</div>
							<Badge variant="outline" className="text-xs flex items-center gap-1">
								<TrendingUp className="h-3 w-3" />
								Pipeline: {pipelineStats.total} dossiers
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						{revenueData.some((item) => item.revenue > 0 || item.cases > 0) ? (
							<div className="h-56 flex items-end gap-3">
								{revenueData.map((item) => {
									const height = Math.max(12, (item.revenue / revenueMax) * 100);
									return (
										<div key={item.month} className="flex-1 flex flex-col items-center justify-end">
											<div
												className="w-full rounded-t-md bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-300"
												style={{ height: `${height}%` }}
											/>
											<div className="mt-3 text-xs font-medium text-gray-700">{item.month}</div>
											<div className="text-[11px] text-gray-500">{formatCurrency(item.revenue)}</div>
											<Badge className="mt-1 bg-slate-100 text-slate-700" variant="secondary">
												{item.cases} actes
											</Badge>
										</div>
									);
								})}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-48 text-center text-sm text-gray-500">
								<BarChart3 className="h-6 w-6 mb-2 text-amber-500" />
								Pas encore de données de revenus disponibles
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Répartition des actes</CardTitle>
						<CardDescription>Volumes par typologie d'actes authentifiés</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{distribution.length ? (
								distribution.map((item) => (
									<div key={item.name} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span
													className="h-2 w-2 rounded-full"
													style={{ backgroundColor: item.color || '#f97316' }}
												/>
												<span className="text-sm font-medium text-gray-800">{item.name}</span>
											</div>
											<Badge variant="outline" className="text-xs">
												{item.count} actes
											</Badge>
										</div>
										<Progress value={item.value} className="h-1.5" />
										<div className="text-xs text-gray-500">{item.value}% du portefeuille</div>
									</div>
								))
							) : (
								<div className="text-sm text-gray-500">
									Les données de distribution seront disponibles dès la création de vos premiers actes.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Actes récents</CardTitle>
						<CardDescription>Suivi des derniers actes enregistrés avec leur progression</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{recentActs.length ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Acte</TableHead>
										<TableHead>Client</TableHead>
										<TableHead>Statut</TableHead>
										<TableHead>Progression</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentActs.map((act) => {
										const statusBadge = getStatusBadge(act.status);
										const progress = getProgress(act.status);
										return (
											<TableRow key={act.id}>
												<TableCell className="font-medium">
													<div className="flex flex-col">
														<span>{getActLabel(act)}</span>
														<span className="text-xs text-gray-500">{formatDate(act.created_at)}</span>
													</div>
												</TableCell>
												<TableCell>
													{act.client_name ? (
														<span>{act.client_name}</span>
													) : (
														<span className="text-xs text-gray-500">Client non assigné</span>
													)}
												</TableCell>
												<TableCell>
													<Badge className={`${statusBadge.className} capitalize`}>{statusBadge.label}</Badge>
												</TableCell>
												<TableCell className="w-48">
													<div className="flex items-center gap-3">
														<Progress value={progress} className="h-1.5" />
														<span className="text-xs text-gray-500">{progress}%</span>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						) : (
							<div className="text-sm text-gray-500">Aucun acte récent pour le moment.</div>
						)}
					</CardContent>
				</Card>

						<Card>
							<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
								<CardHeader className="flex flex-col gap-2">
									<div className="flex items-center justify-between w-full">
										<div>
											<CardTitle>Plan d'action prioritaire</CardTitle>
											<CardDescription>Prochaines échéances et tâches critiques liées aux dossiers</CardDescription>
										</div>
										<TabsList className="grid grid-cols-2 max-w-[240px]">
											<TabsTrigger value="pipeline">Pipeline</TabsTrigger>
											<TabsTrigger value="alerts">Alertes</TabsTrigger>
										</TabsList>
									</div>
									<Separator />
								</CardHeader>
								<CardContent className="space-y-4">
									<TabsContent value="pipeline" className="space-y-4">
								<div className="grid gap-3 sm:grid-cols-2">
									<div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-white">
										<div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
											<Activity className="h-4 w-4" /> Dossiers en cours
										</div>
										<div className="mt-2 text-2xl font-bold text-gray-900">{pipelineStats.inProgress}</div>
										<p className="text-xs text-gray-500">Suivi actif par l'étude</p>
									</div>
									<div className="p-4 rounded-lg border bg-gradient-to-br from-violet-50 to-white">
										<div className="flex items-center gap-2 text-sm font-semibold text-violet-700">
											<ClipboardCheck className="h-4 w-4" /> Signatures en attente
										</div>
										<div className="mt-2 text-2xl font-bold text-gray-900">{pipelineStats.awaitingSignature}</div>
										<p className="text-xs text-gray-500">Rappels clients nécessaires</p>
									</div>
									<div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-white">
										<div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
											<Layers className="h-4 w-4" /> Documentation
										</div>
										<div className="mt-2 text-2xl font-bold text-gray-900">{pipelineStats.documentation}</div>
										<p className="text-xs text-gray-500">Dossiers à compléter</p>
									</div>
									<div className="p-4 rounded-lg border bg-gradient-to-br from-red-50 to-white">
										<div className="flex items-center gap-2 text-sm font-semibold text-red-700">
											<AlertTriangle className="h-4 w-4" /> Annulés / urgences
										</div>
										<div className="mt-2 text-2xl font-bold text-gray-900">{pipelineStats.blocked}</div>
										<p className="text-xs text-gray-500">Escalades requises</p>
									</div>
								</div>
							</TabsContent>

												<TabsContent value="alerts" className="space-y-3">
								<ScrollArea className="h-72 pr-4">
									{upcomingCases.length ? (
										<div className="space-y-3">
											{upcomingCases.map((item) => {
												const statusBadge = getStatusBadge(item.status);
												const progress = getProgress(item.status);
												return (
													<div key={item.id} className="p-4 border rounded-lg hover:shadow-sm transition-all">
														<div className="flex items-start justify-between gap-3">
															<div>
																<div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
																	<Target className="h-4 w-4 text-amber-600" /> {getActLabel(item)}
																</div>
																<div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
																	<span className="flex items-center gap-1">
																		<Calendar className="h-3 w-3" /> Créé le {formatDate(item.created_at)}
																	</span>
																	{item.client_name && (
																		<span className="flex items-center gap-1">
																			<Users className="h-3 w-3" /> {item.client_name}
																		</span>
																	)}
																</div>
															</div>
															<div className="flex flex-col items-end gap-2">
																<Badge className={`${statusBadge.className} text-xs capitalize`}>
																	{statusBadge.label}
																</Badge>
																<Button
																	size="sm"
																	variant="outline"
																	onClick={() =>
																		window.safeGlobalToast?.({
																			title: 'Ouverture dossier',
																			description: `Le dossier ${item.reference || item.client_name || ''} sera ouvert dans la prochaine itération.`
																		})
																	}
																>
																	Consulter
																</Button>
															</div>
														</div>
														<div className="mt-3">
															<div className="flex items-center justify-between text-xs text-gray-500">
																<span>Progression</span>
																<span>{progress}%</span>
															</div>
															<Progress value={progress} className="h-1.5 mt-1" />
														</div>
													</div>
												);
											})}
										</div>
									) : (
										<div className="h-48 flex flex-col items-center justify-center text-sm text-gray-500">
											<Zap className="h-5 w-5 mb-2 text-amber-500" />
											Aucune alerte critique détectée.
										</div>
									)}
								</ScrollArea>
							</TabsContent>
											</CardContent>
										</Tabs>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Performance opérationnelle</CardTitle>
					<CardDescription>Durée moyenne de traitement et efficacité des équipes</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div className="rounded-lg border p-4 bg-white shadow-sm">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
								<Clock className="h-4 w-4 text-amber-600" /> Durée moyenne
							</div>
							<div className="mt-2 text-2xl font-bold text-gray-900">
								{stats.avgCompletionDays ? `${stats.avgCompletionDays} jours` : '—'}
							</div>
							<p className="text-xs text-gray-500">Comparé à l'objectif de 30 jours</p>
						</div>

						<div className="rounded-lg border p-4 bg-white shadow-sm">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
								<CheckCircle className="h-4 w-4 text-emerald-600" /> Actes finalisés
							</div>
							<div className="mt-2 text-2xl font-bold text-gray-900">{stats.completedCases || 0}</div>
							<p className="text-xs text-gray-500">Sur {stats.totalCases || 0} actes enregistrés</p>
						</div>

						<div className="rounded-lg border p-4 bg-white shadow-sm">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
								<FileText className="h-4 w-4 text-blue-600" /> Documents validés
							</div>
							<div className="mt-2 text-2xl font-bold text-gray-900">{stats.documentsAuthenticated || 0}</div>
							<p className="text-xs text-gray-500">Authentifications vérifiées</p>
						</div>

						<div className="rounded-lg border p-4 bg-white shadow-sm">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
								<DollarSign className="h-4 w-4 text-emerald-600" /> Honoraires moyens
							</div>
							<div className="mt-2 text-2xl font-bold text-gray-900">
								{formatCurrency(
									revenueData.length && revenueData[revenueData.length - 1]?.cases
										? (stats.monthlyRevenue || 0) / Math.max(1, revenueData[revenueData.length - 1].cases)
										: stats.monthlyRevenue || 0
								)}
							</div>
							<p className="text-xs text-gray-500">Par acte complété ce mois-ci</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default NotaireOverviewModernized;
