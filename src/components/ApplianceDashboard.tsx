import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Home } from 'lucide-react';
import { Appliance, ApplianceWithStatus, WarrantyStatus } from '@/types/appliance';
import { getWarrantyStatus } from '@/utils/dateUtils';
import { ApplianceCard } from './ApplianceCard';
import { AddApplianceDialog } from './AddApplianceDialog';

export const ApplianceDashboard = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [filteredAppliances, setFilteredAppliances] = useState<ApplianceWithStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarrantyStatus | 'all'>('all');

  // Load appliances from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('appliances');
    if (stored) {
      try {
        setAppliances(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading appliances:', error);
      }
    }
  }, []);

  // Save appliances to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appliances', JSON.stringify(appliances));
  }, [appliances]);

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

  const handleAddAppliance = (newAppliance: Omit<Appliance, 'id'>) => {
    const appliance: Appliance = {
      ...newAppliance,
      id: crypto.randomUUID()
    };
    setAppliances(prev => [...prev, appliance]);
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
        {filteredAppliances.length === 0 ? (
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
                onDelete={(id) => {
                  setAppliances(prev => prev.filter(a => a.id !== id));
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};