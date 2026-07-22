export type DonorEngagement = 'High' | 'Medium' | 'Developing';
export type DonorStatus = 'Active' | 'Cultivation' | 'Stewardship' | 'Lapsed';

export interface DonorHistoryEvent {
  id: string;
  date: string;
  type: 'Meeting' | 'Gift' | 'Email' | 'Note' | 'Assignment';
  title: string;
  description: string;
}

export interface DonorGivingHistoryPoint {
  year: string;
  amount: number;
}

export interface DonorRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  relationshipManager: string;
  engagement: DonorEngagement;
  status: DonorStatus;
  lastContact: string;
  lastGift: number;
  lifetimeGiving: number;
  preferredChannel: 'Email' | 'Phone' | 'In person';
  tags: string[];
  interests: string[];
  nextAction: string;
  relationshipStage: string;
  givingHistory: DonorGivingHistoryPoint[];
  history: DonorHistoryEvent[];
}

export const DONOR_DIRECTORY_ORGANIZATION = 'Northstar Foundation';
export const DONOR_DIRECTORY_TOTAL_RECORDS = 2486;

type DonorSeed = [
  id: string,
  name: string,
  location: string,
  relationshipManager: string,
  engagement: DonorEngagement,
  status: DonorStatus,
  lastContact: string,
  lastGift: number,
  lifetimeGiving: number,
  relationshipStage: string,
];

