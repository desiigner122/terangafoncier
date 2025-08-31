
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const UserFilters = ({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, statusFilter, setStatusFilter, users }) => {
    return (
        <Card className="mb-6">
            <CardHeader><CardTitle>Filtres de recherche</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Rechercher par nom, email..." 
                        className="pl-8 w-full" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger><SelectValue placeholder="Filtrer par rôle" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les rôles</SelectItem>
                        {[...new Set(users.map(u => u.role))].sort().map(role => role && <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
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
    );
};

export default UserFilters;
