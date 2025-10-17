import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonicalUrl }) => {
  const siteName = "Teranga Foncier";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  // Mots-clés par défaut + mots-clés spécifiques à la page
  const defaultKeywords = "blockchain immobilier, foncier sénégal, achat terrain sénégal, vente terrain, immobilier dakar, investissement diaspora, sécurité foncière";
  const combinedKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={combinedKeywords} />
      
      {/* Balises Open Graph (pour le partage sur les réseaux sociaux) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content="https://www.terangafoncier.sn/images/og-image.png" />

      {/* Balises Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.terangafoncier.sn/images/og-image.png" />

      {/* URL Canonique */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default SEO;
