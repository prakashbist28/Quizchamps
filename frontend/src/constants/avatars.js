export const DEFAULT_AVATARS = [
  { id: 'avatar_1', gradient: 'from-violet-500 to-indigo-600',  name: 'Violet'  },
  { id: 'avatar_2', gradient: 'from-rose-500 to-pink-600',      name: 'Rose'    },
  { id: 'avatar_3', gradient: 'from-amber-400 to-orange-500',   name: 'Amber'   },
  { id: 'avatar_4', gradient: 'from-emerald-400 to-teal-500',   name: 'Emerald' },
  { id: 'avatar_5', gradient: 'from-sky-400 to-blue-600',       name: 'Sky'     },
  { id: 'avatar_6', gradient: 'from-fuchsia-500 to-purple-600', name: 'Fuchsia' },
];

export const getDefaultAvatar = (id) =>
  DEFAULT_AVATARS.find((a) => a.id === id) ?? DEFAULT_AVATARS[0];
