/**
 * @file docusignService.js
 * @description Service DocuSign pour signature électronique contrats
 * @created 2025-11-03
 * @week 2 - Day 1-3
 */

const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');

class DocuSignService {
  constructor() {
    this.apiClient = new docusign.ApiClient();
    this.apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi');
    
    this.accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    this.integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    this.userId = process.env.DOCUSIGN_USER_ID;
    this.privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    this.oAuthBasePath = process.env.DOCUSIGN_OAUTH_BASE_PATH || 'account-d.docusign.com';
    
    // Templates pré-configurés dans DocuSign
    this.templateIds = {
      PURCHASE_CONTRACT: process.env.DOCUSIGN_TEMPLATE_PURCHASE || 'template_purchase_001',
      INSTALLMENT_AGREEMENT: process.env.DOCUSIGN_TEMPLATE_INSTALLMENT || 'template_installment_001',
      FINANCING_CONTRACT: process.env.DOCUSIGN_TEMPLATE_FINANCING || 'template_financing_001',
      SELLER_MANDATE: process.env.DOCUSIGN_TEMPLATE_SELLER || 'template_seller_001',
    };
  }

  /**
   * Authentification JWT avec DocuSign
   */
  async authenticate() {
    try {
      const rsaKey = Buffer.from(this.privateKey.replace(/\\n/g, '\n'), 'utf-8');
      
      const results = await this.apiClient.requestJWTUserToken(
        this.integrationKey,
        this.userId,
        ['signature', 'impersonation'],
        rsaKey,
        3600 // 1 heure
      );

      const accessToken = results.body.access_token;
      
      // Set access token
      this.apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
      
      console.log('✅ DocuSign authenticated successfully');
      return accessToken;

    } catch (error) {
      console.error('❌ DocuSign authentication failed:', error);
      throw new Error(`DocuSign auth error: ${error.message}`);
    }
  }

  /**
   * Créer enveloppe de signature pour contrat d'achat
   * @param {Object} contractData - Données du contrat
   * @returns {Promise<Object>} - Envelope ID + URLs signature
   */
  async createPurchaseEnvelope(contractData) {
    try {
      await this.authenticate();

      const {
        caseId,
        propertyId,
        buyerEmail,
        buyerName,
        sellerEmail,
        sellerName,
        notaireEmail,
        notaireName,
        price,
        propertyAddress,
        paymentMethod,
      } = contractData;

      // Créer enveloppe depuis template
      const envelopeDefinition = new docusign.EnvelopeDefinition();
      envelopeDefinition.templateId = this.templateIds.PURCHASE_CONTRACT;
      envelopeDefinition.status = 'sent'; // Envoi immédiat

      // Signataires
      const signers = [];

      // 1. Acheteur (doit signer en premier)
      const buyerSigner = docusign.TemplateRole.constructFromObject({
        email: buyerEmail,
        name: buyerName,
        roleName: 'Acheteur',
        routingOrder: '1',
        tabs: {
          textTabs: [
            { tabLabel: 'CaseID', value: caseId },
            { tabLabel: 'PropertyAddress', value: propertyAddress },
            { tabLabel: 'Price', value: price.toLocaleString('fr-FR') },
            { tabLabel: 'PaymentMethod', value: paymentMethod },
          ],
        },
      });
      signers.push(buyerSigner);

      // 2. Vendeur (signe après acheteur)
      const sellerSigner = docusign.TemplateRole.constructFromObject({
        email: sellerEmail,
        name: sellerName,
        roleName: 'Vendeur',
        routingOrder: '2',
      });
      signers.push(sellerSigner);

      // 3. Notaire (signe en dernier, reçoit copie)
      const notaireSigner = docusign.TemplateRole.constructFromObject({
        email: notaireEmail,
        name: notaireName,
        roleName: 'Notaire',
        routingOrder: '3',
      });
      signers.push(notaireSigner);

      envelopeDefinition.templateRoles = signers;

      // Paramètres email
      envelopeDefinition.emailSubject = `Contrat d'achat - ${propertyAddress}`;
      envelopeDefinition.emailBlurb = `Veuillez signer le contrat d'achat pour le bien situé à ${propertyAddress}. Prix: ${price.toLocaleString('fr-FR')} FCFA.`;

      // Créer enveloppe
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
      const results = await envelopesApi.createEnvelope(this.accountId, {
        envelopeDefinition,
      });

      const envelopeId = results.envelopeId;

      // Générer URLs de signature pour chaque signataire
      const buyerUrl = await this.getRecipientView(envelopeId, buyerEmail, buyerName, '/dashboard/case-tracking/' + caseId);
      const sellerUrl = await this.getRecipientView(envelopeId, sellerEmail, sellerName, '/vendeur/transactions');
      const notaireUrl = await this.getRecipientView(envelopeId, notaireEmail, notaireName, '/solutions/notaires/dashboard/cases/' + caseId);

      console.log(`✅ DocuSign envelope created: ${envelopeId}`);

      return {
        success: true,
        envelopeId,
        status: 'sent',
        signingUrls: {
          buyer: buyerUrl,
          seller: sellerUrl,
          notaire: notaireUrl,
        },
      };

    } catch (error) {
      console.error('❌ Error creating DocuSign envelope:', error);
      throw error;
    }
  }

