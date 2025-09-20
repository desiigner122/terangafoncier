// Feature flags for progressive activation of blockchain features
// Values can be overridden via Vite env variables

export const FEATURES = {
  ENABLE_ONCHAIN_ESCROW: (import.meta?.env?.VITE_ENABLE_ONCHAIN_ESCROW ?? 'false') === 'true',
  ENABLE_REQUEST_NFT: (import.meta?.env?.VITE_ENABLE_REQUEST_NFT ?? 'false') === 'true',
};

export default FEATURES;
