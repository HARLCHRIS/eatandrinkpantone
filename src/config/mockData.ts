import type { Application, JuryEvaluation } from '../types';

export const INITIAL_MOCK_APPLICATIONS: Application[] = [
  {
    id: 'CAND-2026-00101',
    submittedAt: '2026-09-20T10:30:00Z',
    status: 'PRÉSÉLECTIONNÉE',
    assignedJuryIds: ['jury-1', 'jury-2'],
    candidate: {
      lastName: 'SOSSOU',
      firstName: 'Koffi Christian',
      phone: '+229 97 12 34 56',
      email: 'christian.sossou@agrobio.bj',
      city: 'Cotonou',
      address: 'Quartier Fidjrossè, Parcelle 412',
      status: 'Startup',
    },
    project: {
      name: 'NectarD\'Or - Jus Pur d\'Ananas Pain de Sucre sans Additif',
      sector: 'Agroalimentaire - Boissons',
      category: 'Boissons',
      description:
        'Transformation d\'ananas local Pain de Sucre d\'Allada en jus premium 100% naturel pasteurisé en bouteilles en verre recyclables.',
      problem:
        'Pertes post-récolte massives (jusqu\'à 40%) d\'ananas au Bénin faute d\'unités de transformation locale modernes et de conservation adéquate.',
      solution:
        'Unités mobiles de collecte et ligne de pasteurisation douce préservant les nutriments avec un packaging écoresponsable.',
      targetClients:
        'Supermarchés locaux, hôtels, restaurants, banquets et export sous-régional.',
      revenueModel: 'Vente directe B2B aux revendeurs et distribution B2C en packs.',
      competitors: 'Jus importés industriels concentrés en boîtes.',
      differentiation:
        'Fruits frais certifiés origine Allada, 0 sucre ajouté, bouteilles consignées.',
      stage: 'Premières ventes',
      existenceDuration: '18 mois',
      resultsAchieved:
        'Plus de 12 000 bouteilles vendues dans 25 points de vente à Cotonou et Calavi.',
      approximateRevenue: '4 500 000 FCFA / an',
    },
    budget: {
      explanation:
        'Achat d\'une encapsuleuse semi-automatique et acquisition de 2000 bouteilles en verre personnalisées.',
      total: 500000,
      items: [
        {
          id: 'b1',
          category: 'Équipement',
          amount: 250000,
          description: 'Encapsuleuse inox semi-automatique',
        },
        {
          id: 'b2',
          category: 'Emballage',
          amount: 150000,
          description: 'Lot de 2000 bouteilles verre 33cl avec étiquettes',
        },
        {
          id: 'b3',
          category: 'Matières premières',
          amount: 100000,
          description: 'Achat bord champ de 1,5 tonne d\'ananas d\'Allada',
        },
      ],
    },
    media: {
      logoUrl: 'https://images.unsplash.com/photo-1546171753-97d7676e418b?w=400&q=80',
      productPhotoUrl:
        'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80',
      activityPhotoUrl:
        'https://images.unsplash.com/photo-1595855759920-86582396756a?w=800&q=80',
    },
    validation: {
      certifiedExact: true,
      acceptedRules: true,
    },
  },
  {
    id: 'CAND-2026-00102',
    submittedAt: '2026-09-22T14:15:00Z',
    status: 'EN ÉVALUATION',
    assignedJuryIds: ['jury-1'],
    candidate: {
      lastName: 'ADAMOU',
      firstName: 'Fatouma',
      phone: '+229 96 88 77 66',
      email: 'fatouma.adamou@parakou-farine.bj',
      city: 'Parakou',
      address: 'Quartier Titirou, Parakou',
      status: 'Entrepreneur',
    },
    project: {
      name: 'BéninBio Farines - Farines infantiles fortifiées aux céréales locales',
      sector: 'Agroalimentaire - Nutrition',
      category: 'Produits alimentaires transformés',
      description:
        'Production de farine pédiatrique à base de sorgho, maïs, moringa et baobab pour lutter contre la malnutrition infantile.',
      problem:
        'Taux élevé de malnutrition chronique infantile dans les zones rurales par manque d\'aliments de sevrage accessibles et nutritifs.',
      solution:
        'Farine instantanée prêt-à-cuire pré-gelatinisée enrichie en nutriments 100% bio et locaux.',
      targetClients:
        'Mères de famille, centres de santé communautaires, ONG humanitaires.',
      revenueModel: 'Vente en sachet de 250g à prix social (400 FCFA).',
      competitors: 'Farines industrielles importées très coûteuses.',
      differentiation:
        'Ingrédients locaux biodisponibles, goût apprécié des nourrissons et prix solidaire.',
      stage: 'Activité en cours',
      existenceDuration: '2 ans',
      resultsAchieved:
        'Distribution mensuelle de 1 500 sachets dans 3 communes du Nord-Bénin.',
      approximateRevenue: '3 200 000 FCFA / an',
    },
    budget: {
      explanation:
        'Acquisition d\'un séchoir solaire hybride et certification de conformité sanitaire ANSSFD.',
      total: 500000,
      items: [
        {
          id: 'b1',
          category: 'Équipement',
          amount: 300000,
          description: 'Séchoir solaire ventilé inox',
        },
        {
          id: 'b2',
          category: 'Marketing / communication',
          amount: 100000,
          description: 'Sensibilisation nutritionnelle & étiquetage réglementaire',
        },
        {
          id: 'b3',
          category: 'Production',
          amount: 100000,
          description: 'Analyse nutritionnelle en laboratoire agréé',
        },
      ],
    },
    media: {
      productPhotoUrl:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    },
    validation: {
      certifiedExact: true,
      acceptedRules: true,
    },
  },
  {
    id: 'CAND-2026-00103',
    submittedAt: '2026-09-25T09:00:00Z',
    status: 'FINALISTE',
    assignedJuryIds: ['jury-1', 'jury-2'],
    candidate: {
      lastName: 'HOUNGBO',
      firstName: 'Aurelle',
      phone: '+229 95 44 33 22',
      email: 'aurelle@akassa-delice.bj',
      city: 'Abomey-Calavi',
      address: 'Cité Arcon, Calavi',
      status: 'Entreprise',
    },
    project: {
      name: 'Akassa Délices - Akassa traditionnel sous vide longue conservation',
      sector: 'Transformation céréalière',
      category: 'Transformation agroalimentaire',
      description:
        'Stabilisation et mise sous vide de la pâte d\'akassa de maïs fermenté sans conservateur chimique, conservable 6 mois.',
      problem:
        'La périssabilité rapide (3 jours) de l\'akassa traditionnel empêche son exportation et sa vente en grande surface.',
      solution:
        'Conditionnement sous vide hermétique thermo-scellé associé à une pasteurisation douce à basse température.',
      targetClients:
        'Diaspora béninoise, cadres urbains, cantines scolaires et supermarchés.',
      revenueModel: 'Vente en carton de 12 unités et distribution en rayon frais.',
      competitors: 'Vendeuses de marché informel.',
      differentiation:
        'Conservation garantie 6 mois, hygiène irréprochable, prêt à consommer.',
      stage: 'Entreprise déjà établie',
      existenceDuration: '3 ans',
      resultsAchieved:
        'Exportation de premiers lots tests vers la France et le Sénégal.',
      approximateRevenue: '8 900 000 FCFA / an',
    },
    budget: {
      explanation:
        'Achat d\'une emballeuse sous vide à double cloche de capacité semi-industrielle.',
      total: 500000,
      items: [
        {
          id: 'b1',
          category: 'Équipement',
          amount: 350000,
          description: 'Machine sous vide à cloche pro',
        },
        {
          id: 'b2',
          category: 'Emballage',
          amount: 150000,
          description: 'Gaine barrière thermo-rétractable 5000 sachets',
        },
      ],
    },
    media: {
      productPhotoUrl:
        'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&q=80',
    },
    validation: {
      certifiedExact: true,
      acceptedRules: true,
    },
  },
];

