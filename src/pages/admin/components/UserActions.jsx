
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreVertical, Edit, Trash2, Ban, UserCheck, CheckCircle } from 'lucide-react';

const UserActions = ({ user, onAction, onEdit }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {user.verification_status === 'unverified' && <DropdownMenuItem onClick={() => onAction(user.id, 'verify')}><UserCheck className="mr-2 h-4 w-4 text-green-500" /> Approuver</DropdownMenuItem>}
                <DropdownMenuItem onClick={() => onEdit(user)}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                <DropdownMenuSeparator />
                 {user.verification_status !== 'banned' ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-orange-600 focus:text-orange-600"><Ban className="mr-2 h-4 w-4" /> Bannir</DropdownMenuItem></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Bannir {user.full_name}?</AlertDialogTitle><AlertDialogDescription>Cet utilisateur ne pourra plus se connecter.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction className="bg-orange-600 hover:bg-orange-700" onClick={() => onAction(user.id, 'ban')}>Bannir</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 ) : (
                    <DropdownMenuItem onClick={() => onAction(user.id, 'unban')} className="text-green-600 focus:text-green-600"><CheckCircle className="mr-2 h-4 w-4" /> Débannir</DropdownMenuItem>
                 )}
                <AlertDialog>
                    <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer {user.full_name}?</AlertDialogTitle><AlertDialogDescription>Cette action est irréversible et supprimera définitivement le compte.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onAction(user.id, 'delete')}>Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserActions;
