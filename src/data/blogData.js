import { subDays, formatISO } from 'date-fns';

const now = new Date();

export const sampleBlogPosts = [
  {
    id: 'post1',
    title: '5 Conseils pour Acheter un Terrain au SÃ©nÃ©gal depuis l\'Ã‰tranger',
    slug: 'conseils-achat-terrain-diaspora',
    category: "Guide d'Achat",
    excerpt: 'Acheter un terrain au SÃ©nÃ©gal depuis la diaspora demande de la prÃ©paration. DÃ©couvrez nos 5 conseils clÃ©s pour sÃ©curiser votre investissement foncier.',
    content: `
L'achat d'un terrain au SÃ©nÃ©gal, surtout lorsqu'on rÃ©side Ã  l'Ã©tranger, peut sembler complexe. Cependant, avec une bonne prÃ©paration et les bonnes informations, il est tout Ã  fait possible de rÃ©aliser cet investissement en toute sÃ©rÃ©nitÃ©. Voici nos 5 conseils essentiels :

**1. VÃ©rification Approfondie des Documents Fonciers :**
Avant tout engagement, la vÃ©rification des documents est primordiale. Assurez-vous de l'authenticitÃ© du Titre Foncier, du Bail ou de la DÃ©libÃ©ration. Faites appel Ã  un notaire ou un expert foncier sur place pour une analyse rigoureuse. Teranga Foncier vous propose des services de vÃ©rification documentaire pour vous garantir une transaction transparente.

**2. Mandater une Personne de Confiance ou un Professionnel :**
Si vous ne pouvez pas Ãªtre sur place, mandatez une personne de confiance (famille, ami) ou, idÃ©alement, un professionnel de l'immobilier ou un avocat spÃ©cialisÃ©. DÃ©finissez clairement les limites de son mandat.

**3. Comprendre le Processus d'Achat et les Frais AssociÃ©s :**
Renseignez-vous sur les Ã©tapes du processus d'achat au SÃ©nÃ©gal (promesse de vente, acte de vente, enregistrement) et les frais annexes (frais de notaire, droits d'enregistrement, impÃ´ts fonciers). Cela vous Ã©vitera les mauvaises surprises.

**4. Visite Physique du Terrain (si possible ou par mandataire) :**
Une visite physique est cruciale pour vÃ©rifier l'emplacement exact, l'accessibilitÃ©, la viabilisation (eau, Ã©lectricitÃ©), et l'environnement du terrain. Si vous ne pouvez vous dÃ©placer, votre mandataire doit effectuer cette visite et vous fournir un rapport dÃ©taillÃ© avec photos et vidÃ©os.

**5. Utiliser des Canaux de Paiement SÃ©curisÃ©s :**
PrivilÃ©giez les virements bancaires internationaux ou les services de transfert d'argent reconnus. Ã‰vitez les paiements en espÃ¨ces importants sans traÃ§abilitÃ©. Un notaire peut Ã©galement servir d'intermÃ©diaire sÃ©curisÃ© pour les transactions financiÃ¨res.

Chez Teranga Foncier, nous comprenons les dÃ©fis de la diaspora et nous nous engageons Ã  vous fournir l'accompagnement et les outils nÃ©cessaires pour un investissement foncier rÃ©ussi et sÃ©curisÃ© au SÃ©nÃ©gal. N'hÃ©sitez pas Ã  nous contacter pour discuter de votre projet.
    `,
    imageUrlYOUR_API_KEY: 'blog/conseils-diaspora.jpg',
    author_name: 'Abdoulaye DiÃ©mÃ©',
    published_at: formatISO(subDays(now, 3)),
    tags: ["Achat Terrain", "SÃ©curitÃ© FonciÃ¨re", "Diaspora"]
  },
  {
    id: 'post2',
    title: 'Titre Foncier vs Bail vs DÃ©libÃ©ration : Comprendre les DiffÃ©rences',
    slug: 'titre-foncier-bail-deliberation-senegal',
    category: "Juridique",
    excerpt: 'Le statut juridique d\'un terrain est crucial. Apprenez Ã  distinguer Titre Foncier, Bail et DÃ©libÃ©ration pour faire un choix Ã©clairÃ©.',
    content: `
Naviguer dans le systÃ¨me foncier sÃ©nÃ©galais nÃ©cessite de bien comprendre les diffÃ©rents types de titres de propriÃ©tÃ©. Les trois principaux que vous rencontrerez sont le Titre Foncier, le Bail et la DÃ©libÃ©ration.

**Le Titre Foncier (TF) :**
C'est le document qui confÃ¨re le droit de propriÃ©tÃ© le plus absolu et le plus sÃ©curisÃ© sur un terrain. Il est dÃ©finitif, inattaquable et enregistrÃ© au livre foncier tenu par la Conservation de la PropriÃ©tÃ© FonciÃ¨re. Obtenir un TF est souvent le Graal pour tout investisseur car il garantit une sÃ©curitÃ© juridique maximale. Le processus pour l'obtenir peut Ãªtre long et coÃ»teux mais en vaut la peine.

**Le Bail EmphytÃ©otique ou Ordinaire :**
Le bail est un contrat par lequel l'Ã‰tat (ou une collectivitÃ© locale) concÃ¨de la jouissance d'un terrain du domaine national pour une longue durÃ©e (gÃ©nÃ©ralement entre 18 et 99 ans), moyennant une redevance. Le dÃ©tenteur d'un bail (le preneur) a des droits rÃ©els sur le terrain (construire, hypothÃ©quer) mais n'en est pas propriÃ©taire au sens plein du TF. Ã€ la fin du bail, le terrain revient en principe Ã  l'Ã‰tat. Il est possible, sous conditions, de transformer un bail en Titre Foncier.

**La DÃ©libÃ©ration (ou Acte Administratif Affectant un Terrain) :**
Souvent dÃ©livrÃ©e par les communes ou les communautÃ©s rurales, la dÃ©libÃ©ration est un acte administratif qui attribue un droit d'occupation ou d'usage sur une parcelle du domaine national. Ce n'est pas un titre de propriÃ©tÃ© en soi, mais plutÃ´t une Ã©tape prÃ©liminaire qui peut, potentiellement et aprÃ¨s plusieurs dÃ©marches (dont l'immatriculation), mener Ã  l'obtention d'un bail puis d'un Titre Foncier. Les terrains sous dÃ©libÃ©ration sont gÃ©nÃ©ralement moins chers mais prÃ©sentent un niveau de sÃ©curitÃ© juridique infÃ©rieur tant que le processus d'immatriculation n'est pas complÃ©tÃ©.

**Quel Titre Choisir ?**
*   **Pour une sÃ©curitÃ© maximale et un investissement Ã  long terme :** Visez un terrain avec Titre Foncier.
*   **Pour des projets spÃ©cifiques ou des terrains du domaine national :** Le Bail peut Ãªtre une option viable, surtout si une transformation en TF est envisageable.
*   **Pour des acquisitions plus abordables mais nÃ©cessitant une rÃ©gularisation :** La DÃ©libÃ©ration peut Ãªtre un point de dÃ©part, mais soyez conscient des dÃ©marches supplÃ©mentaires et des risques si la procÃ©dure n'aboutit pas.

Il est crucial de se faire accompagner par des professionnels (notaires, avocats spÃ©cialisÃ©s en droit foncier, experts de Teranga Foncier) pour vÃ©rifier la validitÃ© et la nature exacte du titre avant toute transaction.
    `,
    imageUrlYOUR_API_KEY: 'blog/documents-juridiques.jpg',
    author_name: 'Expert Foncier',
    published_at: formatISO(subDays(now, 10)),
    tags: ["Titre Foncier", "Droit Foncier", "Cadastre"]
  },
  {
    id: 'post3',
    title: 'Les Zones d\'Avenir pour l\'Investissement Foncier Ã  Dakar et Environs',
    slug: 'zones-avenir-investissement-dakar',
    category: "MarchÃ© Immobilier",
    excerpt: 'OÃ¹ investir au SÃ©nÃ©gal ? Tour d\'horizon des zones prometteuses autour de Dakar pour un investissement foncier rentable et stratÃ©gique.',
    content: `
Dakar et sa pÃ©riphÃ©rie connaissent une expansion rapide, offrant de nombreuses opportunitÃ©s d'investissement foncier. Voici quelques zones clÃ©s Ã  surveiller :

**1. Diamniadio et le PÃ´le Urbain :**
Incontestablement la zone d'avenir la plus mÃ©diatisÃ©e. Avec ses infrastructures modernes (autoroute, TER, citÃ© ministÃ©rielle, universitÃ©s, parcs industriels), Diamniadio attire les investissements rÃ©sidentiels, commerciaux et industriels. Les prix y ont augmentÃ© mais le potentiel de valorisation reste important.

**2. Lac Rose et la Zone Nord :**
Cette zone bÃ©nÃ©ficie de sa proximitÃ© avec Dakar et de l'extension de l'urbanisation. Le potentiel touristique autour du Lac Rose est un atout, tout comme les projets de dÃ©veloppement routier. IdÃ©al pour des projets rÃ©sidentiels et touristiques.

**3. La Petite CÃ´te (Saly, Somone, Ngaparou, Popenguine) :**
Destination touristique Ã©tablie, la Petite CÃ´te continue d'attirer les investisseurs pour des rÃ©sidences secondaires, des hÃ´tels, et des commerces. La demande locative y est forte. Attention cependant Ã  la pression fonciÃ¨re et Ã  la rÃ©glementation cÃ´tiÃ¨re.

**4. ThiÃ¨s et sa RÃ©gion :**
PositionnÃ©e comme un carrefour stratÃ©gique, ThiÃ¨s bÃ©nÃ©ficie de sa proximitÃ© avec Dakar, de l'aÃ©roport AIBD et de Diamniadio. La ville se dÃ©veloppe et offre des opportunitÃ©s pour des projets rÃ©sidentiels, commerciaux et logistiques Ã  des prix encore plus abordables que Dakar.

**5. Les Alentours de l'AÃ©roport International Blaise Diagne (AIBD) :**
La zone autour de l'AIBD est en plein essor. Des projets logistiques, hÃ´teliers, et rÃ©sidentiels y voient le jour. C'est une zone stratÃ©gique pour les investisseurs visionnaires.

**CritÃ¨res Ã  ConsidÃ©rer avant d'Investir :**
*   **AccessibilitÃ© et Infrastructures :** Routes, eau, Ã©lectricitÃ©, proximitÃ© des services.
*   **Statut Juridique des Terrains :** PrivilÃ©giez les Titres Fonciers ou les Baux en cours de transformation.
*   **Plans d'Urbanisme :** Renseignez-vous sur les plans directeurs d'urbanisme pour anticiper le dÃ©veloppement futur de la zone.
*   **Potentiel de Valorisation :** Ã‰valuez la demande locative, le potentiel de plus-value Ã  long terme.

Teranga Foncier vous accompagne dans l'identification des meilleures opportunitÃ©s en fonction de votre profil d'investisseur et de vos objectifs.
    `,
    imageUrlYOUR_API_KEY: 'blog/zones-investissement.jpg',
    author_name: 'Analyste Immobilier',
    published_at: formatISO(subDays(now, 30)),
    tags: ["Investissement", "Urbanisme", "Dakar"]
  },
  {
    id: 'post4',
    title: 'Financer son Projet Agricole au SÃ©nÃ©gal : Quelles Options ?',
    slug: 'financement-projet-agricole-senegal',
    category: "Agriculture",
    excerpt: 'Du micro-crÃ©dit aux subventions Ã©tatiques, explorez les pistes pour financer l\'acquisition de votre terrain agricole et le lancement de votre exploitation.',
    content: `
Lancer un projet agricole au SÃ©nÃ©gal est une aventure prometteuse, mais le financement peut Ãªtre un dÃ©fi. Voici un aperÃ§u des options disponibles :

**1. Autofinancement et Ã‰pargne Personnelle :**
C'est souvent le point de dÃ©part pour de nombreux entrepreneurs agricoles. L'avantage est l'absence de dettes, mais cela peut limiter l'envergure initiale du projet.

**2. PrÃªts Bancaires SpÃ©cifiques Ã  l'Agriculture :**
Plusieurs banques au SÃ©nÃ©gal proposent des produits de financement adaptÃ©s au secteur agricole. Ces prÃªts peuvent couvrir l'achat de terrain, de matÃ©riel, d'intrants, etc. Il est important de prÃ©parer un business plan solide pour convaincre les institutions financiÃ¨res. Renseignez-vous auprÃ¨s de la BNDE (Banque Nationale de DÃ©veloppement Ã‰conomique) ou d'autres banques commerciales ayant un guichet agricole.

**3. Institutions de Microfinance (IMF) :**
Les IMF sont souvent plus accessibles pour les petits exploitants ou les projets de moindre envergure. Elles proposent des micro-crÃ©dits avec des conditions parfois plus souples que les banques traditionnelles.

**4. Subventions et Programmes Gouvernementaux :**
L'Ã‰tat sÃ©nÃ©galais, Ã  travers divers ministÃ¨res et agences (comme la DER/FJ, le PRACAS), met en place des programmes de subventions et d'accompagnement pour le secteur agricole. Restez informÃ© des appels Ã  projets et des critÃ¨res d'Ã©ligibilitÃ©.

**5. Capital-Investissement et Investisseurs PrivÃ©s :**
Pour des projets plus ambitieux, rechercher des investisseurs privÃ©s ou des fonds de capital-investissement spÃ©cialisÃ©s dans l'agribusiness peut Ãªtre une option. Cela implique souvent de cÃ©der une partie des parts de l'entreprise.

**6. Crowdfunding Agricole :**
Des plateformes de financement participatif dÃ©diÃ©es Ã  l'agriculture Ã©mergent. C'est une maniÃ¨re de lever des fonds auprÃ¨s d'un large public intÃ©ressÃ© par le soutien Ã  l'agriculture locale.

**Conseils pour Maximiser vos Chances de Financement :**
*   **Ã‰laborez un Business Plan DÃ©taillÃ© :** PrÃ©sentez clairement votre projet, vos objectifs, vos prÃ©visions financiÃ¨res, et votre stratÃ©gie.
*   **SÃ©curisez le Foncier :** Avoir un titre de propriÃ©tÃ© clair (TF, Bail) est un atout majeur pour rassurer les financeurs. Teranga Foncier peut vous aider Ã  trouver des terrains avec un statut juridique sÃ©curisÃ©.
*   **Formez-vous et Entourez-vous :** DÃ©montrez votre expertise ou votre capacitÃ© Ã  vous entourer de compÃ©tences techniques.
*   **Commencez Petit et Prouvez le Concept :** Un projet pilote rÃ©ussi peut faciliter l'obtention de financements plus importants.

N'hÃ©sitez pas Ã  consulter les experts de Teranga Foncier qui peuvent vous orienter vers les solutions de financement les plus adaptÃ©es Ã  votre projet agricole.
    `,
    imageUrlYOUR_API_KEY: 'blog/financement-agricole.jpg',
    author_name: 'Expert Agricole',
    published_at: formatISO(subDays(now, 45)),
    tags: ["Agriculture", "Financement", "Projet Agricole"]
  },
  {
    id: 'post5',
    title: 'L\'impact des Nouvelles Infrastructures sur la Valeur FonciÃ¨re',
    slug: 'impact-infrastructures-valeur-fonciere',
    category: "MarchÃ© Immobilier",
    excerpt: 'Autoroutes, TER, pÃ´les urbains... Comment les grands projets d\'infrastructure transforment-ils le paysage foncier et crÃ©ent-ils de nouvelles opportunitÃ©s ?',
    content: `
Le dÃ©veloppement d'infrastructures est un moteur clÃ© de la valorisation fonciÃ¨re. Au SÃ©nÃ©gal, les rÃ©cents et futurs grands projets ont un impact significatif sur le marchÃ© immobilier.

**1. Les Autoroutes et Routes ModernisÃ©es :**
L'extension du rÃ©seau autoroutier (Dakar-Diamniadio-AIBD, ThiÃ¨s-Touba, etc.) a dÃ©senclavÃ© de nombreuses zones, rÃ©duisant les temps de trajet et rendant des localitÃ©s auparavant Ã©loignÃ©es plus attractives. Les terrains situÃ©s Ã  proximitÃ© des Ã©changeurs autoroutiers ou le long de ces axes voient gÃ©nÃ©ralement leur valeur augmenter.

**2. Le Train Express RÃ©gional (TER) :**
Le TER a transformÃ© la mobilitÃ© dans la rÃ©gion de Dakar. Les zones desservies par les gares du TER (Rufisque, Bargny, Diamniadio) connaissent une forte demande pour des projets rÃ©sidentiels et commerciaux. La proximitÃ© d'une gare TER est devenue un critÃ¨re de valorisation important.

**3. Les PÃ´les Urbains et Zones Ã‰conomiques SpÃ©ciales :**
La crÃ©ation de pÃ´les urbains comme Diamniadio ou de Zones Ã‰conomiques SpÃ©ciales (ZES) concentre les investissements, les emplois et les services. Cela stimule la demande de logements, de bureaux et de commerces aux alentours, et donc la valeur des terrains.

**4. L'AÃ©roport International Blaise Diagne (AIBD) :**
L'aÃ©roport a ouvert toute la zone de Diass, Ndayane, et KirÃ¨ne Ã  de nouvelles opportunitÃ©s. Des projets logistiques, hÃ´teliers, industriels et rÃ©sidentiels se dÃ©veloppent pour rÃ©pondre aux besoins liÃ©s Ã  cette plateforme aÃ©roportuaire majeure.

**Comment Anticiper et BÃ©nÃ©ficier de ces Ã‰volutions ?**
*   **Suivre les Annonces Officielles :** Restez informÃ© des plans de dÃ©veloppement d'infrastructures du gouvernement.
*   **Analyser les Plans Directeurs d'Urbanisme (PDU) :** Ces documents donnent des indications sur l'amÃ©nagement futur des territoires.
*   **Investir en Amont (avec Prudence) :** Acheter des terrains dans des zones identifiÃ©es pour de futurs projets d'infrastructure peut offrir un fort potentiel de plus-value. Cependant, cela comporte aussi des risques si les projets sont retardÃ©s ou modifiÃ©s.
*   **ConsidÃ©rer l'Impact Ã  Long Terme :** Ne vous focalisez pas uniquement sur l'effet d'annonce. Ã‰valuez comment l'infrastructure amÃ©liorera durablement l'attractivitÃ© et la fonctionnalitÃ© de la zone.

Chez Teranga Foncier, nous intÃ©grons l'analyse des projets d'infrastructure dans notre Ã©valuation des opportunitÃ©s fonciÃ¨res pour vous aider Ã  faire des investissements Ã©clairÃ©s et porteurs de valeur.
    `,
    imageUrlYOUR_API_KEY: 'blog/infrastructures-senegal.jpg',
    author_name: 'Urbaniste Consultant',
    published_at: formatISO(subDays(now, 60)),
    tags: ["Urbanisme", "Valeur FonciÃ¨re", "Infrastructure"]
  },
];