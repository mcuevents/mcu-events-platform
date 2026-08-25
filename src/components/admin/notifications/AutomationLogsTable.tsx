'use client';

import React, { useState } from 'react';
import { NotificationLog } from '@/types/automation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RefreshCw, CheckCircle2, XCircle, Clock, Mail, MessageCircle, AlertTriangle } from 'lucide-react';

interface AutomationLogsTableProps {
  logs: NotificationLog[];
  onRetry: (logId: string) => Promise<void>;
}

export const AutomationLogsTable: React.FC<AutomationLogsTableProps> = ({ logs, onRetry }) => {
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    await onRetry(id);
    setRetryingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-dark-950/80 rounded-2xl border border-dark-800 overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-dark-800 bg-dark-900/80 text-dark-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Template / Type</th>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Channel</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Dispatched At</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800/60 text-dark-200">
            {logs.map((log) => {
              const isEmail = log.channel === 'email';
              const isSent = log.status === 'sent';
              const isFailed = log.status === 'failed';

              return (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white block capitalize font-mono text-[11px]">
                        {log.notificationType.replace(/_/g, ' ')}
                      </span>
                      {log.idempotencyKey && (
                        <span className="text-[10px] text-dark-500 font-mono block">
                          ID: {log.idempotencyKey}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-dark-300">{log.recipient}</td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-dark-900 border border-dark-800 text-dark-300">
                      {isEmail ? (
                        <Mail className="h-3 w-3 text-blue-400" />
                      ) : (
                        <MessageCircle className="h-3 w-3 text-emerald-400" />
                      )}
                      {isEmail ? 'Email' : 'WhatsApp'}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {isSent && (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Sent
                        </span>
                      )}
                      {isFailed && (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                          <XCircle className="h-3.5 w-3.5" /> Failed
                        </span>
                      )}
                      {log.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}

                      {log.errorMessage && (
                        <p className="text-[10px] text-red-400 max-w-xs leading-tight">
                          {log.errorMessage}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-dark-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {new Date(log.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {isFailed ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(log.id)}
                        isLoading={retryingId === log.id}
                        leftIcon={<RefreshCw className="h-3 w-3" />}
                      >
                        Retry
                      </Button>
                    ) : (
                      <span className="text-[11px] text-dark-500 font-mono">Retries: {log.retryCount}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
