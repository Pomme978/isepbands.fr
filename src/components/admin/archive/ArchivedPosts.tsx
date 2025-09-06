'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileText, Calendar, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import Avatar from '@/components/common/Avatar';
import BadgeDisplay from '@/components/profile/BadgeDisplay';

interface ArchivedPost {
  id: string;
  title: string;
  description?: string;
  author: string;
  authorAvatar?: string;
  authorRole?: string;
  authorRoleColors?: {
    gradientStart: string;
    gradientEnd: string;
  };
  authorPronouns?: string;
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
  const [restoringPostId, setRestoringPostId] = useState<string | null>(null);

  const fetchArchivedPosts = useCallback(async () => {
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
  }, [filters]);

  useEffect(() => {
    fetchArchivedPosts();
  }, [fetchArchivedPosts]);

  const handleRestorePost = async (postId: string) => {
    setRestoringPostId(postId);
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
    } finally {
      setRestoringPostId(null);
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
      case 'post':
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
            className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow bg-white"
          >
            {/* Header avec titre, badges et bouton */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 break-words">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                      >
                        {getStatusLabel()}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTypeLabel(post.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton Restaurer - Desktop à droite, Mobile en dessous */}
              <div className="hidden sm:block flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestorePost(post.id)}
                  disabled={restoringPostId === post.id}
                  className="flex items-center gap-1"
                >
                  {restoringPostId === post.id ? (
                    <Loading text="Restauration..." size="sm" variant="spinner" />
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      Restaurer
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Description */}
            {post.description && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {post.description.length > 150
                    ? `${post.description.substring(0, 150)}...`
                    : post.description}
                </p>
              </div>
            )}

            {/* Informations en grille responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Colonne gauche : Auteur */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2">AUTEUR</p>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={post.authorAvatar}
                      name={post.author || 'Utilisateur inconnu'}
                      size="sm"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm">{post.author}</span>
                      {post.authorRole && (
                        <BadgeDisplay
                          role={post.authorRole}
                          badges={[]}
                          isLookingForGroup={false}
                          pronouns={
                            (post.authorPronouns as 'he/him' | 'she/her' | 'they/them' | 'other') ||
                            'they/them'
                          }
                          size="xs"
                          roleCustomColors={post.authorRoleColors}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Dates */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-2">DATES</p>
                  <div className="space-y-2">
                    {post.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          Publié le {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                    {post.archivedAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span>
                          Archivé le {new Date(post.archivedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informations d'archivage */}
            <div className="border-t border-gray-100 pt-4">
              <div className="mb-3">
                <p className="text-xs text-orange-600 font-medium mb-1">ARCHIVAGE</p>
                <p className="text-sm text-orange-700 font-medium">Archivé par {post.archivedBy}</p>
              </div>

              {/* Raison d'archivage */}
              {post.archiveReason && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700">
                    <strong className="text-orange-800">Raison :</strong> {post.archiveReason}
                  </p>
                </div>
              )}
            </div>

            {/* Bouton Mobile */}
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestorePost(post.id)}
                disabled={restoringPostId === post.id}
                className="w-full flex items-center justify-center gap-2"
              >
                {restoringPostId === post.id ? (
                  <Loading text="Restauration..." size="sm" variant="spinner" />
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Restaurer
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
