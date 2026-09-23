insert into courses (slug, title, description, level, category, price_cents, is_free, published)
values
  ('bases-bourse-debutants', 'Les bases de la bourse pour débutants', 'Comment fonctionne un marché boursier, en six leçons courtes.', 'beginner', 'trading', 0, true, true),
  ('gerer-budget-sans-stress', 'Gérer son budget sans stress', 'Une méthode simple pour suivre ses dépenses et se fixer des objectifs réalistes.', 'beginner', 'literacy', 0, true, true),
  ('comprendre-cryptomonnaies', 'Comprendre les cryptomonnaies', 'Ce qu''il faut vérifier avant d''investir, et les erreurs les plus courantes.', 'intermediate', 'crypto', 4900, false, true),
  ('investissement-long-terme', 'L''investissement long terme expliqué simplement', 'Pourquoi la patience bat souvent la stratégie la plus sophistiquée.', 'beginner', 'investing', 0, true, true),
  ('lire-bilan-financier', 'Lire un bilan financier', 'Décoder les grands postes d''un bilan et d''un compte de résultat.', 'intermediate', 'literacy', 6900, false, true),
  ('marches-expliques-10-minutes', 'Les marchés expliqués en 10 minutes', 'Actions, obligations, devises et matières premières, en une seule séance.', 'beginner', 'trading', 0, true, true);

do $$
declare
  v_course_id uuid;
  v_section_id uuid;
begin
  select id into v_course_id from courses where slug = 'bases-bourse-debutants';

  insert into course_sections (course_id, title, position)
  values (v_course_id, 'Introduction', 0)
  returning id into v_section_id;

  insert into lessons (course_id, section_id, slug, title, position, duration_seconds, is_preview)
  values
    (v_course_id, v_section_id, 'quest-ce-quun-marche', 'Qu''est-ce qu''un marché boursier ?', 0, 240, true),
    (v_course_id, v_section_id, 'actions-vs-obligations', 'Actions vs obligations', 1, 300, true),
    (v_course_id, v_section_id, 'comment-acheter', 'Comment acheter votre premier titre', 2, 360, false),
    (v_course_id, v_section_id, 'comprendre-les-ordres', 'Comprendre les types d''ordres', 3, 280, false),
    (v_course_id, v_section_id, 'frais-et-fiscalite', 'Frais et fiscalité en Belgique/France/Maroc', 4, 320, false),
    (v_course_id, v_section_id, 'erreurs-debutants', 'Les erreurs classiques de débutant', 5, 260, false);

  insert into lesson_assets (lesson_id, provider, video_asset_id)
  select id, 'html5', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
  from lessons
  where course_id = v_course_id;
end $$;
