import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Search,
  Heart
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { CreatePostDialog } from "./community/CreatePostDialog";
import { PostCard } from "./community/PostCard";
import { NetworkingTab } from "./community/NetworkingTab";

import { mockRegionalData } from "@/data/mockRegionalData";

export const CommunityPlatform = ({ user }) => {

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", label: "All Posts", icon: MessageSquare },
    { id: "general", label: "General Discussion", icon: MessageSquare },
    { id: "crop-health", label: "Crop Health", icon: TrendingUp },
    { id: "farming-tips", label: "Farming Tips", icon: Users },
    { id: "market-trends", label: "Market Trends", icon: TrendingUp },
    { id: "technology", label: "Technology", icon: Plus },
    { id: "collaboration", label: "Collaboration", icon: Users }
  ];

  const fetchPosts = async () => {

    try {

      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const postsWithProfiles = await Promise.all(
        (data || []).map(async (post) => {

          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, avatar_url")
            .eq("user_id", post.user_id)
            .single();

          return {
            ...post,
            profiles: profile || {
              display_name: "Anonymous Farmer",
              avatar_url: null
            }
          };

        })
      );

      setPosts(postsWithProfiles);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load community posts");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {

    let filtered = posts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {

      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    }

    setFilteredPosts(filtered);

  }, [posts, selectedCategory, searchTerm]);

  const handlePostCreated = () => {

    fetchPosts();
    setIsCreatePostOpen(false);

  };

  const handleLikePost = async (postId) => {

    try {

      const { data: existingLike } = await supabase
        .from("community_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {

        const { error } = await supabase
          .from("community_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;

      } else {

        const { error } = await supabase
          .from("community_likes")
          .insert({ post_id: postId, user_id: user.id });

        if (error) throw error;

      }

      fetchPosts();

    } catch (error) {

      console.error(error);
      toast.error("Failed to update like");

    }

  };

  const regionCommunity =
    mockRegionalData["Nashik"].farmerCommunity.activeUsers;

  console.log("Active users in Nashik community:", regionCommunity);

  return (

    <div className="min-h-screen bg-background pt-8">

      <div className="container mx-auto px-6">

        <div className="mb-8">

          <h1 className="text-4xl font-bold gradient-text mb-2">
            Farmer Community
          </h1>

          <p className="text-lg text-muted-foreground">
            Connect, collaborate, and learn from fellow farmers worldwide
          </p>

        </div>

        <Tabs defaultValue="posts" className="space-y-6">

          <TabsList className="grid w-full grid-cols-3">

            <TabsTrigger value="posts">
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussion Forum
            </TabsTrigger>

            <TabsTrigger value="networking">
              <Users className="w-4 h-4 mr-2" />
              Networking
            </TabsTrigger>

            <TabsTrigger value="trends">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Topics
            </TabsTrigger>

          </TabsList>

          <TabsContent value="posts">

            <div className="space-y-4">

              {loading ? (

                <p className="text-center text-muted-foreground">
                  Loading community posts...
                </p>

              ) : filteredPosts.length === 0 ? (

                <Card>

                  <CardContent className="text-center py-8">

                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />

                    <h3 className="text-lg font-semibold mb-2">
                      No posts found
                    </h3>

                    <Button onClick={() => setIsCreatePostOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>

                  </CardContent>

                </Card>

              ) : (

                filteredPosts.map((post) => (

                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={user.id}
                    onLike={() => handleLikePost(post.id)}
                    onComment={() => {}}
                  />

                ))

              )}

            </div>

          </TabsContent>

          <TabsContent value="networking">
            <NetworkingTab user={user} />
          </TabsContent>

        </Tabs>

        <CreatePostDialog
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={handlePostCreated}
          user={user}
        />

      </div>

    </div>

  );

};