const donorSeeds: DonorSeed[] = [
  ['amara-lewis', 'Amara Lewis', 'Boston, MA', 'Maya Bennett', 'High', 'Cultivation', 'Jun 18, 2026', 2500, 24850, 'Leadership Prospect'],
  ['julian-mercer', 'Julian Mercer', 'Portland, ME', 'Jordan Blake', 'Medium', 'Active', 'Jun 16, 2026', 1000, 12400, 'Active Donor'],
  ['elena-rivera', 'Elena Rivera', 'Providence, RI', 'Maya Bennett', 'High', 'Stewardship', 'Jun 14, 2026', 5000, 42600, 'Leadership Donor'],
  ['marcus-chen', 'Marcus Chen', 'Cambridge, MA', 'Theo Walker', 'Developing', 'Cultivation', 'Jun 12, 2026', 500, 3850, 'New Prospect'],
  ['priya-shah', 'Priya Shah', 'New York, NY', 'Maya Bennett', 'High', 'Active', 'Jun 10, 2026', 3500, 31200, 'Active Donor'],
  ['daniel-brooks', 'Daniel Brooks', 'Hartford, CT', 'Jordan Blake', 'Medium', 'Stewardship', 'Jun 8, 2026', 750, 9800, 'Stewardship'],
  ['sofia-martinez', 'Sofia Martinez', 'Boston, MA', 'Maya Bennett', 'High', 'Cultivation', 'Jun 6, 2026', 1500, 18400, 'Leadership Prospect'],
  ['cameron-reed', 'Cameron Reed', 'Burlington, VT', 'Theo Walker', 'Developing', 'Active', 'Jun 5, 2026', 250, 2200, 'Active Donor'],
  ['naomi-carter', 'Naomi Carter', 'Albany, NY', 'Jordan Blake', 'Medium', 'Cultivation', 'Jun 3, 2026', 900, 7600, 'Growing Relationship'],
  ['ethan-walker', 'Ethan Walker', 'Worcester, MA', 'Maya Bennett', 'High', 'Active', 'Jun 1, 2026', 2200, 27600, 'Leadership Donor'],
  ['lena-foster', 'Lena Foster', 'Portsmouth, NH', 'Theo Walker', 'Medium', 'Stewardship', 'May 30, 2026', 600, 8400, 'Stewardship'],
  ['adrian-cole', 'Adrian Cole', 'Brooklyn, NY', 'Jordan Blake', 'Developing', 'Lapsed', 'May 28, 2026', 150, 1800, 'Re-engagement'],
  ['maya-bennett', 'Maya Bennett', 'Boston, MA', 'Jordan Blake', 'High', 'Active', 'May 26, 2026', 4000, 35800, 'Leadership Donor'],
  ['jordan-blake', 'Jordan Blake', 'New Haven, CT', 'Theo Walker', 'Medium', 'Cultivation', 'May 24, 2026', 800, 6900, 'Growing Relationship'],
  ['theo-walker', 'Theo Walker', 'Salem, MA', 'Maya Bennett', 'Developing', 'Active', 'May 22, 2026', 300, 2700, 'New Donor'],
  ['isabel-moreno', 'Isabel Moreno', 'Queens, NY', 'Jordan Blake', 'High', 'Stewardship', 'May 20, 2026', 2800, 29100, 'Leadership Donor'],
  ['lucia-martinez', 'Lucia Martinez', 'Providence, RI', 'Maya Bennett', 'Medium', 'Active', 'May 18, 2026', 1200, 11500, 'Active Donor'],
  ['mateo-martinez', 'Mateo Martinez', 'Hartford, CT', 'Theo Walker', 'High', 'Cultivation', 'May 16, 2026', 1800, 16750, 'Leadership Prospect'],
  ['olivia-grant', 'Olivia Grant', 'Boston, MA', 'Maya Bennett', 'Medium', 'Active', 'May 14, 2026', 650, 7900, 'Active Donor'],
  ['noah-patel', 'Noah Patel', 'Cambridge, MA', 'Jordan Blake', 'High', 'Cultivation', 'May 12, 2026', 3200, 33700, 'Leadership Prospect'],
  ['ava-thompson', 'Ava Thompson', 'Portland, ME', 'Theo Walker', 'Developing', 'Stewardship', 'May 10, 2026', 400, 4600, 'Stewardship'],
  ['liam-robinson', 'Liam Robinson', 'Albany, NY', 'Jordan Blake', 'Medium', 'Active', 'May 8, 2026', 950, 10200, 'Active Donor'],
  ['grace-kim', 'Grace Kim', 'New York, NY', 'Maya Bennett', 'High', 'Cultivation', 'May 6, 2026', 4500, 38900, 'Leadership Prospect'],
  ['henry-davis', 'Henry Davis', 'Burlington, VT', 'Theo Walker', 'Developing', 'Lapsed', 'May 4, 2026', 200, 2400, 'Re-engagement'],
  ['zoe-williams', 'Zoe Williams', 'Worcester, MA', 'Jordan Blake', 'Medium', 'Stewardship', 'May 2, 2026', 700, 8800, 'Stewardship'],
  ['leo-anderson', 'Leo Anderson', 'Portsmouth, NH', 'Maya Bennett', 'High', 'Active', 'Apr 30, 2026', 2600, 25400, 'Leadership Donor'],
  ['mia-johnson', 'Mia Johnson', 'Brooklyn, NY', 'Theo Walker', 'Medium', 'Cultivation', 'Apr 28, 2026', 850, 7200, 'Growing Relationship'],
  ['owen-clark', 'Owen Clark', 'New Haven, CT', 'Jordan Blake', 'Developing', 'Active', 'Apr 26, 2026', 350, 3100, 'New Donor'],
  ['nora-scott', 'Nora Scott', 'Salem, MA', 'Maya Bennett', 'High', 'Stewardship', 'Apr 24, 2026', 3100, 29800, 'Leadership Donor'],
  ['samuel-lee', 'Samuel Lee', 'Queens, NY', 'Theo Walker', 'Medium', 'Active', 'Apr 22, 2026', 1100, 11800, 'Active Donor'],
];

