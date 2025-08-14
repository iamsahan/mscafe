import React from 'react';

const AdminMainContent = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6">
        {children}
      </div>
    </main>
  );
};

export default AdminMainContent;
