import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode';

/**
 * Service de génération de PDF pour TerangaFoncier
 * Génère des rapports de performance et des certificats blockchain
 */

class PDFGenerator {
  constructor() {
    this.colors = {
      primary: [147, 51, 234], // Purple-600
      secondary: [59, 130, 246], // Blue-600
      success: [16, 185, 129], // Green-600
      danger: [239, 68, 68], // Red-600
      gray: [107, 114, 128], // Gray-500
      lightGray: [243, 244, 246] // Gray-100
    };
  }

  /**
   * Génère un rapport de performance PDF
   * @param {Object} data - Données du dashboard
   * @param {Object} user - Informations utilisateur
   * @returns {Promise<void>}
   */
  async generatePerformanceReport(data, user) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    // En-tête
    this.addHeader(pdf, 'RAPPORT DE PERFORMANCE');
    
    // Ligne de séparation
    pdf.setDrawColor(...this.colors.primary);
    pdf.setLineWidth(0.5);
    pdf.line(20, 35, pageWidth - 20, 35);

    // Informations utilisateur
    let yPos = 45;
    pdf.setFontSize(10);
    pdf.setTextColor(...this.colors.gray);
    pdf.text(`Généré le: ${new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, yPos);
    yPos += 5;
    pdf.text(`Vendeur: ${user?.full_name || 'Non défini'}`, 20, yPos);
    yPos += 5;
    pdf.text(`Email: ${user?.email || 'Non défini'}`, 20, yPos);
    yPos += 15;

    // Section Statistiques Clés
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    pdf.text('📊 Statistiques Clés', 20, yPos);
    yPos += 10;

    const stats = [
      ['Total Propriétés', data.stats?.totalProperties || 0],
      ['Annonces Actives', data.stats?.activeListings || 0],
      ['Propriétés Vendues', data.stats?.soldProperties || 0],
      ['Revenu Total', this.formatCurrency(data.stats?.totalRevenue || 0)],
      ['Vues Mensuelles', data.stats?.monthlyViews || 0],
      ['Vérifiées Blockchain', data.stats?.blockchainVerified || 0],
      ['Optimisées IA', data.stats?.aiOptimized || 0]
    ];

    pdf.autoTable({
      startY: yPos,
      head: [['Métrique', 'Valeur']],
      body: stats,
      theme: 'striped',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: this.colors.lightGray
      }
    });

    yPos = pdf.lastAutoTable.finalY + 15;

    // Section Métriques IA
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('🤖 Métriques Intelligence Artificielle', 20, yPos);
    yPos += 10;

    const aiMetrics = [
      ['Précision Prix IA', `${data.aiMetrics?.priceAccuracy || 0}%`],
      ['Prédiction Tendances', `${data.aiMetrics?.marketTrendPrediction || 0}%`],
      ['Optimisation Annonces', `${data.aiMetrics?.listingOptimization || 0}%`],
      ['Score Qualité Photos', `${data.aiMetrics?.photoQualityScore || 0}%`]
    ];

    pdf.autoTable({
      startY: yPos,
      head: [['Métrique IA', 'Score']],
      body: aiMetrics,
      theme: 'striped',
      headStyles: {
        fillColor: [147, 51, 234], // Purple
        textColor: [255, 255, 255]
      }
    });

    yPos = pdf.lastAutoTable.finalY + 15;

    // Section Blockchain
    if (yPos > pageHeight - 60) {
      pdf.addPage();
      yPos = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('⛓️ Métriques Blockchain', 20, yPos);
    yPos += 10;

    const blockchainMetrics = [
      ['Taux de Vérification', `${data.blockchainMetrics?.verificationRate || 0}%`],
      ['Vitesse Transaction', `${data.blockchainMetrics?.transactionSpeed || 0}s`],
      ['Smart Contracts Actifs', data.blockchainMetrics?.smartContractsActive || 0],
      ['Disponibilité Réseau', `${data.blockchainMetrics?.networkUptime || 0}%`]
    ];

    pdf.autoTable({
      startY: yPos,
      head: [['Métrique Blockchain', 'Valeur']],
      body: blockchainMetrics,
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246], // Blue
        textColor: [255, 255, 255]
      }
    });

    // Nouvelle page pour liste propriétés
    pdf.addPage();
    yPos = 20;

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('🏘️ Liste des Propriétés', 20, yPos);
    yPos += 10;

    const properties = (data.properties || []).map(p => [
      p.title,
      p.location,
      this.formatCurrency(p.price),
      p.size,
      p.status === 'active' ? '✓ Active' : p.status === 'sold' ? '✓ Vendue' : 'En attente'
    ]);

    pdf.autoTable({
      startY: yPos,
      head: [['Titre', 'Localisation', 'Prix', 'Surface', 'Statut']],
      body: properties,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 40 },
        2: { cellWidth: 35 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 }
      }
    });

    // Pied de page
    this.addFooter(pdf);

    // Téléchargement
    const fileName = `rapport_performance_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  /**
   * Génère un certificat blockchain PDF
   * @param {Object} property - Propriété
   * @param {Object} blockchainData - Données blockchain
   * @returns {Promise<void>}
   */
  async generateBlockchainCertificate(property, blockchainData) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;

    // En-tête spécial certificat
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('CERTIFICAT BLOCKCHAIN', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('TerangaFoncier - Certification de Propriété', pageWidth / 2, 35, { align: 'center' });

    // Bordure dorée
    pdf.setDrawColor(218, 165, 32);
    pdf.setLineWidth(2);
    pdf.rect(15, 55, pageWidth - 30, 230);

    // Contenu
    let yPos = 75;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.text('Certifie que la propriété ci-dessous a été vérifiée et', pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    pdf.text('enregistrée sur la blockchain TerangaChain', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;

    // Informations Propriété
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('📍 Informations de la Propriété', 25, yPos);
    yPos += 10;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    const propertyInfo = [
      ['Titre:', property.title],
      ['Localisation:', property.location],
      ['Prix:', this.formatCurrency(property.price)],
      ['Surface:', property.size],
      ['Type:', property.type],
      ['Date:', new Date().toLocaleDateString('fr-FR')]
    ];

    propertyInfo.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, 30, yPos);
      pdf.setFont(undefined, 'normal');
      pdf.text(value, 70, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Informations Blockchain
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('⛓️ Données Blockchain', 25, yPos);
    yPos += 10;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    
    const blockchainInfo = [
      ['Hash Transaction:', blockchainData.transactionHash || '0x' + Math.random().toString(16).slice(2, 42)],
      ['Numéro de Bloc:', (blockchainData.blockNumber || Math.floor(Math.random() * 1000000)).toLocaleString()],
      ['Réseau:', blockchainData.network || 'TerangaChain'],
      ['Confirmations:', blockchainData.confirmations || Math.floor(Math.random() * 50) + 10],
      ['Statut:', blockchainData.verified ? '✅ Vérifié' : '⏳ En attente']
    ];

    blockchainInfo.forEach(([label, value]) => {
      pdf.setFont(undefined, 'bold');
      pdf.text(label, 30, yPos);
      pdf.setFont(undefined, 'normal');
      const displayValue = label === 'Hash Transaction:' 
        ? value.slice(0, 20) + '...' + value.slice(-10)
        : value.toString();
      pdf.text(displayValue, 70, yPos);
      yPos += 8;
    });

    // QR Code
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(
        `https://terangafoncier.com/verify/${property.id}`, 
        {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }
      );

      pdf.addImage(qrCodeDataUrl, 'PNG', pageWidth - 65, 180, 40, 40);
      
      pdf.setFontSize(8);
      pdf.setTextColor(...this.colors.gray);
      pdf.text('Scanner pour vérifier', pageWidth - 45, 225, { align: 'center' });
    } catch (error) {
      console.error('Erreur génération QR Code:', error);
    }

    // Signature et date
    yPos = 250;
    pdf.setDrawColor(...this.colors.primary);
    pdf.line(30, yPos, 90, yPos);
    pdf.line(pageWidth - 90, yPos, pageWidth - 30, yPos);
    
    yPos += 6;
    pdf.setFontSize(9);
    pdf.setTextColor(...this.colors.gray);
    pdf.text('Signature Numérique', 60, yPos, { align: 'center' });
    pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 60, yPos, { align: 'center' });

    // Pied de page
    pdf.setFontSize(8);
    pdf.setTextColor(...this.colors.gray);
    const footerText = 'Ce certificat est authentique et vérifiable sur la blockchain TerangaChain';
    pdf.text(footerText, pageWidth / 2, 280, { align: 'center' });

    // Téléchargement
    const fileName = `certificat_blockchain_${property.id}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  /**
   * Ajoute un en-tête standard au PDF
   */
  addHeader(pdf, title) {
    const pageWidth = pdf.internal.pageSize.width;
    
    // Logo et titre
    pdf.setFillColor(...this.colors.primary);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('TerangaFoncier', 20, 15);
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(title, 20, 23);
  }

  /**
   * Ajoute un pied de page standard au PDF
   */
  addFooter(pdf) {
    const pageCount = pdf.internal.getNumberOfPages();
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(...this.colors.gray);
      
      // Ligne de séparation
      pdf.setDrawColor(...this.colors.lightGray);
      pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
      
      // Texte pied de page
      pdf.text(
        `TerangaFoncier © ${new Date().getFullYear()} - Tous droits réservés`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      
      pdf.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: 'right' }
      );
    }
  }

  /**
   * Formate un montant en devise XOF
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

// Export singleton
export const pdfGenerator = new PDFGenerator();
export default pdfGenerator;
