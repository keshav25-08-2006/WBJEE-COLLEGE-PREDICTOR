function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>
            <strong className="text-slate-500 dark:text-slate-400">
              Disclaimer:
            </strong>{' '}
            This tool uses previous year cutoff data for prediction purposes
            only. Actual cutoffs may vary. Always refer to the official WBJEE
            counselling website for accurate information.
          </p>
          <p>
            © {new Date().getFullYear()} WBJEE College Predictor. Built with
            React + Vite.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
