import React, { useState, useEffect } from 'react';
import { MessageSquare, Edit2, Trash2, Send, Heart, Share } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  user_email: string;
  created_at: string;
  like_count: number;
  is_liked: boolean;
  comments: Comment[];
  profiles?: { email: string } | null;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  user_email: string;
  created_at: string;
  post_id: string;
  profiles?: { email: string } | null;
}

const OpportunityChat = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('opportunity_posts')
        .select(`
          *,
          profiles(email),
          comments(
            id,
            content,
            user_id,
            created_at,
            profiles(email)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get likes for current user
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user?.id);

      const likedPostIds = new Set(likes?.map(like => like.post_id));

      setPosts(posts.map(post => ({
        ...post,
        user_email: post.profiles?.email || 'Unknown User',
        is_liked: likedPostIds.has(post.id),
        comments: post.comments.map((comment: any) => ({
          ...comment,
          user_email: comment.profiles?.email || 'Unknown User'
        }))
      })));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const { error } = await supabase
        .from('opportunity_posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          user_id: user?.id
        }]);

      if (error) throw error;

      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('post_likes')
          .insert([{
            post_id: postId,
            user_id: user?.id
          }]);
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSharePost = async (post: Post) => {
    try {
      await navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleEditPost = async (postId: string, title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('opportunity_posts')
        .update({ title, content })
        .eq('id', postId);

      if (error) throw error;

      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('opportunity_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment,
          user_id: user?.id,
          post_id: postId
        }]);

      if (error) throw error;

      setNewComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">Share an Opportunity</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Opportunity Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            placeholder="Describe the opportunity..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full h-32 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSubmitPost}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
          >
            Post Opportunity
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            {editingPost === post.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) => setPosts(posts.map(p => 
                    p.id === post.id ? { ...p, title: e.target.value } : p
                  ))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white"
                />
                <textarea
                  value={post.content}
                  onChange={(e) => setPosts(posts.map(p => 
                    p.id === post.id ? { ...p, content: e.target.value } : p
                  ))}
                  className="w-full h-32 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPost(post.id, post.title, post.content)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPost(null)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                    <p className="text-indigo-300 text-sm">
                      Posted by {post.user_email} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikePost(post.id, post.is_liked)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.is_liked
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-indigo-300 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                      <span className="text-sm ml-1">{post.like_count}</span>
                    </button>
                    <button
                      onClick={() => handleSharePost(post)}
                      className="p-2 text-indigo-300 hover:text-white transition-colors"
                    >
                      <Share className="w-5 h-5" />
                    </button>
                    {user?.id === post.user_id && (
                      <>
                        <button
                          onClick={() => setEditingPost(post.id)}
                          className="p-2 text-indigo-300 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-white mb-6">{post.content}</p>

                {/* Comments */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-300">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </div>

                  <div className="space-y-4">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-indigo-300 text-sm">
                            {comment.user_email} • {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-white">{comment.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityChat;