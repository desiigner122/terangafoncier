
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roleSpecificFields = {
    'Banque': { label: 'Nom de la banque', placeholder: 'Ex: Banque de Dakar' },
    'Mairie': { label: 'Commune', placeholder: 'Sélectionnez une commune' },
    'Agent Foncier': { label: 'Zone de couverture', placeholder: 'Ex: Dakar Plateau, Almadies' },
};

const AddUserWizard = ({ isOpen, setIsOpen, onUserAdded }) => {
    const [step, setStep] = useState(1);
    const initialFormState = { full_name: '', email: '', password: 'password123', role: 'Particulier', region: '', departement: '', commune: '', specificInfo: '' };
    const [currentUser, setCurrentUser] = useState(initialFormState);
    const { toast } = useToast();

    const handleSelectChange = (name, value) => {
        const updates = {[name]: value};
        if(name === 'role') {
            updates.specificInfo = '';
            updates.region = '';
            updates.departement = '';
            updates.commune = '';
        }
        if(name === 'region') {
            updates.departement = '';
            updates.commune = '';
        }
        if(name === 'departement') {
            updates.commune = '';
        }
        setCurrentUser(prev => ({...prev, ...updates}));
    }

    const nextStep = () => {
        if(step === 1 && (!currentUser.full_name || !currentUser.email || !currentUser.password)) {
            toast({ title: 'Erreur', description: 'Nom, email et mot de passe sont requis.', variant: 'destructive'});
            return;
        }
        setStep(s => s + 1);
    }
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        try {
            const { data: { user }, error: signUpError } = await supabase.auth.admin.createUser({
                email: currentUser.email,
                password: currentUser.password,
                email_confirm: true,
                user_metadata: {
                    full_name: currentUser.full_name,
                    user_type: currentUser.role,
                    role: currentUser.role,
                    verification_status: 'verified',
                    company_info: currentUser.role === 'Mairie' ? { region: currentUser.region, departement: currentUser.departement, commune: currentUser.commune } : (roleSpecificFields[currentUser.role] ? { info: currentUser.specificInfo } : null)
                }
            });

            if (signUpError) throw signUpError;
            
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                console.warn("Could not fetch profile for new user, but user was created.", profileError);
            }

            onUserAdded(profile || { id: user.id, ...user.user_metadata });
            toast({ title: 'Succès', description: `Utilisateur ${currentUser.full_name} créé.`});
            setIsOpen(false);
            setCurrentUser(initialFormState);
            setStep(1);
        } catch (error) {
            console.error("Error creating user:", error);
            toast({ title: 'Erreur', description: error.message, variant: 'destructive'});
        }
    };
    

    const [regions, setRegions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Charger les régions au montage
    React.useEffect(() => {
        const fetchRegions = async () => {
            setLoadingRegions(true);
            setFetchError(null);
            try {
                const { data, error } = await supabase.from('regions').select('*');
                if (error) throw error;
                setRegions(data);
            } catch (err) {
                setFetchError(err.message);
                setRegions([]);
            } finally {
                setLoadingRegions(false);
            }
        };
        fetchRegions();
    }, []);

    // Charger les départements quand la région change
    React.useEffect(() => {
        const fetchDepartments = async () => {
            if (!currentUser.region) { setDepartments([]); return; }
            try {
                const { data, error } = await supabase.from('departments').select('*').eq('region', currentUser.region);
                if (error) throw error;
                setDepartments(data);
            } catch (err) {
                setDepartments([]);
            }
        };
        fetchDepartments();
    }, [currentUser.region]);

    // Charger les communes quand le département change
    React.useEffect(() => {
        const fetchCommunes = async () => {
            if (!currentUser.departement) { setCommunes([]); return; }
            try {
                const { data, error } = await supabase.from('communes').select('*').eq('departement', currentUser.departement);
                if (error) throw error;
                setCommunes(data);
            } catch (err) {
                setCommunes([]);
            }
        };
        fetchCommunes();
    }, [currentUser.departement]);

    const regionsOptions = regions.map(r => ({ value: r.name, label: r.name }));
    const departmentsOptions = departments.map(d => ({ value: d.name, label: d.name }));
    const communesOptions = communes.map(c => ({ value: c.name, label: c.name }));


    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setCurrentUser(initialFormState);
                setStep(1);
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau compte</DialogTitle>
                    <DialogDescription>Étape {step} sur 2: {step === 1 ? "Informations de base" : "Détails du rôle"}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-1"><Label htmlFor="full_name">Nom complet</Label><Input id="full_name" name="full_name" value={currentUser.full_name} onChange={(e) => setCurrentUser(p => ({...p, full_name: e.target.value}))} /></div>
                            <div className="space-y-1"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={currentUser.email} onChange={(e) => setCurrentUser(p => ({...p, email: e.target.value}))} /></div>
                            <div className="space-y-1"><Label htmlFor="password">Mot de passe</Label><Input id="password" name="password" type="password" value={currentUser.password} onChange={(e) => setCurrentUser(p => ({...p, password: e.target.value}))} /></div>
                        </div>
                    )}
                     {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-1"><Label htmlFor="role">Rôle</Label>
                                <Select onValueChange={(value) => handleSelectChange('role', value)} value={currentUser.role}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(roleSpecificFields).concat(['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Notaire', 'Agriculteur', 'Investisseur', 'Promoteur']).filter((v, i, a) => a.indexOf(v) === i).sort().map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             {currentUser.role === 'Mairie' ? (
                                 <>
                                    <div className="space-y-1"><Label>Région</Label>
                                        <Select onValueChange={(value) => handleSelectChange('region', value)} value={currentUser.region}>
                                            <SelectTrigger><SelectValue placeholder="Choisir une région"/></SelectTrigger>
                                            <SelectContent>{regionsOptions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    {currentUser.region && <div className="space-y-1"><Label>Département</Label>
                                         <Select onValueChange={(value) => handleSelectChange('departement', value)} value={currentUser.departement} disabled={!departmentsOptions.length}>
                                            <SelectTrigger><SelectValue placeholder="Choisir un département"/></SelectTrigger>
                                            <SelectContent>{departmentsOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>}
                                    {currentUser.departement && <div className="space-y-1"><Label>Commune</Label>
                                         <Select onValueChange={(value) => handleSelectChange('commune', value)} value={currentUser.commune} disabled={!communesOptions.length}>
                                            <SelectTrigger><SelectValue placeholder="Choisir une commune"/></SelectTrigger>
                                            <SelectContent>{communesOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>}
                                 </>
                            ) : roleSpecificFields[currentUser.role] && (
                                <div className="space-y-1">
                                   <Label htmlFor="specificInfo">{roleSpecificFields[currentUser.role].label}</Label>
                                   <Input id="specificInfo" name="specificInfo" value={currentUser.specificInfo} onChange={(e) => setCurrentUser(p => ({...p, specificInfo: e.target.value}))} placeholder={roleSpecificFields[currentUser.role].placeholder}/>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {step === 1 && <Button onClick={nextStep}>Suivant</Button>}
                    {step === 2 && (
                        <>
                            <Button variant="outline" onClick={prevStep}>Précédent</Button>
                            <Button onClick={handleSubmit}>Créer le compte</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddUserWizard;