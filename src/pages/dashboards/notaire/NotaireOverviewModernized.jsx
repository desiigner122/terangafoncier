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
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
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

const statusStyles = {
	draft: { label: 'Brouillon', className: 'bg-slate-100 text-slate-700' },
	draft_review: { label: 'En révision', className: 'bg-amber-100 text-amber-800' },
	documentation: { label: 'Documentation', className: 'bg-blue-100 text-blue-800' },
	signature_pending: { label: 'Signature en attente', className: 'bg-purple-100 text-purple-800' },
	registration: { label: 'Enregistrement', className: 'bg-orange-100 text-orange-800' },
	completed: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800' },
	rejected: { label: 'Refusé', className: 'bg-red-100 text-red-800' }
};

const priorityStyles = {
	high: 'bg-red-100 text-red-800',
	urgent: 'bg-red-100 text-red-800',
	medium: 'bg-amber-100 text-amber-800',
	low: 'bg-emerald-100 text-emerald-800'
};

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
	const [cases, setCases] = useState([]);
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
			const [statsResult, revenueResult, recentActsResult, distributionResult, casesResult] = await Promise.all([
				NotaireSupabaseService.getDashboardStats(user.id),
				NotaireSupabaseService.getRevenueData(user.id, 6),
				NotaireSupabaseService.getRecentActs(user.id, 8),
				NotaireSupabaseService.getActTypesDistribution(user.id),
				NotaireSupabaseService.getCases(user.id)
			]);

			if (statsResult?.success) {
				setStats((prev) => ({ ...prev, ...statsResult.data }));
			}

			if (revenueResult?.success) {
				setRevenueData(revenueResult.data || []);
			}

			if (recentActsResult?.success) {
				setRecentActs(recentActsResult.data || []);
			}

			if (distributionResult?.success) {
				setDistribution(distributionResult.data || []);
			}

			if (casesResult?.success) {
				setCases(casesResult.data || []);
			}
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

	const formatSatisfaction = (value) => {
		if (!value && value !== 0) return '—';
		return `${value.toFixed(1)} / 5`;
	};

	const upcomingCases = useMemo(() => {
		if (!cases?.length) return [];
		return [...cases]
			.filter((item) => item.status !== 'completed' && item.status !== 'closed')
			.sort((a, b) => {
				const dateA = a.due_date || a.next_action_date || a.opened_date;
				const dateB = b.due_date || b.next_action_date || b.opened_date;
				return new Date(dateA || 0) - new Date(dateB || 0);
			})
			.slice(0, 6);
	}, [cases]);

	const pipelineStats = useMemo(() => {
		if (!cases?.length) {
			return { total: 0, inProgress: 0, awaitingSignature: 0, documentation: 0, blocked: 0, completed: 0 };
		}

		return cases.reduce(
			(acc, current) => {
				acc.total += 1;
				const status = current.status?.toLowerCase();

				if (status === 'completed' || status === 'closed') {
					acc.completed += 1;
				} else if (status?.includes('signature')) {
					acc.awaitingSignature += 1;
				} else if (status === 'documentation' || status === 'draft_review') {
					acc.documentation += 1;
				} else if (status === 'blocked' || status === 'on_hold') {
					acc.blocked += 1;
				} else {
					acc.inProgress += 1;
				}
				return acc;
			},
			{ total: 0, inProgress: 0, awaitingSignature: 0, documentation: 0, blocked: 0, completed: 0 }
		);
	}, [cases]);

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
			className="space-y-4 sm:space-y-6"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center justify-between">
				<div>
					<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Tableau de bord global</h2>
					<p className="text-sm sm:text-base text-gray-600">
						Vision consolidée de l'activité notariale avec données Supabase en temps réel.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">
						<CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
						<span className="hidden sm:inline">Données réelles actives</span>
						<span className="sm:hidden">Données réelles</span>
					</Badge>
					<Button
						variant="outline"
						size="sm"
						onClick={() => loadOverviewData(false)}
						disabled={isRefreshing}
						className="text-xs sm:text-sm h-8 sm:h-9"
					>
						<RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
						<span className="hidden sm:inline">Actualiser</span>
						<span className="sm:hidden">MAJ</span>
					</Button>
				</div>
			</div>

			<div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">Actes actifs</CardTitle>
						<FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
					</CardHeader>
					<CardContent className="p-3 sm:p-4 pt-0">
						<div className="text-2xl sm:text-3xl font-bold">{stats.activeCases}</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">
							{stats.totalCases} actes suivis • {pipelineStats.completed} finalisés
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">Revenus du mois</CardTitle>
						<DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
					</CardHeader>
					<CardContent className="p-3 sm:p-4 pt-0">
						<div className="text-2xl sm:text-3xl font-bold truncate">{formatCurrency(stats.monthlyRevenue)}</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">
							{revenueData.length ? `${revenueData[revenueData.length - 1]?.cases || 0} actes complétés` : 'En attente de données'}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">Conformité globale</CardTitle>
						<ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
					</CardHeader>
					<CardContent className="p-3 sm:p-4 pt-0">
						<div className="text-2xl sm:text-3xl font-bold">{stats.complianceScore || 0}%</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">Documents authentifiés : {stats.documentsAuthenticated}</p>
						<Progress value={stats.complianceScore || 0} className="mt-2 sm:mt-3" />
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-3 sm:p-4">
						<CardTitle className="text-xs sm:text-sm font-medium">Satisfaction client</CardTitle>
						<Users className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
					</CardHeader>
					<CardContent className="p-3 sm:p-4 pt-0">
						<div className="text-2xl sm:text-3xl font-bold">{formatSatisfaction(stats.clientSatisfaction || 0)}</div>
						<p className="text-[10px] sm:text-xs text-muted-foreground">{stats.uniqueClients || 0} clients servis</p>
						<Progress
							value={Math.min(100, ((stats.clientSatisfaction || 0) / 5) * 100)}
							className="mt-2 sm:mt-3"
						/>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader className="p-3 sm:p-4 lg:p-6">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
							<div>
								<CardTitle className="text-base sm:text-lg">Tendances financières</CardTitle>
								<CardDescription className="text-xs sm:text-sm">Evolution des honoraires collectés sur les 6 derniers mois</CardDescription>
							</div>
							<Badge variant="outline" className="text-[10px] sm:text-xs flex items-center gap-1 w-fit">
								<TrendingUp className="h-3 w-3" />
								<span className="hidden sm:inline">Pipeline: {pipelineStats.total} dossiers</span>
								<span className="sm:hidden">{pipelineStats.total}</span>
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
						{revenueData.length ? (
							<div className="h-48 sm:h-56 flex items-end gap-2 sm:gap-3">
								{revenueData.map((item) => {
									const height = Math.max(12, (item.revenue / revenueMax) * 100);
									return (
										<div key={item.month} className="flex-1 flex flex-col items-center justify-end">
											<div
												className="w-full rounded-t-md bg-gradient-to-t from-amber-500 to-amber-300 transition-all duration-300"
												style={{ height: `${height}%` }}
											/>
											<div className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium text-gray-700 truncate max-w-full">{item.month}</div>
											<div className="text-[9px] sm:text-[11px] text-gray-500 hidden sm:block">{formatCurrency(item.revenue)}</div>
											<Badge className="mt-1 bg-slate-100 text-slate-700 text-[9px] sm:text-[10px] px-1 py-0.5" variant="secondary">
												{item.cases} actes
											</Badge>
										</div>
									);
								})}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center h-40 sm:h-48 text-center text-xs sm:text-sm text-gray-500">
								<BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mb-2 text-amber-500" />
								Pas encore de données de revenus disponibles
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="p-3 sm:p-4 lg:p-6">
						<CardTitle className="text-base sm:text-lg">Répartition des actes</CardTitle>
						<CardDescription className="text-xs sm:text-sm">Volumes par typologie d'actes authentifiés</CardDescription>
					</CardHeader>
					<CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
						<div className="space-y-3 sm:space-y-4">
							{distribution.length ? (
								distribution.map((item) => (
									<div key={item.name} className="space-y-1.5 sm:space-y-2">
										<div className="flex items-center justify-between gap-2">
											<div className="flex items-center gap-2 min-w-0">
												<span
													className="h-2 w-2 rounded-full flex-shrink-0"
													style={{ backgroundColor: item.color || '#f97316' }}
												/>
												<span className="text-xs sm:text-sm font-medium text-gray-800 truncate">{item.name}</span>
											</div>
											<Badge variant="outline" className="text-[10px] sm:text-xs flex-shrink-0">
												{item.count} actes
											</Badge>
										</div>
										<Progress value={item.value} className="h-1 sm:h-1.5" />
										<div className="text-[10px] sm:text-xs text-gray-500">{item.value}% du portefeuille</div>
									</div>
								))
							) : (
								<div className="text-xs sm:text-sm text-gray-500">
									Les données de distribution seront disponibles dès la création de vos premiers actes.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
				<Card>
					<CardHeader className="p-3 sm:p-4 lg:p-6">
						<CardTitle className="text-base sm:text-lg">Actes récents</CardTitle>
						<CardDescription className="text-xs sm:text-sm">Suivi des derniers actes enregistrés avec leur progression</CardDescription>
					</CardHeader>
					<CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-4">
						{recentActs.length ? (
							<div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6">
								<div className="inline-block min-w-full align-middle px-3 sm:px-4 lg:px-6">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="text-xs sm:text-sm">Acte</TableHead>
												<TableHead className="text-xs sm:text-sm hidden sm:table-cell">Client</TableHead>
												<TableHead className="text-xs sm:text-sm">Statut</TableHead>
												<TableHead className="text-xs sm:text-sm hidden lg:table-cell">Progression</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{recentActs.map((act) => {
												const statusBadge = getStatusBadge(act.status);
												return (
													<TableRow key={act.id}>
														<TableCell className="font-medium text-xs sm:text-sm">
															<div className="flex flex-col">
																<span className="truncate max-w-[120px] sm:max-w-none">{act.title || 'Acte sans titre'}</span>
																<span className="text-[10px] sm:text-xs text-gray-500">{formatDate(act.created_at)}</span>
															</div>
														</TableCell>
														<TableCell className="text-xs sm:text-sm hidden sm:table-cell">
															{act.client ? (
																<div className="flex flex-col">
																	<span className="truncate max-w-[120px]">{`${act.client.first_name || ''} ${act.client.last_name || ''}`.trim() || 'Client interne'}</span>
																	<span className="text-[10px] sm:text-xs text-gray-500">{act.client.email || 'Email indisponible'}</span>
																</div>
															) : (
																<span className="text-[10px] sm:text-xs text-gray-500">Client non assigné</span>
															)}
														</TableCell>
														<TableCell>
															<Badge className={`${statusBadge.className} capitalize text-[10px] sm:text-xs px-1.5 py-0.5`}>{statusBadge.label}</Badge>
														</TableCell>
														<TableCell className="w-32 sm:w-48 hidden lg:table-cell">
															<div className="flex items-center gap-2 sm:gap-3">
																<Progress value={Math.min(100, act.progress || 0)} className="h-1 sm:h-1.5" />
																<span className="text-[10px] sm:text-xs text-gray-500">{Math.round(act.progress || 0)}%</span>
															</div>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</div>
						) : (
							<div className="text-xs sm:text-sm text-gray-500">Aucun acte récent pour le moment.</div>
						)}
					</CardContent>
				</Card>

						<Card>
							<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
								<CardHeader className="flex flex-col gap-2 p-3 sm:p-4 lg:p-6">
									<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-4">
										<div>
											<CardTitle className="text-base sm:text-lg">Plan d'action prioritaire</CardTitle>
											<CardDescription className="text-xs sm:text-sm">Prochaines échéances et tâches critiques liées aux dossiers</CardDescription>
										</div>
										<TabsList className="grid grid-cols-2 w-full sm:max-w-[240px]">
											<TabsTrigger value="pipeline" className="text-xs sm:text-sm">Pipeline</TabsTrigger>
											<TabsTrigger value="alerts" className="text-xs sm:text-sm">Alertes</TabsTrigger>
										</TabsList>
									</div>
									<Separator />
								</CardHeader>
								<CardContent className="space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
									<TabsContent value="pipeline" className="space-y-3 sm:space-y-4 mt-0">
								<div className="grid gap-2 sm:gap-3 grid-cols-2">
									<div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-white">
										<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-amber-700">
											<Activity className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Dossiers en cours</span><span className="sm:hidden">En cours</span>
										</div>
										<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{pipelineStats.inProgress}</div>
										<p className="text-[10px] sm:text-xs text-gray-500">Suivi actif par l'étude</p>
									</div>
									<div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-violet-50 to-white">
										<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-violet-700">
											<ClipboardCheck className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Signatures en attente</span><span className="sm:hidden">Signatures</span>
										</div>
										<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{pipelineStats.awaitingSignature}</div>
										<p className="text-[10px] sm:text-xs text-gray-500">Rappels clients nécessaires</p>
									</div>
									<div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-white">
										<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-blue-700">
											<Layers className="h-3 w-3 sm:h-4 sm:w-4" /> Documentation
										</div>
										<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{pipelineStats.documentation}</div>
										<p className="text-[10px] sm:text-xs text-gray-500">Dossiers à compléter</p>
									</div>
									<div className="p-3 sm:p-4 rounded-lg border bg-gradient-to-br from-red-50 to-white">
										<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-red-700">
											<AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Bloqués / urgences</span><span className="sm:hidden">Bloqués</span>
										</div>
										<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{pipelineStats.blocked}</div>
										<p className="text-[10px] sm:text-xs text-gray-500">Escalades requises</p>
									</div>
								</div>
							</TabsContent>

												<TabsContent value="alerts" className="space-y-2 sm:space-y-3 mt-0">
								<ScrollArea className="h-64 sm:h-72 pr-2 sm:pr-4">
									{upcomingCases.length ? (
										<div className="space-y-2 sm:space-y-3">
											{upcomingCases.map((item) => (
												<div key={item.id} className="p-3 sm:p-4 border rounded-lg hover:shadow-sm transition-all">
													<div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-3">
														<div className="flex-1 min-w-0">
															<div className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
																<Target className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0" /> 
																<span className="truncate">{item.title || 'Dossier sans titre'}</span>
															</div>
															<div className="mt-1 text-[10px] sm:text-xs text-gray-500 flex flex-wrap gap-2">
																{item.due_date && (
																	<span className="flex items-center gap-1">
																		<Calendar className="h-3 w-3" /> {formatDate(item.due_date)}
																	</span>
																)}
																{item.next_action && (
																	<span className="flex items-center gap-1">
																		<Clock className="h-3 w-3" /> <span className="truncate max-w-[120px] sm:max-w-none">{item.next_action}</span>
																	</span>
																)}
															</div>
														</div>
														<div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
															<Badge className={`${priorityStyles[item.priority] || 'bg-slate-100 text-slate-700'} text-[10px] sm:text-xs capitalize`}>
																{item.priority || 'standard'}
															</Badge>
															<Button
																size="sm"
																variant="outline"
																onClick={() =>
																	window.safeGlobalToast?.({
																		title: 'Ouverture dossier',
																		description: `Le dossier ${item.case_number || item.title || ''} sera ouvert dans la prochaine itération.`
																	})
																}
																className="text-[10px] sm:text-xs h-7 sm:h-8"
															>
																Consulter
															</Button>
														</div>
													</div>
													<div className="mt-2 sm:mt-3">
														<div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
															<span>Progression</span>
															<span>{Math.round(item.progress || 0)}%</span>
														</div>
														<Progress value={Math.min(100, item.progress || 0)} className="h-1 sm:h-1.5 mt-1" />
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="h-40 sm:h-48 flex flex-col items-center justify-center text-xs sm:text-sm text-gray-500">
											<Zap className="h-4 w-4 sm:h-5 sm:w-5 mb-2 text-amber-500" />
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
				<CardHeader className="p-3 sm:p-4 lg:p-6">
					<CardTitle className="text-base sm:text-lg">Performance opérationnelle</CardTitle>
					<CardDescription className="text-xs sm:text-sm">Durée moyenne de traitement et efficacité des équipes</CardDescription>
				</CardHeader>
				<CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
					<div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
						<div className="rounded-lg border p-3 sm:p-4 bg-white shadow-sm">
							<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
								<Clock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" /> <span className="hidden sm:inline">Durée moyenne</span><span className="sm:hidden">Durée</span>
							</div>
							<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{stats.avgCompletionDays || 0} jours</div>
							<p className="text-[10px] sm:text-xs text-gray-500">Comparé à l'objectif de 30 jours</p>
						</div>

						<div className="rounded-lg border p-3 sm:p-4 bg-white shadow-sm">
							<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
								<CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" /> <span className="hidden sm:inline">Actes finalisés</span><span className="sm:hidden">Finalisés</span>
							</div>
							<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{stats.completedCases || 0}</div>
							<p className="text-[10px] sm:text-xs text-gray-500">Sur {stats.totalCases || 0} actes enregistrés</p>
						</div>

						<div className="rounded-lg border p-3 sm:p-4 bg-white shadow-sm">
							<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
								<FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" /> <span className="hidden sm:inline">Documents validés</span><span className="sm:hidden">Docs</span>
							</div>
							<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900">{stats.documentsAuthenticated || 0}</div>
							<p className="text-[10px] sm:text-xs text-gray-500">Authentifications blockchain réussies</p>
						</div>

						<div className="rounded-lg border p-3 sm:p-4 bg-white shadow-sm">
							<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-700">
								<DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" /> <span className="hidden sm:inline">Honoraires moyens</span><span className="sm:hidden">Honoraires</span>
							</div>
							<div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold text-gray-900 truncate">
								{formatCurrency(
									revenueData.length && revenueData[revenueData.length - 1]?.cases
										? (stats.monthlyRevenue || 0) / Math.max(1, revenueData[revenueData.length - 1].cases)
										: stats.monthlyRevenue || 0
								)}
							</div>
							<p className="text-[10px] sm:text-xs text-gray-500">Par acte complété ce mois-ci</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default NotaireOverviewModernized;
