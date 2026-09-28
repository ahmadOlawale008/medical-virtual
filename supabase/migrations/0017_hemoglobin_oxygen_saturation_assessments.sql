-- Human Bio Media assessment for the four-part Hemoglobin Oxygen Saturation
-- simulation (The Effects of Altitude).
--
-- HBM publishes the lesson as four linked parts, each with its own activity
-- set and its own assessment:
--   Part 1 — Structure and Functions of Oxygen and Hemoglobin (14 questions)
--   Part 2 — The Oxygen-Hemoglobin Dissociation Curve (11 questions)
--   Part 3 — How Pulse Oximetry Measures Blood Oxygen Levels (7 questions)
--   Part 4 — Case Study: How Altitude Alters Hemoglobin Oxygen Saturation (11)
--
-- Like migration 0016, it is deliberately written as ONE atomic statement
-- (a WITH ... VALUES list feeding data-modifying CTEs) rather than a
-- multi-statement script with a staging table, so that it:
--   * cannot partially apply (all or nothing),
--   * needs no DDL and no staging table (no CREATE privilege, nothing left
--     behind, nothing to reference that could be missing),
--   * runs as a single query in any SQL client.
--
-- For each part it creates (or re-publishes) a "General quiz" for that part's
-- simulation slug, seeds every assessment question as a multiple-choice item
-- (the only gradable question type in this schema), stores the Human Bio Media
-- model answer as the explanation shown after submission, and wires the quiz
-- ordering (positions 0..n). Running it more than once is safe.
--
-- Select the whole file and run it as one query.

