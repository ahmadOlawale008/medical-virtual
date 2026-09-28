-- Seeds the eight hematocrit case studies as one quiz per case, five questions each.
-- Text, images, questions and answer options are taken from the Human Bio Media
-- hematocrit case studies, used under CC BY 4.0 with attribution in the app.

insert into public.case_studies (simulation_slug, title, patient_name, patient_initials, patient_identity, scenario, position, published)
select
  'physiology/hematology/hematocrit-case-studies',
  c.title, c.patient_name, c.patient_initials, c.patient_identity, c.scenario, c.position, true
from (values
  (1, 'Case 1: Black Stools and Dizziness', 'Linda', 'L',
   '52-year-old female office manager', 'The subject is a 52-year-old female office manager who has been taking ibuprofen daily for chronic back pain. She reports feeling increasingly tired and has noticed black, tarry stools over the past week. She appears pale and reports dizziness when standing.'),
  (2, 'Case 2: Heavy Menstrual Bleeding', 'Sarah', 'S',
   '26-year-old female teacher', 'The subject is a 26-year-old female teacher who has been experiencing very heavy menstrual periods lasting 8-9 days for the past six months. She feels exhausted, has trouble concentrating at work, and has noticed her skin looks pale.'),
  (3, 'Case 3: Fatigue on a Vegetarian Diet', 'Emily', 'E',
   '22-year-old female college student', 'The subject is a 22-year-old female college student following a strict vegetarian diet. She has been feeling increasingly tired, has brittle nails, and her roommate mentioned she looks pale. She has heavy menstrual periods that last 7-8 days.'),
  (4, 'Case 4: Declining Kidney Function', 'Robert', 'R',
   '58-year-old male', 'The subject is a 58-year-old male with Type 2 diabetes for 15 years. He has developed kidney problems and reports feeling tired and short of breath during normal activities. His recent lab work shows declining kidney function.'),
  (5, 'Case 5: Falling Haematocrit in Pregnancy', 'Maria', 'M',
   '29-year-old female', 'The subject is a 29-year-old female at 32 weeks of pregnancy. She feels more tired than usual and sometimes gets dizzy when standing up quickly. Her previous hematocrit at 12 weeks was 42%, but now it has decreased.'),
  (6, 'Case 6: Weakness After Working in the Heat', 'Mike', 'M',
   '45-year-old male farmer', 'The subject is a 45-year-old male farmer who has been working long hours in hot weather. He reports headaches, dizziness, and hasn''t been drinking enough water during his shifts. He feels weak and his urine is dark yellow.'),
  (7, 'Case 7: Adapting to High Altitude', 'Alex', 'A',
   '35-year-old male experienced climber', 'The subject is a 35-year-old male experienced climber who recently moved from sea level to Colorado (elevation 8,000 feet). Over the past three months, their body has been adapting to the lower oxygen levels at high altitude.'),
  (8, 'Case 8: Breathlessness in COPD', 'Frank', 'F',
   '68-year-old male retired smoker', 'The subject is a 68-year-old male retired smoker with chronic obstructive pulmonary disease (COPD). He gets short of breath easily, has a chronic cough, and his oxygen levels are often low. He reports morning headaches and fatigue.')
) as c(position, title, patient_name, patient_initials, patient_identity, scenario)
where not exists (
  select 1 from public.case_studies existing
  where existing.simulation_slug = 'physiology/hematology/hematocrit-case-studies' and existing.title = c.title
);

insert into public.case_study_keys (case_study_id, hct_value, classification)
select cs.id, k.hct_value, k.classification
from (values
  ('Case 1: Black Stools and Dizziness', 22, 'low'),
  ('Case 2: Heavy Menstrual Bleeding', 24, 'low'),
  ('Case 3: Fatigue on a Vegetarian Diet', 28, 'low'),
  ('Case 4: Declining Kidney Function', 32, 'low'),
  ('Case 5: Falling Haematocrit in Pregnancy', 35, 'normal'),
  ('Case 6: Weakness After Working in the Heat', 48, 'high'),
  ('Case 7: Adapting to High Altitude', 55, 'high'),
  ('Case 8: Breathlessness in COPD', 58, 'high')
) as k(title, hct_value, classification)
join public.case_studies cs
  on cs.title = k.title and cs.simulation_slug = 'physiology/hematology/hematocrit-case-studies'
on conflict (case_study_id) do nothing;

-- One published quiz per case so results are reported per case.
insert into public.quizzes (title, simulation_slug, description, published, case_study_id)
select cs.title, cs.simulation_slug, cs.patient_identity, true, cs.id
from public.case_studies cs
where cs.simulation_slug = 'physiology/hematology/hematocrit-case-studies'
  and not exists (select 1 from public.quizzes q where q.case_study_id = cs.id);

