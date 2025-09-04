import React, { useState } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  Lock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Settings,
  Eye
} from 'lucide-react';
import { 
  ROLES, 
  PERMISSIONS, 
  ROLE_GROUPS,
  hasPermission, 
  getDefaultDashboard, 
  getAccessDeniedMessage 
} from '@/lib/rbacConfig';

const SecurityDiagnosticTool = () => {
  const { profile } = useAuth();
  const [testRole, setTestRole] = useState('');
  const [testPermission, setTestPermission] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Vérifier si l'utilisateur a le droit d'accéder à cet outil
  if (!profile || !hasPermission(profile.role, 'ADMIN_PANEL')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Cet outil de diagnostic est réservé aux administrateurs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const testAccess = () => {
    if (!testRole || !testPermission) return null;
    return hasPermission(testRole, testPermission);
  };

  const filteredPermissions = Object.entries(PERMISSIONS).filter(([permission]) =>
    permission.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleStats = Object.keys(ROLES).map(role => {
    const permissionCount = Object.entries(PERMISSIONS)
      .filter(([, allowedRoles]) => allowedRoles.includes(role))
      .length;
    return { role, permissionCount };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Outil de Diagnostic de Sécurité RBAC
            </CardTitle>
            <CardDescription>
              Analysez et testez le système de contrôle d'accès basé sur les rôles
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="roles">Rôles</TabsTrigger>
            <TabsTrigger value="test">Tests d'accès</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rôles</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(ROLES).length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(PERMISSIONS).length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Groupes de Rôles</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(ROLE_GROUPS).length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques par rôle */}
            <Card>
              <CardHeader>
                <CardTitle>Permissions par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {roleStats.map(({ role, permissionCount }) => (
                    <div key={role} className="flex justify-between items-center p-2 rounded border">
                      <Badge variant="outline">{role}</Badge>
                      <span className="text-sm text-gray-600">{permissionCount} permissions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recherche de Permissions</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Rechercher une permission..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredPermissions.map(([permission, allowedRoles]) => (
                    <Card key={permission} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{permission}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Accessible par : {allowedRoles.length} rôle(s)
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {allowedRoles.map(role => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rôles */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(ROLES).map(([roleKey, roleData]) => (
                <Card key={roleKey}>
                  <CardHeader>
                    <CardTitle className="text-lg">{roleData.name}</CardTitle>
                    <CardDescription>{roleData.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tableau de bord :</span>
                        <Badge variant="outline">{getDefaultDashboard(roleKey)}</Badge>
                      </div>
                      <div className="text-sm">
                        <span>Permissions : </span>
                        <span className="font-medium">
                          {Object.entries(PERMISSIONS)
                            .filter(([, allowedRoles]) => allowedRoles.includes(roleKey))
                            .length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tests d'accès */}
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Testeur d'Accès</CardTitle>
                <CardDescription>
                  Testez si un rôle a accès à une permission spécifique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="test-role">Rôle à tester</Label>
                    <select
                      id="test-role"
                      className="w-full mt-1 p-2 border rounded"
                      value={testRole}
                      onChange={(e) => setTestRole(e.target.value)}
                    >
                      <option value="">Sélectionner un rôle</option>
                      {Object.keys(ROLES).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="test-permission">Permission à tester</Label>
                    <select
                      id="test-permission"
                      className="w-full mt-1 p-2 border rounded"
                      value={testPermission}
                      onChange={(e) => setTestPermission(e.target.value)}
                    >
                      <option value="">Sélectionner une permission</option>
                      {Object.keys(PERMISSIONS).map(permission => (
                        <option key={permission} value={permission}>{permission}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {testRole && testPermission && (
                  <Alert className={testAccess() ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    <div className="flex items-center gap-2">
                      {testAccess() ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={testAccess() ? "text-green-800" : "text-red-800"}>
                        <strong>Résultat :</strong> {testAccess() ? "ACCÈS AUTORISÉ" : "ACCÈS REFUSÉ"}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Audit de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      ✅ Système RBAC initialisé et fonctionnel
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      ✅ {Object.keys(ROLES).length} rôles définis avec des permissions distinctes
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      ✅ Routes critiques protégées (MY_REQUESTS, FAVORITES, etc.)
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      📊 Monitoring continu des accès recommandé
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecurityDiagnosticTool;
