
export const sampleSystemRequests = [
    {
        id: 'SYSREQ-001',
        type: 'account_upgrade',
        status: 'pending',
        user: {
            id: 'user-particulier-to-become-seller',
            name: 'Mamadou Sow',
            email: 'mamadou.sow@example.com',
            currentRole: 'Particulier',
        },
        details: {
            requestedRole: 'Vendeur Particulier',
            files: {
                identity: 'cni_mamadou_sow.pdf',
                residence: 'facture_senelec_sow.pdf',
            }
        },
        created_at: '2025-07-20T10:00:00Z',
    },
    {
        id: 'SYSREQ-002',
        type: 'parcel_listing',
        status: 'pending',
        user: {
            id: 'user-vendeur-pro',
            name: 'Immo Prestige SA',
        },
        details: {
            parcelName: 'Nouvelle Villa de Luxe à Ngor',
            parcelRef: 'Dk-Ngr-045',
            files: {
                titreFoncier: 'TF_12345_DK.pdf',
                planCadastral: 'plan_ngor_villa.pdf',
            }
        },
        created_at: '2025-07-21T14:30:00Z',
    },
    {
        id: 'SYSREQ-003',
        type: 'parcel_listing',
        status: 'approved',
        user: {
            id: 'user-vendeur-particulier',
            name: 'Aissatou Fall',
        },
        details: {
            parcelName: 'Terrain Viabilisé Thiès',
            parcelRef: 'TH-Ville-012',
            files: {
                titreFoncier: 'TF_54321_TH.pdf',
            }
        },
        created_at: '2025-07-19T09:00:00Z',
        processed_at: '2025-07-20T11:00:00Z',
        processed_by: 'Admin Teranga',
    },
     {
        id: 'SYSREQ-004',
        type: 'account_upgrade',
        status: 'rejected',
        user: {
            id: 'user-particulier-rejected',
            name: 'Ousmane Ba',
            email: 'ousmane.ba@example.com',
            currentRole: 'Particulier',
        },
        details: {
            requestedRole: 'Vendeur Particulier',
            files: {
                identity: 'cni_photo_floue.jpg',
            },
            rejectionReason: 'Pièce d\'identité illisible. Veuillez soumettre un document de meilleure qualité.'
        },
        created_at: '2025-07-18T16:00:00Z',
        processed_at: '2025-07-19T10:00:00Z',
        processed_by: 'Admin Teranga',
    },
];
  