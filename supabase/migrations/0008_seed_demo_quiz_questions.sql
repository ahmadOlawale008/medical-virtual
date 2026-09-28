-- Demo content for testing the quiz workflow. Every row is clearly marked so it
-- can be removed later with: delete from public.questions where text like '<p>[Demo seed]%'.
with seed(simulation_slug, text, explanation, correct_answer) as (
  values
    ('physiology/hematology/wbc-count', '<p>[Demo seed 01] True or false: WBC count is commonly reported as cells per microlitre of blood.</p>', 'This is a common reporting unit for a total leukocyte count.', true),
    ('physiology/hematology/wbc-count', '<p>[Demo seed 02] True or false: Red blood cells are the main cells counted in a total WBC count.</p>', 'A WBC count measures leukocytes, not erythrocytes.', false),
    ('physiology/hematology/wbc-count', '<p>[Demo seed 03] True or false: A haemocytometer can be used for manual cell counting.</p>', 'A haemocytometer provides a ruled chamber for manual counts.', true),
    ('physiology/hematology/wbc-count', '<p>[Demo seed 04] True or false: The differential leukocyte count describes the relative types of WBCs.</p>', 'The differential count describes the proportions of leukocyte types.', true),
    ('physiology/hematology/wbc-count', '<p>[Demo seed 05] True or false: WBC results should be interpreted without considering the clinical context.</p>', 'Laboratory results should always be interpreted with clinical context.', false),
    ('physiology/hematology/blood-typing', '<p>[Demo seed 06] True or false: Agglutination with anti-A serum indicates A antigen is present.</p>', 'Visible agglutination indicates the corresponding antigen is present.', true),
    ('physiology/hematology/blood-typing', '<p>[Demo seed 07] True or false: The ABO system is based on antigens found on red cell membranes.</p>', 'ABO blood groups are determined by red-cell surface antigens.', true),
    ('physiology/hematology/blood-typing', '<p>[Demo seed 08] True or false: Type O red cells carry both A and B antigens.</p>', 'Type O red cells lack A and B antigens.', false),
    ('physiology/hematology/blood-typing', '<p>[Demo seed 09] True or false: A control is useful for checking whether a reaction is specific.</p>', 'Controls help identify nonspecific agglutination or test error.', true),
    ('physiology/hematology/blood-typing', '<p>[Demo seed 10] True or false: Crossmatching is unnecessary before a transfusion.</p>', 'Compatibility testing is an important transfusion safety step.', false),
    ('physiology/amphibian-physiology/simple-muscle-twitch', '<p>[Demo seed 11] True or false: A simple muscle twitch has latent, contraction, and relaxation periods.</p>', 'These are the classical phases of a twitch response.', true),
    ('physiology/amphibian-physiology/simple-muscle-twitch', '<p>[Demo seed 12] True or false: The latent period occurs after stimulation and before visible contraction.</p>', 'The latent period is the delay before the mechanical response begins.', true),
    ('physiology/amphibian-physiology/simple-muscle-twitch', '<p>[Demo seed 13] True or false: A single stimulus normally produces a sustained tetanic contraction.</p>', 'A single stimulus produces a twitch, not tetanus.', false),
    ('physiology/amphibian-physiology/simple-muscle-twitch', '<p>[Demo seed 14] True or false: A kymograph can record the mechanical response of muscle.</p>', 'The writing lever transfers movement to the recording drum.', true),
    ('physiology/amphibian-physiology/simple-muscle-twitch', '<p>[Demo seed 15] True or false: Increasing stimulus frequency can cause summation.</p>', 'A second stimulus arriving before full relaxation can add tension.', true),
    ('physiology/amphibian-physiology/effect-of-temperature', '<p>[Demo seed 16] True or false: Temperature can alter the speed of a muscle contraction.</p>', 'Temperature affects physiological reaction and contraction kinetics.', true),
    ('physiology/amphibian-physiology/effect-of-temperature', '<p>[Demo seed 17] True or false: The Ringer solution is used to maintain the preparation.</p>', 'Ringer solution supplies an appropriate bathing environment.', true),
    ('physiology/amphibian-physiology/effect-of-temperature', '<p>[Demo seed 18] True or false: Temperature has no effect on the duration of a twitch.</p>', 'Temperature can affect both contraction and relaxation duration.', false),
    ('physiology/amphibian-physiology/effect-of-temperature', '<p>[Demo seed 19] True or false: A thermometer helps verify the solution temperature.</p>', 'The measured solution temperature is the experimental variable.', true),
    ('physiology/amphibian-physiology/effect-of-temperature', '<p>[Demo seed 20] True or false: Experimental temperature should be recorded with the response.</p>', 'Recording the condition makes results comparable and reproducible.', true),
    ('physiology/amphibian-physiology/genesis-of-tetanus', '<p>[Demo seed 21] True or false: Tetanus results when stimuli arrive before the muscle fully relaxes.</p>', 'Repeated stimuli can maintain force when relaxation is incomplete.', true),
    ('physiology/amphibian-physiology/genesis-of-tetanus', '<p>[Demo seed 22] True or false: Treppe describes a progressive staircase increase in separate contractions.</p>', 'Treppe is a staircase pattern at low repeated stimulation rates.', true),
    ('physiology/amphibian-physiology/genesis-of-tetanus', '<p>[Demo seed 23] True or false: Complete tetanus has complete relaxation between every stimulus.</p>', 'Complete tetanus has little or no visible relaxation between responses.', false),
    ('physiology/amphibian-physiology/genesis-of-tetanus', '<p>[Demo seed 24] True or false: The stimulation frequency influences the type of contraction.</p>', 'Frequency determines whether responses remain separate or fuse.', true),
    ('physiology/amphibian-physiology/genesis-of-tetanus', '<p>[Demo seed 25] True or false: The kymograph trace can show fused contractions.</p>', 'A recording trace makes the progression toward tetanus visible.', true),
    ('physiology/amphibian-physiology/effect-of-load', '<p>[Demo seed 26] True or false: Load is commonly expressed in grams in this simulation.</p>', 'The adjustable load is displayed in grams.', true),
    ('physiology/amphibian-physiology/effect-of-load', '<p>[Demo seed 27] True or false: Increasing load can change the amount of muscle shortening.</p>', 'After-loading changes the mechanical work required of the muscle.', true),
    ('physiology/amphibian-physiology/effect-of-load', '<p>[Demo seed 28] True or false: The writing lever transfers shortening to the drum.</p>', 'Lever movement is recorded as the muscle changes length.', true),
    ('physiology/amphibian-physiology/effect-of-load', '<p>[Demo seed 29] True or false: Free-loaded and after-loaded conditions are identical.</p>', 'They differ in when the load is applied relative to contraction.', false),
    ('physiology/amphibian-physiology/effect-of-load', '<p>[Demo seed 30] True or false: A load-response graph can compare multiple loads.</p>', 'Each recorded load can be retained for comparison.', true),
    ('physiology/amphibian-physiology/normal-cardiogram', '<p>[Demo seed 31] True or false: The Starling heart lever can record ventricular movement.</p>', 'The lever converts heart movement into a drum trace.', true),
    ('physiology/amphibian-physiology/normal-cardiogram', '<p>[Demo seed 32] True or false: The sinus venosus is part of the frog heart preparation.</p>', 'The sinus venosus is a posterior chamber of the frog heart.', true),
    ('physiology/amphibian-physiology/normal-cardiogram', '<p>[Demo seed 33] True or false: Ringer solution temperature can affect heart rate.</p>', 'Temperature is an important modifier of amphibian cardiac activity.', true),
    ('physiology/amphibian-physiology/normal-cardiogram', '<p>[Demo seed 34] True or false: A cardiogram records only the electrical activity of the heart.</p>', 'This preparation records mechanical cardiac movement.', false),
    ('physiology/amphibian-physiology/normal-cardiogram', '<p>[Demo seed 35] True or false: Drum speed changes the horizontal time scale of a recording.</p>', 'Drum speed changes how quickly the trace is written across the drum.', true),
    ('physiology/cardiovascular/cardiac-cycle', '<p>[Demo seed 36] True or false: Ventricular systole is the contraction phase of the ventricle.</p>', 'Systole refers to contraction and ejection.', true),
    ('physiology/cardiovascular/cardiac-cycle', '<p>[Demo seed 37] True or false: Diastole is the period of ventricular relaxation and filling.</p>', 'Diastole permits relaxation and filling.', true),
    ('physiology/cardiovascular/cardiac-cycle', '<p>[Demo seed 38] True or false: The cardiac cycle has no relationship to valve movement.</p>', 'Valve opening and closure are coordinated with pressure changes.', false),
    ('physiology/cardiovascular/cardiac-cycle', '<p>[Demo seed 39] True or false: A cardiac cycle includes both contraction and relaxation.</p>', 'Both phases are required for a complete cycle.', true),
    ('physiology/cardiovascular/cardiac-cycle', '<p>[Demo seed 40] True or false: A cycle trace can be used to compare timing between cardiac phases.</p>', 'A time-based trace shows the sequence and duration of phases.', true)
), inserted as (
  insert into public.questions (text, explanation, simulation_slug, published, availability_type)
  select text, explanation, simulation_slug, true, 'all_time' from seed
  returning id, text, simulation_slug
)
insert into public.question_options (question_id, option_text, is_correct)
select inserted.id, option_text, is_correct
from inserted
join seed on seed.text = inserted.text
cross join lateral (values ('True', seed.correct_answer), ('False', not seed.correct_answer)) options(option_text, is_correct);

-- Ensure each seeded simulation has a quiz and attach its seeded questions.
insert into public.quizzes (title, simulation_slug, published)
select 'General quiz', simulation_slug, true
from (select distinct simulation_slug from public.questions where text like '<p>[Demo seed%') seeded
where not exists (
  select 1 from public.quizzes q where q.title = 'General quiz' and q.simulation_slug = seeded.simulation_slug
);

insert into public.quiz_questions (quiz_id, question_id, position)
select qz.id, q.id, row_number() over (partition by qz.id order by q.created_at) - 1
from public.quizzes qz
join public.questions q on q.simulation_slug = qz.simulation_slug
where q.text like '<p>[Demo seed%'
  and qz.title = 'General quiz'
on conflict (quiz_id, question_id) do nothing;