const amaraHistory: DonorHistoryEvent[] = [
  {
    id: 'amara-meeting-jun-18',
    date: 'Jun 18, 2026',
    type: 'Meeting',
    title: 'Meeting recorded',
    description: 'Discussed scholarship initiatives and fall campaign priorities.',
  },
  {
    id: 'amara-gift-may-29',
    date: 'May 29, 2026',
    type: 'Gift',
    title: 'Gift received',
    description: '$2,500 contributed to the Student Opportunity Fund.',
  },
  {
    id: 'amara-email-may-14',
    date: 'May 14, 2026',
    type: 'Email',
    title: 'Email opened',
    description: 'Viewed the Spring Impact Update.',
  },
  {
    id: 'amara-note-apr-22',
    date: 'Apr 22, 2026',
    type: 'Note',
    title: 'Note added',
    description: 'Interested in supporting first-generation student programs.',
  },
  {
    id: 'amara-assignment-mar-12',
    date: 'Mar 12, 2026',
    type: 'Assignment',
    title: 'Relationship manager assigned',
    description: 'Maya Bennett became the primary relationship manager.',
  },
];

const slugEmail = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/(^\.|\.$)/g, '')}@example.org`;

const buildGivingHistory = (lifetimeGiving: number, lastGift: number): DonorGivingHistoryPoint[] => {
  const earlierGiving = Math.max(lifetimeGiving - lastGift, 0);

  return [
    { year: '2022', amount: Math.round(earlierGiving * 0.12) },
    { year: '2023', amount: Math.round(earlierGiving * 0.18) },
    { year: '2024', amount: Math.round(earlierGiving * 0.24) },
    { year: '2025', amount: Math.round(earlierGiving * 0.32) },
    { year: '2026', amount: lastGift },
  ];
};

const amaraGivingHistory: DonorGivingHistoryPoint[] = [
  { year: '2022', amount: 1800 },
  { year: '2023', amount: 3200 },
  { year: '2024', amount: 4600 },
  { year: '2025', amount: 7400 },
  { year: '2026', amount: 2500 },
];

export const donorDirectoryRecords: DonorRecord[] = donorSeeds.map((seed, index) => {
  const [
    id,
    name,
    location,
    relationshipManager,
    engagement,
    status,
    lastContact,
    lastGift,
    lifetimeGiving,
    relationshipStage,
  ] = seed;

  return {
    id,
    name,
    email: slugEmail(name),
    phone: `(555) 010-${String(1842 + index).padStart(4, '0')}`,
    location,
    relationshipManager,
    engagement,
    status,
    lastContact,
    lastGift,
    lifetimeGiving,
    preferredChannel: index % 3 === 0 ? 'In person' : index % 2 === 0 ? 'Phone' : 'Email',
    tags: engagement === 'High' ? ['Leadership', 'Campaign engaged'] : ['Annual giving'],
    interests:
      id === 'amara-lewis'
        ? ['Student opportunity', 'First-generation programs']
        : engagement === 'High'
          ? ['Education access', 'Community programs']
          : ['Annual fund'],
    nextAction:
      id === 'amara-lewis'
        ? 'Request a personalized first draft based on recent engagement and giving history.'
        : 'Review recent activity and plan the next personal outreach.',
    relationshipStage,
    givingHistory: id === 'amara-lewis' ? amaraGivingHistory : buildGivingHistory(lifetimeGiving, lastGift),
    history:
      id === 'amara-lewis'
        ? amaraHistory
        : [
            {
              id: `${id}-contact`,
              date: lastContact,
              type: 'Email',
              title: 'Outreach recorded',
              description: 'Recent donor communication was added to the relationship history.',
            },
            {
              id: `${id}-gift`,
              date: 'Apr 12, 2026',
              type: 'Gift',
              title: 'Gift received',
              description: `$${lastGift.toLocaleString()} contributed to a Northstar Foundation initiative.`,
            },
          ],
  };
});

export const getDemoDonor = (donorId = 'amara-lewis') =>
  donorDirectoryRecords.find((record) => record.id === donorId) ?? donorDirectoryRecords[0];