with seed(part, position, question_text, explanation_text, options, correct_option) as (
  values
  (1, 0, '<p>How do O₂ molecules enter the circulatory system from the lungs?</p>', 'Alveolar pO₂ is about 100 mmHg while blood entering the lung capillaries is about 40 mmHg, so O₂ diffuses along the pressure gradient from the alveoli into the capillaries.', array['By diffusing down their partial-pressure gradient across the respiratory membrane into the pulmonary capillaries', 'By active transport through the capillary walls against the pressure gradient', 'By binding to plasma albumin inside the alveoli before entering the blood', 'By being pumped directly from the alveoli into the arteries by the heart'], 'By diffusing down their partial-pressure gradient across the respiratory membrane into the pulmonary capillaries'),
  (1, 1, '<p>How do O₂ molecules enter tissue cells from the circulatory system?</p>', 'Blood arriving at tissue capillaries has a pO₂ of about 100 mmHg while the surrounding cells are about 40 mmHg, so O₂ diffuses into the cells and enters their mitochondria.', array['They diffuse from the systemic capillaries down the pressure gradient (about 100 mmHg in blood to about 40 mmHg in cells)', 'They are pumped into cells by sodium–potassium pumps', 'They are carried into cells by hemoglobin that enters the tissue directly', 'They enter through channels that open only during exercise'], 'They diffuse from the systemic capillaries down the pressure gradient (about 100 mmHg in blood to about 40 mmHg in cells)'),
  (1, 2, '<p>Why is oxygen essential for proper cell function?</p>', 'In aerobic respiration mitochondria use oxygen to convert the energy in nutrients into ATP, which powers the chemical reactions required for normal cell function; without it cells rely on far less efficient anaerobic respiration.', array['Mitochondria use it to transfer energy from nutrients to ATP through aerobic respiration', 'It provides the structural framework of the cell membrane', 'It neutralizes lactic acid before it can form in the cytoplasm', 'It carries genetic information from the nucleus to the ribosomes'], 'Mitochondria use it to transfer energy from nutrients to ATP through aerobic respiration'),
  (1, 3, '<p>What organelle is involved?</p>', 'Oxygen enters the mitochondria, where aerobic respiration produces ATP; water and carbon dioxide are the by-products of the reaction.', array['The mitochondrion (mitochondria)', 'The nucleus', 'The ribosome', 'The Golgi apparatus'], 'The mitochondrion (mitochondria)'),
  (1, 4, '<p>Why is only a small percentage (1% to 2%) of oxygen transported in blood plasma?</p>', 'Only about 1–2% of O₂ dissolves in plasma because the gas is nonpolar and poorly soluble in water, the main component of plasma; the remaining 98–99% is reversibly bound to hemoglobin inside red blood cells.', array['Oxygen is nonpolar and does not dissolve easily in water, the main component of plasma', 'Plasma proteins immediately convert oxygen into carbon dioxide', 'Plasma is only present in veins, where oxygen is released', 'Red blood cells absorb oxygen before it can reach the plasma'], 'Oxygen is nonpolar and does not dissolve easily in water, the main component of plasma'),
  (1, 5, '<p>What molecule transports the majority of inhaled O₂ molecules?</p>', 'Most inhaled O₂ (98–99%) travels reversibly bound to the 270–300 million hemoglobin molecules in each red blood cell; only 1–2% rides dissolved in the plasma.', array['Hemoglobin, which carries 98% to 99% of oxygen inside red blood cells', 'Albumin dissolved in the plasma', 'Fibrinogen in the plasma', 'Carbonic anhydrase on the red blood cell surface'], 'Hemoglobin, which carries 98% to 99% of oxygen inside red blood cells'),
  (1, 6, '<p>Which description matches a hemoglobin molecule and the function of its heme group?</p>', 'Hemoglobin is a highly folded protein of two alpha and two beta subunits; each subunit contains a central iron-bearing heme group that binds one oxygen molecule.', array['A folded protein of two alpha and two beta subunits, each with an iron-containing heme group that binds one O₂', 'A single globin chain with one heme group that binds four O₂ molecules', 'A lipid structure with six heme groups that releases oxygen instantly', 'Two beta subunits only, with heme groups that bind carbon dioxide instead of oxygen'], 'A folded protein of two alpha and two beta subunits, each with an iron-containing heme group that binds one O₂'),
  (1, 7, '<p>How many oxygen molecules can one hemoglobin molecule bind?</p>', 'Each of hemoglobin''s four subunits has a heme group containing one iron atom, so a fully saturated hemoglobin molecule carries four O₂ molecules.', array['1', '2', '4', '8'], '4'),
  (1, 8, '<p>What are the primary gases that make up atmospheric air, and what is the approximate percentage of oxygen?</p>', 'Atmospheric air is mostly nitrogen (~78%) with oxygen (~21%); at sea level the total atmospheric pressure is about 760 mmHg.', array['Nitrogen about 78% and oxygen about 21%', 'Oxygen about 78% and nitrogen about 21%', 'Nitrogen about 50% and oxygen about 50%', 'Oxygen about 21% and carbon dioxide about 78%'], 'Nitrogen about 78% and oxygen about 21%'),
  (1, 9, '<p>What is meant by the term partial pressure?</p>', 'In a gas mixture each gas contributes its own share of the total pressure; the partial pressure of a gas is proportional to its percentage of the mixture (e.g., 760 mmHg × 0.21 ≈ 160 mmHg for O₂ at sea level).', array['The pressure that one gas in a mixture exerts on its own, as if it alone filled the space', 'The total pressure of all the gases in the atmosphere combined', 'The pressure required to force oxygen into red blood cells', 'The pressure of water vapor inside the alveoli'], 'The pressure that one gas in a mixture exerts on its own, as if it alone filled the space'),
  (1, 10, '<p>What is the approximate total atmospheric pressure at sea level, and what is the partial pressure of oxygen (pO₂)?</p>', 'At sea level the total atmospheric pressure is about 760 mmHg; because oxygen makes up about 21% of air, its partial pressure is 760 × 0.21 ≈ 160 mmHg.', array['Total ≈ 760 mmHg and pO₂ ≈ 160 mmHg', 'Total ≈ 100 mmHg and pO₂ ≈ 40 mmHg', 'Total ≈ 760 mmHg and pO₂ ≈ 600 mmHg', 'Total ≈ 160 mmHg and pO₂ ≈ 760 mmHg'], 'Total ≈ 760 mmHg and pO₂ ≈ 160 mmHg'),
  (1, 11, '<p>Explain why the partial pressure of oxygen in the lungs’ alveoli (~100 mmHg) is lower than the atmospheric partial pressure of oxygen (~160 mmHg).</p>', 'Three factors lower alveolar pO₂: humidification of inhaled air in the respiratory tract, mixing with residual air left in the lungs from the previous exhalation, and the continuous diffusion of oxygen into the surrounding capillary blood.', array['Inhaled air is humidified, mixes with residual air left in the lungs, and oxygen continuously diffuses into capillary blood', 'The alveoli actively pump oxygen back out during exhalation', 'Nitrogen is converted into oxygen inside the respiratory tract', 'The heart removes oxygen from the alveolar air before it can be inhaled'], 'Inhaled air is humidified, mixes with residual air left in the lungs, and oxygen continuously diffuses into capillary blood'),
  (1, 12, '<p>How does PaO₂ influence oxygen binding to hemoglobin?</p>', 'PaO₂ is the pressure of dissolved oxygen in arterial plasma and is the primary factor determining binding: higher PaO₂ saturates more hemoglobin, lower PaO₂ leaves it less saturated.', array['Higher PaO₂ drives more O₂ to bind hemoglobin, while lower PaO₂ drives less binding', 'PaO₂ affects only dissolved plasma oxygen, never hemoglobin binding', 'Higher PaO₂ immediately makes hemoglobin release its oxygen', 'PaO₂ has no effect once hemoglobin has been synthesized'], 'Higher PaO₂ drives more O₂ to bind hemoglobin, while lower PaO₂ drives less binding'),
  (1, 13, '<p>What is the relationship between PaO₂ and hemoglobin oxygen saturation?</p>', 'Hemoglobin saturation increases with PaO₂ in a sigmoid pattern: it climbs slowly at first, rises steeply through the middle of the curve, and flattens near full saturation.', array['They rise together — as PaO₂ increases, hemoglobin oxygen saturation increases', 'As PaO₂ increases, hemoglobin saturation falls', 'Saturation stays at 50% regardless of PaO₂', 'The two values are unrelated to each other'], 'They rise together — as PaO₂ increases, hemoglobin oxygen saturation increases'),
  (2, 0, '<p>Use the oxyhemoglobin dissociation curve simulator to determine the arterial O₂ pressure (PaO₂) needed to load the first O₂ (25% saturation) onto hemoglobin.</p>', 'The left portion of the curve is flat because unsaturated hemoglobin is in the low-affinity tense (T) state, so a comparatively large rise in PaO₂ — roughly 18 mmHg — is needed to reach 25% saturation.', array['About 18 mmHg', 'About 40 mmHg', 'About 100 mmHg', 'About 60 mmHg'], 'About 18 mmHg'),
  (2, 1, '<p>Determine how much PaO₂ is needed to load the second O₂ (50% saturation) and third O₂ (75% saturation) onto hemoglobin.</p>', 'On the normal curve half of the hemoglobin is saturated at the P₅₀ of about 27 mmHg, and saturation reaches about 75% at the resting tissue pressure of about 40 mmHg.', array['About 27 mmHg for 50% saturation and about 40 mmHg for 75% saturation', 'About 40 mmHg for 50% saturation and about 27 mmHg for 75% saturation', 'About 18 mmHg for 50% saturation and about 100 mmHg for 75% saturation', 'About 100 mmHg for 50% saturation and about 150 mmHg for 75% saturation'], 'About 27 mmHg for 50% saturation and about 40 mmHg for 75% saturation'),
  (2, 2, '<p>Explain why less pressure is needed to load the second and third O₂ molecules than the first O₂ molecule.</p>', 'The first binding event changes hemoglobin’s conformation to the relaxed (R) state, which has a higher affinity for oxygen, so the second and third O₂ molecules bind at progressively smaller pressure increases — cooperative binding.', array['Binding the first O₂ shifts hemoglobin from the tense (T) to the relaxed (R) state, increasing its oxygen affinity — cooperative binding', 'The first O₂ molecule is physically larger than the second and third', 'Hemoglobin runs out of binding sites after three O₂ molecules', 'Plasma pressure pushes the final O₂ molecules into place'], 'Binding the first O₂ shifts hemoglobin from the tense (T) to the relaxed (R) state, increasing its oxygen affinity — cooperative binding'),
  (2, 3, '<p>How much pressure is needed to load the fourth O₂ molecule (100% saturation)?</p>', 'The right portion of the curve is the flattest: with a single binding site remaining, a comparatively large rise in PaO₂ — approaching 100 mmHg — is required to fill hemoglobin completely.', array['A large increase — hemoglobin is essentially fully saturated only near 100 mmHg', 'Only about 18 mmHg', 'Exactly the P₅₀ of 27 mmHg', 'No additional pressure beyond 40 mmHg'], 'A large increase — hemoglobin is essentially fully saturated only near 100 mmHg'),
  (2, 4, '<p>How many O₂ molecules will be unloaded from hemoglobin if the tissue cells are in a resting state and the PaO₂ is 40 mmHg?</p>', 'At a resting tissue PaO₂ of about 40 mmHg hemoglobin is roughly 75% saturated, so it has released the fourth, last-loaded oxygen molecule and retains the other three.', array['One — hemoglobin releases the fourth (last-loaded) O₂ and retains three', 'Two — hemoglobin releases the third and fourth O₂', 'Three — only the first O₂ remains bound', 'None — hemoglobin keeps all four O₂ molecules at rest'], 'One — hemoglobin releases the fourth (last-loaded) O₂ and retains three'),
  (2, 5, '<p>How many O₂ molecules will be unloaded from hemoglobin molecules if the tissue cells become active and the PaO₂ drops to ~ 18 mmHg?</p>', 'At about 18 mmHg — the steep portion of the curve — saturation falls to roughly 25%, so hemoglobin holds only its first O₂ and the second and third molecules unbind to feed the active cells.', array['Two more — the second and third O₂ molecules unbind, leaving hemoglobin about 25% saturated', 'None — active tissues make hemoglobin hold oxygen more tightly', 'One more — only the fourth molecule is released', 'All four O₂ molecules are released'], 'Two more — the second and third O₂ molecules unbind, leaving hemoglobin about 25% saturated'),
  (2, 6, '<p>How do the acids and CO₂ released from active tissue cells affect hemoglobin’s affinity for oxygen?</p>', 'Rising CO₂ and acidity (the Bohr effect) lower hemoglobin’s affinity for oxygen, making it unload oxygen more readily in metabolically active tissues.', array['They decrease hemoglobin’s affinity for oxygen', 'They increase hemoglobin’s affinity, locking oxygen in place', 'They have no effect on hemoglobin at all', 'They destroy hemoglobin molecules so oxygen is lost'], 'They decrease hemoglobin’s affinity for oxygen'),
  (2, 7, '<p>How would the increase in acids and CO₂ affect the oxyhemoglobin dissociation curve?</p>', 'A right shift means any given PaO₂ corresponds to a lower saturation — hemoglobin binds oxygen less readily, which is exactly what active tissues need.', array['It would shift the curve to the right', 'It would shift the curve to the left', 'It would flatten the curve into a straight line', 'It would remove the curve entirely'], 'It would shift the curve to the right'),
  (2, 8, '<p>How would this situation affect oxygen delivery to the tissues?</p>', 'The rightward shift from CO₂, acids, heat, and 2,3-DPG promotes oxygen unloading at the tissues, improving delivery precisely where metabolism is highest.', array['It facilitates unloading, so more oxygen is delivered to the active tissues', 'It reduces delivery by keeping oxygen bound to hemoglobin', 'It has no effect on oxygen delivery', 'It only changes oxygen loading in the lungs'], 'It facilitates unloading, so more oxygen is delivered to the active tissues'),
  (2, 9, '<p>How does a decrease in PaO₂ caused by exposure to high altitude affect the oxyhemoglobin dissociation curve?</p>', 'Less oxygen at altitude lowers PaO₂; the curve itself is unchanged, but the operating point slides down it, so hemoglobin holds less oxygen (hypoxemia).', array['It moves the operating point down along the curve, so hemoglobin saturation falls at the lower pressure', 'It shifts the curve to the left and raises saturation', 'It shifts the curve to the right and raises saturation', 'It has no effect on saturation'], 'It moves the operating point down along the curve, so hemoglobin saturation falls at the lower pressure'),
  (2, 10, '<p>How does this situation affect hemoglobin’s O₂ affinity and the delivery of O₂ to the tissue cells?</p>', 'With less oxygen loaded at the lungs, hemoglobin delivers less O₂ to the tissues; over hours the body compensates with 2,3-DPG (right shift) and, over weeks, new red blood cells (EPO).', array['Lower PaO₂ means less oxygen binds in the lungs, so saturation and oxygen delivery to tissues both fall', 'Affinity increases so tissues receive more oxygen', 'Delivery is unaffected because the heart instantly compensates', 'Oxygen delivery to tissues stops completely'], 'Lower PaO₂ means less oxygen binds in the lungs, so saturation and oxygen delivery to tissues both fall'),
  (3, 0, '<p>What is a pulse oximeter, and where is it typically placed on the body?</p>', 'The pulse oximeter is a small plastic device typically clipped to a fingertip or earlobe; its display shows peripheral oxygen saturation (SpO₂) and pulse rate.', array['A small device clipped to a fingertip or an earlobe that reads blood oxygen saturation and pulse rate', 'A blood-pressure cuff wrapped around the upper arm', 'A sensor taped to the temple that records brain waves', 'A needle sensor inserted into an artery'], 'A small device clipped to a fingertip or an earlobe that reads blood oxygen saturation and pulse rate'),
  (3, 1, '<p>What is displayed on the digital screen of a pulse oximeter?</p>', 'The integrated digital screen reports the peripheral blood oxygen saturation (SpO₂ %) together with the pulse rate (PR) in beats per minute.', array['Peripheral oxygen saturation percentage (SpO₂) and pulse rate (PR)', 'Systolic and diastolic blood pressure', 'Arterial blood gas values only', 'Hemoglobin concentration and hematocrit'], 'Peripheral oxygen saturation percentage (SpO₂) and pulse rate (PR)'),
  (3, 2, '<p>What wavelengths of light are used in pulse oximetry?</p>', 'The oximeter’s two LEDs emit red (~660 nm) and infrared (~940 nm) light because these wavelengths are absorbed differently by oxygenated and deoxygenated hemoglobin.', array['Red ~660 nm and infrared ~940 nm', 'Blue ~450 nm and green ~530 nm', 'Ultraviolet ~200 nm and infrared ~940 nm', 'Only red light at ~660 nm'], 'Red ~660 nm and infrared ~940 nm'),
  (3, 3, '<p>How does the absorption of these light wavelengths differ between oxygenated and deoxygenated hemoglobin?</p>', 'Because oxyhemoglobin and deoxyhemoglobin absorb red and infrared light to different degrees, the ratio of absorbed light reveals the fraction of hemoglobin carrying oxygen.', array['Oxyhemoglobin absorbs more infrared and less red light; deoxygenated hemoglobin absorbs more red and less infrared', 'Both forms absorb red and infrared light equally', 'Oxyhemoglobin absorbs only red light, deoxygenated only infrared', 'Deoxygenated hemoglobin absorbs no light at all'], 'Oxyhemoglobin absorbs more infrared and less red light; deoxygenated hemoglobin absorbs more red and less infrared'),
  (3, 4, '<p>What does SpO₂ represent, and how does the pulse oximeter calculate it?</p>', 'The device compares red and infrared light absorption through pulsating arteries and applies algorithms that account for the typical absorption of oxy- and deoxyhemoglobin; the result is displayed as SpO₂ %, e.g., 85% means hemoglobin carries 85% of its maximum oxygen capacity.', array['The percentage of peripheral hemoglobin carrying oxygen, calculated from the red/infrared absorption ratio using device algorithms', 'The partial pressure of oxygen dissolved in arterial plasma', 'The percentage of oxygen physically dissolved in the plasma', 'The total oxygen content of the blood in mL per deciliter'], 'The percentage of peripheral hemoglobin carrying oxygen, calculated from the red/infrared absorption ratio using device algorithms'),
  (3, 5, '<p>How does a pulse oximeter measure a patient’s pulse rate?</p>', 'Each heartbeat sends a pulse of arterial blood through the vessels, changing how much light is absorbed; the oximeter measures the frequency of these cycles and reports it as the pulse rate.', array['It detects the frequency of cyclical changes in light absorption caused by pulsating arterial blood with each heartbeat', 'It records the heart’s electrical activity like an ECG', 'It listens to heart sounds with a tiny microphone', 'It times the pulse manually at the wrist'], 'It detects the frequency of cyclical changes in light absorption caused by pulsating arterial blood with each heartbeat'),
  (3, 6, '<p>Based on your understanding of how an oximeter operates, which set of factors may cause inaccurate oximeter readings?</p>', 'The reading depends on pulsatile arterial blood flow and clean light transmission, so anything that reduces perfusion (cold, poor circulation), adds motion artifacts, or blocks or scatters light — including nail polish and skin pigmentation — can skew SpO₂.', array['Poor peripheral perfusion (cold or sluggish blood flow), patient movement, and light interference such as nail polish or ambient light', 'The patient’s height, weight, and age', 'Room temperature, humidity, and barometric pressure', 'The color of the display and the battery level'], 'Poor peripheral perfusion (cold or sluggish blood flow), patient movement, and light interference such as nail polish or ambient light'),
  (4, 0, '<p>Use the simulator to compare the approximate atmospheric pO₂ in Seattle, WA, with that in Salt Lake City, UT. What is the approximate percentage of oxygen in the atmosphere at both locations?</p>', 'Oxygen makes up about 21% of the atmosphere at every altitude — only the total barometric pressure (and therefore each gas’s partial pressure) falls as elevation increases.', array['About 21% at both locations', '21% in Seattle but only about 15% in Salt Lake City', 'About 12% at both locations', 'The percentage falls in direct proportion to altitude'], 'About 21% at both locations'),
  (4, 1, '<p>If the percentage of oxygen in the atmosphere is the same at both locations, why do the partial pressures of oxygen (pO₂) differ?</p>', 'Partial pressure depends on total atmospheric pressure: at higher elevation the barometric pressure is lower, so the same 21% of oxygen exerts a smaller partial pressure.', array['Higher altitude means lower barometric pressure, so each gas exerts a smaller partial pressure even though its percentage is unchanged', 'The percentage of oxygen actually drops as altitude rises', 'There is no nitrogen at high altitude, changing the mixture', 'Oxygen becomes heavier than nitrogen and sinks'], 'Higher altitude means lower barometric pressure, so each gas exerts a smaller partial pressure even though its percentage is unchanged'),
  (4, 2, '<p>Refer to the simulation to compare the altitude, atmospheric pO₂, and SpO₂ in Santa Fe and Aspen, CO. How do they differ?</p>', 'Aspen (~12,000 ft) sits higher than Santa Fe (~7,199 ft), so its atmospheric pO₂ is lower; arterial PaO₂ and the subject’s SpO₂ fall accordingly.', array['Aspen is higher, so its atmospheric pO₂ is lower and the subject’s SpO₂ falls compared with Santa Fe', 'Aspen has a higher atmospheric pO₂ and a higher SpO₂ than Santa Fe', 'Both locations have identical atmospheric pO₂ and SpO₂', 'Santa Fe has a lower atmospheric pO₂ because it lies further south'], 'Aspen is higher, so its atmospheric pO₂ is lower and the subject’s SpO₂ falls compared with Santa Fe'),
  (4, 3, '<p>In your explanation, also discuss how hemoglobin oxygen saturation levels influence cellular activity.</p>', 'Hemoglobin saturation determines how much O₂ is unloaded to cells: lower SpO₂ means less O₂ reaches the mitochondria, so ATP synthesis and cellular reaction rates fall.', array['Lower SpO₂ means less oxygen reaches the cells, so mitochondrial ATP synthesis and cellular activity decline', 'Lower SpO₂ speeds up ATP production in the mitochondria', 'SpO₂ affects only the lungs and never the tissues', 'Cellular activity is independent of oxygen delivery'], 'Lower SpO₂ means less oxygen reaches the cells, so mitochondrial ATP synthesis and cellular activity decline'),
  (4, 4, '<p>How may the subject’s SpO₂ be affected due to prolonged exposure to low temperatures at the summit of the Aspen ski slopes?</p>', 'Prolonged cold constricts peripheral vessels and reduces fingertip perfusion, so the subject’s SpO₂ may read lower and become less reliable — and cold also raises the body’s metabolic oxygen demand.', array['Cold constricts peripheral blood vessels, reducing fingertip blood flow, so readings may fall and become less reliable', 'Cold raises SpO₂ by increasing the oxygen percentage in the air', 'Temperature has no effect on pulse oximeter readings', 'Low temperature instantly doubles hemoglobin’s oxygen affinity'], 'Cold constricts peripheral blood vessels, reducing fingertip blood flow, so readings may fall and become less reliable'),
  (4, 5, '<p>Describe the physiological adaptations that would occur when she arrives in Aspen.</p>', 'The immediate response is faster, deeper breathing plus an increased heart rate and stroke volume to raise ventilation and cardiac output.', array['Breathing becomes faster and deeper, and heart rate and stroke volume rise to increase oxygen delivery', 'Red blood cell production doubles within the first minute', 'Ventilation slows to conserve oxygen for the brain', 'The heart rate falls to reduce the heart’s oxygen use'], 'Breathing becomes faster and deeper, and heart rate and stroke volume rise to increase oxygen delivery'),
  (4, 6, '<p>Describe the physiological adaptations that would occur if she decides to extend her stay in Aspen.</p>', 'Over hours to days, 2,3-DPG rises within 12–24 hours and shifts the curve right to promote unloading; over weeks to months, kidney erythropoietin (EPO) drives production of mature red blood cells, raising oxygen-carrying capacity.', array['2,3-DPG rises within 12–24 hours shifting the curve right, and EPO-driven erythropoiesis adds mature red blood cells over weeks to months', 'Only the size of the alveoli increases during the stay', 'Hemoglobin concentration doubles within the first hour', 'Nothing further changes after the immediate response'], '2,3-DPG rises within 12–24 hours shifting the curve right, and EPO-driven erythropoiesis adds mature red blood cells over weeks to months'),
  (4, 7, '<p>Based on the slope of the “Atmospheric pO₂ vs. Altitude” data, calculate the atmospheric pO₂ at the summit of Mt. McKinley (~20,000 feet).</p>', 'The altitude simulation shows atmospheric pO₂ falling from ~160 mmHg at sea level to about 71–73 mmHg at 20,000 ft.', array['About 71–73 mmHg', 'About 108–110 mmHg', 'About 46–48 mmHg', 'About 159–160 mmHg'], 'About 71–73 mmHg'),
  (4, 8, '<p>What is the percentage decrease in atmospheric pO₂ at the summit of Mt. McKinley compared to sea level?</p>', 'About 55%: (160 − 72) ÷ 160 ≈ 0.55, so atmospheric pO₂ at 20,000 ft is a little less than half of its sea-level value.', array['About 55%', 'About 10%', 'About 30%', 'About 5%'], 'About 55%'),
  (4, 9, '<p>Determine what might happen to her SpO₂ upon arrival at ~20,000 feet.</p>', 'At 20,000 ft the simulation reports SpO₂ of roughly 65–80% — severely reduced — with mental function impaired and physical exertion extremely difficult.', array['It falls to roughly 65–80%', 'It stays at 96–100%', 'It rises above 100%', 'It cannot be measured by pulse oximetry'], 'It falls to roughly 65–80%'),
  (4, 10, '<p>Would supplemental O₂ be immediately required for the flyover at ~20,000 feet? Why?</p>', 'Yes — above 18,000–20,000 ft hypoxemia is critical: the time of useful consciousness is limited and supplemental oxygen is required to prevent severe impairment.', array['Yes — above 18,000–20,000 ft hypoxemia is critical and supplemental oxygen is needed to prevent severe impairment', 'No — SpO₂ naturally remains near 100% at any altitude', 'No — the kidneys produce enough EPO within seconds', 'Only if the subject is anemic'], 'Yes — above 18,000–20,000 ft hypoxemia is critical and supplemental oxygen is needed to prevent severe impairment')
),
parts(part, slug) as (
  values
  (1::smallint, 'physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-1'::text),
  (2::smallint, 'physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-2'::text),
  (3::smallint, 'physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-3'::text),
  (4::smallint, 'physiology/hematology/hemoglobin-oxygen-saturation-simulation-and-altitude-part-4'::text)
),
quiz_new as (
  insert into public.quizzes (title, simulation_slug, published)
  select 'General quiz', p.slug, true
  from parts p
  where not exists (
    select 1
    from public.quizzes q
    where q.simulation_slug = p.slug
      and lower(q.title) = 'general quiz'
  )
  returning id, simulation_slug
),
quiz_pub as (
  update public.quizzes
  set published = true
  where lower(title) = 'general quiz'
    and simulation_slug in (select slug from parts)
  returning id, simulation_slug
),
quiz as (
  select id, simulation_slug from quiz_new
  union all
  select id, simulation_slug from quiz_pub
),
new_questions as (
  insert into public.questions (text, explanation, simulation_slug, published)
  select s.question_text, s.explanation_text, p.slug, true
  from seed s
  join parts p on p.part = s.part
  where not exists (
    select 1
    from public.questions q
    where q.simulation_slug = p.slug
      and q.text = s.question_text
  )
  returning id, text, simulation_slug
),
updated_questions as (
  update public.questions q
  set explanation = s.explanation_text,
      published = true
  from seed s
  join parts p on p.part = s.part
  where q.simulation_slug = p.slug
    and q.text = s.question_text
  returning q.id, q.text, q.simulation_slug
),
seeded_questions as (
  select id, text, simulation_slug from new_questions
  union all
  select q.id, q.text, q.simulation_slug
  from public.questions q
  join seed s on s.question_text = q.text
  join parts p on p.part = s.part and p.slug = q.simulation_slug
),
seeded_options as (
  insert into public.question_options (question_id, option_text, is_correct)
  select sq.id, o.option_text, o.option_text = s.correct_option
  from seeded_questions sq
  join seed s on s.question_text = sq.text
  join parts p on p.part = s.part and p.slug = sq.simulation_slug
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
  join parts p on p.part = s.part and p.slug = sq.simulation_slug
  join quiz qz on qz.simulation_slug = p.slug
  on conflict (quiz_id, question_id) do update set position = excluded.position
)
select
  (select count(*) from seed) as seed_rows,
  (select count(*) from seeded_questions) as matched_questions,
  (select count(*) from quiz) as quiz_rows;
