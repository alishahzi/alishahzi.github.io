// ─────────────────────────────────────────────────────────────────────────────
// CONTENT DATA — Shahzad Ali Portfolio
// Single source of truth. Edit this file to update any section of the site.
// ─────────────────────────────────────────────────────────────────────────────

export const personal = {
  name: 'Shahzad Ali',
  shortName: 'Shahzad Ali',
  initials: 'SA',
  title: 'PhD Researcher — Graph Learning and AI Methods for Neurodegenerative Disease Modelling',
  subtitle: 'Alma Mater Studiorum — Università di Bologna · IRCCS San Martino · LISCOMP Lab',
  tagline: 'Graph Learning and AI Methods for Neurodegenerative Disease Modelling',
  location: 'Genova, Italy',
  office: 'LISCOMP, IRCCS San Martino Polyclinic Hospital, Genova, Italy',
  email: 'shahzad.ali6@unibo.it',
  emailPersonal: 'shahzadali039@gmail.com',
  phone: '+39 348 2657723',
  // Profiles
  linkedin: 'https://linkedin.com/in/alishahzi',
  github: 'https://github.com/alishahzi',
  scholar: 'https://scholar.google.com/citations?user=n3XO81UAAAAJ&hl=en',
  orcid: 'https://orcid.org/0000-0002-0608-9515',
  loop: 'https://loop.frontiersin.org/people/3051308/overview',
  researchgate: 'https://www.researchgate.net/profile/Shahzad-Ali-56',
  scopus: 'https://www.scopus.com/authid/detail.uri?authorId=57202066536',
  publons: 'https://www.webofscience.com/wos/author/record/ODJ-8978-2025',
  twitter: 'https://x.com/shahzadali039',
  website: 'https://sites.google.com/view/alishahzad/',
  cvUrl: '/cv.html',
  image: '/profile.png',
  heroBlurb: `PhD candidate at Università di Bologna and IRCCS San Martino working at the intersection of machine learning, graph neural networks, and multimodal neuroimaging. My research focuses on building AI methods that model brain network changes in Alzheimer's disease and predict cognitive decline.`,
  summary: `I am a PhD candidate in Data Science and Computation at [Alma Mater Studiorum – Università di Bologna](https://www.unibo.it/en), Italy. I began my doctoral studies in November 2022, with a PhD project focused on machine learning methods in digital health.
My doctoral research is conducted within the Life Science Computational ([LISCOMP](https://mida.unige.it/liscomp)) Laboratory, a multidisciplinary research environment formed through the collaboration between the [MIDA](https://mida.unige.it/) (Methods for Image and Data Analysis) group and the [IRCCS San Martino Hospital](https://www.ospedalesanmartino.it/it/), Genova. Since September 2023, I am based at IRCCS San Martino Hospital and work under the supervision of Ing. Nicola Rosso and Dr. Sara Garbarino.
From July 2025 to January 2026, I was a visiting researcher at the [LILI Lab](https://lililab-sussex.github.io/), [University of Sussex](https://www.sussex.ac.uk/), UK. During this period, my research focused on artificial intelligence and graph learning methods for neurodegenerative diseases, leveraging structured clinical and healthcare data to model disease mechanisms and disease progression. Prior to starting my PhD, I served as a lecturer in computer science at the [University of Education](https://www.ue.edu.pk/index.php), Lahore, Pakistan, where I was involved in teaching and academic activities.
My research focuses on graph learning and AI methods for neurodegenerative disease modelling, with an emphasis on Graph Neural Networks (GNNs) and multimodal data integration for healthcare and clinical applications.`,
};

export const stats = [
  { value: '9',   label: 'Journal Articles',          sublabel: 'Frontiers · PLOS · JAHA · Elsevier · Springer · CMC' },
  { value: '5',   label: 'Conference Papers',         sublabel: 'IEEE · Springer · SciTePress' },
  { value: '13+', label: 'Professional Certifications', sublabel: 'Coursera · IBM · Microsoft' },
  { value: '7+',  label: 'Years Research & Teaching',  sublabel: 'Italy · UK · Pakistan' },
];

