export const CATEGORIES = [
  'Coding',
  'Science',
  'History',
  'Geography',
  'Nature',
  'Sports',
  'Entertainment',
  'Business & Finance',
  'Language & Literature',
  'General Knowledge',
  'Other',
];

export const TAGS_BY_CATEGORY = {
  Coding: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Java', 'Python', 'AI', 'Machine Learning', 'Databases', 'Algorithms', 'Other'],
  Science: ['Physics', 'Chemistry', 'Biology', 'Astronomy', 'Environment', 'Other'],
  History: ['Ancient History', 'World War II', 'Medieval', 'Modern History', 'American History', 'Other'],
  Geography: ['World Capitals', 'Countries', 'Oceans & Seas', 'Mountains', 'Rivers', 'Other'],
  Nature: ['Animals', 'Plants', 'Weather', 'Ecosystems', 'Oceans', 'Other'],
  Sports: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Olympics', 'Other'],
  Entertainment: ['Movies', 'Music', 'TV Shows', 'Celebrities', 'Video Games', 'Other'],
  'Business & Finance': ['Economics', 'Marketing', 'Investing', 'Entrepreneurship', 'Accounting', 'Other'],
  'Language & Literature': ['Grammar', 'Vocabulary', 'Classic Literature', 'Poetry', 'World Languages', 'Other'],
  'General Knowledge': ['Mixed', 'Trivia', 'Fun Facts', 'Other'],
  Other: [],
};

export const displayCategory = (quiz) => {
  if (!quiz) return 'General Knowledge';
  if (quiz.category === 'Other' && quiz.customCategory) return quiz.customCategory;
  return quiz.category || 'General Knowledge';
};
