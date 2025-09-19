import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  UserPlus,
  Eye,
  EyeOff,
  Shield,
  Users,
  Building,
  TrendingUp,
  Home,
  CheckCircle,
  Globe,
  Zap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';

const logoUrl = "/images/logo.png";

const allowedRoles = ['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Investisseur'];

const ModernRegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userType, setUserType] = useState('Particulier');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            setLoading(false);
            return;
        }

        try {
            if (!userType) {
                throw new Error("Veuillez sélectionner un type de compte.");
            }
            
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        user_type: userType,
                        role: userType,
                        verification_status: 'unverified',
                    }
                }
            });

            if (signUpError) throw signUpError;

            window.safeGlobalToast({
                title: "Compte créé avec succès !",
                description: "Vérifiez votre email pour activer votre compte.",
                className: "bg-green-500 text-white",
            });

            navigate('/login');
            
        } catch (err) {
            console.error("Registration error:", err);
            const errorMessage = err.message.includes('User already registered') 
                ? "Un compte existe déjÏ  avec cet email."
                : "Une erreur est survenue lors de la création du compte.";
            setError(errorMessage);
            window.safeGlobalToast({
                title: "Erreur",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { 
            value: 'Particulier', 
            label: 'Particulier', 
            description: 'Je cherche Ï  acheter un terrain',
            icon: Home,
            color: 'from-emerald-500 to-teal-500'
        },
        { 
            value: 'Investisseur', 
            label: 'Investisseur', 
            description: 'Je veux investir dans le foncier',
            icon: TrendingUp,
            color: 'from-blue-500 to-cyan-500'
        },
        { 
            value: 'Vendeur Particulier', 
            label: 'Vendeur Particulier', 
            description: 'Je veux vendre mon terrain',
            icon: Users,
            color: 'from-purple-500 to-indigo-500'
        },
        { 
            value: 'Vendeur Pro', 
            label: 'Vendeur Professionnel', 
            description: 'Je suis un professionnel de l\'immobilier',
            icon: Building,
            color: 'from-orange-500 to-red-500'
        }
    ];

    const benefits = [
        "Accès immédiat Ï  2,500+ terrains",
        "Vérification juridique incluse",
        "Paiements sécurisés et flexibles",
        "Support client dédié 24/7",
        "Outils d'investissement avancés"
    ];

    return (
        <>
            <Helmet>
                <title>Créer un Compte - Rejoignez Teranga Foncier</title>
                <meta name="description" content="Créez votre compte Teranga Foncier et accédez Ï  la plus grande plateforme foncière du Sénégal. Inscription gratuite et sécurisée." />
                <meta name="keywords" content="inscription Teranga Foncier, créer compte, acheter terrain Sénégal, investissement foncier" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 flex">
                {/* Section gauche - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-600 p-12 flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3 mb-8">
                            <img src={logoUrl} alt="Teranga Foncier" className="w-12 h-12" />
                            <div>
                                <span className="text-2xl font-bold text-white">Teranga Foncier</span>
                                <div className="text-emerald-200 text-sm">Rejoignez la révolution foncière</div>
                            </div>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                Rejoignez plus de 
                                <span className="text-emerald-200"> 1,200 investisseurs</span>
                            </h1>
                            
                            <p className="text-xl text-emerald-100 leading-relaxed">
                                Créez votre compte gratuitement et accédez Ï  la plus grande plateforme 
                                foncière du Sénégal. Achetez, vendez et investissez en toute sécurité.
                            </p>

                            <div className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-emerald-200" />
                                        <span className="text-white">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-6">
                                <Badge className="bg-white/20 text-white border-white/30">
                                    <Zap className="w-4 h-4 mr-1" />
                                    Inscription Gratuite
                                </Badge>
                            </div>
                        </motion.div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                        className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center"
                    >
                        <Globe className="w-10 h-10 text-white" />
                    </motion.div>
                </div>

                {/* Section droite - Formulaire */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full max-w-md"
                    >
                        {/* Logo mobile */}
                        <div className="lg:hidden text-center mb-8">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <img src={logoUrl} alt="Teranga Foncier" className="w-10 h-10" />
                                <div>
                                    <span className="text-xl font-bold text-gray-900">Teranga Foncier</span>
                                    <div className="text-emerald-600 text-sm">Inscription</div>
                                </div>
                            </Link>
                        </div>

                        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center space-y-2">
                                <CardTitle className="text-2xl font-bold text-gray-900">Créer votre compte</CardTitle>
                                <CardDescription className="text-gray-600">
                                    Rejoignez la communauté Teranga Foncier gratuitement
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-gray-700">Nom complet</Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="Votre nom complet"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            disabled={loading}
                                            className="h-12 border-gray-200 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700">Adresse email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="nom@exemple.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            className="h-12 border-gray-200 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="userType" className="text-gray-700">Type de compte</Label>
                                        <Select value={userType} onValueChange={setUserType} required>
                                            <SelectTrigger className="h-12 border-gray-200 focus:border-emerald-500">
                                                <SelectValue placeholder="Sélectionnez votre profil" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleOptions.map((role) => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        <div className="flex items-center gap-3 py-2">
                                                            <role.icon className="w-4 h-4 text-emerald-600" />
                                                            <div>
                                                                <div className="font-medium">{role.label}</div>
                                                                <div className="text-xs text-gray-500">{role.description}</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Minimum 6 caractères"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={loading}
                                                className="h-12 border-gray-200 focus:border-emerald-500 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-gray-700">Confirmer le mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirmez votre mot de passe"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                disabled={loading}
                                                className="h-12 border-gray-200 focus:border-emerald-500 pr-12"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                                        >
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                            <span className="text-sm text-red-700">{error}</span>
                                        </motion.div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Création en cours...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <UserPlus className="w-4 h-4" />
                                                Créer mon compte
                                            </div>
                                        )}
                                    </Button>
                                </form>

                                <Separator />

                                <div className="text-center space-y-3">
                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                        <h3 className="font-medium text-gray-900 mb-2">Vous êtes un professionnel ?</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Promoteur, Banque, Notaire, Géomètre, Agent Foncier, Municipalité
                                        </p>
                                        <Link 
                                            to="/contact" 
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Nous contacter
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                <Separator />

                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Vous avez déjÏ  un compte ?{' '}
                                        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                            Se connecter
                                        </Link>
                                    </p>
                                </div>

                                <Separator />

                                <div className="text-center space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Préférez une inscription guidée ?
                                    </p>
                                    <Link 
                                        to="/register-steps" 
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Inscription en étapes blockchain
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                        En créant un compte, vous acceptez nos{' '}
                                        <Link to="/legal" className="text-emerald-600 hover:underline">conditions d'utilisation</Link>{' '}
                                        et notre{' '}
                                        <Link to="/privacy" className="text-emerald-600 hover:underline">politique de confidentialité</Link>.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6 text-center">
                            <Link 
                                to="/" 
                                className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
                            >
                                â† Retour Ï  l'accueil
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default ModernRegisterPage;

