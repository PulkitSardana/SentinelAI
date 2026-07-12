import { create } from 'zustand';
import { UserRole } from './use-auth-store';

export type AuditAction = 
  | 'VIEWED_PII' 
  | 'REQUESTED_OVERRIDE' 
  | 'APPROVED_OVERRIDE' 
  | 'REJECTED_OVERRIDE'
  | 'ASSIGNED_CASE'
  | 'ESCALATED_CASE'
  | 'CLOSED_CASE';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: AuditAction;
  targetId: string; // The ID of the transaction or case
  justification?: string;
}

interface AuditState {
  logs: AuditLog[];
  logAction: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogsForTarget: (targetId: string) => AuditLog[];
}

export const useAuditStore = create<AuditState>((set, get) => ({
  logs: [],
  logAction: (log) => {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ logs: [newLog, ...state.logs] }));
  },
  getLogsForTarget: (targetId) => {
    return get().logs.filter(log => log.targetId === targetId);
  }
}));
