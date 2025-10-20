# How to Execute the Seller Ratings System Migration

## ⚠️ Important: This Must Be Done in Supabase SQL Editor

The `ADD-SELLER-RATINGS-SYSTEM.sql` migration file adds critical database functions and triggers needed for the real data tracking to work properly.

## Step 1: Access Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your "terangafoncier" project
3. Click on "SQL Editor" in the left sidebar
4. Click "+ New Query" button

## Step 2: Copy and Execute the Migration

1. Open the file: `ADD-SELLER-RATINGS-SYSTEM.sql`
2. Copy ALL the contents
3. Paste into the Supabase SQL editor
4. Click "Run" button (or Ctrl+Enter)

## Step 3: Verify Migration Success

After running, you should see:
- ✅ No errors in the output
- ✅ Rows affected: 0 (for CREATE statements, this is normal)
- ✅ Messages about permissions granted

## What This Migration Does

### 1. Adds New Columns to `profiles` Table
```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS properties_sold INTEGER DEFAULT 0;
```

These columns store:
- **rating** - Average seller rating (1-5 stars)
- **review_count** - Number of reviews received
- **properties_sold** - Count of properties this seller has sold

### 2. Creates `reviews` Table
For storing individual seller reviews:
- reviewer_id (who left the review)
- seller_id (seller being reviewed)
- property_id (which property was being purchased)
- rating (1-5 stars)
- comment (review text)

### 3. Creates Database Functions

#### `update_seller_rating()`
- Automatically calculates average seller rating from all reviews
- Updates `profiles.rating` and `profiles.review_count`
- Triggered when reviews are added/updated/deleted

#### `update_properties_sold()`
- Counts how many properties a seller has sold
- Updates `profiles.properties_sold`
- Triggered when property status changes to "sold"

#### `update_favorites_count()`
- Keeps `properties.favorites_count` in sync with favorites table
- Triggered when favorites are added/removed

#### `increment_property_views(property_id)`
- Safely increments view count atomically
- Called from ParcelleDetailPage when page loads

### 4. Creates Triggers

These automatically keep data in sync:
- `trigger_update_seller_rating` - Updates ratings on reviews changes
- `trigger_update_properties_sold` - Updates sold count on property changes
- `trigger_update_favorites_count` - Updates favorites count on favorites changes

### 5. Sets Up RLS Policies for Reviews

- Anyone can read reviews
- Only authenticated users can write reviews
- Users can only delete their own reviews

## Troubleshooting

### If you get "Column already exists" error
This is fine! The migration uses `IF NOT EXISTS` to avoid errors if run multiple times.

### If you get "Function already exists" error
This is also fine! The migration handles this gracefully.

### If RLS policies cause issues
Make sure you're connected as the project admin (default in dashboard)

## After Migration

### The page will automatically:
1. ✅ Track views when ParcelleDetailPage loads
2. ✅ Update favorites count when items are added/removed
3. ✅ Show real seller ratings (once reviews exist)
4. ✅ Show real properties_sold count

### To test:
1. Open a parcel detail page - you should see views increment
2. Click "Sauvegarder" (favorite) - favorites count should increase
3. Check the seller card - it should show real rating if reviews exist

## Rollback (If Needed)

If something goes wrong, you can rollback by:

1. Create a new query in Supabase SQL Editor
2. Run these commands to remove the new columns:

```sql
ALTER TABLE profiles 
DROP COLUMN IF EXISTS rating,
DROP COLUMN IF EXISTS review_count,
DROP COLUMN IF EXISTS properties_sold;

DROP TABLE IF EXISTS reviews CASCADE;
DROP TRIGGER IF EXISTS trigger_update_seller_rating ON reviews;
DROP TRIGGER IF EXISTS trigger_update_properties_sold ON properties;
DROP TRIGGER IF EXISTS trigger_update_favorites_count ON favorites;
DROP FUNCTION IF EXISTS update_seller_rating();
DROP FUNCTION IF EXISTS update_properties_sold();
DROP FUNCTION IF EXISTS update_favorites_count();
DROP FUNCTION IF EXISTS increment_property_views(UUID);
```

## Important Notes

⚠️ **Run only ONCE** - The migration is idempotent (won't cause errors if run multiple times)

⚠️ **Safe for existing data** - Uses `IF NOT EXISTS` and `CASCADE` to protect existing data

⚠️ **No downtime** - Running this migration won't affect the running application

✅ **Reversible** - Can be rolled back if needed using the rollback commands above

---

**Status:** Ready to execute  
**Execution Time:** < 1 minute  
**Difficulty:** Easy - Just copy, paste, and run