with seed(case_title, position, question_text, options, correct_option) as (
  values
  ('Case 1: Black Stools and Dizziness', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['35%', '22%', '42%', '55%'], '22%'),
  ('Case 1: Black Stools and Dizziness', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'Low'),
  ('Case 1: Black Stools and Dizziness', 2, '<p>What is the most likely cause of the patient''s symptoms?</p>', array['GI bleeding from ulcer', 'Dehydration', 'Kidney disease', 'High altitude'], 'GI bleeding from ulcer'),
  ('Case 1: Black Stools and Dizziness', 3, '<p>How does long-term NSAID use contribute to this condition?</p>', array['Damages the stomach lining', 'Increases blood clotting', 'Decreases iron absorption', 'Increases red blood cell production'], 'Damages the stomach lining'),
  ('Case 1: Black Stools and Dizziness', 4, '<p>What immediate medical interventions might be needed?</p>', array['Endoscopy and blood transfusion', 'Iron supplements only', 'Increase fluid intake', 'Oxygen therapy'], 'Endoscopy and blood transfusion'),
  ('Case 2: Heavy Menstrual Bleeding', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['30%', '40%', '24%', '50%'], '24%'),
  ('Case 2: Heavy Menstrual Bleeding', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'Low'),
  ('Case 2: Heavy Menstrual Bleeding', 2, '<p>How does heavy menstrual bleeding affect hematocrit levels?</p>', array['Chronic blood loss reduces RBCs', 'Increases plasma volume', 'Destroys red blood cells', 'Reduces iron absorption'], 'Chronic blood loss reduces RBCs'),
  ('Case 2: Heavy Menstrual Bleeding', 3, '<p>What are the signs and symptoms the patient is experiencing?</p>', array['Fatigue, pallor, poor concentration', 'Headaches and dark urine', 'Shortness of breath and cough', 'Dizziness when standing'], 'Fatigue, pallor, poor concentration'),
  ('Case 2: Heavy Menstrual Bleeding', 4, '<p>What treatment options might help address her condition?</p>', array['Hormonal therapy and iron supplements', 'Blood transfusion', 'Increased fluid intake', 'Pain medication'], 'Hormonal therapy and iron supplements'),
  ('Case 3: Fatigue on a Vegetarian Diet', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['36%', '44%', '52%', '28%'], '28%'),
  ('Case 3: Fatigue on a Vegetarian Diet', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'Low'),
  ('Case 3: Fatigue on a Vegetarian Diet', 2, '<p>What dietary factors might contribute to the patient''s condition?</p>', array['Low iron intake from vegetarian diet', 'High caffeine intake', 'Low vitamin C', 'High fat intake'], 'Low iron intake from vegetarian diet'),
  ('Case 3: Fatigue on a Vegetarian Diet', 3, '<p>How do heavy menstrual periods worsen iron deficiency?</p>', array['Increases iron loss each month', 'Decreases iron absorption', 'Increases plasma volume', 'Destroys RBCs'], 'Increases iron loss each month'),
  ('Case 3: Fatigue on a Vegetarian Diet', 4, '<p>What lifestyle changes could help improve her hematocrit levels?</p>', array['Iron supplements and vitamin C', 'Reduce exercise', 'Increase calcium intake', 'Avoid gluten'], 'Iron supplements and vitamin C'),
  ('Case 4: Declining Kidney Function', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['32%', '40%', '48%', '56%'], '32%'),
  ('Case 4: Declining Kidney Function', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'Low'),
  ('Case 4: Declining Kidney Function', 2, '<p>How do kidney problems affect red blood cell production?</p>', array['Reduced production of erythropoietin (EPO)', 'Increased destruction of RBCs', 'Blood loss through urine', 'Poor iron absorption'], 'Reduced production of erythropoietin (EPO)'),
  ('Case 4: Declining Kidney Function', 3, '<p>What is the connection between diabetes and kidney disease?</p>', array['High blood sugar damages kidney blood vessels', 'Low blood sugar causes kidney failure', 'Diabetes directly destroys EPO', 'Autoimmune reaction'], 'High blood sugar damages kidney blood vessels'),
  ('Case 4: Declining Kidney Function', 4, '<p>What treatments might help manage the patient''s condition?</p>', array['EPO injections and managing diabetes', 'Blood transfusion', 'High-protein diet', 'Iron supplements only'], 'EPO injections and managing diabetes'),
  ('Case 5: Falling Haematocrit in Pregnancy', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['25%', '35%', '45%', '55%'], '35%'),
  ('Case 5: Falling Haematocrit in Pregnancy', 1, '<p>Based on the patient''s age, sex, and pregnancy status, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'Normal'),
  ('Case 5: Falling Haematocrit in Pregnancy', 2, '<p>Why does hematocrit typically decrease during pregnancy?</p>', array['Plasma volume increases more than RBC mass', 'Fetus uses up all the iron', 'RBCs are destroyed faster', 'Blood is lost during pregnancy'], 'Plasma volume increases more than RBC mass'),
  ('Case 5: Falling Haematocrit in Pregnancy', 3, '<p>What is the difference between normal pregnancy changes and true anemia?</p>', array['Anemia is a pathological drop, this is physiological', 'No difference, pregnancy always causes anemia', 'Anemia involves low plasma'], 'Anemia is a pathological drop, this is physiological'),
  ('Case 5: Falling Haematocrit in Pregnancy', 4, '<p>What monitoring and interventions might be appropriate for the patient?</p>', array['Routine monitoring and prenatal vitamins with iron', 'Immediate blood transfusion', 'Bed rest', 'EPO injections'], 'Routine monitoring and prenatal vitamins with iron'),
  ('Case 6: Weakness After Working in the Heat', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['38%', '42%', '48%', '58%'], '48%'),
  ('Case 6: Weakness After Working in the Heat', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'High'),
  ('Case 6: Weakness After Working in the Heat', 2, '<p>How does dehydration affect hematocrit levels?</p>', array['Decreases plasma volume, concentrating RBCs', 'Increases RBC production', 'Destroys RBCs', 'Increases plasma volume'], 'Decreases plasma volume, concentrating RBCs'),
  ('Case 6: Weakness After Working in the Heat', 3, '<p>What are the signs and symptoms of dehydration the patient is experiencing?</p>', array['Headache, dizziness, dark urine', 'Pale skin and fatigue', 'Chronic cough', 'Black, tarry stools'], 'Headache, dizziness, dark urine'),
  ('Case 6: Weakness After Working in the Heat', 4, '<p>What immediate and long-term recommendations would help the patient?</p>', array['Immediate rehydration and regular fluid intake', 'Iron supplements', 'Salt tablets', 'Reduce physical activity'], 'Immediate rehydration and regular fluid intake'),
  ('Case 7: Adapting to High Altitude', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['40%', '45%', '50%', '55%'], '55%'),
  ('Case 7: Adapting to High Altitude', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'High'),
  ('Case 7: Adapting to High Altitude', 2, '<p>Why does living at high altitude increase hematocrit levels?</p>', array['Body produces more RBCs to compensate for low oxygen', 'Plasma volume decreases', 'Air pressure compresses RBCs', 'Less oxygen is needed'], 'Body produces more RBCs to compensate for low oxygen'),
  ('Case 7: Adapting to High Altitude', 3, '<p>What physiological adaptations occur when moving to high altitude?</p>', array['Increased EPO, RBCs, and breathing rate', 'Decreased heart rate', 'Increased plasma volume', 'Lower blood pressure'], 'Increased EPO, RBCs, and breathing rate'),
  ('Case 7: Adapting to High Altitude', 4, '<p>When would this elevated hematocrit level be concerning versus normal adaptation?</p>', array['If it causes blood to be too thick, leading to clots', 'It''s never concerning', 'Only if the person feels tired', 'If HCT drops below 50%'], 'If it causes blood to be too thick, leading to clots'),
  ('Case 8: Breathlessness in COPD', 0, '<p>What is the patient''s hematocrit (HCT) value?</p>', array['42%', '58%', '48%', '52%'], '58%'),
  ('Case 8: Breathlessness in COPD', 1, '<p>Based on the patient''s age and sex, how would you classify this hematocrit level?</p>', array['Low', 'Normal', 'Borderline', 'High'], 'High'),
  ('Case 8: Breathlessness in COPD', 2, '<p>How does COPD lead to increased hematocrit levels?</p>', array['Chronic low oxygen (hypoxia) stimulates RBC production', 'Lung damage releases a hormone that makes RBCs', 'He is dehydrated from coughing', 'Smoking directly increases RBC count'], 'Chronic low oxygen (hypoxia) stimulates RBC production'),
  ('Case 8: Breathlessness in COPD', 3, '<p>What role does chronic low oxygen play in this condition?</p>', array['Triggers kidneys to release more EPO', 'Directly makes bone marrow work harder', 'Reduces plasma volume', 'Prevents RBCs from dying'], 'Triggers kidneys to release more EPO'),
  ('Case 8: Breathlessness in COPD', 4, '<p>What complications should be monitored with this elevated hematocrit level?</p>', array['Increased risk of stroke and heart attack', 'Increased risk of bleeding', 'Kidney failure', 'Severe anemia'], 'Increased risk of stroke and heart attack')
),
inserted_questions as (
  insert into public.questions (text, explanation, simulation_slug, case_study_id, published)
  select s.question_text, null::text, 'physiology/hematology/hematocrit-case-studies', cs.id, true
  from seed s
  join public.case_studies cs
    on cs.title = s.case_title
   and cs.simulation_slug = 'physiology/hematology/hematocrit-case-studies'
  where not exists (
    select 1 from public.questions existing
    where existing.case_study_id = cs.id and existing.text = s.question_text
  )
  returning id, text, case_study_id
),
inserted_options as (
  insert into public.question_options (question_id, option_text, is_correct)
  select iq.id, o.option_text, o.option_text = s.correct_option
  from inserted_questions iq
  join public.case_studies cs on cs.id = iq.case_study_id
  join seed s on s.case_title = cs.title and s.question_text = iq.text
  cross join lateral unnest(s.options) as o(option_text)
  returning id
)
insert into public.quiz_questions (quiz_id, question_id, position)
select qz.id, iq.id, s.position
from inserted_questions iq
join public.case_studies cs on cs.id = iq.case_study_id
join seed s on s.case_title = cs.title and s.question_text = iq.text
join public.quizzes qz on qz.case_study_id = cs.id
on conflict (quiz_id, question_id) do nothing;
