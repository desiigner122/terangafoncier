-- 🎲 INSERTION DONNÉES DE TEST - Dashboard Notaire
-- Exécutez ce script dans Supabase SQL Editor

-- 1. PROFILS NOTAIRES
INSERT INTO profiles (id, full_name, role, email, phone, created_at)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Me. Jean Dupont', 'Notaire', 'jean.dupont@notaires.sn', '+221 77 123 45 67', NOW() - INTERVAL '2 years'),
('22222222-2222-2222-2222-222222222222', 'Me. Fatou Sall', 'Notaire', 'fatou.sall@notaires.sn', '+221 77 234 56 78', NOW() - INTERVAL '3 years')
ON CONFLICT (id) DO NOTHING;

-- 2. ACTES NOTARIÉS (12 actes)
INSERT INTO notarial_acts (notaire_id, act_number, act_type, status, client_name, act_value, notary_fees, client_satisfaction, actual_duration_days, created_at, completed_date) VALUES
('11111111-1111-1111-1111-111111111111', 'ACT-2025-001', 'vente_terrain', 'completed', 'Amadou Ba', 25000000, 500000, 4.5, 15, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month 15 days'),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-002', 'vente_immobiliere', 'completed', 'Mariama Diop', 45000000, 900000, 5.0, 20, NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 months 10 days'),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-003', 'succession', 'completed', 'Ibrahima Fall', 18000000, 360000, 4.8, 25, NOW() - INTERVAL '4 months', NOW() - INTERVAL '3 months 5 days'),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-004', 'vente_terrain', 'completed', 'Aissatou Ndiaye', 15000000, 300000, 4.7, 12, NOW() - INTERVAL '1 month', NOW() - INTERVAL '15 days'),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-005', 'hypotheque', 'completed', 'Ousmane Sow', 35000000, 700000, 4.9, 18, NOW() - INTERVAL '5 months', NOW() - INTERVAL '4 months'),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-006', 'vente_immobiliere', 'signature_pending', 'Khady Seck', 52000000, 1040000, NULL, NULL, NOW() - INTERVAL '10 days', NULL),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-007', 'vente_terrain', 'documentation', 'Moussa Diallo', 20000000, 400000, NULL, NULL, NOW() - INTERVAL '5 days', NULL),
('11111111-1111-1111-1111-111111111111', 'ACT-2025-008', 'donation', 'draft_review', 'Seynabou Gueye', 8000000, 160000, NULL, NULL, NOW() - INTERVAL '2 days', NULL),
('22222222-2222-2222-2222-222222222222', 'ACT-2025-101', 'vente_terrain', 'completed', 'Modou Faye', 18000000, 360000, 4.6, 16, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month 16 days'),
('22222222-2222-2222-2222-222222222222', 'ACT-2025-102', 'vente_immobiliere', 'completed', 'Awa Cissé', 42000000, 840000, 4.9, 22, NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 months 8 days'),
('22222222-2222-2222-2222-222222222222', 'ACT-2025-103', 'hypotheque', 'completed', 'Cheikh Sy', 30000000, 600000, 4.8, 19, NOW() - INTERVAL '4 months', NOW() - INTERVAL '3 months 11 days'),
('22222222-2222-2222-2222-222222222222', 'ACT-2025-104', 'succession', 'registration', 'Mamadou Sarr', 22000000, 440000, NULL, NULL, NOW() - INTERVAL '12 days', NULL);

-- 3. DOSSIERS (8 dossiers)
INSERT INTO notarial_cases (notaire_id, case_number, case_type, case_status, client_name, description, estimated_value, priority, created_at, due_date) VALUES
('11111111-1111-1111-1111-111111111111', 'DOS-2025-001', 'vente', 'active', 'Binta Diagne', 'Vente villa 4 pièces Almadies', 65000000, 'high', NOW() - INTERVAL '5 days', NOW() + INTERVAL '20 days'),
('11111111-1111-1111-1111-111111111111', 'DOS-2025-002', 'succession', 'pending', 'Omar Kane', 'Succession M. Kane père', 12000000, 'medium', NOW() - INTERVAL '10 days', NOW() + INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111111', 'DOS-2025-003', 'hypotheque', 'active', 'Ndèye Diop', 'Hypothèque financement immobilier', 28000000, 'high', NOW() - INTERVAL '3 days', NOW() + INTERVAL '15 days'),
('11111111-1111-1111-1111-111111111111', 'DOS-2025-004', 'vente', 'completed', 'Alioune Mbaye', 'Vente terrain 2000m²', 15000000, 'medium', NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month'),
('11111111-1111-1111-1111-111111111111', 'DOS-2025-005', 'donation', 'archived', 'Sokhna Niang', 'Donation entre époux', 0, 'low', NOW() - INTERVAL '4 months', NOW() - INTERVAL '3 months'),
('22222222-2222-2222-2222-222222222222', 'DOS-2025-101', 'vente', 'active', 'Pape Sow', 'Vente appartement F3', 38000000, 'high', NOW() - INTERVAL '7 days', NOW() + INTERVAL '25 days'),
('22222222-2222-2222-2222-222222222222', 'DOS-2025-102', 'hypotheque', 'pending', 'Coumba Fall', 'Prêt BICIS', 45000000, 'medium', NOW() - INTERVAL '8 days', NOW() + INTERVAL '35 days'),
('22222222-2222-2222-2222-222222222222', 'DOS-2025-103', 'succession', 'completed', 'Lamine Diop', 'Succession testamentaire', 18000000, 'low', NOW() - INTERVAL '3 months', NOW() - INTERVAL '2 months');

-- 4. ARCHIVES (8 archives)
INSERT INTO archived_acts (notaire_id, act_number, act_type, archive_date, client_name, act_value, notary_fees, completion_date, storage_location, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'ACT-2024-245', 'vente_terrain', NOW() - INTERVAL '6 months', 'Abdoulaye Thiam', 22000000, 440000, NOW() - INTERVAL '7 months', 'Rayonnage B-34', 'Dossier complet'),
('11111111-1111-1111-1111-111111111111', 'ACT-2024-198', 'vente_immobiliere', NOW() - INTERVAL '8 months', 'Yacine Sarr', 48000000, 960000, NOW() - INTERVAL '9 months', 'Archive A-12', 'Maison Mermoz'),
('11111111-1111-1111-1111-111111111111', 'ACT-2024-156', 'succession', NOW() - INTERVAL '10 months', 'Famille Diagne', 15000000, 300000, NOW() - INTERVAL '11 months', 'Rayonnage C-8', '3 héritiers'),
('11111111-1111-1111-1111-111111111111', 'ACT-2023-987', 'hypotheque', NOW() - INTERVAL '1 year', 'Société IMMOSN', 120000000, 2400000, NOW() - INTERVAL '1 year 1 month', 'Coffrefort', 'Immeuble commercial'),
('11111111-1111-1111-1111-111111111111', 'ACT-2023-834', 'vente_terrain', NOW() - INTERVAL '1 year 3 months', 'Groupe SONATEL', 85000000, 1700000, NOW() - INTERVAL '1 year 4 months', 'Coffre spécial', 'Terrain 5000m²'),
('22222222-2222-2222-2222-222222222222', 'ACT-2024-312', 'vente_immobiliere', NOW() - INTERVAL '5 months', 'Khadija Bah', 32000000, 640000, NOW() - INTERVAL '6 months', 'Rayonnage D-21', 'F3 Sacré-Cœur'),
('22222222-2222-2222-2222-222222222222', 'ACT-2024-267', 'donation', NOW() - INTERVAL '7 months', 'Ibrahima Thioye', 6000000, 120000, NOW() - INTERVAL '8 months', 'Archive numérique', 'Parent-enfant'),
('22222222-2222-2222-2222-222222222222', 'ACT-2023-745', 'vente_terrain', NOW() - INTERVAL '1 year 2 months', 'Mamadou Wade', 35000000, 700000, NOW() - INTERVAL '1 year 3 months', 'Rayonnage A-45', 'Mbao 1500m²');

-- 5. CONFORMITÉ (5 checks)
INSERT INTO compliance_checks (notaire_id, check_number, check_type, check_status, compliance_score, check_date, completed_date, findings, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'COMP-2025-Q1', 'regulatory', 'completed', 95, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month 25 days', '{"items_checked": 45, "items_passed": 43}', 'Résultat satisfaisant'),
('11111111-1111-1111-1111-111111111111', 'COMP-2025-SEC-01', 'security', 'completed', 88, NOW() - INTERVAL '1 month', NOW() - INTERVAL '25 days', '{"encryption": "ok"}', 'Audit sécurité'),
('11111111-1111-1111-1111-111111111111', 'COMP-2025-QUAL-01', 'quality', 'pending', NULL, NOW() - INTERVAL '5 days', NULL, NULL, 'Vérification qualité'),
('22222222-2222-2222-2222-222222222222', 'COMP-2025-Q1-FS', 'regulatory', 'completed', 92, NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month 20 days', '{"items_checked": 45, "items_passed": 41}', 'Conformité Q1'),
('22222222-2222-2222-2222-222222222222', 'COMP-2025-SEC-FS', 'security', 'failed', 65, NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days', '{"critical_issues": 3}', 'Actions requises');

-- 6. CLIENTS (8 clients)
INSERT INTO clients_notaire (notaire_id, client_name, client_type, email, phone, total_transactions, total_revenue, satisfaction_score, created_at, last_contact) VALUES
('11111111-1111-1111-1111-111111111111', 'Amadou Ba', 'individual', 'amadou.ba@email.sn', '+221 77 555 11 11', 3, 1500000, 4.5, NOW() - INTERVAL '2 years', NOW() - INTERVAL '2 months'),
('11111111-1111-1111-1111-111111111111', 'Mariama Diop', 'individual', 'mariama.diop@email.sn', '+221 77 555 22 22', 2, 1200000, 5.0, NOW() - INTERVAL '1 year', NOW() - INTERVAL '3 months'),
('11111111-1111-1111-1111-111111111111', 'Société IMMOSN', 'corporate', 'contact@immosn.sn', '+221 33 822 33 44', 12, 8500000, 4.8, NOW() - INTERVAL '3 years', NOW() - INTERVAL '1 month'),
('11111111-1111-1111-1111-111111111111', 'Khady Seck', 'individual', 'khady.seck@email.sn', '+221 77 555 33 33', 1, 520000, 4.7, NOW() - INTERVAL '6 months', NOW() - INTERVAL '10 days'),
('11111111-1111-1111-1111-111111111111', 'Groupe SONATEL', 'corporate', 'legal@sonatel.sn', '+221 33 839 77 77', 5, 6200000, 4.9, NOW() - INTERVAL '4 years', NOW() - INTERVAL '1 year'),
('22222222-2222-2222-2222-222222222222', 'Modou Faye', 'individual', 'modou.faye@email.sn', '+221 77 666 11 11', 2, 720000, 4.6, NOW() - INTERVAL '1 year', NOW() - INTERVAL '2 months'),
('22222222-2222-2222-2222-222222222222', 'Awa Cissé', 'individual', 'awa.cisse@email.sn', '+221 77 666 22 22', 3, 1600000, 4.9, NOW() - INTERVAL '2 years', NOW() - INTERVAL '3 months'),
('22222222-2222-2222-2222-222222222222', 'Khadija Bah', 'individual', 'khadija.bah@email.sn', '+221 77 666 33 33', 1, 640000, 4.8, NOW() - INTERVAL '6 months', NOW() - INTERVAL '5 months');

-- 7. COMMUNICATIONS (5 communications)
INSERT INTO tripartite_communications (notaire_id, communication_type, participants, subject, content, status, created_at, last_updated) VALUES
('11111111-1111-1111-1111-111111111111', 'vendeur_acheteur_notaire', '["Amadou Ba", "Binta Diagne", "Me. Jean Dupont"]', 'Documents manquants', 'Il manque le certificat de non-gage', 'active', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 'banque_client_notaire', '["BICIS", "Ndèye Diop", "Me. Jean Dupont"]', 'Validation hypothèque', 'Dossier validé par la banque', 'completed', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),
('11111111-1111-1111-1111-111111111111', 'vendeur_acheteur_notaire', '["Souleymane Diouf", "Khady Seck", "Me. Jean Dupont"]', 'Confirmation RDV', 'RDV le 20/10 à 10h', 'active', NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'),
('22222222-2222-2222-2222-222222222222', 'banque_client_notaire', '["Banque Atlantique", "Pape Sow", "Me. Fatou Sall"]', 'Prêt en cours', 'Comité jeudi', 'active', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('22222222-2222-2222-2222-222222222222', 'vendeur_acheteur_notaire', '["Ibrahim Touré", "Mamadou Sarr", "Me. Fatou Sall"]', 'Partage succession', '3 héritiers présents requis', 'pending', NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days');

-- 8. AUTHENTIFICATIONS (6 documents)
INSERT INTO document_authentication (notaire_id, document_number, document_type, client_name, verification_status, blockchain_hash, authentication_date, expiration_date, notes) VALUES
('11111111-1111-1111-1111-111111111111', 'AUTH-2025-001', 'titre_propriete', 'Amadou Ba', 'verified', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', NOW() - INTERVAL '2 months', NOW() + INTERVAL '10 months', 'TF-45698 vérifié'),
('11111111-1111-1111-1111-111111111111', 'AUTH-2025-002', 'acte_vente', 'Mariama Diop', 'verified', 'bc1q3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9z0x1c2', NOW() - INTERVAL '3 months', NOW() + INTERVAL '9 months', 'Blockchain authentifié'),
('11111111-1111-1111-1111-111111111111', 'AUTH-2025-003', 'attestation_succession', 'Ibrahima Fall', 'verified', 'bc1qm2n3b4v5c6x7z8a9s0d1f2g3h4j5k6l7p8o9i0u', NOW() - INTERVAL '4 months', NOW() + INTERVAL '8 months', 'Succession certifiée'),
('11111111-1111-1111-1111-111111111111', 'AUTH-2025-004', 'titre_propriete', 'Khady Seck', 'pending', NULL, NOW() - INTERVAL '2 days', NULL, 'En cours vérification'),
('22222222-2222-2222-2222-222222222222', 'AUTH-2025-101', 'acte_vente', 'Modou Faye', 'verified', 'bc1qw2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9m0n', NOW() - INTERVAL '2 months', NOW() + INTERVAL '10 months', 'Pikine blockchain'),
('22222222-2222-2222-2222-222222222222', 'AUTH-2025-102', 'hypotheque', 'Awa Cissé', 'verified', 'bc1q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9z0', NOW() - INTERVAL '3 months', NOW() + INTERVAL '9 months', 'BICIS certifié');

-- UPDATE SEARCH VECTOR
UPDATE archived_acts 
SET search_vector = to_tsvector('french', COALESCE(act_number, '') || ' ' || COALESCE(client_name, '') || ' ' || COALESCE(notes, ''));

-- VÉRIFICATION
SELECT 'notarial_acts' as table, COUNT(*) as records FROM notarial_acts
UNION ALL SELECT 'notarial_cases', COUNT(*) FROM notarial_cases
UNION ALL SELECT 'archived_acts', COUNT(*) FROM archived_acts
UNION ALL SELECT 'compliance_checks', COUNT(*) FROM compliance_checks
UNION ALL SELECT 'clients_notaire', COUNT(*) FROM clients_notaire
UNION ALL SELECT 'tripartite_communications', COUNT(*) FROM tripartite_communications
UNION ALL SELECT 'document_authentication', COUNT(*) FROM document_authentication;
