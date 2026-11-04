import React, { useState, useEffect } from 'react';
import { fetchDirect } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/logger';

const DiagnosticVendorProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    const results = {};

    try {
      // 1. Récupérer les premières propriétés
      logger.debug('📥 Step 1: Fetching properties...');
      const propertiesData = await fetchDirect(
        'properties?select=id,title,owner_id,status,verification_status&limit=5'
      );
      results.properties = propertiesData;
      logger.debug('✅ Properties:', propertiesData);

      // 2. Extraire les owner_ids
      const ownerIds = propertiesData
        .map(p => p.owner_id)
        .filter((id, idx, arr) => arr.indexOf(id) === idx);
      results.ownerIds = ownerIds;
      logger.debug('✅ Unique owner IDs:', ownerIds);

      // 3. Récupérer les profils
      if (ownerIds.length > 0) {
        logger.debug(`📥 Step 2: Fetching ${ownerIds.length} profiles...`);
        const profilesData = await fetchDirect(
          `profiles?select=*&id=in.(${ownerIds.join(',')})`
        );
        results.profiles = profilesData;
        logger.debug('✅ Profiles:', profilesData);

        // 4. Vérifier les champs de chaque profil
        results.profileFields = profilesData.map(p => ({
          id: p.id,
          full_name: p.full_name ? '✅' : '❌',
          email: p.email ? '✅' : '❌',
          phone: p.phone ? '✅' : '❌',
          role: p.role || '❌ No role',
          address: p.address ? '✅' : '❌',
          bio: p.bio ? '✅ (len: ' + p.bio.length + ')' : '❌',
          avatar_url: p.avatar_url ? '✅' : '❌',
          verification_status: p.verification_status || '❌',
          created_at: p.created_at ? '✅' : '❌'
        }));
        logger.debug('✅ Profile fields:', results.profileFields);
      }

      setData(results);
    } catch (err) {
      logger.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔍 Diagnostic: Vendor Profiles</h1>

        <div className="mb-8">
          <Button onClick={runDiagnostics} disabled={loading} className="bg-blue-600">
            {loading ? 'Running...' : 'Run Diagnostics'}
          </Button>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{error}</pre>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-8">
            {/* Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Properties (First 5)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
                  {JSON.stringify(data.properties, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Owner IDs */}
            <Card>
              <CardHeader>
                <CardTitle>Unique Owner IDs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.ownerIds?.map((id, idx) => (
                    <div key={idx} className="p-2 bg-gray-100 rounded font-mono text-sm">
                      {id}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profile Fields Status */}
            {data.profileFields && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Fields Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-2 text-left">Profile ID</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Email</th>
                          <th className="p-2 text-left">Phone</th>
                          <th className="p-2 text-left">Role</th>
                          <th className="p-2 text-left">Address</th>
                          <th className="p-2 text-left">Bio</th>
                          <th className="p-2 text-left">Avatar</th>
                          <th className="p-2 text-left">Verified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.profileFields.map((p, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-mono text-xs">{p.id?.substring(0, 8)}...</td>
                            <td className="p-2">{p.full_name}</td>
                            <td className="p-2">{p.email}</td>
                            <td className="p-2">{p.phone}</td>
                            <td className="p-2">{p.role}</td>
                            <td className="p-2">{p.address}</td>
                            <td className="p-2">{p.bio}</td>
                            <td className="p-2">{p.avatar_url}</td>
                            <td className="p-2">{p.verification_status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full Profiles Data */}
            {data.profiles && (
              <Card>
                <CardHeader>
                  <CardTitle>Full Profiles Data (JSON)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
                    {JSON.stringify(data.profiles, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticVendorProfilePage;