  /**
   * Générer URL de signature embedded
   * @param {String} envelopeId - ID enveloppe
   * @param {String} recipientEmail - Email signataire
   * @param {String} recipientName - Nom signataire
   * @param {String} returnUrl - URL retour après signature
   */
  async getRecipientView(envelopeId, recipientEmail, recipientName, returnUrl) {
    try {
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient);

      const viewRequest = new docusign.RecipientViewRequest();
      viewRequest.returnUrl = `${process.env.FRONTEND_URL}${returnUrl}?signed=true`;
      viewRequest.authenticationMethod = 'email';
      viewRequest.email = recipientEmail;
      viewRequest.userName = recipientName;
      viewRequest.clientUserId = recipientEmail; // Unique ID

      const results = await envelopesApi.createRecipientView(this.accountId, envelopeId, {
        recipientViewRequest: viewRequest,
      });

      return results.url;

    } catch (error) {
      console.error('❌ Error generating recipient view:', error);
      throw error;
    }
  }

  /**
   * Vérifier statut enveloppe
   * @param {String} envelopeId - ID enveloppe
   */
  async getEnvelopeStatus(envelopeId) {
    try {
      await this.authenticate();

      const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
      const envelope = await envelopesApi.getEnvelope(this.accountId, envelopeId);

      // Récupérer statut des signataires
      const recipients = await envelopesApi.listRecipients(this.accountId, envelopeId);

      return {
        envelopeId: envelope.envelopeId,
        status: envelope.status, // 'sent', 'delivered', 'completed', 'voided'
        sentDateTime: envelope.sentDateTime,
        completedDateTime: envelope.completedDateTime,
        recipients: recipients.signers.map(signer => ({
          name: signer.name,
          email: signer.email,
          status: signer.status, // 'sent', 'delivered', 'signed', 'completed'
          signedDateTime: signer.signedDateTime,
          roleName: signer.roleName,
        })),
      };

    } catch (error) {
      console.error('❌ Error getting envelope status:', error);
      throw error;
    }
  }

  /**
   * Télécharger document signé (PDF)
   * @param {String} envelopeId - ID enveloppe
   */
  async downloadSignedDocument(envelopeId) {
    try {
      await this.authenticate();

      const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
      const results = await envelopesApi.getDocument(this.accountId, envelopeId, 'combined');

      return results; // Buffer PDF

    } catch (error) {
      console.error('❌ Error downloading signed document:', error);
      throw error;
    }
  }

  /**
   * Annuler enveloppe (void)
   * @param {String} envelopeId - ID enveloppe
   * @param {String} reason - Raison annulation
   */
  async voidEnvelope(envelopeId, reason) {
    try {
      await this.authenticate();

      const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
      
      const envelope = new docusign.Envelope();
      envelope.status = 'voided';
      envelope.voidedReason = reason;

      await envelopesApi.update(this.accountId, envelopeId, { envelope });

      console.log(`✅ DocuSign envelope voided: ${envelopeId}`);
      return { success: true, status: 'voided' };

    } catch (error) {
      console.error('❌ Error voiding envelope:', error);
      throw error;
    }
  }

  /**
   * Créer enveloppe avec document PDF personnalisé (non template)
   * @param {Object} documentData - Données document
   */
  async createCustomEnvelope(documentData) {
    try {
      await this.authenticate();

      const {
        documentBase64,
        documentName,
        signers,
        emailSubject,
        emailBody,
      } = documentData;

      // Créer document
      const document = new docusign.Document();
      document.documentBase64 = documentBase64;
      document.name = documentName;
      document.fileExtension = 'pdf';
      document.documentId = '1';

      // Créer enveloppe
      const envelopeDefinition = new docusign.EnvelopeDefinition();
      envelopeDefinition.emailSubject = emailSubject;
      envelopeDefinition.emailBlurb = emailBody;
      envelopeDefinition.documents = [document];
      envelopeDefinition.status = 'sent';

      // Ajouter signataires
      const recipients = new docusign.Recipients();
      recipients.signers = signers.map((signer, index) => {
        const s = docusign.Signer.constructFromObject({
          email: signer.email,
          name: signer.name,
          recipientId: (index + 1).toString(),
          routingOrder: (index + 1).toString(),
        });

        // Ajouter onglet signature
        s.tabs = docusign.Tabs.constructFromObject({
          signHereTabs: [{
            documentId: '1',
            pageNumber: '1',
            xPosition: '100',
            yPosition: '150',
          }],
        });

        return s;
      });

      envelopeDefinition.recipients = recipients;

      // Créer enveloppe
      const envelopesApi = new docusign.EnvelopesApi(this.apiClient);
      const results = await envelopesApi.createEnvelope(this.accountId, {
        envelopeDefinition,
      });

      console.log(`✅ Custom DocuSign envelope created: ${results.envelopeId}`);
      return {
        success: true,
        envelopeId: results.envelopeId,
        status: 'sent',
      };

    } catch (error) {
      console.error('❌ Error creating custom envelope:', error);
      throw error;
    }
  }
}

module.exports = new DocuSignService();
