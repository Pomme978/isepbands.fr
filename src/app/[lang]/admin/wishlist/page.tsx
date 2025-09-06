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
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Heart,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// Import des composants réutilisables
import ItemGrid from '@/components/admin/common/ItemGrid';
import ItemFilters from '@/components/admin/common/ItemFilters';
import ItemStatsCard from '@/components/admin/common/ItemStatsCard';
import ItemCard from '@/components/admin/common/ItemCard';
import ItemModal from '@/components/admin/common/ItemModal';

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

      const result = await response.json();
      
      // Log d'activité
      await fetch('/api/admin/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editingItem ? 'wishlist_updated' : 'wishlist_created',
          title: editingItem ? `Souhait modifié: ${formData.name}` : `Nouveau souhait ajouté: ${formData.name}`,
          description: `${formData.category} - ${[formData.brand, formData.model].filter(Boolean).join(' ')} (${PRIORITIES[formData.priority].label}${formData.estimatedPrice ? ` - ${formData.estimatedPrice}€` : ''})`,
          metadata: {
            itemId: result.item?.id || editingItem?.id,
            category: formData.category,
            name: formData.name,
            priority: formData.priority,
            status: formData.status,
            estimatedPrice: payload.estimatedPrice,
          }
        }),
      }).catch(console.error);

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
    const item = items.find(i => i.id === id);
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce souhait ?')) return;

    try {
      const response = await fetch(`/api/admin/wishlist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      // Log d'activité
      if (item) {
        await fetch('/api/admin/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'wishlist_deleted',
            title: `Souhait supprimé: ${item.name}`,
            description: `${item.category} - ${[item.brand, item.model].filter(Boolean).join(' ')} (${PRIORITIES[item.priority].label}${item.estimatedPrice ? ` - ${item.estimatedPrice}€` : ''})`,
            metadata: {
              itemId: id,
              category: item.category,
              name: item.name,
              priority: item.priority,
              status: item.status,
              estimatedPrice: item.estimatedPrice,
            }
          }),
        }).catch(console.error);
      }

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

  const renderItemCard = (item: WishlistItem) => {
    const badges = [
      {
        text: STATUS[item.status].label,
        className: STATUS[item.status].color,
      },
      {
        text: PRIORITIES[item.priority].label,
        className: PRIORITIES[item.priority].color,
      },
    ];

    const actions = [
      ...(item.productUrl ? [{
        icon: <ExternalLink className="w-3 h-3" />,
        onClick: () => window.open(item.productUrl, '_blank'),
        title: "Voir le produit",
      }] : []),
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

    const additionalInfo = item.estimatedPrice ? (
      <div className="flex items-center gap-1">
        <DollarSign className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-600 font-ubuntu">
          {item.estimatedPrice}€
        </span>
      </div>
    ) : null;

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
        description={item.description}
        badges={badges}
        images={item.imageUrl ? [item.imageUrl] : []}
        actions={actions}
        creator={creator}
        additionalInfo={additionalInfo}
      />
    );
  };

  const totalEstimated = filteredItems.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  // Prepare filter options
  const filterOptions = [
    {
      key: 'category',
      label: 'catégories',
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: CATEGORIES.map(cat => ({ value: cat, label: cat })),
      placeholder: 'Catégorie',
      width: 'w-full sm:w-48',
    },
    {
      key: 'priority',
      label: 'priorités',
      value: selectedPriority,
      onChange: setSelectedPriority,
      options: Object.entries(PRIORITIES).map(([value, { label }]) => ({ value, label })),
      placeholder: 'Priorité',
      width: 'w-full sm:w-40',
    },
    {
      key: 'status',
      label: 'statuts',
      value: selectedStatus,
      onChange: setSelectedStatus,
      options: Object.entries(STATUS).map(([value, { label }]) => ({ value, label })),
      placeholder: 'Statut',
      width: 'w-full sm:w-40',
    }
  ];

  // Prepare stats
  const wantedCount = filteredItems.filter((i) => i.status === 'WANTED').length;
  const orderedCount = filteredItems.filter((i) => i.status === 'ORDERED').length;
  const purchasedCount = filteredItems.filter((i) => i.status === 'PURCHASED').length;

  const statsData = [
    { label: 'Souhaités', value: wantedCount },
    { label: 'Commandés', value: orderedCount },
    { label: 'Achetés', value: purchasedCount },
    { label: 'Estimé total', value: `${totalEstimated.toFixed(0)}€` },
  ];

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

          <Button onClick={() => { resetForm(); setShowCreateModal(true); }} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un souhait
          </Button>
        </div>

        <ItemModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingItem ? 'Modifier le souhait' : 'Nouveau souhait'}
          onSubmit={handleSubmit}
          onCancel={() => setShowCreateModal(false)}
          submitLabel={editingItem ? 'Modifier' : 'Ajouter'}
          isSubmitDisabled={!formData.name || !formData.category}
        >

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
        </ItemModal>

        {/* Filters */}
        <ItemFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filterOptions}
        />

        {/* Stats */}
        <ItemStatsCard
          title="Liste de Souhaits ISEP Bands"
          subtitle="Équipements souhaités par l'association"
          mainStat={{ value: filteredItems.length, label: 'souhaits' }}
          stats={statsData}
        />

        {/* Content */}
        <ItemGrid
          loading={loading}
          emptyIcon={<ShoppingCart className="w-12 h-12 mx-auto text-gray-400" />}
          emptyMessage="Aucun souhait trouvé"
          loadingItemsCount={10}
        >
          {filteredItems.map(renderItemCard)}
        </ItemGrid>
      </div>
    </AdminLayout>
  );
}