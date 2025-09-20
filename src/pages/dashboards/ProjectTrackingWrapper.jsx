import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectTrackingPage from '../../components/project/ProjectTrackingPage';
import ProjectBlockchainTracking from '../../components/project/ProjectBlockchainTracking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectTrackingWrapper = () => {
  const { caseId } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tracking">Suivi Projet</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracking">
            <ProjectTrackingPage caseId={caseId} />
          </TabsContent>
          
          <TabsContent value="blockchain">
            <ProjectBlockchainTracking vefaCaseId={caseId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectTrackingWrapper;