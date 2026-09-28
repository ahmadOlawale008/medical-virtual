-- Human Bio Media assessment for the Cardiac Cycle simulation.
--
-- HBM publishes this lesson as ONE long page: a hub-style introduction, a
-- Wiggers-diagram section, the five phases of the cycle, and an activity for
-- every phase. The site mirrors that with a single simulation page, so this
-- migration seeds every assessment against ONE slug:
--
--   slug: physiology/cardiovascular/cardiac-cycle
--     General quiz ................................ 21 questions
--       (foundations, the Wiggers diagram, and atrial systole)
--     Isovolumetric Contraction Assessment .........  6 questions
--     Ventricular Ejection Assessment ..............  6 questions
--     Isovolumetric Relaxation Assessment ..........  6 questions
--     Passive Ventricular Filling Assessment .......  6 questions
--
--   total: 5 quizzes, 45 questions
--
-- HBM attaches four phase assessments to the phase scans, and its
-- atrial-systole questions belong to the same set, so those five questions are
-- carried by the General quiz — the quiz the simulation page renders inline.
-- The four phase quizzes appear in the page's "Other quizzes" selector and are
-- opened one at a time.
--
-- The migration also retires the earlier seven-part split of this lesson: any
-- quiz or question still stored under a ".../cardiac-cycle-*" slug is deleted
-- together with its quiz memberships and the student answers that point at
-- them, and the five "[Demo seed ...]" placeholder questions that migration
-- 0008 attached to this slug are removed, so the assessments panel lists only
-- the five quizzes above.
--
-- Like migrations 0016 and 0017, it is deliberately written as ONE atomic
-- statement (a WITH ... VALUES list feeding data-modifying CTEs) rather than a
-- multi-statement script with a staging table, so that it:
--   * cannot partially apply (all or nothing),
--   * needs no DDL and no staging table (no CREATE privilege, nothing left
--     behind, nothing to reference that could be missing),
--   * runs as a single query in any SQL client.
--
-- Every assessment question is seeded as a multiple-choice item (the only
-- gradable question type in this schema), the Human Bio Media model answer is
-- stored as the explanation shown after submission, and the quiz ordering is
-- wired with positions 0..n. Running it more than once is safe: existing
-- questions keep their options, existing memberships only have their position
-- refreshed, and the purges delete nothing the second time.
--
-- Select the whole file and run it as one query.

