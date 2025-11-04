/**
 * @file AIValidationBadge.jsx
 * @description Badge de statut validation IA pour documents
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Sparkles, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AIValidationBadge = ({ 
  status, 
  score, 
  issues = [], 
  size = 'default',
  showScore = true,
  showTooltip = true 
}) => {
  // Configuration selon statut
  const getConfig = () => {
    switch (status) {
      case 'valid':
        return {
          icon: CheckCircle2,
          label: 'Validé par IA',
          color: 'bg-green-100 text-green-800 border-green-300',
          iconColor: 'text-green-600',
          description: 'Document authentique confirmé par l\'Intelligence Artificielle'
        };
      
      case 'invalid':
        return {
          icon: XCircle,
          label: 'Invalide',
          color: 'bg-red-100 text-red-800 border-red-300',
          iconColor: 'text-red-600',
          description: 'Document rejeté par l\'IA - Vérification manuelle requise'
        };
      
      case 'pending':
        return {
          icon: Clock,
          label: 'En attente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          iconColor: 'text-yellow-600',
          description: 'Validation IA en cours de traitement'
        };
      
      case 'warning':
        return {
          icon: AlertTriangle,
          label: 'Attention',
          color: 'bg-orange-100 text-orange-800 border-orange-300',
          iconColor: 'text-orange-600',
          description: 'Anomalies détectées - Vérification recommandée'
        };
      
      case 'not_validated':
      default:
        return {
          icon: Sparkles,
          label: 'Non validé',
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          iconColor: 'text-gray-600',
          description: 'Document en attente de validation IA'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  // Taille du badge
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  // Badge simple
  const badgeContent = (
    <Badge 
      className={`${config.color} ${sizeClasses[size]} border font-medium flex items-center gap-1.5 cursor-default`}
      variant="outline"
    >
      <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
      <span>{config.label}</span>
      
      {showScore && score !== null && score !== undefined && (
        <span className="ml-1 font-bold">
          {Math.round(score)}%
        </span>
      )}
    </Badge>
  );

  // Avec tooltip
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <p className="font-semibold">Validation IA Teranga</p>
              </div>
              
              <p className="text-sm text-gray-600">{config.description}</p>
              
              {score !== null && score !== undefined && (
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-gray-600">Score de confiance:</span>
                  <span className="font-bold text-purple-600">{Math.round(score)}%</span>
                </div>
              )}
              
              {issues && issues.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-semibold text-red-600 mb-1">
                    Problèmes détectés:
                  </p>
                  <ul className="text-xs text-red-600 space-y-1">
                    {issues.slice(0, 3).map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                    {issues.length > 3 && (
                      <li className="text-gray-600">... et {issues.length - 3} autre(s)</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Sans tooltip
  return badgeContent;
};

// Badge compact pour listes
export const AIValidationIcon = ({ status, score }) => {
  const getConfig = () => {
    switch (status) {
      case 'valid':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
      case 'invalid':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'warning':
        return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' };
      default:
        return { icon: Sparkles, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${config.bg} ${config.color} p-1.5 rounded-full cursor-default inline-flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            Validation IA: {score !== null && score !== undefined ? `${Math.round(score)}%` : 'N/A'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Badge pour affichage dans cartes
export const AIValidationCard = ({ status, score, issues, onRevalidate }) => {
  const config = {
    valid: {
      title: 'Document Validé',
      description: 'Authentifié par l\'IA Teranga',
      color: 'border-green-200 bg-green-50'
    },
    invalid: {
      title: 'Document Invalide',
      description: 'Problèmes détectés par l\'IA',
      color: 'border-red-200 bg-red-50'
    },
    warning: {
      title: 'Attention Requise',
      description: 'Anomalies mineures détectées',
      color: 'border-orange-200 bg-orange-50'
    }
  }[status] || {
    title: 'Non Validé',
    description: 'En attente de validation IA',
    color: 'border-gray-200 bg-gray-50'
  };

  return (
    <div className={`${config.color} border-2 rounded-lg p-3`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AIValidationIcon status={status} score={score} />
            <h4 className="font-semibold text-sm">{config.title}</h4>
          </div>
          <p className="text-xs text-gray-600">{config.description}</p>
        </div>
        
        {score !== null && score !== undefined && (
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{Math.round(score)}%</p>
            <p className="text-xs text-gray-600">Confiance</p>
          </div>
        )}
      </div>

      {issues && issues.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs font-semibold text-red-600 mb-1">Problèmes:</p>
          <ul className="text-xs text-red-600 space-y-0.5">
            {issues.slice(0, 2).map((issue, i) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {onRevalidate && (
        <button
          onClick={onRevalidate}
          className="mt-3 w-full text-xs bg-white border border-gray-300 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          Revalider avec l'IA
        </button>
      )}
    </div>
  );
};

export default AIValidationBadge;
