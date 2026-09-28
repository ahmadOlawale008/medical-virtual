-- Removes the six legacy hematocrit case studies that were seeded before the
-- switch to Human Bio Media's eight-case set. They were replaced by the cases
-- in 0012 with the same simulation slug but different titles.
--
-- quizzes.case_study_id and questions.case_study_id both use ON DELETE SET NULL,
-- so the quizzes and questions must be removed explicitly or they would be left
-- orphaned without a case study.

delete from public.quizzes
where case_study_id in (
  select id from public.case_studies
  where simulation_slug = 'physiology/hematology/hematocrit-case-studies'
    and title in (
      'Case 1: Fatigue and Pallor in a Young Woman',
      'Case 2: Collapse After Endurance Exercise',
      'Case 3: A Routine Result After Relocation',
      'Case 4: A Child With Poorly Controlled Asthma',
      'Case 5: Longstanding Breathlessness and Cyanosis',
      'Case 6: Fatigue in Progressive Kidney Disease'
    )
);

delete from public.questions
where case_study_id in (
  select id from public.case_studies
  where simulation_slug = 'physiology/hematology/hematocrit-case-studies'
    and title in (
      'Case 1: Fatigue and Pallor in a Young Woman',
      'Case 2: Collapse After Endurance Exercise',
      'Case 3: A Routine Result After Relocation',
      'Case 4: A Child With Poorly Controlled Asthma',
      'Case 5: Longstanding Breathlessness and Cyanosis',
      'Case 6: Fatigue in Progressive Kidney Disease'
    )
);

-- case_study_keys rows are removed by ON DELETE CASCADE.
delete from public.case_studies
where simulation_slug = 'physiology/hematology/hematocrit-case-studies'
  and title in (
    'Case 1: Fatigue and Pallor in a Young Woman',
    'Case 2: Collapse After Endurance Exercise',
    'Case 3: A Routine Result After Relocation',
    'Case 4: A Child With Poorly Controlled Asthma',
    'Case 5: Longstanding Breathlessness and Cyanosis',
    'Case 6: Fatigue in Progressive Kidney Disease'
  );

-- Renumber the surviving cases so ordering stays contiguous from 1.
with ordered as (
  select id, row_number() over (order by position, created_at) as rn
  from public.case_studies
  where simulation_slug = 'physiology/hematology/hematocrit-case-studies'
)
update public.case_studies cs
set position = ordered.rn
from ordered
where cs.id = ordered.id and cs.position <> ordered.rn;