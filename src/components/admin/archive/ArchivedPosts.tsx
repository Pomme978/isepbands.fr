'use client';

import { useState, useEffect } from 'react';
import { FileText, Calendar, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import Avatar from '@/components/common/Avatar';

interface ArchivedPost {
  id: string;
  title: string;
  description?: string;
  author: string;
  type: string;
  createdAt?: string;
  archivedAt?: string;
  archivedBy?: string;
  archiveReason?: string;
}

interface ArchivedPostsProps {
  filters: {
    search: string;
    sortBy: string;
    dateRange: string;
  };
}

export default function ArchivedPosts({ filters }: ArchivedPostsProps) {
  const [posts, setPosts] = useState<ArchivedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedPosts();
  }, [filters]);

  const fetchArchivedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value);
        }
      });
      console.log('Fetching archived posts with params:', params.toString());
      const response = await fetch(`/api/admin/archive/posts?${params}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.error || 'Erreur lors du chargement des posts archivés');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching archived posts:', err);
      setError('Erreur lors du chargement des posts archivés');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestorePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}/archive`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la restauration');
      }

      fetchArchivedPosts();
    } catch (err) {
      console.error('Error restoring post:', err);
      setError('Erreur lors de la restauration du post');
    }
  };

  const getStatusColor = () => {
    return 'bg-orange-100 text-orange-800';
  };

  const getStatusLabel = () => {
    return 'Archivé';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user_joined':
        return 'Nouveau membre';
      case 'group_created':
        return 'Nouveau groupe';
      case 'event_created':
        return 'Nouvel événement';
      case 'achievement':
        return 'Achievement';
      case 'custom':
        return 'Publication';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <Loading text="Chargement des posts archivés..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
        <span className="text-red-600">{error}</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun post archivé</h3>
        <p className="text-gray-600">
          {filters.search ? 'Aucun résultat pour cette recherche.' : 'Aucun post archivé.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {posts.length} post{posts.length > 1 ? 's' : ''} archivé{posts.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{post.title}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                    >
                      {getStatusLabel()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(post.type)}
                    </span>
                  </div>

                  {post.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {post.description.length > 100
                        ? `${post.description.substring(0, 100)}...`
                        : post.description}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Avatar name={post.author || 'Utilisateur inconnu'} size="sm" />
                      <span>Par {post.author}</span>
                    </div>
                    {post.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Créé le {new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                    {post.archivedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Archivé le {new Date(post.archivedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    <span>Par {post.archivedBy}</span>
                  </div>

                  {post.archiveReason && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border-l-4 border-orange-400">
                        <strong>Raison :</strong> {post.archiveReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestorePost(post.id)}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Restaurer
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
