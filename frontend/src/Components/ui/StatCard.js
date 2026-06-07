const StatCard = ({ icon: Icon, label, value, sub, accent }) => (
  <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md dark:hover:shadow-blue-500/20 transition duration-300">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>
      <Icon className="size-5 text-white" />
    </div>
    <div>
      <p className={`font-thirteen font-bold text-3xl ${value === '—' ? 'text-gray-400' : 'text-gray-800 dark:text-white'}`}>
        {value}
      </p>
      <p className="font-nine text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && (
        <p className="font-nine text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate" title={typeof sub === 'string' ? sub : undefined}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

export default StatCard;
