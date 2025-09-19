import React from 'react';
import { useAuth } from '@/context/AuthContext';
// useToast import supprimé - utilisation window.safeGlobalToast
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * A guard component that restricts access to its children based on user roles.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render if the user has the required role.
 * @param {string[]} props.allowedRoles - An array of roles allowed to see the content.
 * @param {React.ReactNode} [props.fallback=null] - Optional content to render if the user does not have the required role.
 */
export const Can = ({ children, allowedRoles, fallback = null }) => {
    const { user } = useAuth();
    if (!user || !allowedRoles.includes(user.role)) {
        return fallback;
    }
    return children;
};

/**
 * A HOC (Higher-Order Component) that wraps a page component to restrict access based on roles.
 * Redirects to the dashboard if the role is not allowed.
 * @param {React.ComponentType} Component - The page component to wrap.
 * @param {string[]} allowedRoles - An array of roles allowed to access the page.
 * @returns {React.ComponentType} The wrapped component.
 */
export const withRoleProtection = (Component, allowedRoles) => {
    return (props) => {
        const { user, loading } = useAuth();
        const navigate = useNavigate();
        // toast remplacé par window.safeGlobalToast

        if (loading) {
            return null; // Or a loading spinner
        }

        if (!user || !allowedRoles.includes(user.role)) {
            window.safeGlobalToast({
                variant: 'destructive',
                title: 'Accès non autorisé',
                description: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
            });
            navigate('/dashboard', { replace: true });
            return null;
        }

        return <Component {...props} />;
    };
};

/**
 * A component that wraps interactive elements (like buttons) and disables them if the user's role is forbidden.
 * Shows a tooltip explaining why the action is disabled.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The interactive element to wrap.
 * @param {string[]} props.forbiddenRoles - An array of roles for which the element should be disabled.
 * @param {string} [props.tooltipMessage="Action non autorisée pour votre rôle."] - The message to show in the tooltip.
 */
export const Forbid = ({ children, forbiddenRoles, tooltipMessage = "Action non autorisée pour votre rôle." }) => {
    const { user } = useAuth();
    
    if (user && forbiddenRoles.includes(user.role)) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="w-full">
                            {React.cloneElement(children, { disabled: true, 'aria-disabled': true, style: { pointerEvents: 'none', opacity: 0.6 } })}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltipMessage}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    
    return children;
};
