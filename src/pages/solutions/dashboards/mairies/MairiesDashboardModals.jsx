
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Badge } from '@/components/ui/badge';
    import { Checkbox } from '@/components/ui/checkbox';
    import { AlertCircle, CheckCircle, Clock, MessageSquare, Eye, User, FileText, Search, MapPin, Maximize } from 'lucide-react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { format } from 'date-fns';
    import { fr } from 'date-fns/locale';
    import { sampleParcels } from '@/data';
    import { Card, CardContent } from '@/components/ui/card';
    import { useToast } from "@/components/ui/use-toast-simple";

    const checklistItems = [
        { id: 'check-dossier', label: 'Dossier complet vérifié' },
        { id: 'check-technique', label: 'Avis technique favorable' },
        { id: 'check-commission', label: 'Passage en commission' },
        { id: 'check-signature', label: 'En attente de signature Maire' },
    ];

    const formatPrice = (price) => new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(price);

    const ApplicantInfo = ({ user }) => (
        <div className="p-4 rounded-lg bg-muted/50 border flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-bold text-lg">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Membre depuis: {user?.created_at ? format(new Date(user.created_at), 'd MMMM yyyy', { locale: fr }) : 'N/A'}</p>
            </div>
        </div>
    );

    const RequestDocuments = ({ documents }) => (
        <div>
            <h4 className="font-semibold mb-2 text-base">Documents Justificatifs</h4>
            {documents && Object.keys(documents).length > 0 ? (
                <ul className="space-y-2">
                    {Object.entries(documents).map(([key, value]) => (
                        <li key={key} className="flex items-center justify-between p-2 border rounded-md bg-background">
                            <span className="text-sm font-medium capitalize flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                {key.replace(/_/g, ' ')}
                            </span>
                            <Button asChild variant="outline" size="sm">
                                <a href={value} target="_blank" rel="noopener noreferrer">
                                    <Eye className="mr-2 h-4 w-4" /> Voir
                                </a>
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-sm text-muted-foreground p-4 border rounded-md">Aucun document n'a été fourni pour cette demande.</p>
            )}
        </div>
    );

    const RequestTimeline = ({ history }) => (
        <div>
            <h4 className="font-semibold mb-2 text-base">Historique du Dossier</h4>
            <div className="space-y-4">
                {history.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground/50'}`}></div>
                            {index < history.length - 1 && <div className="w-px h-full bg-muted-foreground/30"></div>}
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{item.status}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(item.date), 'd MMM yyyy, HH:mm', { locale: fr })} par {item.updated_by}</p>
                            <p className="text-sm mt-1">{item.note}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    export const InstructionModal = ({ content, onDecision, onAction, onClose, onContact }) => {
      const { request, user, title, description } = content;
      const [updateNote, setUpdateNote] = useState("");
      const [checkedItems, setCheckedItems] = useState({});

      const requiredPayments = request.payments || [];
      const allPaymentsDone = requiredPayments.every(p => p.status === 'Payé');

      const handleDecisionClick = (decision) => {
        if (decision === 'Approuvé' && !allPaymentsDone) {
          onAction("Paiement Requis", "L'approbation est impossible car tous les frais n'ont pas été réglés par l'acheteur.");
          return;
        }

        const noteWithChecklist = `${updateNote}\n\nChecklist:\n${checklistItems.map(item => `- [${checkedItems[item.id] ? 'x' : ' '}] ${item.label}`).join('\n')}`;
        onDecision(decision, noteWithChecklist.trim());
      }

      const handleCheckboxChange = (id, checked) => {
        setCheckedItems(prev => ({ ...prev, [id]: checked }));
      };

      return (
        <>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh]">
            <div className="md:col-span-1 space-y-4 overflow-y-auto pr-2">
                <ApplicantInfo user={user} />
                <RequestDocuments documents={user.documents || {}} />
            </div>
            <div className="md:col-span-2 space-y-4 overflow-y-auto pr-2">
                {request.parcel_id && <p><span className="font-semibold">Parcelle:</span> <Link to={`/parcelles/${request.parcel_id}`} className="text-primary underline">{request.parcel_id}</Link></p>}
                <p><span className="font-semibold">Message du demandeur:</span></p>
                <blockquote className="border-l-2 pl-4 italic text-muted-foreground">{request.message || "Aucun message."}</blockquote>
                
                <div className="space-y-2 pt-2">
                    <h4 className="font-semibold">Paiements Associés</h4>
                    {requiredPayments.length > 0 ? (
                        <div className="space-y-2 rounded-md border p-3">
                            {requiredPayments.map(p => (
                                <div key={p.id} className="flex justify-between items-center">
                                    <span className="flex items-center">
                                        {p.status === 'Payé' ? <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> : <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                                        {p.description} ({formatPrice(p.amount)})
                                    </span>
                                    <Badge variant={p.status === 'Payé' ? 'success' : 'warning'}>{p.status}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-xs text-muted-foreground">Aucun paiement requis pour ce type de demande.</p>}
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-semibold">Checklist d'Instruction</h4>
                  <div className="space-y-2 rounded-md border p-3">
                    {checklistItems.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox id={item.id} onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)} />
                        <Label htmlFor={item.id} className="text-sm font-normal">{item.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="update-note">Note pour l'acheteur (Optionnel)</Label>
                  <Textarea id="update-note" value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} placeholder="Ex: Dossier complet, en attente de validation finale." />
                </div>

                {!allPaymentsDone && (
                    <div className="flex items-center gap-2 p-3 text-yellow-800 bg-yellow-50 rounded-lg">
                        <AlertCircle className="h-5 w-5"/>
                        <p className="text-xs font-medium">L'approbation finale n'est possible qu'après le règlement de tous les frais par l'acheteur.</p>
                    </div>
                )}
                
                <RequestTimeline history={request.history || []} />
            </div>
          </div>
          <DialogFooter className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4 border-t">
              <Button type="button" variant="outline" className="w-full sm:col-span-1" onClick={onContact}>
                 <MessageSquare className="h-4 w-4 mr-2"/> Contacter
              </Button>
              <Button type="button" variant="destructive" className="w-full sm:col-span-1" onClick={() => handleDecisionClick('Rejeté')}>Rejeter</Button>
              <Button type="button" className="w-full sm:col-span-1" onClick={() => handleDecisionClick('En instruction')}>Mettre à jour</Button>
              <Button type="button" className="w-full sm:col-span-1" onClick={() => handleDecisionClick('Approuvé')} disabled={!allPaymentsDone}>Approuver</Button>
          </DialogFooter>
        </>
      );
    };

    export const AttributionModal = ({ content, municipalParcels, onAttribution, onDecision, onClose, onContact }) => {
      const { toast } = useToast();
      const { request, user, title, description } = content;
      const [attributionMode, setAttributionMode] = useState('select'); // 'select' or 'suggest'
      const [selectedParcel, setSelectedParcel] = useState('');
      const [suggestedParcel, setSuggestedParcel] = useState(null);

      const handleSuggestParcel = () => {
        // Simple suggestion logic: find a random available parcel
        const availableParcels = municipalParcels.filter(p => p.status === 'Attribution sur demande');
        if (availableParcels.length > 0) {
          const randomParcel = availableParcels[Math.floor(Math.random() * availableParcels.length)];
          setSuggestedParcel(randomParcel);
          setSelectedParcel(randomParcel.id);
          toast({ title: "Suggestion Générée", description: `La parcelle ${randomParcel.name} a été suggérée.` });
        } else {
          toast({ title: "Aucune Suggestion", description: "Aucune parcelle disponible pour une suggestion.", variant: "destructive" });
        }
      };
      
      const handleAttributionClick = () => {
        if (!selectedParcel) {
          toast({ title: "Erreur", description: "Veuillez sélectionner ou suggérer une parcelle.", variant: 'destructive' });
          return;
        }
        onAttribution(selectedParcel);
      };

      return (
        <>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 max-h-[70vh]">
            <div className="md:col-span-1 space-y-4 overflow-y-auto pr-2">
                <ApplicantInfo user={user} />
                <RequestDocuments documents={user.documents || {}} />
            </div>
            <div className="md:col-span-2 space-y-4 overflow-y-auto pr-2">
                <p><span className="font-semibold">Motivation:</span> {request.message}</p>
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex space-x-2 rounded-full bg-muted p-1">
                      <Button size="sm" className={`flex-1 rounded-full ${attributionMode === 'select' ? 'bg-background shadow-sm' : ''}`} variant="ghost" onClick={() => setAttributionMode('select')}>Sélectionner</Button>
                      <Button size="sm" className={`flex-1 rounded-full ${attributionMode === 'suggest' ? 'bg-background shadow-sm' : ''}`} variant="ghost" onClick={() => setAttributionMode('suggest')}>Suggérer</Button>
                  </div>

                  {attributionMode === 'select' && (
                    <div>
                      <Label htmlFor="parcel-attribution">Sélectionner une parcelle</Label>
                      <Select name="parcel-attribution" value={selectedParcel} onValueChange={setSelectedParcel}>
                        <SelectTrigger id="parcel-attribution"><SelectValue placeholder="Choisir une parcelle à attribuer" /></SelectTrigger>
                        <SelectContent>
                          {municipalParcels.filter(p => p.status === 'Attribution sur demande').map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name} ({p.area_sqm} m²)</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {attributionMode === 'suggest' && (
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline" onClick={handleSuggestParcel}><Search className="mr-2 h-4 w-4"/> Trouver une suggestion</Button>
                      {suggestedParcel && (
                        <Card>
                          <CardContent className="p-3">
                            <h4 className="font-semibold">{suggestedParcel.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-4">
                              <span><MapPin className="inline h-3 w-3 mr-1"/>{suggestedParcel.zone}</span>
                              <span><Maximize className="inline h-3 w-3 mr-1"/>{suggestedParcel.area_sqm} m²</span>
                            </p>
                             <Button asChild size="sm" variant="link" className="p-0 h-auto">
                                <Link to={`/parcelles/${suggestedParcel.id}`} target="_blank">Voir la fiche détaillée</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
                <RequestTimeline history={request.history || []} />
            </div>
          </div>
          <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t">
            <Button type="button" variant="outline" className="w-full" onClick={onContact}>
              <MessageSquare className="h-4 w-4 mr-2"/> Contacter
            </Button>
            <Button type="button" variant="destructive" className="w-full" onClick={() => onDecision('Rejetée')}>Rejeter</Button>
            <Button type="button" className="w-full" onClick={handleAttributionClick} disabled={!selectedParcel}>Attribuer la Parcelle</Button>
          </DialogFooter>
        </>
      );
    };


    export const GenericActionModal = ({ content, onClose }) => {
        if (!content) return null;
        return (
          <>
            <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                {content.data?.isError ? <AlertCircle className="text-destructive"/> : <CheckCircle className="text-primary"/>}
                {content.title}
            </DialogTitle>
            {content.description && <DialogDescription>{content.description}</DialogDescription>}
            </DialogHeader>
            <DialogFooter>
            <Button onClick={onClose}>Fermer</Button>
            </DialogFooter>
          </>
        )
    };
  