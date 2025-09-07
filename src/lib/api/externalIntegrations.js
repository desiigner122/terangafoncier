// Intégrations API Externes - Banques & Cadastre National Sénégal
import axios from 'axios';

// Configuration des APIs externes
export const EXTERNAL_APIS = {
  // APIs Bancaires Sénégal
  banks: {
    cbao: {
      baseUrl: process.env.VITE_CBAO_API_URL || 'https://api.cbao.sn',
      apiKey: process.env.VITE_CBAO_API_KEY,
      endpoints: {
        creditEligibility: '/credit/eligibility',
        loanSimulation: '/credit/simulation',
        propertyValuation: '/valuation/property',
        accountVerification: '/account/verify'
      }
    },
    bhs: {
      baseUrl: process.env.VITE_BHS_API_URL || 'https://api.bhs.sn',
      apiKey: process.env.VITE_BHS_API_KEY,
      endpoints: {
        mortgageRates: '/mortgage/rates',
        preApproval: '/mortgage/preapproval',
        riskAssessment: '/risk/assessment'
      }
    },
    ecobank: {
      baseUrl: process.env.VITE_ECOBANK_API_URL || 'https://api.ecobank.com/sn',
      apiKey: process.env.VITE_ECOBANK_API_KEY,
      endpoints: {
        diasporaFinance: '/diaspora/finance',
        transferRates: '/transfer/rates',
        investmentProducts: '/investment/products'
      }
    }
  },

  // API Cadastre National
  cadastre: {
    baseUrl: process.env.VITE_CADASTRE_API_URL || 'https://api.cadastre.gouv.sn',
    apiKey: process.env.VITE_CADASTRE_API_KEY,
    endpoints: {
      propertyVerification: '/property/verify',
      titleDeedCheck: '/title/check',
      boundariesInfo: '/boundaries/info',
      legalStatus: '/legal/status',
      ownershipHistory: '/ownership/history'
    }
  },

  // Services Géographiques
  geography: {
    baseUrl: process.env.VITE_GEO_API_URL || 'https://api.geo.gouv.sn',
    apiKey: process.env.VITE_GEO_API_KEY,
    endpoints: {
      coordinates: '/coordinates',
      administrative: '/administrative',
      urbanPlanning: '/urban/planning'
    }
  },

  // API Notaires
  notaires: {
    baseUrl: process.env.VITE_NOTAIRES_API_URL || 'https://api.notaires.sn',
    apiKey: process.env.VITE_NOTAIRES_API_KEY,
    endpoints: {
      authentication: '/document/authenticate',
      registration: '/act/register',
      verification: '/verify'
    }
  }
};

// Classe pour gestion des APIs bancaires
export class BankingAPIService {
  constructor() {
    this.initialized = false;
  }

