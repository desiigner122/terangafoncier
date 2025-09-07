import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
	ArrowRight, TrendingUp, Users, Shield, Star, Play, MapPin, Building, Blocks, Rocket, BarChart3, Globe, Sparkles, Eye, DollarSign, 
	Smartphone, Camera, MessageSquare, CreditCard, Lock, Award, Zap, Search, FileText, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const metricsData = [
	{ label: "Terrains Disponibles", value: "2,847", trend: "+12.5%", icon: Building, color: "text-green-400" },
	{ label: "Investisseurs Actifs", value: "8,291", trend: "+8.2%", icon: Users, color: "text-blue-400" },
	{ label: "Volume Total", value: "14.2B", suffix: " CFA", trend: "+23.1%", icon: BarChart3, color: "text-purple-400" },
	{ label: "Projets Complétés", value: "456", trend: "+5.8%", icon: Star, color: "text-yellow-400" },
	{ label: "Taux de Réussite", value: "98.7", suffix: "%", trend: "+0.3%", icon: Shield, color: "text-emerald-400" },
	{ label: "Pays Couverts", value: "12", trend: "+2", icon: Globe, color: "text-cyan-400" },
	{ label: "Tokens NFT", value: "3,214", trend: "+45.2%", icon: Blocks, color: "text-orange-400" },
	{ label: "ROI Moyen", value: "18.5", suffix: "%", trend: "+2.1%", icon: TrendingUp, color: "text-pink-400" }
];

