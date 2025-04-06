import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/organisms/alert';
import { Button } from '@/components/ui/organisms/button';
import { AlertTriangle } from 'lucide-react';

interface PendingApprovalsAlertProps {
  pendingCount: number;
  onViewApprovals: () => void;
}

export const PendingApprovalsAlert: React.FC<PendingApprovalsAlertProps> = ({
  pendingCount,
  onViewApprovals
}) => {
  return (
    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertTitle className="text-amber-800 dark:text-amber-300">Aprovações Pendentes</AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-400">
        Existem {pendingCount} transações aguardando sua aprovação.
        <Button
          variant="link"
          onClick={onViewApprovals}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 p-0 h-auto"
        >
          Ver agora
        </Button>
      </AlertDescription>
    </Alert>
  );
};