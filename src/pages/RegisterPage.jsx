
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { motion } from 'framer-motion';
import { 
  UserPlus
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/customSupabaseClient';

const allowedRoles = ['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Investisseur'];

const RegisterPage = () => {
    const navigate = useNavigate();
    // toast remplacÃ© par window.safeGlobalToast
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [userType, setUserType] = useState('Particulier');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
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
                title: "Inscription presque terminée!",
                description: "Veuillez consulter vos emails pour confirmer votre compte.",
                className: "bg-green-500 text-white",
            });
            navigate('/login'); 
        } catch (err) {
            let errorMessage = err.message || "Une erreur est survenue.";
            if (err.message?.includes('User already registered')) {
                errorMessage = "Un utilisateur avec cet email existe déjà.";
            }
            setError(errorMessage);
            window.safeGlobalToast({
                title: "Erreur d'inscription",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Inscription - Créez votre compte sur Teranga Foncier</title>
                <meta name="description" content="Rejoignez Teranga Foncier en créant un compte. Accédez à des services fonciers sécurisés pour trouver, acheter ou vendre le terrain de vos rêves." />
                <link rel="canonical" href="https://www.terangafoncier.com/register" />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center min-h-screen bg-muted/40 p-4"
            >
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        <UserPlus className="mx-auto h-10 w-10 text-primary" />
                        <CardTitle className="text-2xl font-bold">Créer un Compte</CardTitle>
                        <CardDescription>Rejoignez la révolution foncière au Sénégal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Nom complet</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    YOUR_API_KEY="Ex: Moussa Diop"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    YOUR_API_KEY="nom@exemple.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    YOUR_API_KEY="Minimum 6 caractères"
                                    minLength="6"
                                />
                            </div>
                            <div>
                                <Label htmlFor="userType">Type de compte</Label>
                                <Select onValueChange={setUserType} value={userType}>
                                    <SelectTrigger id="userType">
                                        <SelectValue YOUR_API_KEY="Sélectionnez un type de compte" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allowedRoles.map(role => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <p className="text-xs text-muted-foreground pt-2">
                                En créant un compte, vous acceptez nos <Link to="/legal" className="underline">Conditions d'Utilisation</Link>. 
                                Pour les autres rôles professionnels (Mairie, Notaire, Banque...), veuillez <Link to="/contact" className="underline">nous contacter</Link>.
                            </p>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Création en cours...' : "S'inscrire"}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Déjà un compte?{' '}
                            <Link to="/login" className="underline text-primary hover:text-primary/80">
                                Se connecter
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default RegisterPage;
