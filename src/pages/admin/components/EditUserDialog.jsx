
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roleOptions = ['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Mairie', 'Banque', 'Notaire', 'Agent Foncier', 'Admin', 'Investisseur', 'Promoteur', 'Agriculteur'].sort();

const EditUserDialog = ({ isOpen, setIsOpen, user, onUserUpdated }) => {
    const [editingUser, setEditingUser] = useState(user);

    useEffect(() => {
        setEditingUser(user);
    }, [user]);

    const handleSubmit = () => {
        onUserUpdated(editingUser);
    };

    if (!editingUser) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Modifier le compte</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="edit_full_name">Nom complet</Label>
                        <Input id="edit_full_name" value={editingUser.full_name || ''} onChange={(e) => setEditingUser(p => ({...p, full_name: e.target.value}))} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit_email">Email</Label>
                        <Input id="edit_email" type="email" value={editingUser.email || ''} onChange={(e) => setEditingUser(p => ({...p, email: e.target.value}))} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit_role">Rôle</Label>
                        <Select onValueChange={(value) => setEditingUser(p => ({...p, role: value}))} value={editingUser.role || ''}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {roleOptions.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button onClick={handleSubmit}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditUserDialog;
