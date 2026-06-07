import HashLoader from 'react-spinners/HashLoader';

const PageLoader = ({ message = 'Loading…', submessage }) => (
  <div className="flex flex-col gap-6 w-full min-h-screen items-center justify-center text-center px-4">
    <HashLoader size={100} color="#2563eb" />
    <div>
      <p className="font-ten text-lg md:text-2xl font-bold text-blue-400">{message}</p>
      {submessage && (
        <p className="font-nine text-sm text-slate-500 dark:text-slate-400 mt-1">{submessage}</p>
      )}
    </div>
  </div>
);

export default PageLoader;
