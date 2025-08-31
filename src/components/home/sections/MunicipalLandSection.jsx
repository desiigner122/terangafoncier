
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Landmark, FileSignature, ArrowRight } from 'lucide-react';

const MunicipalLandSection = () => {
    return (
        <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-border/50 shadow-lg">
                <div className="grid md:grid-cols-2">
                    <motion.div 
                        className="p-8 md:p-12 flex flex-col justify-center"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Landmark className="h-12 w-12 text-primary mb-4"/>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">
                            Accédez aux Terrains Communaux
                        </h2>
                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                            Vous ne trouvez pas le terrain parfait ? Teranga Foncier vous offre un accès privilégié pour soumettre directement votre demande d'attribution de parcelle à nos mairies partenaires. Une opportunité unique, simplifiée et sécurisée par notre plateforme.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button size="lg" asChild>
                                <Link to="/demande-terrain-communal">
                                    En savoir plus <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/request-municipal-land">
                                    Commencer ma demande <FileSignature className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="relative hidden md:block"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <img 
                            alt="Vue aérienne d'une ville côtière sénégalaise avec des zones d'aménagement"
                            className="absolute inset-0 w-full h-full object-cover"
                          src="https://images.unsplash.com/photo-1576613948343-4648b041b2e7" />
                    </motion.div>
                </div>
            </Card>
        </div>
    );
};

export default MunicipalLandSection;
