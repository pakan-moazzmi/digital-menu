create table menu_events (
  id bigint generated always as identity primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete cascade,
  event_type text not null check (event_type in ('menu_view', 'item_view')),
  created_at timestamptz not null default now()
);

create index idx_menu_events_restaurant_created
  on menu_events(restaurant_id, created_at desc);
create index idx_menu_events_item on menu_events(menu_item_id);

alter table menu_events enable row level security;

-- فقط عضو رستوران آمار رستوران خودش را می‌بیند.
-- عمداً هیچ policy برای INSERT/UPDATE/DELETE نداریم.
create policy "عضو رستوران آمار را می‌بیند"
  on menu_events for select
  using (is_restaurant_member(restaurant_id));

create or replace function record_menu_event(
  p_restaurant_slug text,
  p_item_slug text,
  p_event_type text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restaurant_id uuid;
  v_item_id uuid;
begin
  if p_event_type not in ('menu_view', 'item_view') then
    return;
  end if;

  select id into v_restaurant_id
  from restaurants
  where slug = p_restaurant_slug;

  if v_restaurant_id is null then
    return;
  end if;

  if p_event_type = 'item_view' then
    select id into v_item_id
    from menu_items
    where restaurant_id = v_restaurant_id
      and slug = p_item_slug
      and is_available = true;

    if v_item_id is null then
      return;
    end if;
  end if;

  insert into menu_events (restaurant_id, menu_item_id, event_type)
  values (v_restaurant_id, v_item_id, p_event_type);
end;
$$;

revoke all on function record_menu_event(text, text, text) from public;
grant execute on function record_menu_event(text, text, text) to anon, authenticated;