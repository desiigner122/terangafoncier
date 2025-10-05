import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, AlertTriangle, Eye, RefreshCw } from 'lucide-react';

const MaintenanceTestPage = () => {
  const [isMaintenanceActive, setIsMaintenanceActive] = React.useState(
    localStorage.getItem('maintenanceMode') === 'true'
  );

  const handleToggleMaintenance = (checked) => {
    if (checked) {
      localStorage.setItem('maintenanceMode', 'true');
      localStorage.setItem('maintenanceConfig', JSON.stringify({
        message: 'Site en maintenance - Test',
        estimatedDuration: null,
        allowedUsers: ['admin', 'Admin'],
        startTime: new Date().toISOString(),
        endTime: null
      }));
      console.log('✅ Mode maintenance activé');
    } else {
      localStorage.removeItem('maintenanceMode');
      localStorage.removeItem('maintenanceConfig');
      console.log('✅ Mode maintenance désactivé');
    }
    
    setIsMaintenanceActive(checked);
  };

  const testMaintenance = () => {
    window.open('/', '_blank');
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Test Mode Maintenance</h1>
          <p className="text-gray-600">Activez/désactivez le mode maintenance pour tester</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Contrôle du Mode Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <h3 className="font-medium">Mode Maintenance</h3>
                <p className="text-sm text-gray-600">
                  Activez pour afficher la page de maintenance aux visiteurs
                </p>
              </div>
              <Switch
                checked={isMaintenanceActive}
                onCheckedChange={handleToggleMaintenance}
              />
            </div>

            {isMaintenanceActive && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                  <span className="font-medium text-amber-800">Mode Maintenance Actif</span>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  Les visiteurs verront la page de maintenance. Vous pouvez toujours accéder au site car vous êtes admin.
                </p>
                <div className="flex gap-2">
                  <Button onClick={testMaintenance} variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Tester (Nouvel onglet)
                  </Button>
                  <Button onClick={refreshPage} variant="outline" size="sm">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Recharger la page
                  </Button>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Instructions de test :</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Activez le mode maintenance avec le switch ci-dessus</li>
                <li>Cliquez sur "Tester" pour ouvrir un nouvel onglet</li>
                <li>Ouvrez un onglet en navigation privée et visitez le site</li>
                <li>Vous devriez voir la page de maintenance</li>
                <li>Désactivez le mode pour revenir à la normale</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Console JavaScript</h4>
              <p className="text-sm text-blue-700 mb-2">
                Vous pouvez aussi utiliser ces commandes dans la console :
              </p>
              <div className="bg-blue-100 rounded p-2 font-mono text-xs">
                <div>maintenanceTest.activer() // Activer</div>
                <div>maintenanceTest.desactiver() // Désactiver</div>
                <div>maintenanceTest.verifier() // Vérifier statut</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut Actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Mode Maintenance :</span>
              <Badge variant={isMaintenanceActive ? "destructive" : "default"}>
                {isMaintenanceActive ? "ACTIVÉ" : "DÉSACTIVÉ"}
              </Badge>
            </div>
            {isMaintenanceActive && (
              <div className="mt-2 text-sm text-gray-600">
                Configuré depuis : {new Date().toLocaleString('fr-FR')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceTestPage;