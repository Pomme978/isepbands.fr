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
  Package,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Camera,
  Grid3x3,
  Table,
  List,
  Layers,
  Copy,
  DollarSign,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import StackEffect from '@/components/admin/inventory/StackEffect';

// Import des nouveaux composants
import ItemGrid from '@/components/admin/common/ItemGrid';
import ItemFilters from '@/components/admin/common/ItemFilters';
import ItemStatsCard from '@/components/admin/common/ItemStatsCard';
import ItemCard from '@/components/admin/common/ItemCard';
import ItemModal from '@/components/admin/common/ItemModal';
import ImageViewer from '@/components/admin/common/ImageViewer';

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
  usable: boolean;
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
  const [viewingImages, setViewingImages] = useState<string[]>([]);
  const [viewingImageIndex, setViewingImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    brand: '',
    model: '',
    state: 'GOOD' as const,
    quantity: 1,
    comment: '',
    usable: true,
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

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      brand: '',
      model: '',
      state: 'GOOD',
      quantity: 1,
      comment: '',
      usable: true,
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

      const result = await response.json();

      // Log d'activité
      await fetch('/api/admin/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editingItem ? 'inventory_updated' : 'inventory_created',
          title: editingItem
            ? `Équipement modifié: ${formData.name}`
            : `Nouvel équipement ajouté: ${formData.name}`,
          description: `${formData.category} - ${[formData.brand, formData.model].filter(Boolean).join(' ')} (Qté: ${formData.quantity})`,
          metadata: {
            itemId: result.item?.id || editingItem?.id,
            category: formData.category,
            name: formData.name,
            quantity: formData.quantity,
            state: formData.state,
          },
        }),
      }).catch(console.error);

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
      usable: item.usable,
    });
    setUploadedImages(item.images || []);
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    try {
      const response = await fetch(`/api/admin/inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      // Log d'activité
      if (item) {
        await fetch('/api/admin/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'inventory_deleted',
            title: `Équipement supprimé: ${item.name}`,
            description: `${item.category} - ${[item.brand, item.model].filter(Boolean).join(' ')} (Qté: ${item.quantity})`,
            metadata: {
              itemId: id,
              category: item.category,
              name: item.name,
              quantity: item.quantity,
              state: item.state,
            },
          }),
        }).catch(console.error);
      }

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

  const nextImage = (itemId: string, imagesLength: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % imagesLength,
    }));
  };

  const prevImage = (itemId: string, imagesLength: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + imagesLength) % imagesLength,
    }));
  };

  const handleImageClick = (images: string[], startIndex: number = 0) => {
    setViewingImages(images);
    setViewingImageIndex(startIndex);
  };

  // Prepare filter options
  const filterOptions = [
    {
      key: 'category',
      label: 'types',
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: categories.map(cat => ({ value: cat.name, label: cat.name, count: cat.count })),
      placeholder: 'Type',
      width: 'w-full sm:w-48',
    },
    {
      key: 'state',
      label: 'états',
      value: selectedState,
      onChange: setSelectedState,
      options: Object.entries(STATE_LABELS).map(([value, label]) => ({ value, label })),
      placeholder: 'État',
      width: 'w-full sm:w-40',
    }
  ];

  // Prepare stats
  const usableCount = items.filter((i) => i.usable && ['NEW', 'VERY_GOOD', 'GOOD'].includes(i.state)).length;
  const notUsableCount = items.filter((i) => !i.usable).length;
  const outOfServiceCount = items.filter((i) => ['DEFECTIVE', 'OUT_OF_SERVICE'].includes(i.state)).length;

  const statsData = [
    { label: 'Utilisables', value: usableCount },
    { label: 'Non utilisables', value: notUsableCount },
    { label: 'Hors service', value: outOfServiceCount },
  ];

  const mainCategories = categories.slice(0, 2).map((cat) => (
    <Badge key={cat.name} className="text-xs bg-primary/10 text-primary">
      {cat.name} ({cat.count})
    </Badge>
  ));

  const renderItemCard = (item: InventoryItem) => {
    const badges = [
      {
        text: STATE_LABELS[item.state],
        className: STATE_COLORS[item.state],
      }
    ];

    const actions = [
      {
        icon: <Copy className="w-3 h-3" />,
        onClick: () => {/* handleDuplicate logic */},
        title: "Dupliquer",
      },
      {
        icon: <Edit className="w-3 h-3" />,
        onClick: () => handleEdit(item),
        title: "Modifier",
      },
      {
        icon: <Trash2 className="w-3 h-3" />,
        onClick: () => handleDelete(item.id),
        className: "text-gray-600 hover:text-red-600 p-1 h-auto",
        title: "Supprimer",
      },
    ];

    const additionalInfo = (
      <span className="text-xs text-gray-500 font-ubuntu">
        Qté: <span className="font-medium text-gray-700">{item.quantity}</span>
      </span>
    );

    const creator = item.creator ? {
      name: `${item.creator.firstName} ${item.creator.lastName}`,
      date: new Date(item.createdAt).toLocaleDateString('fr-FR'),
    } : undefined;

    return (
      <ItemCard
        key={item.id}
        id={item.id}
        name={item.name}
        category={item.category}
        brand={item.brand}
        model={item.model}
        description={item.comment}
        badges={badges}
        images={item.images}
        currentImageIndex={currentImageIndex[item.id] || 0}
        onPrevImage={() => prevImage(item.id, item.images?.length || 0)}
        onNextImage={() => nextImage(item.id, item.images?.length || 0)}
        onImageClick={(url) => handleImageClick(item.images || [], item.images?.indexOf(url) || 0)}
        actions={actions}
        creator={creator}
        additionalInfo={additionalInfo}
      />
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-outfit text-foreground">Inventaire Musical</h1>
            <p className="text-muted-foreground font-ubuntu">
              Gestion de l'équipement de l'association
            </p>
          </div>

          <Button onClick={() => { resetForm(); setShowCreateModal(true); }} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un équipement
          </Button>
        </div>

        <ItemModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingItem ? "Modifier l'équipement" : 'Nouvel équipement'}
          onSubmit={handleSubmit}
          onCancel={() => setShowCreateModal(false)}
          submitLabel={editingItem ? 'Modifier' : 'Créer'}
          isSubmitDisabled={!formData.name || !formData.category}
        >
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
                      <SelectValue placeholder="Sélectionnez un état">
                        {formData.state && (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full border ${STATE_COLORS[formData.state as keyof typeof STATE_COLORS].replace('text-', 'bg-').replace('border-', 'border-').split(' ')[0]}`}
                            />
                            {STATE_LABELS[formData.state as keyof typeof STATE_LABELS]}
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full border ${STATE_COLORS[value as keyof typeof STATE_COLORS].replace('text-', 'bg-').replace('border-', 'border-').split(' ')[0]}`}
                            />
                            {label}
                          </div>
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
                  <label className="flex items-center gap-2 text-sm font-medium font-ubuntu">
                    <input
                      type="checkbox"
                      checked={formData.usable}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          usable: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300"
                    />
                    Utilisable
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    L'article est-il actuellement utilisable ?
                  </p>
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
                  accept="image/*,.heic,.heif"
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
        </ItemModal>

        {/* Filters & View Mode */}
        <ItemFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterOptions}
        />

        {/* Stats */}
        <ItemStatsCard
          title="Inventaire Musical ISEP Bands"
          subtitle="État du matériel de l'association"
          mainStat={{ value: items.length, label: 'objets' }}
          stats={statsData}
          additionalInfo={
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-gray-500 font-ubuntu mr-1">Principales:</span>
              {mainCategories}
            </div>
          }
        />

        {/* Content */}
        <ItemGrid
          loading={loading}
          emptyIcon={<Package className="w-12 h-12 mx-auto text-gray-400" />}
          emptyMessage="Aucun article trouvé"
          loadingItemsCount={12}
        >
          {filteredItems.map(renderItemCard)}
        </ItemGrid>

        {/* Image Viewer */}
        <ImageViewer
          images={viewingImages}
          currentIndex={viewingImageIndex}
          isOpen={viewingImages.length > 0}
          onClose={() => setViewingImages([])}
          onNext={() => setViewingImageIndex((prev) => (prev + 1) % viewingImages.length)}
          onPrev={() => setViewingImageIndex((prev) => (prev - 1 + viewingImages.length) % viewingImages.length)}
          onIndexChange={setViewingImageIndex}
        />
      </div>
    </AdminLayout>
  );
}