  // Vérification d'éligibilité au crédit
  async checkCreditEligibility(customerData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.banks.cbao.baseUrl}${EXTERNAL_APIS.banks.cbao.endpoints.creditEligibility}`,
        {
          income: customerData.income,
          expenses: customerData.expenses,
          existingLoans: customerData.existingLoans,
          employment: customerData.employment,
          propertyValue: customerData.propertyValue,
          downPayment: customerData.downPayment
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.banks.cbao.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        eligible: response.data.eligible,
        maxLoanAmount: response.data.maxLoanAmount,
        interestRate: response.data.interestRate,
        monthlyPayment: response.data.monthlyPayment,
        loanTerm: response.data.loanTerm,
        requirements: response.data.requirements
      };
    } catch (error) {
      console.error('❌ Erreur vérification éligibilité crédit:', error);
      return { eligible: false, error: error.message };
    }
  }

  // Simulation de prêt immobilier
  async simulateLoan(loanData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.banks.cbao.baseUrl}${EXTERNAL_APIS.banks.cbao.endpoints.loanSimulation}`,
        {
          amount: loanData.amount,
          term: loanData.term,
          interestRate: loanData.interestRate,
          propertyType: loanData.propertyType,
          location: loanData.location
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.banks.cbao.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        monthlyPayment: response.data.monthlyPayment,
        totalInterest: response.data.totalInterest,
        totalCost: response.data.totalCost,
        amortizationSchedule: response.data.amortizationSchedule,
        insurance: response.data.insurance,
        fees: response.data.fees
      };
    } catch (error) {
      console.error('❌ Erreur simulation prêt:', error);
      return { error: error.message };
    }
  }

  // Évaluation de propriété par la banque
  async getPropertyValuation(propertyData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.banks.cbao.baseUrl}${EXTERNAL_APIS.banks.cbao.endpoints.propertyValuation}`,
        {
          location: propertyData.location,
          area: propertyData.area,
          propertyType: propertyData.type,
          coordinates: propertyData.coordinates,
          amenities: propertyData.amenities,
          age: propertyData.age
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.banks.cbao.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        estimatedValue: response.data.estimatedValue,
        confidence: response.data.confidence,
        comparables: response.data.comparables,
        marketTrends: response.data.marketTrends,
        riskFactors: response.data.riskFactors
      };
    } catch (error) {
      console.error('❌ Erreur évaluation propriété:', error);
      return { error: error.message };
    }
  }

  // Taux de change et financement diaspora
  async getDiasporaFinancing(customerData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.banks.ecobank.baseUrl}${EXTERNAL_APIS.banks.ecobank.endpoints.diasporaFinance}`,
        {
          country: customerData.country,
          income: customerData.income,
          currency: customerData.currency,
          propertyValue: customerData.propertyValue,
          transferHistory: customerData.transferHistory
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.banks.ecobank.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        eligibleProducts: response.data.eligibleProducts,
        exchangeRates: response.data.exchangeRates,
        transferFees: response.data.transferFees,
        specialOffers: response.data.specialOffers,
        requiredDocuments: response.data.requiredDocuments
      };
    } catch (error) {
      console.error('❌ Erreur financement diaspora:', error);
      return { error: error.message };
    }
  }
}

// Classe pour API Cadastre National
export class CadastreAPIService {
  constructor() {
    this.initialized = false;
  }

