import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Composant Dialog de confirmation réutilisable
 * Remplace les confirm() natifs par une belle modal
 * 
 * @example
 * const [confirmOpen, setConfirmOpen] = useState(false);
 * 
 * <ConfirmDialog
 *   open={confirmOpen}
 *   onOpenChange={setConfirmOpen}
 *   title="Supprimer la propriété ?"
 *   description="Cette action est irréversible."
 *   onConfirm={() => handleDelete()}
 *   confirmText="Supprimer"
 *   variant="destructive"
 * />
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title = "Êtes-vous sûr ?",
  description = "Cette action ne peut pas être annulée.",
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "default" // "default" | "destructive"
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
