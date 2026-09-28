-- Blood typing assessment.
--
-- The simulation used to score six questions locally in the browser, so nothing
-- was recorded and administrators could not review results. The same questions
-- now live in the database and belong to this simulation's General quiz, which
-- the simulation page renders inline.

-- Ensure the General quiz exists for this simulation.
insert into public.quizzes (title, simulation_slug, published)
select 'General quiz', 'physiology/hematology/blood-typing', true
where not exists (
  select 1 from public.quizzes q
  where q.simulation_slug = 'physiology/hematology/blood-typing'
    and lower(q.title) = 'general quiz'
);

-- Drop the placeholder demo questions this simulation inherited from 0008.
delete from public.questions
where simulation_slug = 'physiology/hematology/blood-typing'
  and text like '<p>[Demo seed%';

with seed(position, question_text, options, correct_option) as (
  values
    (0, '<p>What is the husband’s blood type?</p>',
     array['A+', 'B−', 'O+', 'AB+'], 'O+'),
    (1, '<p>What is the wife’s blood type?</p>',
     array['A−', 'O−', 'A+', 'AB−'], 'A−'),
    (2, '<p>What ABO blood types could their child inherit?</p>',
     array['Only A', 'A or O', 'A, B, AB, or O', 'Only O'], 'A or O'),
    (3, '<p>Which Rh antigen is most clinically significant?</p>',
     array['A', 'B', 'D', 'H'], 'D'),
    (4, '<p>What is RhoGAM?</p>',
     array['An anti-D immunoglobulin injection', 'An ABO antigen', 'A red-cell stimulant', 'A platelet concentrate'],
     'An anti-D immunoglobulin injection'),
    (5, '<p>To which recipients can the husband’s RBCs be donated safely?</p>',
     array['O− only', 'A+, B+, O+, and AB+', 'AB+ only', 'All Rh types'],
     'A+, B+, O+, and AB+')
),
inserted_questions as (
  insert into public.questions (text, explanation, simulation_slug, published)
  select s.question_text, null::text, 'physiology/hematology/blood-typing', true
  from seed s
  where not exists (
    select 1 from public.questions existing
    where existing.simulation_slug = 'physiology/hematology/blood-typing'
      and existing.text = s.question_text
  )
  returning id, text
),
inserted_options as (
  insert into public.question_options (question_id, option_text, is_correct)
  select iq.id, o.option_text, o.option_text = s.correct_option
  from inserted_questions iq
  join seed s on s.question_text = iq.text
  cross join lateral unnest(s.options) as o(option_text)
  returning id
)
insert into public.quiz_questions (quiz_id, question_id, position)
select qz.id, iq.id, s.position
from inserted_questions iq
join seed s on s.question_text = iq.text
join public.quizzes qz
  on qz.simulation_slug = 'physiology/hematology/blood-typing'
 and lower(qz.title) = 'general quiz'
on conflict (quiz_id, question_id) do nothing;