export const researchFocus = [
  {
    id: 'gnn-neurodegeneration',
    title: 'Graph Neural Networks for Neurodegeneration',
    description:
      'Designing GNN architectures over MRI-derived structural and functional connectomes to model Alzheimer\'s disease progression and predict cognitive decline.',
    tags: ['GNN', 'Connectomes', 'Alzheimer\'s', 'Cognitive Decline'],
    color: 'cyan',
    icon: 'brain',
  },
  {
    id: 'multimodal-fusion',
    title: 'Multimodal Neuroimaging Data Integration',
    description:
      'Integrating structural MRI, diffusion MRI, neurotransmitter maps, and CSF biomarkers into unified models for diagnosis, staging, and disease-progression prediction.',
    tags: ['MRI', 'DTI', 'Biomarkers', 'Multimodal'],
    color: 'indigo',
    icon: 'zap',
  },
  {
    id: 'interpretable-ai',
    title: 'Interpretable & Explainable AI for Clinical Risk',
    description:
      'Building transparent ML frameworks for clinical decision support — including cardiovascular risk prediction — that pair strong performance with clinician-friendly explanations.',
    tags: ['Interpretable ML', 'SHAP', 'GradCAM', 'Clinical Decision Support'],
    color: 'emerald',
    icon: 'network',
  },
  {
    id: 'neuroimaging-pipelines',
    title: 'Neuroimaging Preprocessing & Analysis Pipelines',
    description:
      'End-to-end pipelines on MRI / DTI data using FreeSurfer, MRtrix3, FSL, SPM, Clinica, and Nilearn — from raw DICOM to harmonised features ready for ML models.',
    tags: ['FreeSurfer', 'MRtrix3', 'FSL', 'SPM', 'Clinica', 'Nilearn'],
    color: 'amber',
    icon: 'sun',
  },
  {
    id: 'disease-progression',
    title: 'Disease Mechanism & Progression Modelling',
    description:
      'Structured clinical and healthcare data combined with graph learning to model disease mechanisms and longitudinal progression in neurodegenerative disorders.',
    tags: ['Disease Progression', 'Longitudinal Modelling', 'Clinical Data', 'Healthcare AI'],
    color: 'violet',
    icon: 'grid',
  },
  {
    id: 'predictive-modelling',
    title: 'Predictive Modelling Across Domains',
    description:
      'Classical ML, ensemble methods, and hybrid kernels applied to clinical screening (autism, dental), socioeconomic crime prediction, wind power forecasting, and phishing detection.',
    tags: ['XGBoost', 'SVM', 'Ensemble', 'Forecasting'],
    color: 'pink',
    icon: 'share2',
  },
  {
    id: 'mentoring-teaching',
    title: 'Teaching, Mentoring & Outreach',
    description:
      'Delivering undergraduate courses in Artificial Intelligence, Data Mining, and Machine Learning; supervising final-year projects; and speaking at international schools and seminars.',
    tags: ['Teaching', 'Data Mining', 'AI Curriculum', 'FYP Supervision'],
    color: 'teal',
    icon: 'cpu',
  },
];

export const experience = [
  {
    id: 'irccs-phd',
    role: 'PhD Researcher',
    org: 'IRCCS Ospedale Policlinico San Martino',
    orgUrl: 'https://www.ospedalesanmartino.it/it/',
    department: '[LISCOMP Laboratory](https://mida.unige.it/liscomp) — supervised by Ing. Nicola Rosso and Dr. Sara Garbarino',
    location: 'Genova, Italy',
    period: 'Sep 2023 — Present',
    type: 'Clinical Research',
    current: true,
    highlights: [
      'Applied Machine Learning, Deep Learning, and Graph Neural Networks for disease diagnosis using neuroimaging data, with a particular focus on multimodal data',
      'Developed AI models to enhance diagnostic accuracy for neurological disorders, including Alzheimer\'s disease',
      'Analysed large-scale neuroimaging datasets to identify imaging biomarkers and disease patterns',
      'Collaborated with medical professionals and researchers to translate data-driven insights into clinical practice',
      'Published peer-reviewed research in top-tier journals and presented at international conferences',
    ],
    tags: ['GNN', 'Alzheimer\'s', 'Multimodal MRI', 'Clinical AI', 'LISCOMP'],
  },
  {
    id: 'sussex-visiting',
    role: 'Visiting Researcher',
    org: 'LILI Lab, University of Sussex',
    orgUrl: 'https://lililab-sussex.github.io/',
    department: '[Lifespan Lab (LILI)](https://lililab-sussex.github.io/) at the [University of Sussex](https://www.sussex.ac.uk/) — graph learning for neurodegenerative diseases',
    location: 'Brighton, United Kingdom',
    period: 'Jul 2025 — Jan 2026',
    type: 'Visiting Research',
    current: false,
    highlights: [
      'Visiting researcher at the LILI Lab (Lifespan Lab), University of Sussex',
      'Research on artificial intelligence and graph learning methods for neurodegenerative diseases',
      'Leveraged structured clinical and healthcare data to model disease mechanisms and progression',
      'Strengthened international collaboration between the LISCOMP / MIDA groups and UK research community',
    ],
    tags: ['Visiting Research', 'Graph Learning', 'Neurodegeneration', 'UK Collaboration'],
  },
  {
    id: 'ue-lecturer',
    role: 'Lecturer — Computer Science',
    org: 'University of Education, Lahore',
    orgUrl: 'https://www.ue.edu.pk/index.php',
    department: 'Department of Information Sciences',
    location: 'Lahore, Pakistan',
    period: 'Mar 2019 — Present',
    type: 'Academic Teaching',
    current: true,
    highlights: [
      'Teaching undergraduate-level courses in Data Mining, Artificial Intelligence, and Introduction to Machine Learning',
      'Supervising final-year undergraduate projects across AI, data analytics, and software systems',
      'Attending and speaking at conferences and seminars, representing the department at national and international venues',
    ],
    tags: ['Teaching', 'Data Mining', 'AI', 'FYP Supervision'],
  },
  {
    id: 'uet-gra',
    role: 'Graduate Research Assistant',
    org: 'University of Engineering and Technology, Lahore',
    orgUrl: 'https://www.uet.edu.pk/home/',
    department: 'Department of Computer Science & Engineering',
    location: 'Lahore, Pakistan',
    period: 'Oct 2016 — May 2018',
    type: 'Academic Research',
    current: false,
    highlights: [
      'Taught and designed the laboratory subject of Artificial Intelligence (Fall 2016, Fall 2017)',
      'Assisted faculty members in creating and marking quizzes and assignments for undergraduate students',
      'Supervised final-year and class projects alongside coursework for the MSc degree',
    ],
    tags: ['AI Lab', 'Research Assistant', 'Teaching Assistant', 'MSc Research'],
  },
];

