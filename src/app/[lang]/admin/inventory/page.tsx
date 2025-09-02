'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Upload,
  X,
  Camera,
  AlertCircle,
  Grid3x3,
  Table,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import StackEffect from '@/components/admin/inventory/StackEffect';

interface InventoryItem {
  id: string;
  category: string;
  name: string;
  brand?: string;
  model?: string;
  state: 'NEW' | 'VERY_GOOD' | 'GOOD' | 'AVERAGE' | 'DAMAGED' | 'DEFECTIVE' | 'OUT_OF_SERVICE';
  quantity: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Category {
  name: string;
  count: number;
}

interface GroupedItems {
  key: string;
  name: string;
  items: InventoryItem[];
  totalQuantity: number;
}

type ViewMode = 'grid' | 'table' | 'board' | 'grouped';

const STATE_LABELS = {
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  AVERAGE: 'État moyen',
  DAMAGED: 'Abîmé',
  DEFECTIVE: 'Défectueux',
  OUT_OF_SERVICE: 'Hors service',
} as const;

const STATE_COLORS = {
  NEW: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  VERY_GOOD: 'bg-green-100 text-green-800 border-green-200',
  GOOD: 'bg-blue-100 text-blue-800 border-blue-200',
  AVERAGE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  DAMAGED: 'bg-orange-100 text-orange-800 border-orange-200',
  DEFECTIVE: 'bg-red-100 text-red-800 border-red-200',
  OUT_OF_SERVICE: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

const CATEGORIES = [
  'Clavier',
  'Percussions',
  'Amplis',
  'Instruments à cordes',
  'Hardware batterie',
  'Matériel Audio',
  'Accessoires',
  'Électronique',
  'Mobilier',
  'Autre',
];

const VIEW_MODES = [
  { value: 'grid', label: 'Grille', icon: Grid3x3 },
  { value: 'table', label: 'Table', icon: Table },
  { value: 'board', label: 'Board', icon: List },
  { value: 'grouped', label: 'Groupé', icon: Layers },
] as const;

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [expandedStacks, setExpandedStacks] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    brand: '',
    model: '',
    state: 'GOOD' as const,
    quantity: 1,
    comment: '',
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all')
        params.append('category', selectedCategory);
      if (selectedState && selectedState !== 'all') params.append('state', selectedState);

      const response = await fetch(`/api/admin/inventory?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setItems(data.items || []);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, selectedState]);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Regroupement des items par nom
  const groupedItems = useMemo<GroupedItems[]>(() => {
    const groups = new Map<string, InventoryItem[]>();
    
    filteredItems.forEach(item => {
      const key = item.name.toLowerCase().trim();
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      name: items[0].name,
      items,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredItems]);

  // Stacking des items identiques pour la grille
  const stackedItems = useMemo(() => {
    const stacks = new Map<string, InventoryItem[]>();
    
    filteredItems.forEach(item => {
      const stackKey = `${item.category.toLowerCase()}-${item.name.toLowerCase()}`;
      if (!stacks.has(stackKey)) {
        stacks.set(stackKey, []);
      }
      stacks.get(stackKey)!.push(item);
    });

    return Array.from(stacks.entries()).map(([key, items]) => ({
      key,
      items,
      representative: items[0], // Premier item comme représentant
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      isStacked: items.length > 1,
    }));
  }, [filteredItems]);

  // Items organisés par catégorie pour le mode board
  const boardItems = useMemo(() => {
    const board = new Map<string, InventoryItem[]>();
    
    // Initialiser avec toutes les catégories
    CATEGORIES.forEach(cat => board.set(cat, []));
    
    filteredItems.forEach(item => {
      if (!board.has(item.category)) {
        board.set(item.category, []);
      }
      board.get(item.category)!.push(item);
    });

    return Array.from(board.entries()).filter(([_, items]) => items.length > 0);
  }, [filteredItems]);

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      brand: '',
      model: '',
      state: 'GOOD',
      quantity: 1,
      comment: '',
    });
    setUploadedImages([]);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        images: uploadedImages,
      };

      const url = editingItem ? `/api/admin/inventory/${editingItem.id}` : '/api/admin/inventory';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save');
      }

      toast.success(editingItem ? 'Article modifié' : 'Article créé');
      setShowCreateModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      category: item.category,
      name: item.name,
      brand: item.brand || '',
      model: item.model || '',
      state: item.state,
      quantity: item.quantity,
      comment: item.comment || '',
    });
    setUploadedImages(item.images || []);
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Article supprimé');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setUploadedImages((prev) => [...prev, ...data.urls]);
      toast.success('Images uploadées');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleStack = (key: string) => {
    setExpandedStacks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const nextImage = (itemId: string, imagesLength: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % imagesLength
    }));
  };

  const prevImage = (itemId: string, imagesLength: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + imagesLength) % imagesLength
    }));
  };

  const renderStackCard = (stack: { key: string; items: InventoryItem[]; representative: InventoryItem; totalQuantity: number; isStacked: boolean }) => {
    const { key, items, representative, totalQuantity, isStacked } = stack;
    const isExpanded = expandedStacks.has(key);

    if (!isStacked) {
      return renderItemCard(representative);
    }

    if (isExpanded) {
      // Mode déroulé : prend toute la largeur disponible
      return (
        <div key={key} className="col-span-full">
          {/* Fond spécial pour les cartes déroulées */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 border-2 border-primary/20">
            {/* Header avec bouton replier stylé */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {representative.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {items.length} fiches • {totalQuantity} quantité totale
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStack(key);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                <ChevronUp className="w-4 h-4" />
                Replier le stack
              </button>
            </div>
            
            {/* Cartes déroulées dans une sous-grille avec fond */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="transform transition-all duration-300 ease-out"
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animation: `expandFromStack 0.4s ease-out forwards`,
                  }}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    {renderItemCard(item)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <style jsx>{`
            @keyframes expandFromStack {
              0% {
                opacity: 0;
                transform: translateY(-20px) scale(0.9) rotateX(10deg);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1) rotateX(0deg);
              }
            }
          `}</style>
        </div>
      );
    }

    // Mode empilé
    return (
      <div 
        key={key} 
        className="relative group cursor-pointer" 
        onClick={(e) => {
          e.stopPropagation();
          toggleStack(key);
        }}
      >
        {/* Composant d'effet de stack */}
        <StackEffect count={items.length} isVisible={true} />
        
        {/* Card principale avec événements bloqués */}
        <div 
          className="relative z-10 transition-all duration-300 group-hover:transform group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none">
            {renderItemCard({ ...representative, quantity: totalQuantity })}
          </div>
        </div>
        
        {/* Overlay cliquable invisible pour capturer les clics */}
        <div className="absolute inset-0 z-30 cursor-pointer" />
        
        {/* Badge avec nombre d'items */}
        <div className="absolute -top-2 -left-2 z-40 pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-60"></div>
            <div className="relative bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
              {items.length}
            </div>
          </div>
        </div>
        
        {/* Icône de déroulement au centre */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="bg-primary/90 text-white rounded-full p-3 shadow-lg animate-bounce">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        
        {/* Effet de brillance au hover */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] pointer-events-none z-20"></div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3" />
              Cliquer pour dérouler ({items.length} items)
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderItemCard = (item: InventoryItem) => (
    <div
      key={item.id}
      className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Images avec carrousel - Compact */}
      <div className="relative h-48 bg-gray-50">
        {item.images && item.images.length > 0 ? (
          <div className="relative group h-full">
            <Image
              src={item.images[currentImageIndex[item.id] || 0]}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setViewingImage(item.images![currentImageIndex[item.id] || 0])}
            />
            {item.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(item.id, item.images!.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(item.id, item.images!.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {item.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === (currentImageIndex[item.id] || 0)
                          ? 'bg-white'
                          : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {/* Badge d'état en overlay */}
            <div className="absolute top-2 right-2">
              <Badge className={`text-xs ${STATE_COLORS[item.state]}`}>
                {STATE_LABELS[item.state]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <Camera className="w-8 h-8 text-gray-400 mb-1" />
            <p className="text-xs text-gray-500 font-ubuntu">Aucune photo</p>
          </div>
        )}
      </div>

      {/* Content compact */}
      <div className="p-3">
        {/* Header avec nom et info */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <Badge className="text-xs bg-primary/10 text-primary font-medium">
              {item.category}
            </Badge>
            <span className="text-xs text-gray-500 font-ubuntu">
              Qté: <span className="font-medium text-gray-700">{item.quantity}</span>
            </span>
          </div>
          <h3 className="font-bold text-base font-outfit text-gray-900 leading-tight mb-1">{item.name}</h3>
          {(item.brand || item.model) && (
            <p className="text-xs text-gray-600 font-ubuntu">
              {[item.brand, item.model].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        {/* Commentaire si présent */}
        {item.comment && (
          <p className="text-xs text-gray-600 font-ubuntu mb-2 line-clamp-2 italic">
            "{item.comment}"
          </p>
        )}

        {/* Actions et info créateur */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
              className="text-gray-600 hover:text-primary p-1 h-auto"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(item.id)}
              className="text-gray-600 hover:text-red-600 p-1 h-auto"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {item.creator && (
            <div className="text-right">
              <p className="text-xs text-gray-400 font-ubuntu">
                {item.creator.firstName} {item.creator.lastName}
              </p>
              <p className="text-xs text-gray-400 font-ubuntu">
                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marque / Modèle
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qté
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {item.images && item.images.length > 0 ? (
                    <div className="relative w-12 h-12">
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover rounded cursor-pointer"
                        onClick={() => setViewingImage(item.images![0])}
                      />
                      {item.images.length > 1 && (
                        <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {item.images.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Camera className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">
                  <Badge className="text-xs">{item.category}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {[item.brand, item.model].filter(Boolean).join(' - ') || '-'}
                </td>
                <td className="px-4 py-3">
                  <Badge className={`text-xs border ${STATE_COLORS[item.state]}`}>
                    {STATE_LABELS[item.state]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBoardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boardItems.map(([category, categoryItems]) => (
        <div key={category} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-700">{category}</h3>
            <Badge className="text-xs">{categoryItems.length}</Badge>
          </div>
          <div className="space-y-3">
            {categoryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  {item.images && item.images.length > 0 && (
                    <div className="flex -space-x-2">
                      {item.images.slice(0, 2).map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt=""
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {item.images.length > 2 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{item.images.length - 2}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {(item.brand || item.model) && (
                  <p className="text-xs text-gray-500 mb-2">
                    {[item.brand, item.model].filter(Boolean).join(' - ')}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs border ${STATE_COLORS[item.state]}`}>
                    {STATE_LABELS[item.state]}
                  </Badge>
                  <span className="text-xs text-gray-600">Qté: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroupedView = () => (
    <div className="space-y-4">
      {groupedItems.map((group) => (
        <div key={group.key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleGroup(group.key)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {expandedGroups.has(group.key) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <h3 className="font-bold text-lg">{group.name}</h3>
              <Badge className="bg-primary text-white">
                {group.items.length} {group.items.length > 1 ? 'articles' : 'article'}
              </Badge>
              <span className="text-sm text-gray-600">
                Quantité totale: <span className="font-medium">{group.totalQuantity}</span>
              </span>
            </div>
            <div className="flex gap-2">
              {group.items.slice(0, 3).map((item, idx) => (
                item.images && item.images[0] ? (
                  <Image
                    key={idx}
                    src={item.images[0]}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div key={idx} className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                )
              ))}
              {group.items.length > 3 && (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{group.items.length - 3}</span>
                </div>
              )}
            </div>
          </button>
          
          {expandedGroups.has(group.key) && (
            <div className="border-t border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map(renderItemCard)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-outfit text-foreground">Inventaire Musical</h1>
            <p className="text-muted-foreground font-ubuntu">
              Gestion des instruments et équipements d&apos;ISEP Bands
            </p>
          </div>

          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un équipement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-outfit">
                  {editingItem ? "Modifier l'équipement" : 'Nouvel équipement'}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">
                      Catégorie *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Nom *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nom de l'instrument/équipement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Marque</label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                      placeholder="Marque"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Modèle</label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                      placeholder="Modèle"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">État</label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: value as
                            | 'NEW'
                            | 'VERY_GOOD'
                            | 'GOOD'
                            | 'AVERAGE'
                            | 'DAMAGED'
                            | 'DEFECTIVE'
                            | 'OUT_OF_SERVICE',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Quantité</label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">
                      Commentaire
                    </label>
                    <Textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, comment: e.target.value }))
                      }
                      placeholder="Notes, état détaillé, localisation..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 font-ubuntu">Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 font-ubuntu">
                      {uploading ? 'Upload en cours...' : 'Cliquez pour ajouter des photos'}
                    </p>
                  </label>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Photo ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.name || !formData.category}>
                  {editingItem ? 'Modifier' : 'Créer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters & View Mode */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, marque, modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les états</SelectItem>
                {Object.entries(STATE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Selector */}
            <div className="flex gap-1 border border-gray-200 rounded-lg p-1">
              {VIEW_MODES.map((mode) => (
                <Button
                  key={mode.value}
                  variant={viewMode === mode.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode(mode.value as ViewMode)}
                  className="px-3"
                  title={mode.label}
                >
                  <mode.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Vue d'ensemble de l'inventaire musical */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold font-outfit text-gray-900">Inventaire Musical ISEP Bands</h2>
              <p className="text-xs text-gray-600 font-ubuntu">État du matériel de l'association</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-outfit text-primary">{items.length}</p>
              <p className="text-xs text-gray-600 font-ubuntu">instruments</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">
                {items.filter((i) => ['NEW', 'VERY_GOOD', 'GOOD'].includes(i.state)).length}
              </p>
              <p className="text-xs text-gray-600 font-ubuntu">Opérationnels</p>
            </div>
            
            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">
                {items.filter((i) => ['DEFECTIVE', 'OUT_OF_SERVICE'].includes(i.state)).length}
              </p>
              <p className="text-xs text-gray-600 font-ubuntu">Hors service</p>
            </div>
            
            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">{categories.length}</p>
              <p className="text-xs text-gray-600 font-ubuntu">Catégories</p>
            </div>
          </div>
          
          {/* Catégories les plus représentées */}
          <div className="flex flex-wrap gap-1">
            <span className="text-xs text-gray-500 font-ubuntu mr-1">Principales:</span>
            {categories.slice(0, 2).map((cat) => (
              <Badge key={cat.name} className="text-xs bg-primary/10 text-primary">
                {cat.name} ({cat.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Content based on view mode */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-ubuntu">Aucun article trouvé</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {stackedItems.map(renderStackCard)}
          </div>
        ) : viewMode === 'table' ? (
          renderTableView()
        ) : viewMode === 'board' ? (
          renderBoardView()
        ) : viewMode === 'grouped' ? (
          renderGroupedView()
        ) : null}

        {/* Image Viewer Modal avec carrousel */}
        {viewingImage && (
          <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <button
                  onClick={() => setViewingImage(null)}
                  className="absolute top-4 right-4 z-20 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Trouver l'item correspondant à l'image */}
                {(() => {
                  const currentItem = filteredItems.find(item => 
                    item.images?.includes(viewingImage)
                  );
                  
                  if (!currentItem || !currentItem.images || currentItem.images.length <= 1) {
                    return (
                      <Image
                        src={viewingImage}
                        alt="Photo en grand"
                        width={800}
                        height={600}
                        className="w-full h-auto max-h-[85vh] object-contain"
                      />
                    );
                  }
                  
                  const currentIndex = currentItem.images.indexOf(viewingImage);
                  
                  return (
                    <div className="relative group">
                      <Image
                        src={viewingImage}
                        alt="Photo en grand"
                        width={800}
                        height={600}
                        className="w-full h-auto max-h-[85vh] object-contain"
                      />
                      
                      {/* Flèches de navigation */}
                      <button
                        onClick={() => {
                          const prevIndex = (currentIndex - 1 + currentItem.images!.length) % currentItem.images!.length;
                          setViewingImage(currentItem.images![prevIndex]);
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-3 hover:bg-black/80 transition-colors z-10"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      
                      <button
                        onClick={() => {
                          const nextIndex = (currentIndex + 1) % currentItem.images!.length;
                          setViewingImage(currentItem.images![nextIndex]);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-3 hover:bg-black/80 transition-colors z-10"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      
                      {/* Indicateurs */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 px-3 py-2 rounded-full">
                        {currentItem.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setViewingImage(img)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              idx === currentIndex ? 'bg-white' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Compteur */}
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {currentItem.images.length}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}