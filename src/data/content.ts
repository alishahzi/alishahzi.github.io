// ─────────────────────────────────────────────────────────────────────────────
// CONTENT DATA — Shahzad Ali Portfolio
// Single source of truth. Edit this file to update any section of the site.
// ─────────────────────────────────────────────────────────────────────────────

export const personal = {
  name: 'Shahzad Ali',
  shortName: 'Shahzad Ali',
  initials: 'Shahzad',
  title: 'PhD Researcher — AI & Deep Learning for Medical Imaging',
  subtitle: 'PhD Scholar in Data Science & Computation · Alma Mater Studiorum Università di Bologna · IRCCS Ospedale Policlinico San Martino',
  tagline: 'Advancing Healthcare Through Machine Learning & Medical Imaging AI',
  location: 'Genova, Italy',
  email: 'shahzadali039@gmail.com',
  emailAcademic: 'shahzad.ali6@unibo.it',
  phone: '+39 348 2657723',
  linkedin: 'https://www.linkedin.com/in/shahzadali21',
  github: 'https://github.com/alishahzi',
  scholar: 'https://scholar.google.com/citations?user=shahzadali',
  orcid: 'https://orcid.org/0000-0002-0608-9515',
  website: 'https://sites.google.com/view/alishahzad/',
  publons: 'https://www.webofscience.com/wos/author/record/ODJ-8978-2025',
  scopus: 'https://www.scopus.com/authid/detail.uri?authorId=57202066536',
  cvUrl: '/cv/CV_Shahzad.pdf',
  image: '/profile.png',
  summary: `I'm a passionate PhD scholar specializing in the applications of Machine and Deep Learning
  in the realm of medical imaging and healthcare. My research involves leveraging graph neural networks,
  deep learning, and classical ML to address critical clinical challenges — with a particular focus on
  Alzheimer's disease diagnosis using multimodal neuroimaging (MRI, DTI) and interpretable AI for
  cardiovascular risk prediction. I have a strong background in handling extensive datasets,
  developing algorithms, and building predictive models, and have presented my research in reputed
  international journals and conferences. I also enjoy collaborating with peers and mentoring students.`,
};

export const stats = [
  { value: '4', label: 'Peer-Reviewed Journals', sublabel: 'Frontiers, Springer, CMC, AEJ' },
  { value: '4+', label: 'Conference & Symposium Papers', sublabel: 'IEEE · ICOSST · RIN IRCCS' },
  { value: '13+', label: 'Professional Certifications', sublabel: 'Coursera · IBM · Microsoft' },
  { value: '7+', label: 'Years Research & Teaching', sublabel: 'Italy · Pakistan' },
];

