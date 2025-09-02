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
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

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

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-outfit text-foreground">Inventaire</h1>
            <p className="text-muted-foreground font-ubuntu">
              Gestion du matériel de l&apos;association
            </p>
          </div>

          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-outfit">
                  {editingItem ? "Modifier l'article" : 'Nouvel article'}
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
                      placeholder="Nom de l'article"
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

        {/* Filters */}
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
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-primary" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 font-ubuntu">Total Articles</p>
                <p className="text-2xl font-bold font-outfit">{items.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 font-ubuntu">En bon état</p>
                <p className="text-2xl font-bold font-outfit">
                  {items.filter((i) => ['NEW', 'VERY_GOOD', 'GOOD'].includes(i.state)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 font-ubuntu">À surveiller</p>
                <p className="text-2xl font-bold font-outfit">
                  {items.filter((i) => ['AVERAGE', 'DAMAGED'].includes(i.state)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 font-ubuntu">Hors service</p>
                <p className="text-2xl font-bold font-outfit">
                  {items.filter((i) => ['DEFECTIVE', 'OUT_OF_SERVICE'].includes(i.state)).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-ubuntu">Aucun article trouvé</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Images */}
                <div className="mb-4">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      width={200}
                      height={120}
                      className="w-full h-30 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setViewingImage(item.images![0])}
                    />
                  ) : (
                    <div className="w-full h-30 bg-gray-100 rounded flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500 font-ubuntu">Photo manquante</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <Badge className="text-xs bg-primary text-white border-primary">
                    {item.category}
                  </Badge>
                  <Badge className={`text-xs border ${STATE_COLORS[item.state]}`}>
                    {STATE_LABELS[item.state]}
                  </Badge>
                </div>

                {/* Content - flex-grow pour pousser les actions en bas */}
                <div className="flex-grow">
                  <h3 className="font-bold text-lg font-outfit mb-1">{item.name}</h3>
                  {(item.brand || item.model) && (
                    <p className="text-sm text-gray-600 font-ubuntu mb-2">
                      {[item.brand, item.model].filter(Boolean).join(' - ')}
                    </p>
                  )}

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600 font-ubuntu">
                      Quantité: <span className="font-medium">{item.quantity}</span>
                    </span>
                  </div>

                  {item.comment && (
                    <p className="text-sm text-gray-600 font-ubuntu mb-3 line-clamp-2">
                      {item.comment}
                    </p>
                  )}
                </div>

                {/* Actions - toujours en bas */}
                <div className="space-y-2 mt-auto">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Creator info */}
                  {item.creator && (
                    <p className="text-xs text-gray-400 font-ubuntu">
                      Ajouté par {item.creator.firstName} {item.creator.lastName}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Image Viewer Modal */}
        {viewingImage && (
          <Dialog open={!!viewingImage} onOpenChange={() => setViewingImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <button
                  onClick={() => setViewingImage(null)}
                  className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <Image
                  src={viewingImage}
                  alt="Photo en grand"
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
