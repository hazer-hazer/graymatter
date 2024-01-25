CREATE UNIQUE INDEX buy_list_items_buy_list_id_item_id_item_variant_id_ukey ON buy_list_items (buy_list_id, item_id, item_variant_id) NULLS NOT DISTINCT;
