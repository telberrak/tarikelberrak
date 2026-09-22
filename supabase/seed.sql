-- Sample content matching the design mock. Safe to re-run (upserts on slug).

insert into public.courses (slug, title, description, level, category, price_cents, is_free, published)
values
  ('bases-bourse-debutants', 'Les bases de la bourse pour débutants', 'Comment fonctionne un marché boursier, en six leçons courtes.', 'beginner', 'trading', 0, true, true),
  ('gerer-budget-sans-stress', 'Gérer son budget sans stress', 'Une méthode simple pour suivre ses dépenses et se fixer des objectifs réalistes.', 'beginner', 'literacy', 0, true, true),
  ('comprendre-cryptomonnaies', 'Comprendre les cryptomonnaies', 'Ce qu''il faut vérifier avant d''investir, et les erreurs les plus courantes.', 'intermediate', 'crypto', 4900, false, true),
  ('investissement-long-terme', 'L''investissement long terme expliqué simplement', 'Pourquoi la patience bat souvent la stratégie la plus sophistiquée.', 'beginner', 'investing', 0, true, true),
  ('lire-bilan-financier', 'Lire un bilan financier', 'Décoder les grands postes d''un bilan et d''un compte de résultat.', 'intermediate', 'literacy', 6900, false, true),
  ('marches-expliques-10-minutes', 'Les marchés expliqués en 10 minutes', 'Actions, obligations, devises et matières premières, en une seule séance.', 'beginner', 'trading', 0, true, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  level = excluded.level,
  category = excluded.category,
  price_cents = excluded.price_cents,
  is_free = excluded.is_free,
  published = excluded.published;

-- Curriculum + video assets for the flagship free course.
with course as (
  select id from public.courses where slug = 'bases-bourse-debutants'
),
section as (
  insert into public.course_sections (course_id, title, position)
  select id, 'Introduction', 0 from course
  returning id, course_id
)
insert into public.lessons (course_id, section_id, slug, title, position, duration_seconds, is_preview)
select
  section.course_id,
  section.id,
  lesson.slug,
  lesson.title,
  lesson.position,
  lesson.duration_seconds,
  lesson.is_preview
from section
cross join (
  values
    ('quest-ce-quun-marche', 'Qu''est-ce qu''un marché boursier ?', 0, 240, true),
    ('actions-vs-obligations', 'Actions vs obligations', 1, 300, true),
    ('comment-acheter', 'Comment acheter votre premier titre', 2, 360, false),
    ('comprendre-les-ordres', 'Comprendre les types d''ordres', 3, 280, false),
    ('frais-et-fiscalite', 'Frais et fiscalité en Belgique/France/Maroc', 4, 320, false),
    ('erreurs-debutants', 'Les erreurs classiques de débutant', 5, 260, false)
) as lesson(slug, title, position, duration_seconds, is_preview)
on conflict (course_id, slug) do update set
  title = excluded.title,
  position = excluded.position,
  duration_seconds = excluded.duration_seconds,
  is_preview = excluded.is_preview;

insert into public.lesson_assets (lesson_id, provider, video_asset_id)
select l.id, 'html5', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
from public.lessons l
join public.courses c on c.id = l.course_id
where c.slug = 'bases-bourse-debutants'
on conflict (lesson_id) do update set video_asset_id = excluded.video_asset_id;
