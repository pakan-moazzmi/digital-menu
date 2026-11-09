create table restaurant_plans (
  restaurant_id uuid primary key references restaurants(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

alter table restaurant_plans enable row level security;

-- عضو رستوران فقط می‌تواند پلن خودش را ببیند. عمداً policy نوشتن نداریم.
create policy "عضو رستوران پلن را می‌بیند"
  on restaurant_plans for select
  using (is_restaurant_member(restaurant_id));

-- رستوران‌های موجود
insert into restaurant_plans (restaurant_id)
select id from restaurants
on conflict do nothing;

-- رستوران‌های جدید خودکار پلن رایگان می‌گیرند
create or replace function create_default_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into restaurant_plans (restaurant_id) values (new.id)
  on conflict do nothing;
  return new;
end;
$$;

create trigger trg_create_default_plan
after insert on restaurants
for each row execute function create_default_plan();

-- سقف تعداد غذا برای هر پلن (null یعنی نامحدود)
create or replace function plan_item_limit(p_plan text)
returns integer
language sql
immutable
as $$
  select case p_plan when 'free' then 20 else null end;
$$;

create or replace function enforce_item_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_limit integer;
  v_count integer;
begin
  select plan into v_plan
  from restaurant_plans
  where restaurant_id = new.restaurant_id;

  v_limit := plan_item_limit(coalesce(v_plan, 'free'));

  if v_limit is not null then
    select count(*) into v_count
    from menu_items
    where restaurant_id = new.restaurant_id;

    if v_count >= v_limit then
      raise exception 'PLAN_LIMIT_REACHED';
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_enforce_item_limit
before insert on menu_items
for each row execute function enforce_item_limit();