  // Vérification d'un titre foncier
  async verifyTitleDeed(titleNumber) {
    try {
      const response = await axios.get(
        `${EXTERNAL_APIS.cadastre.baseUrl}${EXTERNAL_APIS.cadastre.endpoints.titleDeedCheck}/${titleNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.cadastre.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        valid: response.data.valid,
        owner: response.data.owner,
        area: response.data.area,
        location: response.data.location,
        restrictions: response.data.restrictions,
        mortgages: response.data.mortgages,
        legalStatus: response.data.legalStatus,
        lastUpdate: response.data.lastUpdate
      };
    } catch (error) {
      console.error('❌ Erreur vérification titre foncier:', error);
      return { valid: false, error: error.message };
    }
  }

  // Vérification des limites de propriété
  async verifyPropertyBoundaries(coordinates) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.cadastre.baseUrl}${EXTERNAL_APIS.cadastre.endpoints.boundariesInfo}`,
        {
          coordinates: coordinates,
          checkConflicts: true
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.cadastre.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        verified: response.data.verified,
        boundaries: response.data.boundaries,
        conflicts: response.data.conflicts,
        neighbors: response.data.neighbors,
        warnings: response.data.warnings
      };
    } catch (error) {
      console.error('❌ Erreur vérification limites:', error);
      return { verified: false, error: error.message };
    }
  }

  // Historique de propriété
  async getOwnershipHistory(propertyId) {
    try {
      const response = await axios.get(
        `${EXTERNAL_APIS.cadastre.baseUrl}${EXTERNAL_APIS.cadastre.endpoints.ownershipHistory}/${propertyId}`,
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.cadastre.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        history: response.data.history,
        transactions: response.data.transactions,
        disputes: response.data.disputes,
        legalChanges: response.data.legalChanges
      };
    } catch (error) {
      console.error('❌ Erreur historique propriété:', error);
      return { error: error.message };
    }
  }

  // Statut légal d'une propriété
  async getLegalStatus(propertyData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.cadastre.baseUrl}${EXTERNAL_APIS.cadastre.endpoints.legalStatus}`,
        {
          titleNumber: propertyData.titleNumber,
          location: propertyData.location,
          owner: propertyData.owner
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.cadastre.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        status: response.data.status,
        restrictions: response.data.restrictions,
        permits: response.data.permits,
        taxes: response.data.taxes,
        compliance: response.data.compliance
      };
    } catch (error) {
      console.error('❌ Erreur statut légal:', error);
      return { error: error.message };
    }
  }
}

// Classe pour authentification notariale
export class NotaryAPIService {
  constructor() {
    this.initialized = false;
  }

  // Authentification d'un document
  async authenticateDocument(documentData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.notaires.baseUrl}${EXTERNAL_APIS.notaires.endpoints.authentication}`,
        {
          documentHash: documentData.hash,
          documentType: documentData.type,
          parties: documentData.parties,
          notaryId: documentData.notaryId
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.notaires.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        authenticated: response.data.authenticated,
        notarySignature: response.data.notarySignature,
        timestamp: response.data.timestamp,
        certificateNumber: response.data.certificateNumber,
        validity: response.data.validity
      };
    } catch (error) {
      console.error('❌ Erreur authentification document:', error);
      return { authenticated: false, error: error.message };
    }
  }

  // Enregistrement d'un acte
  async registerAct(actData) {
    try {
      const response = await axios.post(
        `${EXTERNAL_APIS.notaires.baseUrl}${EXTERNAL_APIS.notaires.endpoints.registration}`,
        {
          actType: actData.type,
          parties: actData.parties,
          property: actData.property,
          conditions: actData.conditions,
          notaryId: actData.notaryId
        },
        {
          headers: {
            'Authorization': `Bearer ${EXTERNAL_APIS.notaires.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        registered: response.data.registered,
        actNumber: response.data.actNumber,
        registrationDate: response.data.registrationDate,
        fees: response.data.fees,
        requirements: response.data.requirements
      };
    } catch (error) {
      console.error('❌ Erreur enregistrement acte:', error);
      return { registered: false, error: error.message };
    }
  }
}

// Services intégrés
export const bankingService = new BankingAPIService();
export const cadastreService = new CadastreAPIService();
export const notaryService = new NotaryAPIService();

// Fonction de vérification complète d'une propriété
export async function completePropertyVerification(propertyData) {
  const results = {
    cadastre: null,
    banking: null,
    legal: null,
    blockchain: null,
    overall: 'pending'
  };

  try {
    // Vérification cadastrale
    if (propertyData.titleNumber) {
      results.cadastre = await cadastreService.verifyTitleDeed(propertyData.titleNumber);
    }

    // Évaluation bancaire
    if (propertyData.requestValuation) {
      results.banking = await bankingService.getPropertyValuation(propertyData);
    }

    // Statut légal
    results.legal = await cadastreService.getLegalStatus(propertyData);

    // Déterminer le statut global
    const cadastreValid = results.cadastre?.valid !== false;
    const legalCompliant = results.legal?.status === 'compliant';
    const bankingApproved = results.banking?.confidence > 0.8;

    if (cadastreValid && legalCompliant && bankingApproved) {
      results.overall = 'verified';
    } else if (cadastreValid && legalCompliant) {
      results.overall = 'partial';
    } else {
      results.overall = 'failed';
    }

    return results;
  } catch (error) {
    console.error('❌ Erreur vérification complète:', error);
    results.overall = 'error';
    results.error = error.message;
    return results;
  }
}

// Hook pour utilisation dans les composants
export const useExternalAPIs = () => {
  return {
    banking: bankingService,
    cadastre: cadastreService,
    notary: notaryService,
    completeVerification: completePropertyVerification
  };
};

export default {
  banking: bankingService,
  cadastre: cadastreService,
  notary: notaryService,
  completeVerification: completePropertyVerification
};
