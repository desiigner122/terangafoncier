
import { addDays, subDays, formatISO } from 'date-fns';
import { sampleUsers } from './userData';

const now = new Date();

const senegalDepartments = [
    "Dakar", "Guédiawaye", "Pikine", "Rufisque", "Bambey", "Diourbel", "Mbacké",
    "Fatick", "Foundiougne", "Gossas", "Birkilane", "Kaffrine", "Koungheul",
    "Malem Hodar", "Guinguinéo", "Kaolack", "Nioro du Rip", "Kédougou",
    "Salémata", "Saraya", "Kolda", "Médina Yoro Foulah", "Vélingara",
    "Kébémer", "Linguère", "Louga", "Kanel", "Matam", "Ranérou Ferlo",
    "Saint-Louis", "Dagana", "Podor", "Sédhiou", "Bounkiling", "Goudomp",
    "Tambacounda", "Bakel", "Goudiry", "Koumpentoum", "Mbour", "Thiès",
    "Tivaouane", "Bignona", "Oussouye", "Ziguinchor"
];

const parcelTypes = ['Résidentiel', 'Commercial', 'Agricole', 'Industriel', 'Mixte', 'Touristique'];
const statuses = ['Disponible', 'Réservée', 'Vendue', 'Attribution sur demande'];
const docStatuses = ['Vérifié', 'Partiellement Vérifié', 'En attente', 'Info Manquante'];

const getRandomSellerId = () => {
    const sellers = sampleUsers.filter(u => u.role.includes('Vendeur') || u.role === 'Mairie');
    if (sellers.length === 0) return null;
    return sellers[Math.floor(Math.random() * sellers.length)].id;
};

const getOwnerTypeFromSellerId = (sellerId) => {
    if (!sellerId) return 'Particulier';
    const seller = sampleUsers.find(u => u.id === sellerId);
    return seller ? seller.role : 'Particulier';
};

const generateParcels = () => {
    const parcels = [];
    let idCounter = 1;

    for (let i = 0; i < 60; i++) {
        const dept = senegalDepartments[Math.floor(Math.random() * senegalDepartments.length)];
        const type = parcelTypes[Math.floor(Math.random() * parcelTypes.length)];
        const area = Math.floor(Math.random() * (type === 'Agricole' ? 48000 : 4850) + (type === 'Agricole' ? 2000 : 150));
        
        const sellerId = getRandomSellerId();
        const ownerType = getOwnerTypeFromSellerId(sellerId);
        
        const isMunicipal = ownerType === 'Mairie';
        
        const price = isMunicipal ? null : area * (Math.floor(Math.random() * 150000) + 5000);
        const status = isMunicipal ? 'Attribution sur demande' : statuses[Math.floor(Math.random() * (statuses.length -1))]; // Exclude municipal status for others
        
        const docStatus = docStatuses[Math.floor(Math.random() * docStatuses.length)];
        const dateAdded = subDays(now, Math.floor(Math.random() * 365));
        const isEligibleForInstallments = !isMunicipal && Math.random() > 0.4; // 60% of private sellers offer installments

        parcels.push({
            id: `${dept.substring(0, 3).toUpperCase()}-${type.substring(0, 3).toUpperCase()}-${String(idCounter).padStart(3, '0')}`,
            reference: `REF-${dept.substring(0, 3).toUpperCase()}-${String(idCounter).padStart(4, '0')}`,
            name: `Terrain ${type} ${dept} #${i + 1}`,
            location_name: `${dept}, Sénégal`,
            description: `Belle parcelle de ${area}m² dans la zone de ${dept}. Idéal pour projet ${type.toLowerCase()}. Ce bien est ${isEligibleForInstallments ? 'éligible' : 'non éligible'} au paiement échelonné.`,
            price: price,
            area_sqm: area,
            area: area,
            status: status,
            documents: {
                titreFoncier: "https://example.com/doc/titre_foncier.pdf",
                planCadastral: "https://example.com/doc/plan_cadastral.pdf"
            },
            images: [
                `https://source.unsplash.com/random/800x600?land,senegal,${idCounter}`,
                `https://source.unsplash.com/random/800x600?field,senegal,${idCounter}`,
                `https://source.unsplash.com/random/800x600?savannah,senegal,${idCounter}`
            ],
            coordinates: { lat: 14.7167 + (Math.random() - 0.5) * 2, lng: -17.4677 + (Math.random() - 0.5) * 2 },
            zone: dept,
            type: type,
            is_featured: Math.random() < 0.2,
            verified: docStatus === 'Vérifié',
            documentStatus: docStatus,
            titre_foncier: `TF ${Math.floor(Math.random() * 90000) + 10000}/${dept.substring(0, 2).toUpperCase()}`,
            dateAdded: formatISO(dateAdded),
            created_at: formatISO(dateAdded),
            updated_at: formatISO(addDays(dateAdded, Math.floor(Math.random() * 30))),
            owner_type: ownerType,
            seller_id: sellerId,
            potential: `Fort potentiel de développement pour un projet ${type.toLowerCase()}.`,
            is_eligible_for_installments: isEligibleForInstallments,
        });
        idCounter++;
    }
    return parcels;
};

export const sampleParcels = generateParcels();