export const education = [
  {
    id: 'phd',
    degree: 'PhD in Data Science and Computation',
    specialization: 'Machine Learning Methods in Digital Health',
    institution: 'Alma Mater Studiorum — Università di Bologna',
    institutionUrl: 'https://www.unibo.it/en',
    location: 'Bologna, Italy',
    period: 'Nov 2022 — Present',
    department: 'PhD Programme in Data Science and Computation',
    thesis: 'Graph Learning and AI Methods for Neurodegenerative Disease Modelling',
    scholarship: 'PhD Scholarship — Alma Mater Studiorum Università di Bologna',
    highlights: [
      'Doctoral research conducted within the LISCOMP Laboratory (MIDA group × IRCCS San Martino Hospital)',
      'Focus: Graph Neural Networks, multimodal neuroimaging, Alzheimer\'s disease',
      'Visiting researcher at LILI Lab, University of Sussex, UK (Jul 2025 – Jan 2026)',
    ],
  },
  {
    id: 'msc',
    degree: 'Master of Science in Computer Science',
    specialization: 'Computer Science · Machine Learning',
    institution: 'University of Engineering and Technology, Lahore',
    institutionUrl: 'https://www.uet.edu.pk/home/',
    location: 'Lahore, Pakistan',
    period: 'Jan 2016 — Jul 2018',
    department: 'Department of Computer Science & Engineering',
    thesis: 'Artificial Neural Network Model for Rainfall-Runoff Prediction for Jhelum River Basin Upstream of the Mangla Dam, Pakistan',
    scholarship: 'Punjab Educational Endowment Fund (PEEF) — Talent-Based Scholarship',
    gpa: '3.75 / 4.00',
    highlights: [
      'PEEF Talent-Based Scholarship, Government of Punjab',
      'Focus: neural networks, hydrological forecasting, data-driven modelling',
      'Published research in Springer\'s Modeling Earth Systems and Environment',
    ],
  },
  {
    id: 'bsc',
    degree: 'Bachelor of Science in Telecommunication and Networking',
    specialization: 'Computer Science · Telecommunication & Networking',
    institution: 'COMSATS University Islamabad, Sahiwal Campus',
    institutionUrl: 'https://sahiwal.comsats.edu.pk/',
    location: 'Sahiwal, Pakistan',
    period: 'Aug 2011 — Jun 2015',
    department: '',
    thesis: 'Visible Light-Based Communication System for High Data Rate Real-Time Applications',
    scholarship: 'ICT R&D Scholarship — Federal Government of Pakistan',
    highlights: [
      'Merit-based ICT R&D Scholarship throughout the degree',
      'Final-Year Project funded by the ICT R&D Programme',
      'Focus: visible light communication, networking, embedded systems',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PUBLICATIONS
// Only two categories: Journal Articles and Conference Papers.
// Every entry carries a DOI (rendered as a clickable link in the UI).
// ─────────────────────────────────────────────────────────────────────────────
export const publications = {
  journalsPublished: [
    {
      id: 'J9',
      authors: 'Ali U, Sufyan M, Ali S, Ahmad M, Rehman Khan S, Raza N, Sultana J, Habib MA',
      title: 'A robust multi-location evaluation of a machine learning framework for wind power forecasting.',
      venue: 'PLOS ONE',
      vol: '21(4): e0344971',
      year: 2026,
      doi: '10.1371/journal.pone.0344971',
    },
    {
      id: 'J8',
      authors: 'Argenti L, Massa F, Losa M, Lombardo L, Lorenzini L, Peira E, Sofia L, Raffa S, Sambuceti G, Garbarino S, Kreshpa W, Bozzo G, Pelagotti V, Pulze M, Gualco L, Hamedani M, Cirone A, Francia S, Brugnolo A, Girtler N, Caneva S, Roccatagliata L, Mattioli P, Morbelli S, Ali S, Piana M, Serrati C, Uccelli A, Chincarini A, Arnaldi D, Orso B, Pardini M',
      title: 'Neurotransmitter landscape and neurodegeneration patterns in Alzheimer\'s Disease.',
      venue: 'Neurobiology of Aging',
      year: 2026,
      doi: '10.1016/j.neurobiolaging.2026.02.004',
    },
    {
      id: 'J7',
      authors: 'Ali S, Kreshpa W, Rosso N, Piana M, Roccatagliata L, Cirone A, Lorenzini L, Campi C, Pardini M, Garbarino S',
      title: 'A systematic study on the integration of MRI connectivity metrics for Alzheimer\'s diagnosis, staging, and cognitive decline prediction.',
      venue: 'Frontiers in Neuroimaging',
      vol: '5: 1746464',
      year: 2026,
      doi: '10.3389/fnimg.2026.1746464',
    },
    {
      id: 'J6',
      authors: 'Naveed Manji S, Imtiaz M, Ehsan S, Mehmood K, Ahmad S, Zaheer N, Iqbal S, Ali S',
      title: 'Perception of Dental Faculty Regarding Development of Preclinical Endodontic Simulation Curriculum for Undergraduate Dental Students in Pakistan.',
      venue: 'Scientifica',
      vol: '2026: 1988107',
      year: 2026,
      doi: '10.1155/sci5/1988107',
    },
    {
      id: 'J5',
      authors: 'Bashir AF, Jatala UW, Fareed MA, Sheryar S, Chattha SA, Khan SR, Ahmad S, Iqbal S, Zafar MS, Ali S',
      title: 'Evaluation of Post-Endodontic Pain Reduction Using Intracanal Cryotherapy in Symptomatic Apical Periodontitis.',
      venue: 'Australian Endodontic Journal',
      vol: '51(3): 677–683',
      year: 2025,
      doi: '10.1111/aej.12983',
    },
    {
      id: 'J4',
      authors: 'Losa M, Cotta Ramusino M, Cama I, Gualco L, Gandoglia I, Massa F, Donniaquio A, Mortola P, Argenti L, Lombardo L, Kreshpa W, Pelagotti V, Bozzo G, Orso B, Mattioli P, Arnaldi D, Cirone A, Ali S, Hamedani M, Pulze M, Plantone D, Lorenzini L, Falcitano L, Mazzacane F, Perini G, Costa A, Piana M, Castellan L, Uccelli A, Schenone A, Kozberg M, Piazza F, Del Sette M, Garbarino S, Roccatagliata L, Farina LM, Pardini M',
      title: 'Cerebrospinal Fluid Biomarkers Profiling in Cerebral Amyloid Angiopathy and Relationship With Disease Phenotypes.',
      venue: 'Journal of the American Heart Association',
      vol: '14(20): e044784',
      year: 2025,
      doi: '10.1161/JAHA.125.044784',
    },
    {
      id: 'J3',
      authors: 'Ali S, Piana M, Pardini M, Garbarino S',
      title: 'Graph neural networks in Alzheimer\'s disease diagnosis: a review of unimodal and multimodal advances.',
      venue: 'Frontiers in Neuroscience',
      vol: '19: 1623141',
      year: 2025,
      doi: '10.3389/fnins.2025.1623141',
    },
    {
      id: 'J2',
      authors: 'Kiran I, Ali S, Alhussein M, Aslam S, Aurangzeb K',
      title: 'An AI-Enabled Framework for Transparency and Interpretability in Cardiovascular Disease Risk Prediction.',
      venue: 'Computers, Materials & Continua',
      vol: '82(3): 5057–5078',
      year: 2025,
      doi: '10.32604/cmc.2025.058724',
    },
    {
      id: 'J1',
      authors: 'Ali S, Shahbaz M',
      title: 'Streamflow forecasting by modeling the rainfall–streamflow relationship using artificial neural networks.',
      venue: 'Modeling Earth Systems and Environment (Springer)',
      vol: '6(3): 1645–1656',
      year: 2020,
      doi: '10.1007/s40808-020-00780-3',
    },
  ],
  journalsUnderReview: [],
  bookChapters: [],
  workingPapers: [],
  // ── Conference / symposium abstracts & posters ─────────────────────────
  abstracts: [
    {
      id: 'A1',
      authors: 'Ali S, Kreshpa W, Rosso N, Piana M, Roccatagliata L, Cirone A, Lorenzini L, Campi C, Pardini M, Garbarino S',
      title: 'MRI Connectivity Metrics for Alzheimer\'s Diagnosis, Staging, and Cognitive Decline Prediction.',
      venue: 'Organization for Human Brain Mapping (OHBM) Annual Meeting',
      location: 'Bordeaux, France',
      year: 2026,
      type: 'Accepted poster',
      url: 'https://humanbrainmapping.org/i4a/pages/index.cfm?pageid=4317',
    },
    {
      id: 'A2',
      authors: 'Ali S, et al.',
      title: 'Hierarchical Graph-of-Graphs Learning for Multimodal Alzheimer\'s Disease Staging and Progression Modelling.',
      venue: 'Learning on Graphs Italian Meetup 2026',
      location: 'Pisa, Italy',
      year: 2026,
      type: 'Accepted oral / poster',
      url: 'https://log26pisa.github.io/',
    },
    {
      id: 'A3',
      authors: 'Ali S, Kreshpa W, Piana M, Pardini M, Garbarino S',
      title: 'Integration of Graph Theory and Brain Microstructural Analysis with Machine Learning for Advanced Diagnosis of Alzheimer\'s Disease and Prediction of Cognitive Decline.',
      venue: 'IV Annual Meeting RIN IRCCS Network — Symposia',
      location: 'Italy',
      year: 2024,
      type: 'Presented poster',
    },
  ],
  selectedConferences: [
    {
      id: 'C5',
      authors: 'Ali U, Shahid S, Misbah, Ali S, Aslam S, Mustafa K',
      title: 'Hybrid Kernel SVM and Boosting Approaches for Accurate Autism Spectrum Disorder Screening.',
      venue: 'Information Systems for Intelligent Systems — ISBM 2025, Lecture Notes in Networks and Systems, Vol. 1744, Springer, Cham',
      year: 2026,
      doi: '10.1007/978-3-032-12996-3_17',
    },
    {
      id: 'C4',
      authors: 'Ali U, Hussain T, Akbar MM, Ali S, Sajid',
      title: 'Socioeconomic Indicator-Based Crime Prediction in Pakistan Using Machine Learning Techniques.',
      venue: 'Information Systems for Intelligent Systems — ISBM 2025, Lecture Notes in Networks and Systems, Vol. 1749, Springer, Cham',
      year: 2026,
      doi: '10.1007/978-3-032-13003-7_22',
    },
    {
      id: 'C3',
      authors: 'Ali S, Shahbaz M, Jamil K',
      title: 'Entropy-Based Feature Selection Classification Approach for Detecting Phishing Websites.',
      venue: '13th International Conference on Open Source Systems and Technologies (ICOSST), IEEE',
      location: 'Lahore, Pakistan',
      year: 2019,
      doi: '10.1109/ICOSST48232.2019.9044042',
    },
    {
      id: 'C2',
      authors: 'Shahbaz M, Ali S, Guergachi A, Niazi A, Umer A',
      title: 'Classification of Alzheimer\'s Disease using Machine Learning Techniques.',
      venue: '8th International Conference on Data Science, Technology and Applications (DATA), SciTePress',
      vol: 'pp. 296–303',
      year: 2019,
      doi: '10.5220/0007949902960303',
    },
    {
      id: 'C1',
      authors: 'Ali S, Usman M, Saddique D, Aslam MU, Ejaz S',
      title: 'Prediction of Diabetes Disease using Data Mining Classification Techniques.',
      venue: 'Al Yamamah University Engineering Forum (YUENG)',
      location: 'Riyadh, Saudi Arabia',
      year: 2019,
    },
  ],
};

export const projects = [];

export const skills = {
  programming: [
    { name: 'Python',           level: 95, detail: 'NumPy, Pandas, Scikit-learn, Jupyter, Colab — daily research driver' },
    { name: 'C++',              level: 85, detail: 'Numerical routines, performance-critical code — Expert' },
    { name: 'R',                level: 70, detail: 'Statistical analysis and hypothesis testing — Intermediate' },
    { name: 'Java',             level: 65, detail: 'Object-oriented programming, teaching context — Intermediate' },
  ],
  aiml: [
    { name: 'Scikit-learn',     level: 95, detail: 'Classical ML pipelines, feature selection, model evaluation — Expert' },
    { name: 'PyTorch',          level: 85, detail: 'Deep learning, graph neural networks, GradCAM — Intermediate+' },
    { name: 'TensorFlow / Keras', level: 78, detail: 'Deep learning, CNNs, sequence models — Intermediate' },
    { name: 'OpenCV',           level: 75, detail: 'Image preprocessing, computer vision — Intermediate' },
    { name: 'Graph Neural Networks', level: 88, detail: 'PyTorch Geometric, DGL — Alzheimer\'s connectomics' },
  ],
  powerEnergy: [
    { name: 'FreeSurfer',       level: 88, detail: 'Structural MRI cortical reconstruction and parcellation' },
    { name: 'MRtrix3',          level: 85, detail: 'Diffusion MRI preprocessing, tractography, connectomics' },
    { name: 'FSL',              level: 80, detail: 'FMRIB Software Library — MRI analysis and registration' },
    { name: 'SPM',              level: 78, detail: 'Statistical Parametric Mapping for MRI / fMRI' },
    { name: 'Clinica & Nilearn',level: 80, detail: 'Reproducible pipelines, Python-first neuroimaging' },
  ],
  domains: [
    'Graph Neural Networks & Connectomics',
    'Multimodal Neuroimaging Integration',
    'Alzheimer\'s Disease Diagnosis & Staging',
    'Disease Progression Modelling',
    'Interpretable / Explainable AI',
    'Cardiovascular Risk Prediction',
    'Neuroimaging Pipelines (MRI / DTI)',
    'Clinical Decision Support Systems',
    'Predictive Modelling & Forecasting',
    'Research Writing & Peer Review',
    'Data Visualisation (PowerBI, Tableau)',
    'Data Mining (Rapidminer, Weka, KNIME)',
  ],
};

export const awards = [
  {
    id: 'unibo-phd',
    title: 'PhD Scholarship — Data Science & Computation',
    org: 'Alma Mater Studiorum — Università di Bologna',
    year: '2022',
    description: 'Competitive PhD scholarship in the Data Science and Computation programme, with research focus on Machine Learning methods in Digital Health.',
    tier: 'major',
  },
  {
    id: 'peef',
    title: 'Punjab Educational Endowment Fund (PEEF) Scholarship',
    org: 'Government of Punjab, Pakistan',
    year: '2016',
    description: 'Talent-based scholarship awarded during the Master of Science degree in Computer Science at the University of Engineering and Technology, Lahore.',
    tier: 'major',
  },
  {
    id: 'ictrd-fyp',
    title: 'ICT R&D Final Year Project Grant',
    org: 'ICT R&D Programme, Federal Government of Pakistan',
    year: '2014',
    description: 'Research grant for the Bachelor Final Year Project — "Visible Light-Based Communication System for High Data Rate Real-Time Applications".',
    tier: 'grant',
  },
  {
    id: 'ictrd-scholarship',
    title: 'ICT R&D Merit Scholarship',
    org: 'ICT R&D, Federal Government of Pakistan',
    year: '2011',
    description: 'Merit-based scholarship awarded during the Bachelor of Science in Telecommunication and Networking at COMSATS University Islamabad, Sahiwal Campus.',
    tier: 'award',
  },
];

export const peerReview = [
  'Frontiers in Neuroscience',
  'Frontiers in Neuroimaging',
  'Computers, Materials & Continua',
  'IEEE Access',
  'Modeling Earth Systems and Environment (Springer)',
];

export const professionalDevelopment = [
  {
    title: 'Update on the Pathophysiology and Neuroimaging of ARIA (Amyloid-Related Imaging Abnormalities)',
    org: 'Symposia Congressi — Genova, Italy',
    year: '2025',
  },
  {
    title: '2024 Geilo Winter School — Graphs and Applications',
    org: 'SINTEF — Geilo, Norway',
    year: '2024',
  },
  {
    title: 'IEEE Communication Society (ComSoc) eHealth Technical Committee PhD School',
    org: 'IEEE ComSoc — Genova, Italy',
    year: '2023',
  },
  {
    title: 'Eastern European Machine Learning (EEML) Summer School',
    org: 'Technical University of Košice, Slovakia',
    year: '2023',
  },
  {
    title: 'Invited Speaker — Data Science and Machine Learning for Physicists',
    org: 'International School on Physics & Allied Disciplines, National Center of Physics, Islamabad',
    year: '2019',
  },
  { title: 'Computational Neuroscience',                                  org: 'Coursera', year: '2025' },
  { title: 'Foundations and Core Concepts of PyTorch',                    org: 'Coursera', year: '2025' },
  { title: 'Machine Learning with Python',                                org: 'Coursera', year: '2025' },
  { title: 'Data Analysis with Python',                                   org: 'Coursera', year: '2025' },
  { title: 'Python for Data Science, AI & Development',                   org: 'Coursera', year: '2025' },
  { title: 'Introduction to Artificial Intelligence (AI)',                org: 'Coursera', year: '2025' },
  { title: 'Generative AI: Prompt Engineering Basics',                    org: 'Coursera', year: '2025' },
  { title: 'Generative AI: Introduction and Applications',                org: 'Coursera', year: '2025' },
  { title: 'Deep Learning with PyTorch: GradCAM',                         org: 'Coursera', year: '2024' },
  { title: 'Machine Learning Pipelines with Azure ML Studio',             org: 'Coursera', year: '2024' },
  { title: 'Build your first Machine Learning Pipeline using Dataiku',    org: 'Coursera', year: '2024' },
  { title: 'Overview of Data Visualization',                              org: 'Coursera', year: '2024' },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEWS & UPDATES
// Newest first. Each entry's `body` may contain [label](url) inline links
// — they're rendered as clickable cyan accents by the inlineLinks helper.
// ─────────────────────────────────────────────────────────────────────────────
export const news = [
  {
    id: 'n17',
    date: 'Jun 2026',
    body: `Our abstract, "MRI Connectivity Metrics for Alzheimer's Diagnosis, Staging, and Cognitive Decline Prediction," has been accepted for a poster presentation at the [Organization for Human Brain Mapping (OHBM) 2026 Annual Meeting](https://humanbrainmapping.org/i4a/pages/index.cfm?pageid=4317), June 14–18, 2026, in Bordeaux, France. I look forward to presenting this research and engaging with the international neuroimaging community at OHBM 2026.`,
  },
  {
    id: 'n16',
    date: 'Jun 2026',
    body: `Our abstract, "Hierarchical Graph-of-Graphs Learning for Multimodal Alzheimer's Disease Staging and Progression Modelling," has been accepted for presentation at the [Learning on Graphs Italian Meetup 2026](https://log26pisa.github.io/), June 9–11, 2026, in Pisa, Italy. I look forward to presenting this work and engaging with the graph learning and biomedical AI community.`,
  },
  {
    id: 'n15',
    date: 'May 2026',
    body: `Participated in the European Prevention of Alzheimer's Disease Consortium ([EURO-PAD](https://www.symposiacongressi.com/euro-pad-scientific-symposium/)) Scientific Symposium, held in Genoa, Italy, from 28–29 May 2026.`,
  },
  {
    id: 'n14',
    date: 'Jul 2025 – Jan 2026',
    body: `Visiting Researcher at the [University of Sussex](https://www.sussex.ac.uk/), UK. During this period, I conducted research at the [LILI Lab](https://lililab-sussex.github.io/), focusing on AI and graph learning methods for neurodegenerative disease modelling, with an emphasis on clinically relevant and translational applications.`,
  },
  {
    id: 'n13',
    date: 'Dec 2025',
    body: `Participated in the [Rastuc Labs](https://www.linkedin.com/company/rastuc-labs) Computational Neuroscience Workshop 2025, held from 15–19 December 2025, focusing on computational and data-driven approaches in neuroscience.`,
  },
  {
    id: 'n12',
    date: 'Dec 2025',
    body: `Successfully completed the [NCEAC–HEC Generative AI Training](https://www.pakangels.com/hec-generative-ai-training-program/) (Oct–Nov 2025) and was awarded the Generative AI Application Developer Certificate by UETIANS Lahore Endowment Foundation, in collaboration with [Higher Education Commission](https://www.hec.gov.pk), [Pak Angels](https://www.pakangels.com/), [iCode Guru](https://icode.guru/), and [Aspire Pakistan](https://aspirepk.org/). Recognised as a Top Performer.`,
  },
  {
    id: 'n11',
    date: 'Oct 2025',
    body: `Successfully completed Soft Skills Training (3 days / 17 hours), recognised by the [International Centre for Migration Policy Development (ICMPD)](https://www.icmpd.org/) and the [Overseas Employment Corporation (OEC)](https://oec.gov.pk/), focusing on employability skills and career readiness.`,
  },
  {
    id: 'n10',
    date: 'Oct 2025',
    body: `Participated in the Author Workshop: Publishing Open Access, organised by [Wiley Customer Education](https://www.wiley.com/en-us/solutions-partnerships/customer-success-hub/webinars-and-events/) in collaboration with the [Higher Education Commission (HEC)](https://www.hec.gov.pk/english/Pages/default.aspx), covering open-access publishing models and best practices.`,
  },
  {
    id: 'n9',
    date: 'Sep 2025',
    body: `Attended the [Clarivate](https://clarivate.com/) webinar "Peer Review: Best Practices and Recommendations", focusing on peer-review ethics, reviewer responsibilities, and editorial standards.`,
  },
  {
    id: 'n8',
    date: 'Sep 2025',
    body: `Attended webinars organised by ECOSISTER Pillar Training: "How to Design an Award-Winning Scientific Poster" (24 Sept 2025) and "Grant Graphics Masterclass: Visuals That Win Funding" (25 Sept 2025), focusing on effective visual communication for scientific dissemination and competitive research funding.`,
  },
  {
    id: 'n7',
    date: 'May 2025',
    body: `Attended the scientific meeting "[Update on the Pathophysiology and Neuroimaging of Amyloid-Related Imaging Abnormalities (ARIA)](https://www.symposiacongressi.com/aria2025/)", held in Genoa, Italy (22 May 2025). The event focused on clinical and neuroimaging aspects of ARIA, including MRI manifestations, pathophysiological mechanisms, and implications for amyloid-targeting therapies.`,
  },
  {
    id: 'n6',
    date: 'Nov 2024',
    body: `Presented work titled "Integration of Graph Theory and Brain Microstructural Analysis with Machine Learning for Advanced Diagnosis of Alzheimer's Disease and Prediction of Cognitive Decline" at the IV Annual Meeting RIN IRCCS Network – Symposia, 21–22 November 2024.`,
  },
  {
    id: 'n5',
    date: 'Jan 2024',
    body: `Participated in the [Geilo Winter School](https://www.sintef.no/projectweb/geilowinterschool/) on [Graphs and Applications](https://www.sintef.no/projectweb/geilowinterschool/2024-winter-school/), held in Geilo, Norway, from 21–26 January 2024.`,
  },
  {
    id: 'n4',
    date: 'Oct 2023',
    body: `Participated in the IEEE Communication Society (ComSoc) eHealth Technical Committee (TC) PhD School, held in Genoa, Italy, from 25–27 October 2023.`,
  },
  {
    id: 'n3',
    date: 'Nov 2022',
    body: `Started PhD (38th cycle) in Data Science and Computation at [Alma Mater Studiorum – Università di Bologna](https://www.unibo.it/en), funded by Next Generation EU – NRRP (D.M. 351/2022).`,
  },
  {
    id: 'n2',
    date: 'Mar 2019',
    body: `Appointed as Lecturer in Information Technology (BS-18) at the [University of Education Lahore](https://www.ue.edu.pk/index.php) – Multan Campus, Pakistan, effective 20 March 2019. Transferred to the University of Education Lahore – Vehari Campus, Pakistan, effective 23 October 2020.`,
  },
  {
    id: 'n1',
    date: 'Jul 2018',
    body: `Completed Master of Science (M.Sc.) in Computer Science from the [University of Engineering and Technology](https://www.uet.edu.pk/home/), Lahore, Pakistan, with the degree awarded on 23 November 2018.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEWS GALLERY — slideshow above the news timeline
// Drop image files into  public/news/  and reference them here with leading "/news/".
// Slides without a corresponding file simply don't display (the img onError
// handler hides them), so it is safe to ship this list even if some images
// are not yet provided. Order = display order; the slideshow rotates them.
// ─────────────────────────────────────────────────────────────────────────────
export const newsGallery = [
  // EURO-PAD Scientific Symposium — Genoa, May 2026
  {
    src: '/news/euro-pad-1.jpg',
    alt: 'EURO-PAD Scientific Symposium in Genoa',
    caption: 'EURO-PAD Scientific Symposium · Genoa (May 2026)',
  },
  {
    src: '/news/euro-pad-3.jpg',
    alt: 'EURO-PAD Scientific Symposium in Genoa',
    caption: 'EURO-PAD Scientific Symposium · Genoa (May 2026)',
  },
  {
    src: '/news/euro-pad-4.jpg',
    alt: 'EURO-PAD Scientific Symposium in Genoa',
    caption: 'EURO-PAD Scientific Symposium · Genoa (May 2026)',
  },

  // Visiting research period at LILI Lab, University of Sussex (Jul 2025 – Jan 2026)
  // Photos taken at London Bridge / around the UK during that period.
  {
    src: '/news/sussex-mobility-1.jpg',
    alt: 'London Bridge, taken during the visiting research period at the University of Sussex',
    caption: 'London Bridge · during visiting research at the University of Sussex (Jul 2025 – Jan 2026)',
  },
  {
    src: '/news/sussex-mobility-2.jpg',
    alt: 'UK photo from the visiting research period at the University of Sussex',
    caption: 'London Bridge · during visiting research at the University of Sussex (Jul 2025 – Jan 2026)',
  },

  // RIN IRCCS Network Symposium — Nov 2024
  {
    src: '/news/rin-irccs-symposia.jpg',
    alt: 'IV Annual Meeting RIN IRCCS Network — Symposia',
    caption: 'IV Annual Meeting RIN IRCCS Network — Symposia (Nov 2024)',
  },

  // Geilo Winter School — Graphs and Applications, Norway, Jan 2024
  {
    src: '/news/geilo-winter-school-1.jpg',
    alt: 'Geilo Winter School on Graphs and Applications, Norway',
    caption: 'Geilo Winter School — Graphs and Applications · Norway (Jan 2024)',
  },
  {
    src: '/news/geilo-winter-school-2.jpg',
    alt: 'Geilo Winter School on Graphs and Applications, Norway',
    caption: 'Geilo Winter School — Graphs and Applications · Norway (Jan 2024)',
  },
  {
    src: '/news/geilo-winter-school-3.jpg',
    alt: 'Geilo Winter School on Graphs and Applications, Norway',
    caption: 'Geilo Winter School — Graphs and Applications · Norway (Jan 2024)',
  },
  {
    src: '/news/geilo-winter-school-4.jpg',
    alt: 'Geilo Winter School on Graphs and Applications, Norway',
    caption: 'Geilo Winter School — Graphs and Applications · Norway (Jan 2024)',
  },

  // IEEE ComSoc eHealth PhD School — Genoa, Oct 2023
  {
    src: '/news/comsoc-phd-school.jpg',
    alt: 'IEEE ComSoc eHealth Technical Committee PhD School in Genoa',
    caption: 'IEEE ComSoc eHealth Technical Committee PhD School · Genoa (Oct 2023)',
  },

  // Porto Antico, Genova — decorative city shots from where the research lives
  {
    src: '/news/porto-antico-genova-1.jpg',
    alt: 'Porto Antico, Genoa, Italy',
    caption: 'Porto Antico, Genova — where the research lives',
  },
  {
    src: '/news/porto-antico-genova-2.jpg',
    alt: 'Porto Antico, Genoa, Italy',
    caption: 'Porto Antico, Genova — where the research lives',
  },
];


