
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, ShieldOff, Ban } from 'lucide-react';
import UserActions from './UserActions';

const getStatusBadge = (status) => {
    switch (status) {
        case 'verified': return <Badge variant="success" className="capitalize"><CheckCircle className="mr-1 h-3 w-3"/>Vérifié</Badge>;
        case 'pending': return <Badge variant="warning" className="capitalize"><Clock className="mr-1 h-3 w-3"/>En attente</Badge>;
        case 'rejected': return <Badge variant="destructive" className="capitalize"><AlertTriangle className="mr-1 h-3 w-3"/>Rejeté</Badge>;
        case 'banned': return <Badge variant="destructive" className="capitalize"><Ban className="mr-1 h-3 w-3"/>Banni</Badge>;
        case 'unverified': return <Badge variant="outline" className="capitalize"><ShieldOff className="mr-1 h-3 w-3"/>Non Vérifié</Badge>;
        default: return <Badge variant="secondary" className="capitalize">{status}</Badge>;
    }
};

const UserTable = ({ users, onAction, onEdit }) => {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rôle</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Statut</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inscrit le</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-foreground">{user.full_name}</div>
                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.verification_status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <UserActions user={user} onAction={onAction} onEdit={onEdit} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserTable;
