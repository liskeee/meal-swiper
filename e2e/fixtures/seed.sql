-- E2E test seed data
INSERT OR IGNORE INTO meals (id, nazwa, opis, photo_url, prep_time, kcal_baza, kcal_z_miesem, bialko_baza, bialko_z_miesem, trudnosc, kuchnia, category, skladniki_baza, skladniki_mieso, przepis, tags)
VALUES
  ('test-1', 'Pasta Carbonara', 'Klasyczny włoski makaron', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800', 20, 500, 650, 18, 35, 'łatwe', 'włoska', 'makaron',
   '[{"name":"Makaron","amount":"200g"},{"name":"Jajka","amount":"2 szt"}]',
   '[{"name":"Boczek","amount":"100g"}]',
   '{"kroki":["Ugotuj makaron.","Wymieszaj jajka z serem.","Połącz z makaronem."],"wskazowki":"Nie przesmażaj jajek."}',
   '["obiad"]'),
  ('test-2', 'Sałatka Grecka', 'Lekka sałatka śródziemnomorska', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', 10, 200, 350, 8, 22, 'łatwe', 'grecka', 'sałatka',
   '[{"name":"Pomidor","amount":"2 szt"},{"name":"Ogórek","amount":"1 szt"},{"name":"Feta","amount":"100g"}]',
   '[{"name":"Kurczak grillowany","amount":"150g"}]',
   '{"kroki":["Pokrój warzywa.","Dodaj fetę.","Skrop oliwą."],"wskazowki":"Podawaj schłodzoną."}',
   '["obiad","lekkie"]');
