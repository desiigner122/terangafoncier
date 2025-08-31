
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { sampleAgentData } from '@/data';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/spinner';

const AgentTasksPage = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(sampleAgentData.tasks);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (message) => {
    toast({ title: "Action Simulée", description: message });
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Le titre de la tâche ne peut pas être vide.' });
      return;
    }
    const newTask = {
      id: `TSK${Date.now()}`,
      title: newTaskTitle,
      priority: 'Moyenne',
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    handleAction(`Nouvelle tâche "${newTaskTitle}" ajoutée.`);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Haute': return 'destructive';
      case 'Moyenne': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const upcomingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold">Mes Tâches</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle tâche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              placeholder="Ex: Appeler le client pour le dossier..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tâches à faire ({upcomingTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {upcomingTasks.map(task => (
                <li key={task.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                  <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleToggleTask(task.id)} />
                  <label htmlFor={`task-${task.id}`} className="flex-grow cursor-pointer">
                    <span className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
                    <div className="text-xs text-muted-foreground">
                      Échéance: {task.dueDate}
                    </div>
                  </label>
                  <Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tâches terminées ({completedTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {completedTasks.map(task => (
                <li key={task.id} className="flex items-center space-x-3 p-2 rounded-md">
                  <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleToggleTask(task.id)} />
                  <label htmlFor={`task-${task.id}`} className="flex-grow cursor-pointer">
                    <span className="line-through text-muted-foreground">{task.title}</span>
                  </label>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AgentTasksPage;
