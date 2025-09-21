import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Home } from 'lucide-react';
import { Appliance, ApplianceWithStatus, WarrantyStatus } from '@/types/appliance';
import { getWarrantyStatus } from '@/utils/dateUtils';
import { ApplianceCard } from './ApplianceCard';
import { AddApplianceDialog } from './AddApplianceDialog';
import { ApplianceService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const ApplianceDashboard = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [filteredAppliances, setFilteredAppliances] = useState<ApplianceWithStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarrantyStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load appliances from API on mount
  useEffect(() => {
    loadAppliances();
  }, []);

  const loadAppliances = async () => {
    try {
      setLoading(true);
      const response = await ApplianceService.getAppliances();
      if (response.success && response.data) {
        // Convert API response to frontend format
        const appliancesData = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          model: item.model,
          serialNumber: item.serialNumber,
          purchaseDate: item.purchaseDate.split('T')[0], // Convert to YYYY-MM-DD format
          purchaseLocation: item.purchaseLocation,
          warrantyMonths: item.warrantyMonths,
          warrantyExpiryDate: item.warrantyExpiryDate.split('T')[0], // Convert to YYYY-MM-DD format
          category: item.category,
          notes: item.notes
        }));
        setAppliances(appliancesData);
      } else {
        toast({
          title: "Error",
          description: "Failed to load appliances",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading appliances:', error);
      toast({
        title: "Error",
        description: "Failed to load appliances",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and enhance appliances with warranty status
  useEffect(() => {
    let filtered = appliances.map(appliance => {
      const { status, daysUntilExpiry } = getWarrantyStatus(appliance.warrantyExpiryDate);
      return {
        ...appliance,
        warrantyStatus: status,
        daysUntilExpiry
      };
    });

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(appliance =>
        appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appliance.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appliance.model?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appliance => appliance.warrantyStatus === statusFilter);
    }

    setFilteredAppliances(filtered);
  }, [appliances, searchTerm, statusFilter]);

  const handleAddAppliance = async (newAppliance: Omit<Appliance, 'id'>) => {
    try {
      // Convert frontend format to API format
      const apiData = {
        name: newAppliance.name,
        brand: newAppliance.brand,
        model: newAppliance.model,
        serialNumber: newAppliance.serialNumber,
        purchaseDate: new Date(newAppliance.purchaseDate).toISOString(),
        purchaseLocation: newAppliance.purchaseLocation,
        warrantyMonths: newAppliance.warrantyMonths,
        category: newAppliance.category,
        notes: newAppliance.notes
      };
      
      const response = await ApplianceService.createAppliance(apiData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Appliance added successfully"
        });
        // Reload appliances to get the latest data
        await loadAppliances();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to add appliance",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding appliance:', error);
      toast({
        title: "Error",
        description: "Failed to add appliance",
        variant: "destructive"
      });
    }
  };

  const getStatusCounts = () => {
    const counts = { active: 0, expiring: 0, expired: 0 };
    appliances.forEach(appliance => {
      const { status } = getWarrantyStatus(appliance.warrantyExpiryDate);
      counts[status]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Appliance Tracker</h1>
                <p className="text-sm text-muted-foreground">Manage your home appliances and warranties</p>
              </div>
            </div>
            <AddApplianceDialog onAdd={handleAddAppliance} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Appliances</p>
                <p className="text-2xl font-bold text-foreground">{appliances.length}</p>
              </div>
              <Home className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Warranties</p>
                <p className="text-2xl font-bold text-success">{statusCounts.active}</p>
              </div>
              <Badge variant="default" className="bg-success">Active</Badge>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-warning">{statusCounts.expiring}</p>
              </div>
              <Badge variant="secondary" className="bg-warning text-warning-foreground">Expiring</Badge>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-destructive">{statusCounts.expired}</p>
              </div>
              <Badge variant="destructive">Expired</Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appliances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: WarrantyStatus | 'all') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appliances Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading appliances...</p>
          </div>
        ) : filteredAppliances.length === 0 ? (
          <div className="text-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {appliances.length === 0 ? 'No appliances yet' : 'No appliances match your filters'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {appliances.length === 0 
                ? 'Get started by adding your first appliance to track warranties and maintenance.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {appliances.length === 0 && (
              <AddApplianceDialog onAdd={handleAddAppliance} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliances.map((appliance) => (
              <ApplianceCard
                key={appliance.id}
                appliance={appliance}
                onEdit={(appliance) => {
                  // TODO: Implement edit functionality
                  console.log('Edit appliance:', appliance);
                }}
                onDelete={async (id) => {
                  try {
                    const response = await ApplianceService.deleteAppliance(id);
                    if (response.success) {
                      toast({
                        title: "Success",
                        description: "Appliance deleted successfully"
                      });
                      await loadAppliances();
                    } else {
                      toast({
                        title: "Error",
                        description: "Failed to delete appliance",
                        variant: "destructive"
                      });
                    }
                  } catch (error) {
                    console.error('Error deleting appliance:', error);
                    toast({
                      title: "Error",
                      description: "Failed to delete appliance",
                      variant: "destructive"
                    });
                  }
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};