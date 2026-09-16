import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-16 px-4 text-center min-h-[calc(100vh-200px)]">
      <div className="bg-rose-50 text-rose-600 p-4 rounded-full border border-rose-200 mb-6">
        <ShieldAlert size={48} />
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-8 text-sm">
        The workspace path you are trying to access does not exist or has been moved. Please verify the URL or return to safety.
      </p>

      <Link to="/">
        <Button variant="primary">
          Return to Portal Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