const ModernHomePage = () => {
	return (
		<>
			<Helmet>
				<title>Teranga Foncier - Blockchain Immobilier Sénégal</title>
				<meta name="description" content="Investissez dans l'immobilier sénégalais avec la blockchain. Terrains, construction, NFT." />
			</Helmet>

			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
				{/* Barre de Métriques Défilante */}
				<div className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 py-3 overflow-hidden">
					<div className="flex animate-scroll">
						{[...metricsData, ...metricsData].map((metric, index) => {
							const IconComponent = metric.icon;
							return (
								<div key={index} className="flex items-center mx-8 whitespace-nowrap">
									<IconComponent className={`h-4 w-4 mr-2 ${metric.color}`} />
									<span className="text-slate-200 text-sm font-medium mr-2">{metric.label}:</span>
									<span className="text-white font-bold mr-1">{metric.value}{metric.suffix || ''}</span>
									<span className={`text-xs font-medium ${metric.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{metric.trend}</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Hero Section */}
				<section className="relative py-24 overflow-hidden">
					<div className="container mx-auto px-4 relative z-10">
						<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
							<Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-red-500 text-white border-0 px-6 py-2 text-lg">🇸🇳 Powered by Blockchain</Badge>
							<h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-green-200 bg-clip-text text-transparent leading-tight">
								L'Immobilier Sénégalais
								<span className="block text-4xl lg:text-6xl">Réinventé</span>
							</h1>
							<p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
								Investissez dans des terrains au Sénégal avec la sécurité de la blockchain, la transparence des smart contracts et l'innovation de l'IA.
							</p>
							<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
								<Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl border-0">
									<Link to="/terrains">Explorer les Terrains<Building className="ml-2 h-5 w-5" /></Link>
								</Button>
								<Button asChild variant="outline" size="lg" className="border-slate-400 text-slate-200 hover:bg-slate-800 hover:text-white backdrop-blur-sm px-8 py-6 text-lg font-semibold">
									<Link to="/blockchain"><Play className="mr-2 h-5 w-5" />Voir la Blockchain</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				</section>

				{/* Aperçu des Fonctionnalités Principales */}
				<section className="py-20 bg-slate-800/20 backdrop-blur-lg">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center mb-16"
						>
							<h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
								Fonctionnalités <span className="text-yellow-400">Innovantes</span>
							</h2>
							<p className="text-xl text-slate-300 max-w-2xl mx-auto">
								Découvrez les outils révolutionnaires qui transforment l'expérience immobilière
							</p>
						</motion.div>

						<div className="grid lg:grid-cols-3 gap-8 mb-16">
							{[
								{
									title: "Terrains Blockchain",
									description: "Explorez notre catalogue de terrains authentifiés par blockchain avec titres NFT sécurisés.",
									icon: Building,
									link: "/terrains",
									color: "from-blue-500 to-cyan-500",
									features: ["2,847 terrains vérifiés", "Titres NFT authentiques", "Géolocalisation précise"]
								},
								{
									title: "Surveillance IA",
									description: "Suivez vos projets de construction en temps réel grâce à l'intelligence artificielle.",
									icon: Eye,
									link: "/surveillance",
									color: "from-purple-500 to-pink-500",
									features: ["Monitoring 24/7", "Alertes en temps réel", "Rapports automatiques"]
								},
								{
									title: "Paiements Sécurisés",
									description: "Effectuez vos transactions avec notre système de paiement blockchain sécurisé.",
									icon: Shield,
									link: "/paiements",
									color: "from-green-500 to-emerald-500",
									features: ["Smart contracts", "Escrow automatique", "Multi-devises"]
								}
							].map((feature, index) => {
								const IconComponent = feature.icon;
								return (
									<motion.div
										key={feature.title}
										initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
										whileInView={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.8, delay: index * 0.1 }}
									>
										<Link to={feature.link}>
											<Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
												<CardContent className="p-8">
													<div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
														<IconComponent className="h-8 w-8 text-white" />
													</div>
													<h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
													<p className="text-slate-300 mb-6 leading-relaxed">{feature.description}</p>
													<div className="space-y-2">
														{feature.features.map((feat, idx) => (
															<div key={idx} className="flex items-center text-sm text-slate-400">
																<Star className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
																{feat}
															</div>
														))}
													</div>
													<ArrowRight className="h-5 w-5 text-slate-400 mt-4 group-hover:text-white transition-colors duration-300" />
												</CardContent>
											</Card>
										</Link>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Services par Type d'Utilisateur */}
				<section className="py-20">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center mb-16"
						>
							<h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
								Solutions <span className="text-green-400">Personnalisées</span>
							</h2>
							<p className="text-xl text-slate-300 max-w-2xl mx-auto">
								Des services adaptés à chaque profil d'investisseur immobilier
							</p>
						</motion.div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
							{[
								{ title: "Particuliers", description: "Investissement personnel", icon: Users, link: "/particuliers", color: "from-blue-500 to-cyan-500", badge: "Populaire" },
								{ title: "Diaspora", description: "Investissement à distance", icon: Globe, link: "/diaspora", color: "from-green-500 to-emerald-500", badge: "International" },
								{ title: "Promoteurs", description: "Développement de projets", icon: Building, link: "/promoteurs", color: "from-purple-500 to-pink-500", badge: "Professionnel" },
								{ title: "Mairies", description: "Gestion territoriale", icon: MapPin, link: "/mairies", color: "from-yellow-500 to-orange-500", badge: "Institutionnel" },
								{ title: "Banques", description: "Financement immobilier", icon: DollarSign, link: "/banques", color: "from-red-500 to-pink-500", badge: "Financier" },
								{ title: "Agents", description: "Intermédiation immobilière", icon: Star, link: "/agents", color: "from-indigo-500 to-purple-500", badge: "Expert" }
							].map((service, index) => {
								const IconComponent = service.icon;
								return (
									<motion.div
										key={service.title}
										initial={{ opacity: 0, scale: 0.8 }}
										whileInView={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
									>
										<Link to={service.link}>
											<Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-lg hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden">
												<div className="absolute top-4 right-4">
													<Badge className={`text-xs bg-gradient-to-r ${service.color} text-white border-0`}>
														{service.badge}
													</Badge>
												</div>
												<CardContent className="p-8 text-center">
													<div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
														<IconComponent className="h-8 w-8 text-white" />
													</div>
													<h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
													<p className="text-slate-400 text-sm mb-4">{service.description}</p>
													<ArrowRight className="h-5 w-5 text-slate-400 mx-auto group-hover:text-white transition-colors duration-300" />
												</CardContent>
											</Card>
										</Link>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Technologies Blockchain */}
				<section className="py-20 bg-slate-800/20 backdrop-blur-lg">
					<div className="container mx-auto px-4">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center mb-16"
						>
							<h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
								Technologie <span className="text-orange-400">Blockchain</span>
							</h2>
							<p className="text-xl text-slate-300 max-w-2xl mx-auto">
								L'innovation au service de la transparence et de la sécurité immobilière
							</p>
						</motion.div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							{[
								{ title: "NFT Titres", icon: Blocks, description: "Propriété authentifiée", stat: "3,214 titres" },
								{ title: "Smart Contracts", icon: Lock, description: "Contrats automatisés", stat: "892 contrats" },
								{ title: "IA Surveillance", icon: Eye, description: "Monitoring intelligent", stat: "97.8% précision" },
								{ title: "Paiements Crypto", icon: CreditCard, description: "Transactions sécurisées", stat: "14.2B CFA volume" }
							].map((tech, index) => {
								const IconComponent = tech.icon;
								return (
									<motion.div
										key={tech.title}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.6, delay: index * 0.1 }}
									>
										<Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-lg hover:scale-105 transition-all duration-300 text-center">
											<CardContent className="p-6">
												<div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
													<IconComponent className="h-6 w-6 text-white" />
												</div>
												<h3 className="text-lg font-bold text-white mb-2">{tech.title}</h3>
												<p className="text-slate-400 text-sm mb-3">{tech.description}</p>
												<Badge className="bg-orange-500/20 text-orange-400 border-0 text-xs">
													{tech.stat}
												</Badge>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Call to Action Final */}
				<section className="py-24 relative overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-green-500/10 to-red-500/10"></div>
					
					<div className="container mx-auto px-4 relative z-10">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8 }}
							className="text-center max-w-4xl mx-auto"
						>
							<h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
								Prêt à Investir dans
								<span className="block bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
									l'Avenir du Sénégal ?
								</span>
							</h2>
							
							<p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed">
								Rejoignez plus de <strong>8,000+</strong> investisseurs qui transforment l'immobilier sénégalais avec la blockchain.
							</p>
							
							<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
								<Button 
									asChild
									size="lg"
									className="bg-gradient-to-r from-yellow-500 via-green-500 to-red-500 hover:from-yellow-600 hover:via-green-600 hover:to-red-600 text-white font-bold px-12 py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl border-0"
								>
									<Link to="/register">
										Commencer Maintenant
										<Rocket className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								
								<Button 
									asChild
									variant="outline" 
									size="lg"
									className="border-slate-400 text-slate-200 hover:bg-slate-800 hover:text-white backdrop-blur-sm px-8 py-6 text-lg font-semibold"
								>
									<Link to="/demo">
										<Sparkles className="mr-2 h-5 w-5" />
										Voir la Démo
									</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				</section>
			</div>
			<style>
				{`
				@keyframes scroll {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
				.animate-scroll {
					animation: scroll 30s linear infinite;
				}
				`}
			</style>
		</>
	);
};

export default ModernHomePage;
