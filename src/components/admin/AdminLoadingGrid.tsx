import React from 'react';

interface AdminLoadingGridProps {
  count?: number;
  height?: string;
}

const AdminLoadingGrid = ({ count = 6, height = 'h-64' }: AdminLoadingGridProps) => (
  <>
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className={`bg-white rounded-[40px] ${height} animate-pulse border border-gray-100 shadow-lg`} />
    ))}
  </>
);

export default AdminLoadingGrid;
