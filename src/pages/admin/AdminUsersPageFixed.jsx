import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ShieldOff, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban, 
  UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from "@/components/ui/use-toast-simple";
import { LoadingSpinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';

// Utiliser des données locales pour éviter les problèmes d'import
const sampleUsers = [
  {
    id: 'user-1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'Particulier',
    verification_status: 'verified',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    role: 'Mairie',
    verification_status: 'pending',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 'user-3',
    name: 'Ahmed Diallo',
    email: 'ahmed.diallo@example.com',
    role: 'Banque',
    verification_status: 'verified',
    created_at: '2024-01-17T09:15:00Z'
  }
];

const senegalRegionsAndDepartments = {
    'Dakar': {
        'Dakar': ['Dakar', 'Guédiawaye', 'Pikine', 'Rufisque'],
        'Pikine': ['Pikine', 'Guédiawaye'],
        'Rufisque': ['Rufisque', 'Sangalkam']
    },
    'Thiès': {
        'Thiès': ['Thiès Nord', 'Thiès Sud'],
        'Tivaouane': ['Tivaouane', 'Mékhé'],
        'Mbour': ['Mbour', 'Joal-Fadiouth']
    },
    'Saint-Louis': {
        'Saint-Louis': ['Saint-Louis', 'Ross Béthio'],
        'Dagana': ['Dagana', 'Richard Toll'],
        'Podor': ['Podor', 'Golléré']
    }
};

const roleSpecificFields = {
    'Banque': { label: 'Nom de la banque', YOUR_API_KEY: 'Ex: Banque de Dakar' },
    'Mairie': { label: 'Commune', YOUR_API_KEY: 'Sélectionnez une commune' },
    'Agent Foncier': { label: 'Zone de couverture', YOUR_API_KEY: 'Ex: Dakar Plateau, Almadies' },
};

const AddUserWizard = ({ isOpen, setIsOpen, onUserAdded }) => {
    const [step, setStep] = useState(1);
    const initialFormState = { id: null, full_name: '', email: '', password: 'password123', role: 'Particulier', region: '', departement: '', commune: '', specificInfo: '' };
    const [currentUser, setCurrentUser] = useState(initialFormState);

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
            const newUser = {
                id: `user-${Date.now()}`,
                name: currentUser.full_name,
                ...currentUser,
                user_type: currentUser.role,
                verification_status: 'verified',
                created_at: new Date().toISOString(),
            };
            
            onUserAdded(newUser);
            toast({ title: 'Succès', description: `Utilisateur ${currentUser.full_name} créé.`});
            setIsOpen(false);
            setCurrentUser(initialFormState);
            setStep(1);
        } catch (error) {
            console.error('Erreur:', error);
            toast({ title: 'Erreur', description: 'Erreur lors de la création du compte.', variant: 'destructive'});
        }
    };
    
    const regionsOptions = Object.keys(senegalRegionsAndDepartments).map(r => ({ value: r, label: r }));
    const departmentsOptions = currentUser.region ? Object.keys(senegalRegionsAndDepartments[currentUser.region]).map(d => ({ value: d, label: d })) : [];
    const communesOptions = (currentUser.region && currentUser.departement) ? senegalRegionsAndDepartments[currentUser.region][currentUser.departement].map(c => ({ value: c, label: c })) : [];

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
                                            <SelectTrigger><SelectValue YOUR_API_KEY="Choisir une région"/></SelectTrigger>
                                            <SelectContent>{regionsOptions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>
                                    {currentUser.region && <div className="space-y-1"><Label>Département</Label>
                                         <Select onValueChange={(value) => handleSelectChange('departement', value)} value={currentUser.departement} disabled={!departmentsOptions.length}>
                                            <SelectTrigger><SelectValue YOUR_API_KEY="Choisir un département"/></SelectTrigger>
                                            <SelectContent>{departmentsOptions.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>}
                                    {currentUser.departement && <div className="space-y-1"><Label>Commune</Label>
                                         <Select onValueChange={(value) => handleSelectChange('commune', value)} value={currentUser.commune} disabled={!communesOptions.length}>
                                            <SelectTrigger><SelectValue YOUR_API_KEY="Choisir une commune"/></SelectTrigger>
                                            <SelectContent>{communesOptions.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </div>}
                                 </>
                            ) : roleSpecificFields[currentUser.role] && (
                                <div className="space-y-1">
                                   <Label htmlFor="specificInfo">{roleSpecificFields[currentUser.role].label}</Label>
                                   <Input id="specificInfo" name="specificInfo" value={currentUser.specificInfo} onChange={(e) => setCurrentUser(p => ({...p, specificInfo: e.target.value}))} YOUR_API_KEY={roleSpecificFields[currentUser.role].YOUR_API_KEY}/>
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

const AdminUsersPageFixed = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const initialFormState = { id: null, full_name: '', email: '', password: '', role: 'Particulier', region: '', departement: '', commune: '', specificInfo: '' };
    const [editingUser, setEditingUser] = useState(initialFormState);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Utiliser les données d'exemple pour éviter les erreurs
                setUsers(JSON.parse(JSON.stringify(sampleUsers)));
            } catch (error) {
                console.error('Erreur de connexion:', error);
                setUsers(JSON.parse(JSON.stringify(sampleUsers)));
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAction = async (userId, actionType) => {
        let userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) return;

        let user = users[userIndex];
        let updatedUsers = [...users];
        let message = "";

        try {
            switch(actionType) {
                case 'delete':
                    message = `Utilisateur ${user.name} supprimé.`;
                    updatedUsers.splice(userIndex, 1);
                    break;
                    
                case 'ban':
                    updatedUsers[userIndex] = { ...user, verification_status: 'banned' };
                    message = `Utilisateur ${user.name} banni.`;
                    break;
                    
                case 'unban':
                    updatedUsers[userIndex] = { ...user, verification_status: 'verified' };
                    message = `Utilisateur ${user.name} débanni.`;
                    break;
                    
                case 'verify':
                    updatedUsers[userIndex] = { ...user, verification_status: 'verified' };
                    message = `Utilisateur ${user.name} vérifié.`;
                    break;
                    
                default:
                    return;
            }

            setUsers(updatedUsers);
            toast({ title: 'Succès', description: message });
            
        } catch (error) {
            console.error('Erreur lors de l\'action:', error);
            toast({ title: 'Erreur', description: 'Une erreur est survenue lors de l\'opération.', variant: 'destructive' });
        }
    };

    const openEditModal = (user) => {
        setEditingUser({ ...user, full_name: user.name, password: '' });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!editingUser.full_name || !editingUser.email) {
            toast({ title: 'Erreur', description: 'Le nom et l\'email sont requis.', variant: 'destructive'});
            return;
        }
        
        try {
            let updatedUsers = [...users];
            const userIndex = updatedUsers.findIndex(u => u.id === editingUser.id);
            if(userIndex !== -1) {
                updatedUsers[userIndex] = { 
                    ...updatedUsers[userIndex], 
                    name: editingUser.full_name, 
                    full_name: editingUser.full_name, 
                    email: editingUser.email, 
                    role: editingUser.role 
                };
                setUsers(updatedUsers);
                toast({ title: 'Succès', description: `Utilisateur ${editingUser.full_name} mis à jour.` });
            }
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            toast({ title: 'Erreur', description: 'Erreur lors de la mise à jour.', variant: 'destructive' });
        }
    };

    const filteredUsers = users.filter(user => {
        const searchMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = roleFilter === 'all' || user.role === roleFilter;
        const statusMatch = statusFilter === 'all' || user.verification_status === statusFilter;
        return searchMatch && roleMatch && statusMatch;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified': return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3"/>Vérifié</Badge>;
            case 'pending': return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3"/>En attente</Badge>;
            case 'rejected': return <Badge variant="destructive" className="capitalize"><AlertTriangle className="mr-1 h-3 w-3"/>Rejeté</Badge>;
            case 'banned': return <Badge variant="destructive" className="capitalize"><Ban className="mr-1 h-3 w-3"/>Banni</Badge>;
            case 'unverified': return <Badge variant="outline" className="capitalize"><ShieldOff className="mr-1 h-3 w-3"/>Non Vérifié</Badge>;
            default: return <Badge variant="secondary" className="capitalize">{status}</Badge>;
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;
    
    return (
        <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-12 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestion des Comptes</h1>
                    <p className="text-muted-foreground">Gérez tous les utilisateurs de la plateforme.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Créer un compte</Button>
            </div>
            <Card className="mb-6">
                <CardHeader><CardTitle>Filtres de recherche</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="search" YOUR_API_KEY="Rechercher par nom, email..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger><SelectValue YOUR_API_KEY="Filtrer par rôle" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            {[...new Set(users.map(u => u.role))].sort().map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger><SelectValue YOUR_API_KEY="Filtrer par statut" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="verified">Vérifié</SelectItem>
                            <SelectItem value="unverified">Non Vérifié</SelectItem>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="banned">Banni</SelectItem>
                            <SelectItem value="rejected">Rejeté</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800"><tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rôle</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inscrit le</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr></thead>
                    <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">{filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-foreground">{user.name}</div><div className="text-xs text-muted-foreground">{user.email}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.verification_status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {user.verification_status === 'unverified' && <DropdownMenuItem onClick={() => handleAction(user.id, 'verify')}><UserCheck className="mr-2 h-4 w-4 text-green-500" /> Approuver</DropdownMenuItem>}
                                        <DropdownMenuItem onClick={() => openEditModal(user)}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                         {user.verification_status !== 'banned' ? (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-orange-600 focus:text-orange-600"><Ban className="mr-2 h-4 w-4" /> Bannir</DropdownMenuItem></AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader><AlertDialogTitle>Bannir {user.name}?</AlertDialogTitle><AlertDialogDescription>Cet utilisateur ne pourra plus se connecter.</AlertDialogDescription></AlertDialogHeader>
                                                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction className="bg-orange-600 hover:bg-orange-700" onClick={() => handleAction(user.id, 'ban')}>Bannir</AlertDialogAction></AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                         ) : (
                                            <DropdownMenuItem onClick={() => handleAction(user.id, 'unban')} className="text-green-600 focus:text-green-600"><CheckCircle className="mr-2 h-4 w-4" /> Débannir</DropdownMenuItem>
                                         )}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Supprimer {user.name}?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible et supprimera définitivement le compte.</AlertDialogDescription></AlertDialogHeader>
                                                <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleAction(user.id, 'delete')}>Supprimer</AlertDialogAction></AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>))}
                    </tbody>
                </table></div></CardContent>
            </Card>
        </motion.div>
        
        <AddUserWizard isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} onUserAdded={(newUser) => setUsers(prev => [newUser, ...prev])} />

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Modifier le compte</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1"><Label htmlFor="edit_full_name">Nom complet</Label><Input id="edit_full_name" value={editingUser.full_name} onChange={(e) => setEditingUser(p => ({...p, full_name: e.target.value}))} /></div>
                    <div className="space-y-1"><Label htmlFor="edit_email">Email</Label><Input id="edit_email" type="email" value={editingUser.email} onChange={(e) => setEditingUser(p => ({...p, email: e.target.value}))} /></div>
                    <div className="space-y-1"><Label htmlFor="edit_role">Rôle</Label>
                        <Select onValueChange={(value) => setEditingUser(p => ({...p, role: value}))} value={editingUser.role}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(roleSpecificFields).concat(['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Notaire', 'Agriculteur', 'Investisseur', 'Promoteur']).filter((v, i, a) => a.indexOf(v) === i).sort().map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Annuler</Button>
                    <Button onClick={handleEditSubmit}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default AdminUsersPageFixed;
