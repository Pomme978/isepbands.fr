'use client';

import { useState, useEffect } from 'react';
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
  ShoppingCart,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Heart,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  estimatedPrice?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'WANTED' | 'ORDERED' | 'PURCHASED' | 'CANCELLED';
  productUrl?: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

type ViewMode = 'grid' | 'table';

const PRIORITIES = {
  LOW: { label: 'Basse', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Moyenne', color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgente', color: 'bg-red-100 text-red-800' },
} as const;

const STATUS = {
  WANTED: { label: 'Souhaité', color: 'bg-purple-100 text-purple-800', icon: Heart },
  ORDERED: { label: 'Commandé', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PURCHASED: { label: 'Acheté', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Annulé', color: 'bg-gray-100 text-gray-800', icon: Trash2 },
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

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    estimatedPrice: '',
    priority: 'MEDIUM' as const,
    status: 'WANTED' as const,
    productUrl: '',
    description: '',
    imageUrl: '',
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all')
        params.append('category', selectedCategory);
      if (selectedPriority && selectedPriority !== 'all')
        params.append('priority', selectedPriority);
      if (selectedStatus && selectedStatus !== 'all')
        params.append('status', selectedStatus);

      const response = await fetch(`/api/admin/wishlist?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, selectedPriority, selectedStatus]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      brand: '',
      model: '',
      estimatedPrice: '',
      priority: 'MEDIUM',
      status: 'WANTED',
      productUrl: '',
      description: '',
      imageUrl: '',
    });
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : null,
      };

      const url = editingItem ? `/api/admin/wishlist/${editingItem.id}` : '/api/admin/wishlist';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      toast.success(editingItem ? 'Souhait modifié' : 'Souhait ajouté');
      setShowCreateModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (item: WishlistItem) => {
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand || '',
      model: item.model || '',
      estimatedPrice: item.estimatedPrice?.toString() || '',
      priority: item.priority,
      status: item.status,
      productUrl: item.productUrl || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
    });
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce souhait ?')) return;

    try {
      const response = await fetch(`/api/admin/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Souhait supprimé');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderItemCard = (item: WishlistItem) => (
    <div
      key={item.id}
      className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-50">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
            <ShoppingCart className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-ubuntu">Pas d'image</p>
          </div>
        )}
        
        {/* Badges en overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Badge className={`text-xs ${STATUS[item.status].color}`}>
            {STATUS[item.status].label}
          </Badge>
          <Badge className={`text-xs ${PRIORITIES[item.priority].color}`}>
            {PRIORITIES[item.priority].label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <Badge className="text-xs bg-primary/10 text-primary font-medium">
              {item.category}
            </Badge>
            {item.estimatedPrice && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-600 font-ubuntu">
                  {item.estimatedPrice}€
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-bold text-base font-outfit text-gray-900 leading-tight mb-1">
            {item.name}
          </h3>
          
          {(item.brand || item.model) && (
            <p className="text-xs text-gray-600 font-ubuntu">
              {[item.brand, item.model].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-gray-600 font-ubuntu mb-2 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex gap-1">
            {item.productUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(item.productUrl, '_blank')}
                className="text-gray-600 hover:text-primary p-1 h-auto"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
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

  const totalEstimated = filteredItems.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-outfit text-foreground">Liste de Souhaits</h1>
            <p className="text-muted-foreground font-ubuntu">
              Équipements souhaités pour l'association
            </p>
          </div>

          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un souhait
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-outfit">
                  {editingItem ? 'Modifier le souhait' : 'Nouveau souhait'}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">
                      Nom *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Nom du produit souhaité"
                    />
                  </div>

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

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">URL du produit</label>
                    <Input
                      value={formData.productUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productUrl: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Prix estimé</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.estimatedPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, estimatedPrice: e.target.value }))
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Priorité</label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, priority: value as any }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRIORITIES).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">Statut</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value as any }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">URL de l'image</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 font-ubuntu">
                      Description
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Pourquoi ce produit est-il souhaité ?"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={!formData.name || !formData.category}>
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4">
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
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les priorités</SelectItem>
                {Object.entries(PRIORITIES).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(STATUS).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold font-outfit text-gray-900">Liste de Souhaits ISEP Bands</h2>
              <p className="text-xs text-gray-600 font-ubuntu">Équipements souhaités par l'association</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-outfit text-primary">{filteredItems.length}</p>
              <p className="text-xs text-gray-600 font-ubuntu">souhaits</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">
                {filteredItems.filter((i) => i.status === 'WANTED').length}
              </p>
              <p className="text-xs text-gray-600 font-ubuntu">Souhaités</p>
            </div>
            
            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">
                {filteredItems.filter((i) => i.status === 'ORDERED').length}
              </p>
              <p className="text-xs text-gray-600 font-ubuntu">Commandés</p>
            </div>
            
            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">
                {filteredItems.filter((i) => i.status === 'PURCHASED').length}
              </p>
              <p className="text-xs text-gray-600 font-ubuntu">Achetés</p>
            </div>

            <div className="bg-white p-2 text-center">
              <p className="text-lg font-bold font-outfit text-primary mb-1">
                {totalEstimated.toFixed(0)}€
              </p>
              <p className="text-xs text-gray-600 font-ubuntu">Estimé total</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-ubuntu">Aucun souhait trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {filteredItems.map(renderItemCard)}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}