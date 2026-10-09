-- profiles: extends auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- restaurants
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  created_at timestamptz not null default now()
);

create index idx_restaurants_slug on restaurants(slug);

-- restaurant_members
create table restaurant_members (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  unique (restaurant_id, user_id)
);

create index idx_restaurant_members_restaurant_id on restaurant_members(restaurant_id);
create index idx_restaurant_members_user_id on restaurant_members(user_id);

-- categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_categories_restaurant_id on categories(restaurant_id);

-- menu_items
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  price numeric(12,2) not null default 0,
  image_url text,
  spiciness_level smallint not null default 0,
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create index idx_menu_items_restaurant_id on menu_items(restaurant_id);
create index idx_menu_items_category_id on menu_items(category_id);

-- ingredients
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null
);

create index idx_ingredients_restaurant_id on ingredients(restaurant_id);

-- allergens
create table allergens (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null
);

create index idx_allergens_restaurant_id on allergens(restaurant_id);

-- menu_item_ingredients
create table menu_item_ingredients (
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  primary key (menu_item_id, ingredient_id)
);

-- menu_item_allergens
create table menu_item_allergens (
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  allergen_id uuid not null references allergens(id) on delete cascade,
  primary key (menu_item_id, allergen_id)
);

-- restaurant_settings
create table restaurant_settings (
  restaurant_id uuid primary key references restaurants(id) on delete cascade,
  currency_label text not null default 'تومان'
);