with seed(quiz, position, question_text, explanation_text, options, correct_option) as (
  values
  ('General quiz', 0, '<p>How long does one cardiac cycle last when the heart beats 75 times per minute?</p>', 'At 75 beats per minute one cardiac cycle lasts 0.8 seconds. The duration shortens as the heart rate increases and lengthens as the heart rate decreases.', array['0.8 seconds', '0.4 seconds', '1.2 seconds', '1.6 seconds'], '0.8 seconds'),
  ('General quiz', 1, '<p>What happens to the duration of the cardiac cycle as the heart rate increases?</p>', 'The duration shortens as the heart rate increases and lengthens as the heart rate decreases; because the cycle is recurring, the end of one cycle prepares the heart for the start of the next.', array['It shortens', 'It lengthens', 'It always stays exactly 0.8 seconds', 'It stops recurring entirely'], 'It shortens'),
  ('General quiz', 2, '<p>The heart acts as two coordinated pumps working in parallel. What does the right side pump during each cycle?</p>', 'The right side receives deoxygenated blood from the body and pumps it to the lungs through the pulmonary circulation, where it picks up oxygen and releases carbon dioxide.', array['Deoxygenated blood to the lungs through the pulmonary circulation', 'Oxygen-rich blood to the whole body through the systemic circulation', 'Oxygen-rich blood directly to the brain only', 'Blood only to the coronary arteries'], 'Deoxygenated blood to the lungs through the pulmonary circulation'),
  ('General quiz', 3, '<p>Which path does the left side of the heart serve during each cardiac cycle?</p>', 'The left side receives oxygen-rich blood from the lungs and pumps it through the systemic circulation to supply all tissues of the body, from the head and upper limbs to the abdomen and lower limbs.', array['It pumps oxygen-rich blood through the systemic circulation to supply all tissues of the body', 'It pumps deoxygenated blood to the lungs through the pulmonary circulation', 'It pumps blood only into the right atrium', 'It sends blood to the pulmonary trunk without passing the aorta'], 'It pumps oxygen-rich blood through the systemic circulation to supply all tissues of the body'),
  ('General quiz', 4, '<p>About what fraction of the cardiac cycle is ventricular systole?</p>', 'During ventricular systole the ventricles pump blood out of the chambers; it accounts for about 1/3 of the cardiac cycle, while ventricular diastole is about 2/3.', array['About 1/3 of the cycle', 'About 2/3 of the cycle', 'Exactly 1/2 of the cycle', 'About 1/10 of the cycle'], 'About 1/3 of the cycle'),
  ('General quiz', 5, '<p>During which segment of the cardiac cycle do the ventricular chambers relax and fill with blood?</p>', 'During ventricular diastole the ventricular chambers relax and fill with blood; this segment is about 2/3 of the cardiac cycle.', array['Ventricular diastole', 'Ventricular systole', 'Isovolumetric contraction', 'Ventricular ejection'], 'Ventricular diastole'),
  ('General quiz', 6, '<p>Why do physiologists often select atrial systole as the starting point of the cardiac cycle?</p>', 'Because the phases are part of a cyclic process there is no set starting point; physiologists often select atrial systole because it coincides with the P wave at the beginning of the electrocardiogram. Another common choice is ventricular isovolumetric contraction because it marks the beginning of ventricular systole.', array['It coincides with the P wave at the beginning of the electrocardiogram', 'It is the longest phase of the cardiac cycle', 'It is the moment the semilunar valves open', 'It is when the ventricles are completely empty'], 'It coincides with the P wave at the beginning of the electrocardiogram'),
  ('General quiz', 7, '<p>What drives blood flow through the heart during the cardiac cycle?</p>', 'Blood flows through the heart from areas of higher pressure to areas of lower pressure. Cardiomyocyte contraction raises chamber pressure and relaxation lowers it, and the heart valves direct blood into only the proper low-pressure areas.', array['Pressure differences — blood flows from areas of higher pressure to areas of lower pressure', 'The valves actively pump blood between the chambers', 'Gravity alone moves blood through the heart', 'Nerves push blood through the low-pressure areas'], 'Pressure differences — blood flows from areas of higher pressure to areas of lower pressure'),
  ('General quiz', 8, '<p>What is a Wiggers diagram?</p>', 'The Wiggers diagram, named after its developer Carl Wiggers, is a composite of several graphs related to the cardiac cycle. Physiologists use it to interpret and comprehend the changing events associated with each part of a heartbeat.', array['A composite of several graphs related to the cardiac cycle', 'A single graph of heart rate over 24 hours', 'A diagram that only shows heart valve sounds', 'A chart of blood gas pressures in the lungs'], 'A composite of several graphs related to the cardiac cycle'),
  ('General quiz', 9, '<p>What does the x-axis of the Wiggers diagram display?</p>', 'The X-axis (horizontal axis) of the Wiggers diagram displays the sequence and durations of the main divisions and subdivisions (phases) of the cardiac cycle.', array['The sequence and durations of the main divisions and subdivisions (phases) of the cardiac cycle', 'The amplitudes of ventricular pressure only', 'The heart rate in beats per minute', 'The oxygen saturation of arterial blood'], 'The sequence and durations of the main divisions and subdivisions (phases) of the cardiac cycle'),
  ('General quiz', 10, '<p>What does the y-axis of the Wiggers diagram display?</p>', 'The Y-axis (vertical axis) displays the amplitudes of several heart events associated with each part of the cardiac cycle, including chamber pressures, chamber volumes, electrical activity, and sounds.', array['The amplitudes of chamber pressures, chamber volumes, electrical activity, and sounds', 'The sequence of cardiac phases from left to right', 'The duration of each phase in seconds', 'The names of the heart valves in order'], 'The amplitudes of chamber pressures, chamber volumes, electrical activity, and sounds'),
  ('General quiz', 11, '<p>Why are the recordings for the Wiggers diagram taken from the left side of the heart?</p>', 'The recordings are taken from the left side of the heart because the ventricle is thicker and produces more forceful contractions than the right.', array['Because the left ventricle is thicker and produces more forceful contractions than the right', 'Because the right ventricle has thicker walls', 'Because the left side has no electrical activity', 'Because sounds can only be recorded from the right atrium'], 'Because the left ventricle is thicker and produces more forceful contractions than the right'),
  ('General quiz', 12, '<p>Which trace on the Wiggers diagram represents the electrical activity of the heart?</p>', 'The Wiggers diagram plots electrical activity as the electrocardiogram trace, alongside chamber and arterial pressures, ventricular volumes, and heart sounds.', array['The electrocardiogram', 'The phonocardiogram', 'The ventricular volume curve', 'The arterial pressure curve'], 'The electrocardiogram'),
  ('General quiz', 13, '<p>Which trace on the Wiggers diagram represents the heart sounds?</p>', 'Heart sounds are shown on the phonocardiogram trace of the Wiggers diagram, plotted below the pressure, volume, and electrocardiogram traces.', array['The phonocardiogram', 'The electrocardiogram', 'The ventricular volume curve', 'The x-axis phase labels'], 'The phonocardiogram'),
  ('General quiz', 14, '<p>After whom is the Wiggers diagram named?</p>', 'The Wiggers diagram is named after its developer, Carl Wiggers.', array['Carl Wiggers', 'William Harvey', 'Andreas Vesalius', 'Willem Einthoven'], 'Carl Wiggers'),
  ('General quiz', 15, '<p>How does the ventricular volume trace behave during ventricular ejection?</p>', 'Initially the blood flows rapidly out of the ventricles but slows as the phase continues, so ventricular volume falls steeply at first and then levels off.', array['It falls rapidly at first and then more slowly as ejection continues', 'It rises rapidly at first and then falls', 'It stays constant throughout systole', 'It falls only during diastole'], 'It falls rapidly at first and then more slowly as ejection continues'),
  ('Isovolumetric Contraction Assessment', 0, '<p>During ventricular isovolumetric contraction, what best explains why the phase is described as “isovolumetric”?</p>', 'Both sets of valves are shut during this phase — the atrioventricular valves close once ventricular pressure exceeds atrial pressure, and the semilunar valves remain closed because ventricular pressure has not yet exceeded arterial pressure. With blood unable to enter or leave, contraction raises pressure while ventricular volume stays exactly the same.', array['All four valves are closed, so no blood can enter or leave the ventricles and their volume stays constant', 'Blood rushes into the ventricles exactly as fast as it leaves them', 'The semilunar valves are open, so blood is leaving the ventricles slowly', 'The atria keep refilling the ventricles while the ventricles contract'], 'All four valves are closed, so no blood can enter or leave the ventricles and their volume stays constant'),
  ('Isovolumetric Contraction Assessment', 1, '<p>Which sequence of events closes the atrioventricular valves at the start of this phase?</p>', 'Contraction of the ventricles drives ventricular pressure upward until it exceeds atrial pressure; that pressure gradient pushes the mitral and tricuspid leaflets together and shuts them, and the resulting valve closure produces the first heart sound.', array['Ventricular pressure rises above atrial pressure, forcing the mitral and tricuspid valves shut', 'Atrial pressure rises above ventricular pressure, forcing the valves shut', 'The semilunar valves slam shut and pull the atrioventricular valves with them', 'The AV node signals the valve leaflets to contract'], 'Ventricular pressure rises above atrial pressure, forcing the mitral and tricuspid valves shut'),
  ('Isovolumetric Contraction Assessment', 2, '<p>Which event marks the end of ventricular isovolumetric contraction?</p>', 'Ventricular pressure keeps climbing until it surpasses the pressure in the aorta and pulmonary trunk. The aortic and pulmonic semilunar valves are then forced open and blood begins leaving the ventricles, so the ejection phase begins.', array['Ventricular pressure exceeds arterial pressure and the semilunar valves open', 'The atrioventricular valves reopen and ventricular filling begins', 'The tricuspid valve closes for the remainder of the cycle', 'The aortic valve shuts as arterial pressure falls'], 'Ventricular pressure exceeds arterial pressure and the semilunar valves open'),
  ('Isovolumetric Contraction Assessment', 3, '<p>During this phase the ventricular pressure curve climbs steeply while the arterial curve only drifts downward. Why does arterial pressure keep falling?</p>', 'The semilunar valves are still closed, so no blood enters the arteries, yet blood keeps running off into the peripheral circulation. The falling arterial volume means falling arterial pressure, which continues until the semilunar valves open.', array['Blood keeps flowing out of the arteries to the tissues while no blood enters from the ventricles', 'The arteries constrict as soon as the ventricles begin to contract', 'Blood leaks backward through the closed semilunar valves', 'The atria absorb blood from the arteries during ventricular contraction'], 'Blood keeps flowing out of the arteries to the tissues while no blood enters from the ventricles'),
  ('Isovolumetric Contraction Assessment', 4, '<p>Which heart sound is generated during this phase, and by which structure?</p>', 'Closure of the mitral and tricuspid valves as ventricular pressure exceeds atrial pressure produces the first heart sound (S1), the loudest and longest of the heart sounds and best heard with the bell of the stethoscope at the cardiac apex.', array['First heart sound (S1), from closure of the atrioventricular valves', 'Second heart sound (S2), from closure of the semilunar valves', 'Third heart sound (S3), from rapid passive ventricular filling', 'Fourth heart sound (S4), from atrial systole'], 'First heart sound (S1), from closure of the atrioventricular valves'),
  ('Isovolumetric Contraction Assessment', 5, '<p>Which statement correctly pairs the electrical and mechanical events visible during this phase on the Wiggers diagram?</p>', 'The QRS complex, representing ventricular depolarization, immediately precedes and triggers ventricular contraction. Ventricular repolarization (the T wave) is not recorded until the ventricles begin to relax in the third phase.', array['Ventricular depolarization (QRS complex) triggers contraction of the ventricles', 'Atrial depolarization (P wave) triggers contraction of the ventricles', 'Ventricular repolarization (T wave) triggers contraction of the ventricles', 'No electrical activity accompanies this phase'], 'Ventricular depolarization (QRS complex) triggers contraction of the ventricles'),
  ('Ventricular Ejection Assessment', 0, '<p>What must happen before blood can leave the ventricles during the ejection phase?</p>', 'The ventricles must generate enough pressure to exceed the pressure already present in the aorta and pulmonary trunk. Only then are the aortic and pulmonic semilunar valves forced open and ejection begins.', array['Ventricular pressure rises above arterial pressure, forcing the semilunar valves open', 'The atrioventricular valves open so blood can pass through the atria first', 'Arterial pressure falls to zero before the valves open', 'The atria contract and inject blood directly into the arteries'], 'Ventricular pressure rises above arterial pressure, forcing the semilunar valves open'),
  ('Ventricular Ejection Assessment', 1, '<p>On the volume graphs the ventricular volume falls sharply and then levels off before the phase ends. What does that pattern show?</p>', 'Ejection is rapid at the start when the pressure gradient is largest, then slows as the gradient falls. A portion of the end-systolic volume is never expelled, which is why the ventricular volume curve flattens well above zero.', array['Blood leaves rapidly at first and then slows, and some end-systolic volume is never ejected', 'Blood leaves at a constant rate until the ventricle is completely empty', 'Blood stops leaving as soon as the atria begin to contract', 'The volume line is flat because no blood is ejected at all'], 'Blood leaves rapidly at first and then slows, and some end-systolic volume is never ejected'),
  ('Ventricular Ejection Assessment', 2, '<p>During this phase the arterial pressure curve continues to rise instead of matching ventricular pressure. What is the best interpretation?</p>', 'The ejected blood enters the closed arterial compartment and stretches its walls; arterial pressure rises with the added volume, then falls again as the ventricles relax and the semilunar valves close.', array['Blood entering from the ventricles stretches the arterial walls and raises arterial pressure', 'The arteries constrict independently of the volume of blood they receive', 'Arterial pressure is unaffected by the volume of blood entering', 'Blood flows backward into the ventricles through the open semilunar valves'], 'Blood entering from the ventricles stretches the arterial walls and raises arterial pressure'),
  ('Ventricular Ejection Assessment', 3, '<p>Toward the end of this phase the ventricles begin to relax. What happens when ventricular pressure falls below arterial pressure?</p>', 'Blood in the large arteries flows back toward the ventricles and fills the semilunar cusps, shutting the aortic and pulmonic valves. This closure produces the second heart sound (S2) and marks the start of isovolumetric relaxation.', array['Blood flows back toward the ventricles, filling the cusps and closing the semilunar valves', 'The atrioventricular valves open immediately and filling begins', 'Arterial pressure continues to rise while the ventricles relax', 'Blood passes freely from the aorta into the left ventricle'], 'Blood flows back toward the ventricles, filling the cusps and closing the semilunar valves'),
  ('Ventricular Ejection Assessment', 4, '<p>Which heart sound accompanies the final moments of ventricular ejection?</p>', 'The second heart sound (S2) is created by closure of the aortic and pulmonic semilunar valves as ventricular pressure drops below arterial pressure; it is best heard at the top of the heart.', array['Second heart sound (S2), from closure of the aortic and pulmonic valves', 'First heart sound (S1), from closure of the mitral and tricuspid valves', 'Fourth heart sound (S4), from atrial contraction', 'No heart sound is produced during ejection'], 'Second heart sound (S2), from closure of the aortic and pulmonic valves'),
  ('Ventricular Ejection Assessment', 5, '<p>Which combination of graphs correctly describes ventricular ejection?</p>', 'During ejection blood is leaving, so ventricular volume falls while ventricular pressure rises to its peak and then falls as relaxation begins; arterial pressure rises, and the T wave records ventricular repolarization.', array['Falling ventricular volume, rising ventricular pressure, rising arterial pressure, and the T wave', 'Rising ventricular volume, falling ventricular pressure, falling arterial pressure, and the P wave', 'Falling ventricular volume, falling ventricular pressure, flat arterial pressure, and the QRS complex', 'Constant ventricular volume, rising ventricular pressure, falling arterial pressure, and no wave'], 'Falling ventricular volume, rising ventricular pressure, rising arterial pressure, and the T wave'),
  ('Isovolumetric Relaxation Assessment', 0, '<p>Why is ventricular isovolumetric relaxation described as &ldquo;isovolumetric&rdquo;?</p>', 'The phase begins the moment the semilunar valves close and ends when the atrioventricular valves open. Throughout that interval all four valves are shut, so no blood can enter or leave the ventricles and their volume stays exactly the same while the muscle relaxes and pressure falls.', array['All four valves are shut, so no blood can enter or leave and ventricular volume stays constant', 'Blood enters the ventricles exactly as fast as it leaves them', 'The atrioventricular valves are open, so blood is flowing slowly into the ventricles', 'The ventricles keep ejecting blood while their pressure falls'], 'All four valves are shut, so no blood can enter or leave and ventricular volume stays constant'),
  ('Isovolumetric Relaxation Assessment', 1, '<p>Which event begins ventricular isovolumetric relaxation?</p>', 'As the ventricles relax, ventricular pressure drops below the pressure in the aorta and pulmonary trunk. Blood in those large arteries then flows back toward the ventricles, fills the semilunar cusps, and shuts the aortic and pulmonic valves — the moment isovolumetric relaxation begins.', array['Ventricular pressure falls below arterial pressure and the semilunar valves close', 'Atrial pressure falls below ventricular pressure and the atrioventricular valves close', 'The atrioventricular valves open and filling suddenly begins', 'The aortic valve opens and blood enters the aorta'], 'Ventricular pressure falls below arterial pressure and the semilunar valves close'),
  ('Isovolumetric Relaxation Assessment', 2, '<p>Which heart sound is produced at the start of this phase, and by which structures?</p>', 'Closure of the aortic and pulmonic semilunar valves produces the second heart sound (S2). It is sharper and shorter than the first sound and is best heard at the top of the heart, and it marks the boundary between ventricular systole and ventricular diastole.', array['Second heart sound (S2), from closure of the semilunar valves', 'First heart sound (S1), from closure of the atrioventricular valves', 'Third heart sound (S3), from rapid passive ventricular filling', 'Fourth heart sound (S4), from atrial contraction'], 'Second heart sound (S2), from closure of the semilunar valves'),
  ('Isovolumetric Relaxation Assessment', 3, '<p>What happens to the ventricular pressure trace during this phase, and why?</p>', 'With every valve closed no blood can flow in or out, so the relaxing myocardium simply decompresses: ventricular pressure falls steeply and steadily. The steep drop ends when ventricular pressure reaches atrial pressure and the atrioventricular valves open.', array['It falls steeply because the myocardium relaxes while no blood can enter or leave', 'It rises steeply because the ventricles are still contracting against closed valves', 'It stays flat because volume is unchanged', 'It rises briefly and then stays level until the atria contract'], 'It falls steeply because the myocardium relaxes while no blood can enter or leave'),
  ('Isovolumetric Relaxation Assessment', 4, '<p>The arterial pressure trace shows a small notch followed by a brief rise as this phase begins. What causes it?</p>', 'When the semilunar valves snap shut, the elastic walls of the aorta and pulmonary trunk rebound. That elastic recoil produces the small dicrotic notch and the brief secondary rise (the dicrotic wave) in the arterial pressure trace, after which arterial pressure continues to fall.', array['Elastic recoil of the arterial walls after the semilunar valves close', 'Blood being ejected into the arteries as the ventricles contract', 'Blood flowing back from the atria into the ventricles', 'Atrial contraction adding blood to the ventricles'], 'Elastic recoil of the arterial walls after the semilunar valves close'),
  ('Isovolumetric Relaxation Assessment', 5, '<p>Which combination of graph events identifies ventricular isovolumetric relaxation?</p>', 'During isovolumetric relaxation the ventricular volume trace is flat, ventricular pressure falls sharply, both sets of valves are closed, the second heart sound has just been recorded, and the arterial trace shows the dicrotic notch with pressure still above ventricular pressure.', array['Flat ventricular volume, sharply falling ventricular pressure, closed valves, and the second heart sound', 'Rising ventricular volume, rising ventricular pressure, and open atrioventricular valves', 'Falling ventricular volume, rising ventricular pressure, and the first heart sound', 'Flat ventricular volume, rising ventricular pressure, and the fourth heart sound'], 'Flat ventricular volume, sharply falling ventricular pressure, closed valves, and the second heart sound'),
  ('Passive Ventricular Filling Assessment', 0, '<p>Which event opens the atrioventricular valves and starts passive ventricular filling?</p>', 'Filling begins when the relaxing ventricles drop the pressure inside the chambers below the pressure in the atria. That gradient pushes the mitral and tricuspid leaflets apart, so blood flows from the atria into the ventricles without any atrial contraction.', array['Ventricular pressure falls below atrial pressure and the atrioventricular valves open', 'Atrial pressure falls below ventricular pressure and the atrioventricular valves open', 'The semilunar valves close and pull the atrioventricular valves open', 'The atria contract and force the valves open'], 'Ventricular pressure falls below atrial pressure and the atrioventricular valves open'),
  ('Passive Ventricular Filling Assessment', 1, '<p>Why is most ventricular filling described as passive?</p>', 'The ventricles are relaxing, so blood simply follows the pressure gradient from the atria into the ventricles through open valves. No muscle contraction drives this part of filling — the atrial contraction that completes the process comes only at the very end of diastole.', array['Blood flows down the pressure gradient through the open valves while the ventricles relax, without atrial contraction', 'The ventricles actively suck blood in with a contracting movement of their own', 'The atria contract throughout the phase to push blood downward', 'The semilunar valves stay open so blood can enter the ventricles'], 'Blood flows down the pressure gradient through the open valves while the ventricles relax, without atrial contraction'),
  ('Passive Ventricular Filling Assessment', 2, '<p>About how much of the blood that fills the ventricles arrives during this passive phase?</p>', 'Most filling is passive: roughly 70 to 80 percent of the blood in the ventricles enters while they relax. The final 20 to 30 percent is added later by atrial contraction, the atrial kick.', array['Most of it — roughly 70 to 80 percent', 'Almost none of it — under 10 percent', 'Exactly half of it, with the atria supplying the other half', 'None of it, because the atrioventricular valves are still shut'], 'Most of it — roughly 70 to 80 percent'),
  ('Passive Ventricular Filling Assessment', 3, '<p>Filling is rapid at the start of this phase and then slows. What best explains the slowing?</p>', 'At first the pressure difference between the atria and the relaxed ventricles is large, so blood rushes in. As the ventricles fill, that gradient shrinks, and the blood still returning from the large veins has to pass through the atria, so flow gradually slows until the atria contract.', array['The pressure gradient between the atria and ventricles shrinks as the ventricles fill', 'The atrioventricular valves begin to close again during diastole', 'The ventricles start contracting before they are full', 'The semilunar valves open and blood leaves the ventricles'], 'The pressure gradient between the atria and ventricles shrinks as the ventricles fill'),
  ('Passive Ventricular Filling Assessment', 4, '<p>Which heart sound may be heard during the rapid filling at the start of this phase?</p>', 'The third heart sound (S3) can sometimes be heard during the rapid filling that follows the opening of the atrioventricular valves. It is common in children and young adults and reflects the sudden deceleration of blood as it strikes the ventricular wall.', array['Third heart sound (S3), during rapid passive filling', 'First heart sound (S1), during closure of the atrioventricular valves', 'Second heart sound (S2), during closure of the semilunar valves', 'Fourth heart sound (S4), during atrial contraction'], 'Third heart sound (S3), during rapid passive filling'),
  ('Passive Ventricular Filling Assessment', 5, '<p>Which combination of graph events identifies passive ventricular filling?</p>', 'During passive filling blood is entering the ventricles: ventricular volume rises, ventricular pressure stays low and continues to fall toward atrial pressure, the atrioventricular valves are open, and the arterial pressure trace keeps declining because the semilunar valves are shut.', array['Rising ventricular volume, low falling ventricular pressure, open atrioventricular valves, and falling arterial pressure', 'Falling ventricular volume, rising ventricular pressure, and closed atrioventricular valves', 'Flat ventricular volume, sharply rising ventricular pressure, and open semilunar valves', 'Rising ventricular volume, rising ventricular pressure, and open semilunar valves'], 'Rising ventricular volume, low falling ventricular pressure, open atrioventricular valves, and falling arterial pressure'),
  ('General quiz', 16, '<p>What does atrial systole contribute to ventricular filling?</p>', 'Passive filling already accounts for most of the blood that enters the ventricles while they relax; atrial contraction then tops the ventricles up just before they contract, adding the final portion of filling that is often called the atrial kick.', array['The final portion of ventricular filling, often called the atrial kick', 'All of the blood that enters the ventricles during diastole', 'The blood that is ejected from the ventricles during systole', 'No blood at all, because the atrioventricular valves are shut'], 'The final portion of ventricular filling, often called the atrial kick'),
  ('General quiz', 17, '<p>Which electrical event on the Wiggers diagram immediately precedes atrial systole?</p>', 'The P wave records depolarization of the atria, and the atria contract shortly after it. That contraction raises atrial pressure and registers as a small pressure bump on the atrial trace of the diagram.', array['The P wave, which records atrial depolarization', 'The QRS complex, which records ventricular depolarization', 'The T wave, which records ventricular repolarization', 'The second heart sound, which records semilunar valve closure'], 'The P wave, which records atrial depolarization'),
  ('General quiz', 18, '<p>Why does blood flow from the atria into the ventricles during atrial systole?</p>', 'The atrioventricular valves are still open at this point because ventricular pressure is below atrial pressure. When the atria contract, atrial pressure rises further and blood follows the pressure gradient through the open mitral and tricuspid valves into the ventricles.', array['The atrioventricular valves are open and atrial contraction raises atrial pressure above ventricular pressure', 'The semilunar valves open and allow blood to flow back into the ventricles', 'The ventricles contract and pull blood out of the atria', 'The atria relax at the same moment that the ventricles contract'], 'The atrioventricular valves are open and atrial contraction raises atrial pressure above ventricular pressure'),
  ('General quiz', 19, '<p>About how much of the blood in the ventricles arrives because of atrial contraction when the heart is at rest?</p>', 'At rest roughly 70 to 80 percent of ventricular filling happens passively while the ventricles relax. Atrial contraction supplies the remaining 20 to 30 percent — the atrial kick — which completes filling just before systole begins.', array['About 20 percent, with the rest arriving during passive filling', 'About 80 percent, with only a small part arriving passively', 'About 50 percent, shared equally with passive filling', 'None of it, because the ventricles fill only while the atria are relaxed'], 'About 20 percent, with the rest arriving during passive filling'),
  ('General quiz', 20, '<p>What happens to the atrial contribution to ventricular filling as the heart rate increases?</p>', 'A faster heart shortens diastole more than systole, so there is less time for passive filling and atrial contraction supplies a larger share of the blood the ventricles receive before they contract.', array['It becomes a larger share of filling because diastole shortens', 'It disappears because atrial contraction stops at high heart rates', 'It stays at exactly the same share at every heart rate', 'It falls to zero because passive filling becomes faster instead'], 'It becomes a larger share of filling because diastole shortens')
),
quiz_titles(title) as (
  values
  ('General quiz'),
  ('Isovolumetric Contraction Assessment'),
  ('Ventricular Ejection Assessment'),
  ('Isovolumetric Relaxation Assessment'),
  ('Passive Ventricular Filling Assessment')
),
target_slug(slug) as (
  values ('physiology/cardiovascular/cardiac-cycle'::text)
),
retired_quizzes as (
  select q.id
  from public.quizzes q
  where q.simulation_slug like (select slug || '-%' from target_slug)
),
-- student_answers references question_options without an ON DELETE action, so
-- every answer that points at a doomed question has to go first. Each purge
-- below is cross joined to a one-row guard built from the previous purge, which
-- forces the deletes to run in the order they are written (data-modifying CTEs
-- are otherwise executed in an unspecified order).
purge_retired_answers as (
  delete from public.student_answers a
  where a.question_id in (
    select qq.question_id
    from public.quiz_questions qq
    where qq.quiz_id in (select id from retired_quizzes)
    union
    select q.id
    from public.questions q
    where q.simulation_slug like (select slug || '-%' from target_slug)
  )
  returning 1
),
purge_demo_answers as (
  delete from public.student_answers a
  using (select count(*) as n from purge_retired_answers) as guard
  where a.question_id in (
    select q.id
    from public.questions q
    where q.simulation_slug in (select slug from target_slug)
      and q.text like '<p>[Demo seed%'
  )
  returning 1
),
-- Memberships first: a question can be shared between quizzes, a quiz cannot.
purge_retired_memberships as (
  delete from public.quiz_questions qq
  using (select count(*) as n from purge_demo_answers) as guard
  where qq.quiz_id in (select id from retired_quizzes)
  returning 1
),
purge_retired_questions as (
  delete from public.questions q
  using (select count(*) as n from purge_retired_memberships) as guard
  where q.simulation_slug like (select slug || '-%' from target_slug)
  returning q.id
),
purge_demo_questions as (
  delete from public.questions q
  using (select count(*) as n from purge_retired_questions) as guard
  where q.simulation_slug in (select slug from target_slug)
    and q.text like '<p>[Demo seed%'
  returning q.id
),
purge_retired_settings as (
  delete from public.simulation_quiz_settings s
  using (select count(*) as n from purge_demo_questions) as guard
  where s.simulation_slug like (select slug || '-%' from target_slug)
  returning 1
),
purge_retired_quiz_rows as (
  delete from public.quizzes z
  using (select count(*) as n from purge_retired_settings) as guard
  where z.id in (select id from retired_quizzes)
  returning z.id
),
quiz_new as (
  insert into public.quizzes (title, simulation_slug, published)
  select t.title, s.slug, true
  from quiz_titles t
  cross join target_slug s
  where not exists (
    select 1
    from public.quizzes q
    where q.simulation_slug = s.slug
      and lower(q.title) = lower(t.title)
  )
  returning id, title, simulation_slug
),
quiz_pub as (
  update public.quizzes q
  set published = true
  from target_slug s, quiz_titles t
  where q.simulation_slug = s.slug
    and lower(q.title) = lower(t.title)
  returning q.id, q.title, q.simulation_slug
),
quiz as (
  select id, title, simulation_slug from quiz_new
  union all
  select id, title, simulation_slug from quiz_pub
),
new_questions as (
  insert into public.questions (text, explanation, simulation_slug, published)
  select s.question_text, s.explanation_text, sl.slug, true
  from seed s
  cross join target_slug sl
  where not exists (
    select 1
    from public.questions q
    where q.simulation_slug = sl.slug
      and q.text = s.question_text
  )
  returning id, text, simulation_slug
),
updated_questions as (
  update public.questions q
  set explanation = s.explanation_text,
      published = true
  from seed s
  cross join target_slug sl
  where q.text = s.question_text
    and q.simulation_slug = sl.slug
  returning q.id, q.text, q.simulation_slug
),
seeded_questions as (
  select id, text, simulation_slug from new_questions
  union all
  select q.id, q.text, q.simulation_slug
  from public.questions q
  join seed s on s.question_text = q.text
  join target_slug sl on sl.slug = q.simulation_slug
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
  join quiz qz on lower(qz.title) = lower(s.quiz)
  on conflict (quiz_id, question_id) do update set position = excluded.position
)
select
  (select count(*) from seed) as seed_rows,
  (select count(*) from seeded_questions) as matched_questions,
  (select count(*) from quiz) as quiz_rows,
  (select count(*) from purge_retired_quiz_rows) as retired_quizzes_deleted,
  (select count(*) from purge_demo_questions) as demo_questions_deleted;
