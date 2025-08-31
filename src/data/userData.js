
import { Smartphone, Mail, Settings, HelpCircle, Heart, Search, FileText, Bell, MessageSquare, LogOut, Lock, User, UserPlus } from 'lucide-react';

export const sampleUsers = [
    { id: 'user-particulier', full_name: 'Alioune Diop', name: 'Alioune Diop', email: 'particulier@teranga.sn', role: 'Particulier', user_type: 'Particulier', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/alioune.png', created_at: '2025-01-15T10:00:00Z' },
    { id: 'user-vendeur-particulier-certifie', full_name: 'Aissatou Fall', name: 'Aissatou Fall', email: 'vendeur.particulier.certifie@teranga.sn', role: 'Vendeur Particulier', user_type: 'Vendeur Particulier', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/aissatou.png', created_at: '2025-02-20T11:30:00Z' },
    { id: 'user-vendeur-pro-certifie', full_name: 'Immo Prestige SA', name: 'Immo Prestige SA', email: 'vendeur.pro.certifie@teranga.sn', role: 'Vendeur Pro', user_type: 'Vendeur Pro', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/immo.png', created_at: '2025-03-10T09:00:00Z' },
    { id: 'user-vendeur-particulier-non-certifie', full_name: 'Moussa Gueye', name: 'Moussa Gueye', email: 'vendeur.particulier.noncertifie@teranga.sn', role: 'Vendeur Particulier', user_type: 'Vendeur Particulier', verification_status: 'unverified', avatar: 'https://avatar.vercel.sh/moussa.png', created_at: '2025-03-12T11:30:00Z' },
    { id: 'user-mairie-saly', full_name: 'Mairie de Saly', name: 'Mairie de Saly', email: 'mairie.saly@teranga.sn', role: 'Mairie', user_type: 'Mairie', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/mairie-saly.png', created_at: '2025-01-05T14:00:00Z' },
    { id: 'user-mairie-dakar', full_name: 'Mairie de Dakar', name: 'Mairie de Dakar', email: 'mairie.dakar@teranga.sn', role: 'Mairie', user_type: 'Mairie', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/mairie-dakar.png', created_at: '2025-01-06T14:00:00Z' },
    { id: 'user-banque', full_name: 'Banque Africaine de Développement', name: 'Banque Africaine Dev', email: 'banque@teranga.sn', role: 'Banque', user_type: 'Banque', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/banque.png', created_at: '2025-04-01T16:00:00Z' },
    { id: 'user-notaire', full_name: 'Maitre Ndiaye', name: 'Maitre Ndiaye', email: 'notaire@teranga.sn', role: 'Notaire', user_type: 'Notaire', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/notaire.png', created_at: '2025-02-01T12:00:00Z' },
    { id: 'user-agent', full_name: 'Agent Foncier Sarr', name: 'Agent Foncier Sarr', email: 'agent@teranga.sn', role: 'Agent Foncier', user_type: 'Agent Foncier', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/agent.png', created_at: '2025-03-25T08:00:00Z' },
    { id: 'user-admin', full_name: 'Admin Teranga', name: 'Admin Teranga', email: 'palaye122@hotmail.fr', role: 'Admin', user_type: 'Admin', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/admin.png', created_at: '2025-01-01T00:00:00Z' },
    { id: 'user-investisseur', name: 'Investisseur Dieng', full_name: 'Investisseur Dieng', email: 'investisseur@teranga.sn', role: 'Investisseur', user_type: 'Investisseur', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/invest.png', created_at: '2025-05-15T18:00:00Z' },
    { id: 'user-promoteur', name: 'Bâtisseurs du Futur', full_name: 'Bâtisseurs du Futur', email: 'promoteur@teranga.sn', role: 'Promoteur', user_type: 'Promoteur', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/promoteur.png', created_at: '2025-06-10T10:00:00Z' },
    { id: 'user-agriculteur', name: 'Ferme Gningue', full_name: 'Ferme Gningue', email: 'agriculteur@teranga.sn', role: 'Agriculteur', user_type: 'Agriculteur', verification_status: 'verified', avatar: 'https://avatar.vercel.sh/ferme.png', created_at: '2025-04-22T14:00:00Z' },
    { 
        id: 'user-unverified-1', 
        name: 'Nouveau Venu', 
        full_name: 'Nouveau Venu', 
        email: 'new@teranga.sn', 
        role: 'Particulier', 
        user_type: 'Particulier', 
        verification_status: 'unverified', 
        avatar: 'https://avatar.vercel.sh/new.png', 
        created_at: new Date().toISOString(),
        documents: {
            "piece_identite": "/documents/sample-cni.pdf",
            "justificatif_domicile": "/documents/sample-facture.pdf"
        }
    },
];

export const sampleRequests = [
    {
        id: 'REQ-2025-001',
        user_id: 'user-particulier',
        parcel_id: 'Mbo-Rési-059',
        request_type: 'buy',
        status: 'En instruction',
        message: "Bonjour, je suis très intéressé par cette parcelle et souhaite initier la procédure d'achat. Merci.",
        created_at: '2025-07-10T10:00:00Z',
        recipient: 'Immo Prestige SA',
        payments: [
          { id: 'TRN-001-2025', description: 'Acompte (1/4)', status: 'Payé', amount: 10312500 },
          { id: 'TRN-004-2025', description: 'Frais de Notaire', status: 'En attente', amount: 75000 },
        ],
        history: [
            { status: 'Nouvelle', date: '2025-07-10T10:00:00Z', updated_by: 'Alioune Diop', note: 'Demande soumise.' },
            { status: 'En instruction', date: '2025-07-11T14:20:00Z', updated_by: 'Immo Prestige SA', note: 'Dossier reçu et en cours de vérification.' }
        ],
    },
    {
        id: 'REQ-2025-002',
        user_id: 'user-particulier',
        parcel_id: null,
        request_type: 'acquisition',
        status: 'En instruction',
        message: "Je souhaiterais faire une demande d'attribution pour une parcelle à usage d'habitation dans la commune de Saly.",
        created_at: '2025-07-05T15:30:00Z',
        recipient: 'Mairie de Saly',
        payments: [
          { id: 'TRN-002-2025', description: 'Frais de dossier', status: 'Payé', amount: 50000 },
          { id: 'TRN-005-2025', description: 'Timbres fiscaux', status: 'En attente', amount: 15000 }
        ],
        history: [
            { status: 'Nouvelle', date: '2025-07-05T15:30:00Z', updated_by: 'Alioune Diop', note: 'Demande d\'attribution communale soumise.'},
            { status: 'En instruction', date: '2025-07-08T09:00:00Z', updated_by: 'Agent Mairie', note: 'Dossier en cours d\'étude. Paiement des timbres fiscaux requis pour continuer.'}
        ],
    },
     {
        id: 'REQ-2025-003',
        user_id: 'user-particulier',
        parcel_id: 'Pik-Comm-063',
        request_type: 'buy',
        status: 'Nouvelle',
        message: "Je confirme mon intérêt pour la parcelle à Pikine.",
        created_at: '2025-07-12T11:00:00Z',
        recipient: 'Vendeur Particulier',
        payments: [],
        history: [ { status: 'Nouvelle', date: '2025-07-12T11:00:00Z', updated_by: 'Alioune Diop', note: 'Demande d\'achat soumise.' }]
    },
];

export const sampleNotifications = [
  { id: 1, user_id: 'user-particulier', type: 'message', content: 'Nouveau message de Vendeur de Test concernant SLY-NGP-010', date: '2025-07-11T14:25:00Z', is_read: false, link: '/messaging' },
  { id: 2, user_id: 'user-particulier', type: 'status_update', content: 'Le statut de votre demande REQ-2025-002 est passé à "En instruction"', date: '2025-07-08T09:00:00Z', is_read: false, link: '/case-tracking/REQ-2025-002' },
  { id: 3, user_id: 'user-vendeur-particulier', type: 'new_request', content: 'Nouvelle demande d\'achat pour votre parcelle à Pikine', date: '2025-07-12T11:05:00Z', is_read: false, link: '/dashboard' },
];

export const sampleSavedSearches = [
    { id: 1, name: "Terrains agricoles à Thiès", filters: { type: 'agricole', zone: 'thiès' }, new_results: 2, date: '2025-07-01' },
];

export const sampleFavorites = ['Dak-Rési-001', 'Mbo-Rési-059'];

export const sampleUserListings = [
    { id: 'p-user-01', name: "Terrain familial à Ngaparou", status: 'active', views: 125, inquiries: 4 },
];

export const sampleConversations = [
  { id: 'conv1', participants: ['user-particulier', 'user-vendeur-pro-certifie'], parcel_id: 'Mbo-Rési-059', last_message: 'Ok, je prépare les documents.', unread_count: 1, updated_at: '2025-07-11T14:25:00Z' },
  { id: 'conv2', participants: ['user-particulier', 'user-vendeur-particulier-certifie'], parcel_id: 'Pik-Comm-063', last_message: 'Bonjour, est-il possible de visiter ?', unread_count: 0, updated_at: '2025-07-12T11:10:00Z' },
];

export const sampleMessages = {
  'conv1': [
    { id: 'msg1', conversation_id: 'conv1', sender_id: 'user-particulier', content: "Bonjour, je suis intéressé par la parcelle Mbo-Rési-059.", created_at: '2025-07-10T10:05:00Z' },
  ],
  'conv2': [
    { id: 'msg2', conversation_id: 'conv2', sender_id: 'user-particulier', content: 'Bonjour, est-il possible de visiter la parcelle à Pikine ?', created_at: '2025-07-12T11:10:00Z' },
  ],
};

export const sampleTransactions = [
  {
    id: 'TRN-003-2025',
    date: '2025-08-15',
    description: 'Achat de la parcelle Mbo-Rési-059 (2/4)',
    amount: 10312500,
    totalAmount: 41250000,
    status: 'En attente',
    type: 'Achat de terrain',
    paymentMethod: null,
    parcelId: 'Mbo-Rési-059'
  },
  {
    id: 'TRN-004-2025',
    date: '2025-07-25',
    description: 'Frais de Notaire - Dossier Mbo-Rési-059',
    amount: 75000,
    totalAmount: 75000,
    status: 'En attente',
    type: 'Frais notariaux',
    paymentMethod: null,
    parcelId: 'Mbo-Rési-059'
  },
  {
    id: 'TRN-005-2025',
    date: '2025-07-20',
    description: 'Timbres fiscaux - Mairie de Dakar',
    amount: 15000,
    totalAmount: 15000,
    status: 'En attente',
    type: 'Frais administratifs',
    paymentMethod: null,
    parcelId: null
  },
  {
    id: 'TRN-001-2025',
    date: '2025-07-15',
    description: 'Achat de la parcelle Mbo-Rési-059 (1/4)',
    amount: 10312500,
    totalAmount: 41250000,
    status: 'Payé',
    type: 'Achat de terrain',
    paymentMethod: 'Virement Bancaire',
    parcelId: 'Mbo-Rési-059'
  },
  {
    id: 'TRN-002-2025',
    date: '2025-06-20',
    description: 'Frais de dossier - Demande d\'attribution Mairie de Dakar',
    amount: 50000,
    totalAmount: 50000,
    status: 'Payé',
    type: 'Frais administratifs',
    paymentMethod: 'Wave',
    parcelId: null
  },
];
