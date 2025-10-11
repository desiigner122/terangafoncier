# 🚀 GUIDE D'INTÉGRATION DES HOOKS

## Étapes pour intégrer les hooks dans CompleteSidebarAdminDashboard.jsx

### 1. Importer les hooks (en haut du fichier)

```javascript
// Ajouter après les autres imports
import { 
  useAdminStats, 
  useAdminUsers, 
  useAdminProperties, 
  useAdminTickets 
} from '@/hooks/admin';
```

### 2. Utiliser les hooks dans le composant

```javascript
const CompleteSidebarAdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  
  // ⭐ NOUVEAUX HOOKS
  const { stats, loading: statsLoading } = useAdminStats();
  const { users, loading: usersLoading, suspendUser, unsuspendUser, changeUserRole, deleteUser } = useAdminUsers();
  const { properties, loading: propertiesLoading, approveProperty, rejectProperty, deleteProperty } = useAdminProperties();
  const { tickets, loading: ticketsLoading, replyToTicket, updateTicketStatus } = useAdminTickets();
  
  // ... reste du code
```

### 3. Modifier renderOverview() pour utiliser stats

```javascript
const renderOverview = () => {
  if (statsLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des statistiques...</p>
      </div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards avec VRAIES DONNÉES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} actifs, {stats.suspendedUsers} suspendus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingProperties} en attente de validation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Support</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.openTickets} ouverts, {stats.urgentTickets} urgents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReports} en attente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Utilisateurs par rôle */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Vendeurs</span>
              <Badge>{stats.usersByRole.vendeur}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Acheteurs</span>
              <Badge>{stats.usersByRole.acheteur}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Notaires</span>
              <Badge>{stats.usersByRole.notaire}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Banques</span>
              <Badge>{stats.usersByRole.banque}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Agents Fonciers</span>
              <Badge>{stats.usersByRole.agent_foncier}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Admins</span>
              <Badge variant="destructive">{stats.usersByRole.admin}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

### 4. Modifier renderUsers() pour liste réelle

```javascript
const renderUsers = () => {
  if (usersLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Utilisateurs</h2>
        <Badge variant="outline">{users.length} utilisateurs</Badge>
      </div>

      {/* VRAIE LISTE */}
      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.name || 'Sans nom'}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={user.suspended_at ? 'destructive' : 'default'}>
                        {user.suspended_at ? 'Suspendu' : 'Actif'}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!user.suspended_at ? (
                      <DropdownMenuItem 
                        onClick={() => {
                          const reason = prompt('Raison de la suspension:');
                          if (reason) suspendUser(user.id, reason);
                        }}
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Suspendre
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => unsuspendUser(user.id)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Réactiver
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => {
                        const newRole = prompt('Nouveau rôle (admin, vendeur, acheteur, notaire, banque):');
                        if (newRole) changeUserRole(user.id, newRole);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Changer rôle
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        if (confirm('Supprimer cet utilisateur ?')) {
                          deleteUser(user.id);
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

### 5. Modifier renderProperties() pour validation réelle

```javascript
const renderProperties = () => {
  if (propertiesLoading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>;
  }

  const pendingProperties = properties.filter(p => p.verification_status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Validation des Propriétés</h2>
        <Badge variant="destructive">{pendingProperties.length} en attente</Badge>
      </div>

      {/* VRAIES PROPRIÉTÉS EN ATTENTE */}
      <div className="grid gap-4">
        {pendingProperties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Par: {property.owner?.name} ({property.owner?.email})
                    </p>
                  </div>
                  <Badge>{property.type}</Badge>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => approveProperty(property.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      const reason = prompt('Raison du rejet:');
                      if (reason) rejectProperty(property.id, reason);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (confirm('Supprimer cette propriété ?')) {
                        deleteProperty(property.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingProperties.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aucune propriété en attente</h3>
              <p className="text-gray-600">Toutes les propriétés ont été validées !</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
```

## ✅ RÉSULTAT ATTENDU

Après ces modifications, vous verrez :

1. ✅ **Vraies statistiques** sur la page Overview
2. ✅ **Vraie liste d'utilisateurs** avec actions fonctionnelles
3. ✅ **Vraies propriétés en attente** avec boutons Approuver/Rejeter qui marchent
4. ✅ **Tous les comptes tests visibles**
5. ✅ **Toutes les actions enregistrées dans admin_actions**

## 🚀 PROCHAINES ÉTAPES

Une fois ces modifications appliquées et testées :
- Créer les hooks pour Reports et Notifications
- Intégrer les pages Support et Signalements
- Ajouter les filtres avancés
- Implémenter la recherche temps réel

