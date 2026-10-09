-- Enable RLS on every table
alter table profiles enable row level security;
alter table restaurants enable row level security;
alter table restaurant_members enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table ingredients enable row level security;
alter table allergens enable row level security;
alter table menu_item_ingredients enable row level security;
alter table menu_item_allergens enable row level security;
alter table restaurant_settings enable row level security;

-- Helper: is the current user a member of this restaurant?
create or replace function is_restaurant_member(target_restaurant_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from restaurant_members
    where restaurant_id = target_restaurant_id
      and user_id = auth.uid()
  );
$$;

-- profiles
create policy "کاربر پروفایل خودش را می‌بیند"
  on profiles for select
  using (id = auth.uid());

create policy "کاربر پروفایل خودش را ویرایش می‌کند"
  on profiles for update
  using (id = auth.uid());

create policy "کاربر پروفایل خودش را می‌سازد"
  on profiles for insert
  with check (id = auth.uid());

-- restaurants
create policy "همه رستوران را می‌بینند"
  on restaurants for select
  using (true);

create policy "عضو رستوران را ویرایش می‌کند"
  on restaurants for update
  using (is_restaurant_member(id));

create policy "کاربر لاگین‌شده رستوران می‌سازد"
  on restaurants for insert
  with check (auth.uid() is not null);

-- restaurant_members
create policy "کاربر عضویت‌های خودش را می‌بیند"
  on restaurant_members for select
  using (user_id = auth.uid());

create policy "کاربر خودش را عضو رستوران تازه‌ساخته می‌کند"
  on restaurant_members for insert
  with check (user_id = auth.uid());

-- categories
create policy "همه دسته‌بندی‌ها را می‌بینند"
  on categories for select
  using (true);

create policy "عضو رستوران دسته‌بندی مدیریت می‌کند"
  on categories for insert
  with check (is_restaurant_member(restaurant_id));

create policy "عضو رستوران دسته‌بندی را ویرایش می‌کند"
  on categories for update
  using (is_restaurant_member(restaurant_id));

create policy "عضو رستوران دسته‌بندی را حذف می‌کند"
  on categories for delete
  using (is_restaurant_member(restaurant_id));

-- menu_items
create policy "همه آیتم‌های منو را می‌بینند"
  on menu_items for select
  using (true);

create policy "عضو رستوران آیتم می‌سازد"
  on menu_items for insert
  with check (is_restaurant_member(restaurant_id));

create policy "عضو رستوران آیتم را ویرایش می‌کند"
  on menu_items for update
  using (is_restaurant_member(restaurant_id));

create policy "عضو رستوران آیتم را حذف می‌کند"
  on menu_items for delete
  using (is_restaurant_member(restaurant_id));

-- ingredients
create policy "همه مواد تشکیل‌دهنده را می‌بینند"
  on ingredients for select using (true);

create policy "عضو رستوران ماده مدیریت می‌کند"
  on ingredients for insert
  with check (is_restaurant_member(restaurant_id));

create policy "عضو رستوران ماده را ویرایش می‌کند"
  on ingredients for update
  using (is_restaurant_member(restaurant_id));

create policy "عضو رستوران ماده را حذف می‌کند"
  on ingredients for delete
  using (is_restaurant_member(restaurant_id));

-- allergens
create policy "همه آلرژن‌ها را می‌بینند"
  on allergens for select using (true);

create policy "عضو رستوران آلرژن مدیریت می‌کند"
  on allergens for insert
  with check (is_restaurant_member(restaurant_id));

create policy "عضو رستوران آلرژن را ویرایش می‌کند"
  on allergens for update
  using (is_restaurant_member(restaurant_id));

create policy "عضو رستوران آلرژن را حذف می‌کند"
  on allergens for delete
  using (is_restaurant_member(restaurant_id));

-- menu_item_ingredients
create policy "همه ارتباط غذا-ماده را می‌بینند"
  on menu_item_ingredients for select using (true);

create policy "عضو رستوران ارتباط می‌سازد"
  on menu_item_ingredients for insert
  with check (is_restaurant_member(
    (select restaurant_id from menu_items where id = menu_item_id)
  ));

create policy "عضو رستوران ارتباط را حذف می‌کند"
  on menu_item_ingredients for delete
  using (is_restaurant_member(
    (select restaurant_id from menu_items where id = menu_item_id)
  ));

-- menu_item_allergens
create policy "همه ارتباط غذا-آلرژن را می‌بینند"
  on menu_item_allergens for select using (true);

create policy "عضو رستوران ارتباط می‌سازد"
  on menu_item_allergens for insert
  with check (is_restaurant_member(
    (select restaurant_id from menu_items where id = menu_item_id)
  ));

create policy "عضو رستوران ارتباط را حذف می‌کند"
  on menu_item_allergens for delete
  using (is_restaurant_member(
    (select restaurant_id from menu_items where id = menu_item_id)
  ));

-- restaurant_settings
create policy "همه تنظیمات را می‌بینند"
  on restaurant_settings for select using (true);

create policy "عضو رستوران تنظیمات می‌سازد"
  on restaurant_settings for insert
  with check (is_restaurant_member(restaurant_id));

create policy "عضو رستوران تنظیمات را ویرایش می‌کند"
  on restaurant_settings for update
  using (is_restaurant_member(restaurant_id));