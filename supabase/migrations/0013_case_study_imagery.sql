-- Case-study imagery and the reader target value.
--
-- tube_hct is the packed-cell volume used to select the capillary-tube reader
-- activity for each case. It is student-readable by design: measuring the tube
-- is the learning step. The quiz answer key stays admin-only in case_study_keys.

alter table public.case_studies
  add column if not exists tube_hct numeric,
  add column if not exists image_url text,
  add column if not exists image_alt text;

alter table public.case_studies
  drop constraint if exists case_studies_tube_hct_check;

alter table public.case_studies
  add constraint case_studies_tube_hct_check
  check (tube_hct is null or tube_hct between 0 and 100);

-- Single source of truth for the value at seed time.
update public.case_studies cs
set tube_hct = k.hct_value
from public.case_study_keys k
where k.case_study_id = cs.id
  and cs.tube_hct is null;

-- Patient images from Human Bio Media, stored locally under /public.
update public.case_studies cs
set image_url = v.image_url,
    image_alt = v.image_alt
from (values
  ('Case 1: Black Stools and Dizziness',
   '/physiology/hematology/hematocrit-cases/middle-age-woman-ulcer.png',
   'Pale 52-year-old woman with black, tarry stools from a bleeding ulcer'),
  ('Case 2: Heavy Menstrual Bleeding',
   '/physiology/hematology/hematocrit-cases/young-woman-menstrual.png',
   'Tired 26-year-old woman with heavy menstrual bleeding'),
  ('Case 3: Fatigue on a Vegetarian Diet',
   '/physiology/hematology/hematocrit-cases/young-female-college-student.png',
   'Pale 22-year-old college student on a vegetarian diet'),
  ('Case 4: Declining Kidney Function',
   '/physiology/hematology/hematocrit-cases/middle-age-man-diabetes.png',
   '58-year-old man with type 2 diabetes and declining kidney function'),
  ('Case 5: Falling Haematocrit in Pregnancy',
   '/physiology/hematology/hematocrit-cases/pregnant-woman.png',
   '29-year-old woman at 32 weeks of pregnancy'),
  ('Case 6: Weakness After Working in the Heat',
   '/physiology/hematology/hematocrit-cases/farmer-dehydrated.png',
   'Dehydrated 45-year-old farmer after working in hot weather'),
  ('Case 7: Adapting to High Altitude',
   '/physiology/hematology/hematocrit-cases/mountain-climber.png',
   '35-year-old climber acclimatising to high altitude'),
  ('Case 8: Breathlessness in COPD',
   '/physiology/hematology/hematocrit-cases/elderly-man-copd.png',
   '68-year-old man with chronic obstructive pulmonary disease')
) as v(title, image_url, image_alt)
where cs.title = v.title
  and cs.simulation_slug = 'physiology/hematology/hematocrit-case-studies'
  and cs.image_url is null;

