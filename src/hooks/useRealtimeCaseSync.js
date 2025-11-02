/**
 * Custom hook for real-time synchronization of purchase cases
 * Auto-subscribes to purchase_cases and purchase_case_documents changes
 * Triggers reload callback on any change
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useRealtimeCaseSync = (caseId, onDataChange, dependencies = []) => {
  const subscriptionsRef = useRef([]);

  useEffect(() => {
    if (!caseId) return;

    try {
      // Subscribe to purchase_cases updates
      const caseChannel = supabase
        .channel(`realtime:purchase_cases:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_cases',
            filter: `id=eq.${caseId}`
          },
          () => {
            console.log('📡 Realtime: purchase_cases changed');
            onDataChange?.();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Subscribed to purchase_cases realtime');
          }
        });

      subscriptionsRef.current.push(caseChannel);

      // Subscribe to purchase_case_documents updates
      const docsChannel = supabase
        .channel(`realtime:purchase_case_documents:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_case_documents',
            filter: `case_id=eq.${caseId}`
          },
          () => {
            console.log('📡 Realtime: purchase_case_documents changed');
            onDataChange?.();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Subscribed to purchase_case_documents realtime');
          }
        });

      subscriptionsRef.current.push(docsChannel);

      // Subscribe to purchase_case_messages updates (for messaging)
      const msgChannel = supabase
        .channel(`realtime:purchase_case_messages:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_case_messages',
            filter: `case_id=eq.${caseId}`
          },
          () => {
            console.log('📡 Realtime: purchase_case_messages changed');
            onDataChange?.();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Subscribed to purchase_case_messages realtime');
          }
        });

      subscriptionsRef.current.push(msgChannel);

      // Subscribe to purchase_case_timeline updates (for timeline/audit trail)
      const timelineChannel = supabase
        .channel(`realtime:purchase_case_timeline:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_case_timeline',
            filter: `case_id=eq.${caseId}`
          },
          () => {
            console.log('📡 Realtime: purchase_case_timeline changed');
            onDataChange?.();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Subscribed to purchase_case_timeline realtime');
          }
        });

      subscriptionsRef.current.push(timelineChannel);

      // Subscribe to purchase_case_history updates (for status history)
      const historyChannel = supabase
        .channel(`realtime:purchase_case_history:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_case_history',
            filter: `case_id=eq.${caseId}`
          },
          () => {
            console.log('📡 Realtime: purchase_case_history changed');
            onDataChange?.();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Subscribed to purchase_case_history realtime');
          }
        });

      subscriptionsRef.current.push(historyChannel);

      // Subscribe to notaire_case_assignments updates (for notary workflow)
      const assignmentChannel = supabase
        .channel(`realtime:notaire_case_assignments:${caseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notaire_case_assignments',
            filter: `case_id=eq.${caseId}`
          },
          () => {
            console.log('📡 Realtime: notaire_case_assignments changed');
            onDataChange?.();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Subscribed to notaire_case_assignments realtime');
          }
        });

      subscriptionsRef.current.push(assignmentChannel);

      return () => {
        // Cleanup all subscriptions on unmount or dependency change
        subscriptionsRef.current.forEach((channel) => {
          try {
            supabase.removeChannel(channel);
          } catch (_) {
            // ignore cleanup errors
          }
        });
        subscriptionsRef.current = [];
      };
    } catch (error) {
      console.warn('⚠️ Realtime subscription setup error:', error);
      // Non-blocking: app works without realtime
    }
  }, [caseId, ...dependencies]);
};

export default useRealtimeCaseSync;