export const researchFocus = [
  {
    id: 'gnn-alzheimer',
    title: 'Graph Neural Networks for Alzheimer\'s Diagnosis',
    description:
      'Designing GNN architectures for unimodal and multimodal neuroimaging analysis. Integrating structural MRI, diffusion MRI, and brain connectomics to improve early diagnosis of Alzheimer\'s disease and predict cognitive decline.',
    tags: ['GNN', 'Alzheimer\'s', 'Multimodal MRI', 'Connectomics'],
    color: 'cyan',
    icon: 'brain',
  },
  {
    id: 'deep-learning-medical',
    title: 'Deep Learning for Medical Imaging',
    description:
      'Applying CNNs, transformers, and hybrid architectures on large-scale neuroimaging datasets (ADNI, OASIS) to identify imaging biomarkers and disease patterns for neurological disorders.',
    tags: ['CNN', 'Transformers', 'Neuroimaging', 'Biomarkers'],
    color: 'indigo',
    icon: 'zap',
  },
  {
    id: 'interpretable-ai',
    title: 'Interpretable & Explainable AI for Clinical Risk',
    description:
      'Building transparent machine learning frameworks for cardiovascular disease risk prediction using SHAP, LIME, and GradCAM. Bridging black-box model performance with clinician-friendly explanations.',
    tags: ['Interpretable ML', 'SHAP', 'GradCAM', 'Cardiovascular Risk'],
    color: 'emerald',
    icon: 'network',
  },
  {
    id: 'neuroimaging-pipelines',
    title: 'Neuroimaging Preprocessing & Analysis Pipelines',
    description:
      'End-to-end pipelines on MRI/DTI data using FreeSurfer, MRtrix3, FSL, SPM, Clinica, and Nilearn — from raw DICOM to harmonised features ready for ML models.',
    tags: ['FreeSurfer', 'MRtrix3', 'FSL', 'SPM', 'Clinica', 'Nilearn'],
    color: 'amber',
    icon: 'sun',
  },
  {
    id: 'brain-microstructure',
    title: 'Brain Microstructural Analysis & Graph Theory',
    description:
      'Combining graph theory metrics (centrality, clustering, small-worldness) with microstructural features from diffusion MRI to characterise brain networks in health and disease.',
    tags: ['Graph Theory', 'Diffusion MRI', 'Brain Networks', 'Cognitive Decline'],
    color: 'violet',
    icon: 'grid',
  },
  {
    id: 'predictive-modelling',
    title: 'Predictive Modelling for Clinical Decision Support',
    description:
      'Classical ML (Random Forests, XGBoost, SVM) and ensemble approaches for disease classification, phishing detection, hydrological forecasting, and decision-support tools across domains.',
    tags: ['XGBoost', 'Ensemble Learning', 'Classification', 'Forecasting'],
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
    department: 'Clinical Neurosciences / Neuroimaging',
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
    tags: ['GNN', 'Alzheimer\'s', 'Multimodal MRI', 'Clinical AI', 'Biomarkers'],
  },
  {
    id: 'unibo-phd',
    role: 'PhD Candidate — Data Science & Computation',
    org: 'Alma Mater Studiorum Università di Bologna',
    department: 'PhD Programme in Data Science and Computation',
    location: 'Bologna, Italy',
    period: 'Nov 2022 — Present',
    type: 'Academic Research',
    current: true,
    highlights: [
      'Pursuing a PhD in Data Science and Computation with a specific focus on Machine Learning methods in Digital Health',
      'Developing graph-based and deep-learning methodologies for neuroimaging and multimodal medical data',
      'Authored peer-reviewed publications on Alzheimer\'s disease diagnosis, cardiovascular risk interpretability, and brain microstructural analysis',
    ],
    tags: ['Data Science', 'Digital Health', 'Machine Learning', 'Graph Methods'],
  },
  {
    id: 'ue-lecturer',
    role: 'Lecturer — Computer Science',
    org: 'University of Education, Lahore',
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
    institution: 'Alma Mater Studiorum Università di Bologna',
    location: 'Bologna, Italy',
    period: 'Nov 2022 — Present',
    department: 'PhD Programme in Data Science and Computation',
    thesis: 'Machine and Deep Learning Methods for Neuroimaging-Based Diagnosis of Neurological Disorders',
    scholarship: 'PhD Scholarship — Alma Mater Studiorum Università di Bologna',
    highlights: [
      'Research collaboration with IRCCS Ospedale Policlinico San Martino (Genova)',
      'Focus: Graph Neural Networks, multimodal neuroimaging, Alzheimer\'s disease',
      'Published 3 peer-reviewed journal articles during the PhD (2024–2025)',
    ],
  },
  {
    id: 'msc',
    degree: 'Master of Science in Computer Science',
    specialization: 'Machine Learning',
    institution: 'University of Engineering and Technology, Lahore',
    location: 'Lahore, Pakistan',
    period: 'Jan 2016 — Jul 2018',
    department: 'Department of Computer Science & Engineering',
    thesis: 'Artificial Neural Network Model for Rainfall-Runoff Prediction for Jhelum River Basin Upstream of the Mangla Dam, Pakistan',
    scholarship: 'Punjab Educational Endowment Fund (PEEF) — Talent-Based Scholarship',
    gpa: '3.75 / 4.00',
    highlights: [
      'PEEF Talent-Based Scholarship, Government of Punjab',
      'Focus: neural networks, hydrological forecasting, data-driven modelling',
      'Published research in Springer\'s Modeling Earth Systems and Environment (IF 2.9)',
    ],
  },
  {
    id: 'bsc',
    degree: 'Bachelor of Science in Telecommunication and Networking',
    specialization: 'Computer Science · Telecommunication & Networking',
    institution: 'COMSATS University Islamabad, Sahiwal Campus',
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

export const publications = {
  journalsPublished: [
    {
      id: 'J4',
      authors: 'Shahzad Ali, Michele Piana, Matteo Pardini, Sara Garbarino',
      title: 'Graph Neural Networks in Alzheimer\'s Disease Diagnosis: A Review of Unimodal and Multimodal Advances.',
      venue: 'Frontiers in Neuroscience',
      year: 2025,
      status: 'Published',
      if: 3.2,
    },
    {
      id: 'J3',
      authors: 'Anam Fayyaz Bashir, Ussamah Waheed Jatala, Muhammad Amber Fareed, Sheryar Sheryar, Saadia Ahmad Chattha, Saima Razaq Khan, Shahzad Ahmad, Shazia Iqbal, Muhammad Sohail Zafar, Shahzad Ali',
      title: 'Evaluation of Post-Endodontic Pain Reduction Using Intracanal Cryotherapy in Symptomatic Apical Periodontitis.',
      venue: 'Australian Endodontic Journal',
      year: 2025,
      status: 'Published',
      if: 1.5,
    },
    {
      id: 'J2',
      authors: 'Isha Kiran, Shahzad Ali, Sajawal ur Rehman Khan, Musaed Alhussein, Sheraz Aslam, Khursheed Aurangzeb',
      title: 'An AI-Enabled Framework for Transparency and Interpretability in Cardiovascular Disease Risk Prediction.',
      venue: 'Computers, Materials & Continua',
      year: 2025,
      status: 'Published',
      if: 1.7,
    },
    {
      id: 'J1',
      authors: 'Shahzad Ali, Muhammad Shahbaz',
      title: 'Streamflow Forecasting by Modeling the Rainfall–Streamflow Relationship Using Artificial Neural Networks.',
      venue: 'Modeling Earth Systems and Environment (Springer)',
      year: 2020,
      status: 'Published',
      if: 2.9,
    },
  ],
  journalsUnderReview: [],
  bookChapters: [],
  workingPapers: [
    {
      id: 'W1',
      authors: 'Shahzad Ali, Wendy Kreshpa, Michele Piana, Matteo Pardini, Sara Garbarino',
      title: 'Integration of Graph Theory and Brain Microstructural Analysis with Machine Learning for Advanced Diagnosis of Alzheimer\'s Disease and Prediction of Cognitive Decline.',
      venue: 'IV Annual Meeting RIN IRCCS Network — Symposia',
      year: 2024,
      status: 'Symposium Paper',
    },
  ],
  selectedConferences: [
    {
      id: 'C3',
      authors: 'Muhammad Shahbaz, Shahzad Ali, Aziz Guergachi, Aneeta Niazi, Amina Umer',
      title: 'Classification of Alzheimer\'s Disease using Machine Learning Techniques.',
      venue: 'Proceedings of the 8th International Conference on Data Science, Technology and Applications (DATA)',
      location: 'Prague, Czech Republic',
      year: 2019,
    },
    {
      id: 'C2',
      authors: 'Shahzad Ali, Muhammad Shahbaz, Kashif Jamil',
      title: 'Entropy-Based Feature Selection Classification Approach for Detecting Phishing Websites.',
      venue: '13th International Conference on Open Source Systems and Technologies (ICOSST)',
      location: 'Lahore, Pakistan',
      year: 2019,
    },
    {
      id: 'C1',
      authors: 'Shahzad Ali, Dawood Saddique, Muhammad Usman Aslam, Muhammad Usman, Umair Maqbool, Shoaib Ejaz',
      title: 'Prediction of Diabetes Disease using Data Mining Classification Techniques.',
      venue: 'Proceedings of Al Yamamah University Engineering Forum (YUENG)',
      location: 'Riyadh, Saudi Arabia',
      year: 2019,
    },
  ],
};

export const projects = [
  {
    id: 'gnn-alzheimer-review',
    title: 'GNNs in Alzheimer\'s Disease Diagnosis — Unimodal & Multimodal Review',
    subtitle: 'Frontiers in Neuroscience (2025)',
    problem: 'The rapid growth of GNN-based methods for Alzheimer\'s disease (AD) diagnosis across unimodal and multimodal neuroimaging lacks a unified, critical synthesis for clinical researchers.',
    method: 'Systematic review of graph construction strategies, message-passing architectures, and fusion techniques across MRI, PET, DTI, and clinical data; benchmarking datasets and reporting pitfalls.',
    tools: ['PyTorch Geometric', 'DGL', 'Python', 'ADNI', 'OASIS'],
    contribution: 'Consolidated the state-of-the-art into a clinician-accessible taxonomy of GNN-based AD diagnosis, highlighting multimodal fusion as the most promising direction.',
    tags: ['GNN', 'Alzheimer\'s', 'Review', 'Multimodal', 'Neuroimaging'],
    color: 'cyan',
    status: 'Published — Frontiers in Neuroscience 2025',
  },
  {
    id: 'graph-theory-microstructure',
    title: 'Graph Theory + Brain Microstructural Analysis for Advanced AD Diagnosis',
    subtitle: 'IV Annual Meeting RIN IRCCS Network, Nov 2024',
    problem: 'Early differentiation between healthy ageing and prodromal Alzheimer\'s disease using only structural MRI is insufficient; microstructural and network-level features may carry earlier signals.',
    method: 'Extracted graph-theoretic metrics (degree, clustering, small-worldness) from diffusion-derived structural connectomes; fused with microstructural features and fed into ML classifiers.',
    tools: ['MRtrix3', 'FreeSurfer', 'NetworkX', 'Scikit-learn', 'Python'],
    contribution: 'Demonstrated that graph-theoretic + microstructural fusion improves prediction of cognitive decline over either modality in isolation.',
    tags: ['Graph Theory', 'Diffusion MRI', 'Connectomics', 'Cognitive Decline'],
    color: 'indigo',
    status: 'Symposium — RIN IRCCS 2024',
  },
  {
    id: 'cvd-interpretability',
    title: 'AI-Enabled Transparency & Interpretability for Cardiovascular Risk',
    subtitle: 'Computers, Materials & Continua (2025)',
    problem: 'Black-box ML models for cardiovascular disease (CVD) risk prediction are poorly adopted in clinical settings due to lack of transparency and actionable explanations.',
    method: 'Built an end-to-end framework combining gradient-boosted classifiers with SHAP and LIME for feature attribution, plus calibration and subgroup fairness checks on public CVD datasets.',
    tools: ['XGBoost', 'SHAP', 'LIME', 'Python', 'Scikit-learn'],
    contribution: 'Delivered a clinically interpretable CVD risk model with per-patient explanations and feature-level insights, published in Computers, Materials & Continua.',
    tags: ['Explainable AI', 'SHAP', 'Cardiovascular', 'Clinical Decision Support'],
    color: 'emerald',
    status: 'Published — CMC 2025',
  },
  {
    id: 'streamflow-ann',
    title: 'ANN-Based Rainfall–Streamflow Forecasting — Jhelum River Basin',
    subtitle: 'MSc Thesis · Modeling Earth Systems and Environment (2020)',
    problem: 'Accurate short-horizon streamflow forecasting upstream of the Mangla Dam is critical for flood management and hydropower scheduling in Pakistan.',
    method: 'Trained multi-layer feed-forward neural networks on historical rainfall–streamflow pairs from the Jhelum basin; benchmarked against conventional hydrological baselines.',
    tools: ['MATLAB', 'Python', 'Neural Network Toolbox'],
    contribution: 'Published the first ANN-based forecasting study for the Jhelum basin upstream of Mangla Dam in Springer\'s Modeling Earth Systems and Environment (IF 2.9).',
    tags: ['ANN', 'Hydrology', 'Forecasting', 'Rainfall–Runoff', 'Springer'],
    color: 'amber',
    status: 'Published — Springer 2020',
  },
  {
    id: 'phishing-detection',
    title: 'Entropy-Based Feature Selection for Phishing Website Detection',
    subtitle: 'ICOSST 2019',
    problem: 'Phishing detection models suffer from high-dimensional URL and content features, leading to overfitting and slow inference.',
    method: 'Applied entropy-based feature ranking to reduce feature space, followed by multiple classifiers (Random Forest, Decision Tree, SVM) for final prediction.',
    tools: ['Python', 'Scikit-learn', 'Weka'],
    contribution: 'Showed that entropy-guided selection retains accuracy with a fraction of the original features — presented at the 13th ICOSST.',
    tags: ['Feature Selection', 'Entropy', 'Phishing', 'Classification'],
    color: 'teal',
    status: 'Published — IEEE ICOSST 2019',
  },
  {
    id: 'ad-classification-classical',
    title: 'Alzheimer\'s Disease Classification with Classical ML',
    subtitle: 'DATA 2019 Conference',
    problem: 'Benchmarking classical ML techniques for AD classification before the deep-learning era guides practitioners on strong baselines and interpretable tools.',
    method: 'Compared SVM, Random Forest, and ensemble approaches on structural MRI features with rigorous cross-validation and statistical testing.',
    tools: ['Python', 'Scikit-learn', 'MATLAB'],
    contribution: 'Established comparative baselines for AD classification, feeding into my later GNN-based PhD research.',
    tags: ['Classical ML', 'Alzheimer\'s', 'Classification', 'Benchmarking'],
    color: 'violet',
    status: 'Published — DATA 2019',
  },
];

export const skills = {
  programming: [
    { name: 'Python', level: 95, detail: 'NumPy, Pandas, Scikit-learn, Jupyter, Colab — daily driver for research' },
    { name: 'C++', level: 85, detail: 'Numerical routines, performance-critical code — Expert level' },
    { name: 'R', level: 70, detail: 'Statistical analysis, hypothesis testing — Intermediate' },
    { name: 'Java', level: 65, detail: 'Object-oriented programming, teaching context — Intermediate' },
  ],
  aiml: [
    { name: 'Scikit-learn', level: 95, detail: 'Classical ML pipelines, feature selection, model evaluation — Expert' },
    { name: 'PyTorch', level: 80, detail: 'Deep learning, graph neural networks, GradCAM — Intermediate+' },
    { name: 'TensorFlow / Keras', level: 78, detail: 'Deep learning, CNNs, sequence models — Intermediate' },
    { name: 'OpenCV', level: 75, detail: 'Image preprocessing, computer vision — Intermediate' },
    { name: 'Graph Neural Networks', level: 85, detail: 'PyTorch Geometric, DGL — Alzheimer\'s connectomics research' },
  ],
  powerEnergy: [
    { name: 'FreeSurfer', level: 88, detail: 'Structural MRI cortical reconstruction and parcellation' },
    { name: 'MRtrix3', level: 85, detail: 'Diffusion MRI preprocessing, tractography, connectomics' },
    { name: 'FSL', level: 80, detail: 'FMRIB Software Library — MRI analysis and registration' },
    { name: 'SPM', level: 78, detail: 'Statistical Parametric Mapping for MRI/fMRI' },
    { name: 'Clinica & Nilearn', level: 80, detail: 'Reproducible pipelines, Python-first neuroimaging' },
  ],
  domains: [
    'Machine & Deep Learning for Medical Imaging',
    'Graph Neural Networks & Connectomics',
    'Alzheimer\'s Disease Diagnosis',
    'Interpretable / Explainable AI',
    'Cardiovascular Risk Prediction',
    'Neuroimaging Pipelines (MRI / DTI)',
    'Multimodal Data Fusion',
    'Classical ML & Ensemble Methods',
    'Clinical Decision Support Systems',
    'Research Writing & Peer Review',
    'Data Visualisation (PowerBI, Tableau)',
    'Data Mining (Rapidminer, Weka, KNIME)',
  ],
};

export const awards = [
  {
    id: 'unibo-phd',
    title: 'PhD Scholarship — Data Science & Computation',
    org: 'Alma Mater Studiorum Università di Bologna',
    year: '2022',
    description: 'Competitive PhD scholarship in the Data Science and Computation programme, with a research focus on Machine Learning methods in Digital Health.',
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
  {
    title: 'Computational Neuroscience',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Foundations and Core Concepts of PyTorch',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Machine Learning with Python',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Data Analysis with Python',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Python for Data Science, AI & Development',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Introduction to Artificial Intelligence (AI)',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Generative AI: Prompt Engineering Basics',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Generative AI: Introduction and Applications',
    org: 'Coursera',
    year: '2025',
  },
  {
    title: 'Deep Learning with PyTorch: GradCAM',
    org: 'Coursera',
    year: '2024',
  },
  {
    title: 'Machine Learning Pipelines with Azure ML Studio',
    org: 'Coursera',
    year: '2024',
  },
  {
    title: 'Build your first Machine Learning Pipeline using Dataiku',
    org: 'Coursera',
    year: '2024',
  },
  {
    title: 'Overview of Data Visualization',
    org: 'Coursera',
    year: '2024',
  },
];
