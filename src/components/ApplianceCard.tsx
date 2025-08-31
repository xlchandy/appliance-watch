import { ApplianceWithStatus } from '@/types/appliance';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getRelativeTimeString } from '@/utils/dateUtils';
import { 
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical
} from 'lucide-react';

interface ApplianceCardProps {
  appliance: ApplianceWithStatus;
  onEdit?: (appliance: ApplianceWithStatus) => void;
  onDelete?: (id: string) => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active': return 'default';
    case 'expiring': return 'secondary';
    case 'expired': return 'destructive';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4" />;
    case 'expiring': return <Clock className="h-4 w-4" />;
    case 'expired': return <AlertTriangle className="h-4 w-4" />;
    default: return <CheckCircle className="h-4 w-4" />;
  }
};

export const ApplianceCard = ({ appliance, onEdit, onDelete }: ApplianceCardProps) => {
  return (
    <Card className="p-6 hover:shadow-medium transition-all duration-smooth cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">
            {appliance.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            {appliance.brand} {appliance.model && `• ${appliance.model}`}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Purchased {formatDate(appliance.purchaseDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <Badge 
            variant={getStatusBadgeVariant(appliance.warrantyStatus)}
            className="flex items-center gap-1"
          >
            {getStatusIcon(appliance.warrantyStatus)}
            <span className="capitalize">{appliance.warrantyStatus}</span>
          </Badge>
          <span className="text-sm text-muted-foreground">
            {getRelativeTimeString(appliance.daysUntilExpiry)}
          </span>
        </div>

        {appliance.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {appliance.notes}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(appliance)}
          className="flex-1"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>
    </Card>
  );
};