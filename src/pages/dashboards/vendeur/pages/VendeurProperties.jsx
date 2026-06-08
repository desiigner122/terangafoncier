import React from 'react';
import VendeurPropertiesRealData from '../VendeurPropertiesRealData';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  MapPin,
  DollarSign,
  Camera,
  Clock,
  CheckCircle,
  AlertTriangle,
  Share2,
  Shield,
  Brain,
  Star,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog';
import SharePropertyModal from '@/components/dialogs/SharePropertyModal';
import PreviewPropertyModal from '@/components/dialogs/PreviewPropertyModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const VendeurProperties = (props) => {
  return <VendeurPropertiesRealData {...props} />;
};