export const INITIAL_MOCK_EVALUATIONS: JuryEvaluation[] = [
  {
    id: 'eval-1',
    applicationId: 'CAND-2026-00101',
    juryId: 'jury-1',
    juryName: 'Dr. Florentin AHOUANSOU (Expert Agro-Economiste)',
    scores: {
      problemRelevance: 9,
      innovation: 8,
      commercialPotential: 9,
      localEconomicImpact: 9,
      feasibility: 8,
      traction: 8,
      founderQuality: 9,
    },
    feedback:
      'Projet extrêmement solide. Excellente maîtrise de la chaîne de valeur de l\'ananas d\'Allada. Le plan de dotation est très bien justifié.',
    evaluatedAt: '2026-09-28T16:20:00Z',
    totalWeightedScore: 86.5,
  },
  {
    id: 'eval-2',
    applicationId: 'CAND-2026-00103',
    juryId: 'jury-1',
    juryName: 'Dr. Florentin AHOUANSOU (Expert Agro-Economiste)',
    scores: {
      problemRelevance: 10,
      innovation: 9,
      commercialPotential: 9,
      localEconomicImpact: 9,
      feasibility: 9,
      traction: 9,
      founderQuality: 10,
    },
    feedback:
      'Innovation majeure sur un plat emblématique béninois. Potentiel de marché gigantesque pour la diaspora.',
    evaluatedAt: '2026-09-29T11:45:00Z',
    totalWeightedScore: 92.0,
  },
];
