-- Full Human Bio Media assessment for the blood typing simulation.
--
-- Migration 0015 seeded only six questions; the Human Bio Media lab defines a
-- 21-question assessment (ABO blood group, Rh blood group, Rho-GAM, and
-- donor/recipient compatibility). This migration supersedes that partial set.
--
-- It is deliberately written as ONE atomic statement (a WITH ... VALUES list
-- feeding data-modifying CTEs) rather than a multi-statement script with a
-- staging table, so that it:
--   * cannot partially apply (all or nothing),
--   * needs no DDL and no staging table (no CREATE privilege, nothing left
--     behind, nothing to reference that could be missing),
--   * runs as a single query in any SQL client.
--
-- It removes the demo placeholders and the two superseded 0015 questions,
-- seeds all 21 questions as multiple-choice items (the only gradable question
-- type in this schema), stores the Human Bio Media model answer as the
-- explanation shown after submission, and rebuilds the General quiz ordering
-- (positions 0-20). Running it more than once is safe.
--
-- Select the whole file and run it as one query.

with seed(position, question_text, explanation_text, options, correct_option) as (
  values
  (0, '<p>What is the husband’s blood type?</p>', 'The husband’s blood type is O+. Agglutination occurs only with anti-D serum, so the ABO type is O and the Rh type is positive.', array['A+', 'B+', 'O+', 'AB+'], 'O+'),
  (1, '<p>What ABO alleles could he possibly have?</p>', 'Type O is recessive, so an O phenotype requires two O alleles (OO).', array['OO alleles', 'AO or BO alleles', 'AA or AB alleles', 'BB or OO alleles'], 'OO alleles'),
  (2, '<p>What is the wife’s blood type?</p>', 'The wife’s blood type is A−. Agglutination occurs only with anti-A serum, so the ABO type is A and the Rh type is negative.', array['A−', 'O−', 'A+', 'AB−'], 'A−'),
  (3, '<p>What ABO alleles could she possibly have?</p>', 'Because the O allele is recessive, a type A phenotype results from either AA (homozygous) or AO (heterozygous) alleles.', array['AA or AO alleles', 'OO alleles', 'AB or BO alleles', 'BB or AO alleles'], 'AA or AO alleles'),
  (4, '<p>What ABO alleles could their child inherit?</p>', 'The husband can contribute only an O allele, while the wife can contribute an A or an O allele, so the child’s genotype is either AO or OO.', array['AO or OO', 'BO or BB', 'AB or AA', 'AO or BB'], 'AO or OO'),
  (5, '<p>What is or are the child’s possible ABO blood type(s)?</p>', 'AO expresses as blood type A because the A allele is dominant over O, and OO expresses as blood type O, so the child can be type A or type O.', array['A or O', 'B or AB', 'Only A', 'A, B, AB, or O'], 'A or O'),
  (6, '<p>What possible ABO antibodies will the child start producing after its birth.</p>', 'If the child is blood type A, it will make anti-B antibodies. If the child is blood type O, it will make both anti-A and anti-B antibodies.', array['Anti-B if type A; anti-A and anti-B if type O', 'Anti-A and anti-B regardless of blood type', 'Only anti-AB antibodies', 'ABO antibodies are never produced'], 'Anti-B if type A; anti-A and anti-B if type O'),
  (7, '<p>What are the parents’ Rh types?</p>', 'The husband is Rh+ and the wife is Rh−.', array['The husband is Rh+ and the wife is Rh−', 'The husband is Rh− and the wife is Rh+', 'Both parents are Rh+', 'Both parents are Rh−'], 'The husband is Rh+ and the wife is Rh−'),
  (8, '<p>Is it likely that either parent would have anti-Rh antibodies in their blood?</p>', 'No. The husband is Rh+ and would not produce antibodies to his own blood type. The wife, who is Rh−, would not produce anti-Rh antibodies unless she is exposed (sensitized) to incompatible Rh+ blood.', array['No — neither has them; the wife would only make them after exposure to Rh+ blood', 'Yes — both parents constantly produce anti-Rh antibodies', 'Yes — only the husband produces anti-Rh antibodies', 'Yes — the wife produces them during every pregnancy'], 'No — neither has them; the wife would only make them after exposure to Rh+ blood'),
  (9, '<p>How do Rh surface antigens differ in structure from ABO surface antigens?</p>', 'Rh antigens are transmembrane proteins that coil and loop along the red-cell membrane, whereas ABO antigens are oligosaccharides (short sugar chains) linked to membrane proteins or lipids.', array['Rh antigens are transmembrane proteins; ABO antigens are oligosaccharides', 'Rh antigens are oligosaccharides; ABO antigens are transmembrane proteins', 'Both are oligosaccharides', 'Both are transmembrane proteins'], 'Rh antigens are transmembrane proteins; ABO antigens are oligosaccharides'),
  (10, '<p>Which Rh antigen is most clinically significant?</p>', 'The D antigen is the most clinically significant of the Rh antigens, which is why positive and negative blood types refer to its presence or absence.', array['A', 'B', 'D', 'H'], 'D'),
  (11, '<p>How do anti-Rh antibodies compare in structure with anti-A and anti-B antibodies?</p>', 'Anti-Rh antibodies are much smaller (IgG class, with two antigen-binding sites) than the anti-A and anti-B antibodies (IgM class, with ten binding sites).', array['Anti-Rh antibodies are IgG with two binding sites; anti-A/anti-B are IgM with ten', 'Anti-Rh antibodies are IgM with ten binding sites; anti-A/anti-B have two', 'They have identical structures', 'Anti-Rh antibodies are IgA; anti-A and anti-B are IgE'], 'Anti-Rh antibodies are IgG with two binding sites; anti-A/anti-B are IgM with ten'),
  (12, '<p>Are most people in the United States Rh+ or Rh-?</p>', 'Most people in the United States are Rh+ (about 85 percent), because the Rh+ allele is dominant over the Rh− allele.', array['Rh+, because the Rh+ allele is dominant', 'Rh−, because the Rh− allele is dominant', 'Rh+ and Rh− are equally common', 'Rh−, because the Rh+ allele is recessive'], 'Rh+, because the Rh+ allele is dominant'),
  (13, '<p>Is the child likely to be blood type Rh+ or Rh-?</p>', 'The child is likely to be Rh+ (about an 85 percent chance), because the father is Rh+ and the Rh+ allele is dominant.', array['Rh+, because the Rh+ allele is dominant', 'Rh−, because the wife is Rh−', 'Rh−, because Rh skips generations', 'Exactly 50 percent chance of either'], 'Rh+, because the Rh+ allele is dominant'),
  (14, '<p>Will the wife produce anti-Rh antibodies that are harmful to the blood of the current fetus?</p>', 'Not likely, because fetal Rh+ cells rarely cross the placenta during pregnancy, so the wife is unlikely to be sensitized before this birth.', array['Not likely — fetal Rh+ cells rarely cross the placenta during pregnancy', 'Yes — Rh antibodies cross the placenta immediately after conception', 'Yes — every Rh− mother attacks her Rh+ fetus', 'Only if the fetus has blood type A'], 'Not likely — fetal Rh+ cells rarely cross the placenta during pregnancy'),
  (15, '<p>What is RhoGAM?</p>', 'RhoGAM (Rh₀(D) immune globulin) is an injection of anti-D antibodies given to Rh− mothers to destroy any fetal Rh+ red blood cells before sensitization occurs.', array['An anti-D immunoglobulin injection', 'An ABO antigen', 'A red-cell stimulant', 'A platelet concentrate'], 'An anti-D immunoglobulin injection'),
  (16, '<p>When would Rho-GAM be given to the wife?</p>', 'RhoGAM is typically given during weeks 26–28 of pregnancy and again within 72 hours following birth, whenever the baby is Rh+.', array['During weeks 26–28 of pregnancy and within 72 hours after birth', 'Only after a second pregnancy', 'At the exact moment of conception', 'Only if the baby has blood type O'], 'During weeks 26–28 of pregnancy and within 72 hours after birth'),
  (17, '<p>How would Rho-GAM affect the wife’s immune system?</p>', 'The wife may become exposed to the baby’s Rh+ cells during or immediately after birth. The injection eliminates any Rh+ cells before her immune system can recognize them, so she does not produce her own anti-Rh antibodies.', array['It clears the baby’s Rh+ cells before her immune system makes anti-Rh antibodies', 'It makes her permanently Rh-positive', 'It suppresses all antibody production', 'It adds anti-A and anti-B antibodies to her blood'], 'It clears the baby’s Rh+ cells before her immune system makes anti-Rh antibodies'),
  (18, '<p>How does Rho-GAM help prevent problems with the wife’s future pregnancies?</p>', 'Without RhoGAM the mother’s immune system may produce anti-Rh IgG antibodies, which can cross the placenta in a later pregnancy and destroy a future Rh+ fetus’s red blood cells (hemolytic disease of the newborn). RhoGAM prevents those antibodies from ever forming.', array['It prevents anti-Rh IgG antibodies that could cross the placenta and harm a future Rh+ fetus', 'It makes the next baby Rh−', 'It strengthens the placenta', 'It adds anti-A antibodies to her blood'], 'It prevents anti-Rh IgG antibodies that could cross the placenta and harm a future Rh+ fetus'),
  (19, '<p>To which blood type(s) can the husband safely donate blood?</p>', 'He can donate to A+, B+, O+, and AB+ recipients — every Rh+ blood type — because their plasma contains no anti-A, anti-B, or anti-Rh antibodies that would attack his cells.', array['A+, B+, O+, and AB+', 'O− only', 'AB− only', 'A− and B−'], 'A+, B+, O+, and AB+'),
  (20, '<p>Explain your previous answer.</p>', 'The husband is type O, so his red blood cells lack A and B antigens. Anti-A and anti-B antibodies in type-A or type-B recipients encounter no matching antigens, so agglutination does not occur — this is why type O is called the universal donor type. Rh+ recipients (A+, B+, O+, AB+) make no anti-Rh antibodies, but Rh− recipients with prior exposure could still react.', array['His type-O red cells lack A and B antigens, so recipient anti-A/anti-B antibodies find nothing to attack, and Rh+ recipients make no anti-Rh antibodies', 'Type-O red cells carry A and B antigens that stimulate every recipient', 'All recipients receive the same plasma antibodies as the donor', 'Only AB− recipients can accept his blood'], 'His type-O red cells lack A and B antigens, so recipient anti-A/anti-B antibodies find nothing to attack, and Rh+ recipients make no anti-Rh antibodies')
),
quiz_new as (
  insert into public.quizzes (title, simulation_slug, published)
  select 'General quiz', 'physiology/hematology/blood-typing', true
  where not exists (
    select 1
    from public.quizzes q
    where q.simulation_slug = 'physiology/hematology/blood-typing'
      and lower(q.title) = 'general quiz'
  )
  returning id
),
quiz_pub as (
  update public.quizzes
  set published = true
  where simulation_slug = 'physiology/hematology/blood-typing'
    and lower(title) = 'general quiz'
  returning id
),
quiz as (
  select id from quiz_new
  union all
  select id from quiz_pub
),
demo_questions as (
  delete from public.questions
  where simulation_slug = 'physiology/hematology/blood-typing'
    and (
      text like '<p>[Demo seed%'
      or text = '<p>What ABO blood types could their child inherit?</p>'
      or text = '<p>To which recipients can the husband’s RBCs be donated safely?</p>'
    )
),
new_questions as (
  insert into public.questions (text, explanation, simulation_slug, published)
  select s.question_text, s.explanation_text, 'physiology/hematology/blood-typing', true
  from seed s
  where not exists (
    select 1
    from public.questions q
    where q.simulation_slug = 'physiology/hematology/blood-typing'
      and q.text = s.question_text
  )
  returning id, text
),
updated_questions as (
  update public.questions q
  set explanation = s.explanation_text,
      published = true
  from seed s
  where q.simulation_slug = 'physiology/hematology/blood-typing'
    and q.text = s.question_text
  returning q.id, q.text
),
seeded_questions as (
  select id, text from new_questions
  union all
  select q.id, q.text
  from public.questions q
  join seed s on s.question_text = q.text
  where q.simulation_slug = 'physiology/hematology/blood-typing'
),
seeded_options as (
  insert into public.question_options (question_id, option_text, is_correct)
  select sq.id, o.option_text, o.option_text = s.correct_option
  from seeded_questions sq
  join seed s on s.question_text = sq.text
  cross join lateral unnest(s.options) as o(option_text)
  where not exists (
    select 1
    from public.question_options existing
    where existing.question_id = sq.id
  )
),
seeded_memberships as (
  insert into public.quiz_questions (quiz_id, question_id, position)
  select qz.id, sq.id, s.position
  from seeded_questions sq
  join seed s on s.question_text = sq.text
  cross join quiz qz
  on conflict (quiz_id, question_id) do update set position = excluded.position
)
select
  (select count(*) from seed) as seed_rows,
  (select count(*) from seeded_questions) as matched_questions;
