/*
  # Make Opportunity Chat Public and Add Likes

  1. Changes
    - Update policies to make posts and comments public
    - Add likes table for opportunity posts
    - Add like count to posts

  2. Security
    - Enable RLS on likes table
    - Add appropriate policies for likes
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view posts" ON opportunity_posts;
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;

-- Update policies to allow public access
CREATE POLICY "Posts are public"
  ON opportunity_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Comments are public"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Add likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES opportunity_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Add like_count to posts
ALTER TABLE opportunity_posts
ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;

-- Enable RLS on likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Policies for likes
CREATE POLICY "Anyone can view likes"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update like count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE opportunity_posts 
    SET like_count = like_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE opportunity_posts 
    SET like_count = like_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for like count
CREATE TRIGGER update_like_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_like_count();