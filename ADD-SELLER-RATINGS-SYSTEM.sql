-- Add rating and review system to profiles table
-- This migration adds the ability to track seller ratings

-- 1. Add rating columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS properties_sold INTEGER DEFAULT 0;

-- 2. Create reviews table to store individual reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  rating DECIMAL(3,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create function to update seller rating when new review is added
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE seller_id = NEW.seller_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE seller_id = NEW.seller_id
    )
  WHERE id = NEW.seller_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to automatically update ratings
DROP TRIGGER IF EXISTS trigger_update_seller_rating ON reviews;
CREATE TRIGGER trigger_update_seller_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_seller_rating();

-- 5. Function to update properties_sold count when property status changes to sold
CREATE OR REPLACE FUNCTION update_properties_sold()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'sold' AND OLD.status != 'sold' THEN
    UPDATE profiles
    SET properties_sold = properties_sold + 1
    WHERE id = NEW.owner_id;
  ELSIF NEW.status != 'sold' AND OLD.status = 'sold' THEN
    UPDATE profiles
    SET properties_sold = GREATEST(properties_sold - 1, 0)
    WHERE id = NEW.owner_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to automatically update properties_sold count
DROP TRIGGER IF EXISTS trigger_update_properties_sold ON properties;
CREATE TRIGGER trigger_update_properties_sold
AFTER UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_properties_sold();

-- 7. Create function to update favorites_count
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties
    SET favorites_count = GREATEST(favorites_count - 1, 0)
    WHERE id = OLD.property_id;
  END IF;
  
  RETURN CASE TG_OP
    WHEN 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to automatically update favorites_count
DROP TRIGGER IF EXISTS trigger_update_favorites_count ON favorites;
CREATE TRIGGER trigger_update_favorites_count
AFTER INSERT OR DELETE ON favorites
FOR EACH ROW
EXECUTE FUNCTION update_favorites_count();

-- 9. Create function to increment views_count
DROP FUNCTION IF EXISTS increment_property_views(UUID) CASCADE;
CREATE FUNCTION increment_property_views(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE properties
  SET views_count = views_count + 1
  WHERE id = property_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_property ON favorites(user_id, property_id);

-- 11. Enable RLS on reviews table if not already enabled
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 12. RLS Policies for reviews table
DROP POLICY IF EXISTS "Enable select for all users" ON reviews;
CREATE POLICY "Enable select for all users" ON reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON reviews;
CREATE POLICY "Enable insert for authenticated users" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Enable delete for own reviews" ON reviews;
CREATE POLICY "Enable delete for own reviews" ON reviews
  FOR DELETE USING (
    auth.uid() = reviewer_id OR auth.role() = 'service_role'
  );

-- 13. Update properties_sold for existing sellers based on sold properties
UPDATE profiles p
SET properties_sold = (
  SELECT COUNT(*)
  FROM properties
  WHERE owner_id = p.id AND status = 'sold'
)
WHERE EXISTS (
  SELECT 1 FROM properties WHERE owner_id = p.id
);

-- 14. Update ratings for existing sellers based on reviews (if any exist)
UPDATE profiles p
SET 
  rating = COALESCE((
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM reviews
    WHERE seller_id = p.id
  ), 0.0),
  review_count = COALESCE((
    SELECT COUNT(*)
    FROM reviews
    WHERE seller_id = p.id
  ), 0)
WHERE EXISTS (
  SELECT 1 FROM reviews WHERE seller_id = p.id
);

GRANT ALL ON reviews TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_seller_rating TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_properties_sold TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION update_favorites_count TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION increment_property_views(UUID) TO anon, authenticated, service_role;
