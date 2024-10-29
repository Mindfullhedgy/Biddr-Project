"use client";

import { useState } from "react";
import { searchOpportunities } from "@/lib/api/sam-service";
import { toast } from "sonner";
import AdminSettings from "@/components/admin-settings";
import Header from "@/components/header";

export default function Home() {
  const [postedFrom, setPostedFrom] = useState<Date>();
  const [postedTo, setPostedTo] = useState<Date>();
  const [deadlineFrom, setDeadlineFrom] = useState<Date>();
  const [deadlineTo, setDeadlineTo] = useState<Date>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const validateDateRange = (from?: Date, to?: Date) => {
    if (from && to && from > to) {
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    if (!postedFrom && !postedTo && !deadlineFrom && !deadlineTo) {
      toast.error('Please select at least one date filter');
      return;
    }

    if (!validateDateRange(postedFrom, postedTo)) {
      toast.error('Posted From date must be before Posted To date');
      return;
    }

    if (!validateDateRange(deadlineFrom, deadlineTo)) {
      toast.error('Deadline From date must be before Deadline To date');
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchOpportunities({
        postedFrom,
        postedTo,
        deadlineFrom,
        deadlineTo
      });
      
      if (result.totalRecords === 0) {
        toast.info('No opportunities found for the selected criteria');
      } else {
        toast.success(`Found ${result.totalRecords} opportunities`);
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch opportunities');
    } finally {
      setIsLoading(false);
      setIsFilterOpen(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header 
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showProjects ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Projects Available</h2>
            <p className="text-slate-600">
              Use the admin settings to fetch new projects from SAM.gov
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Saved Jobs</h2>
            <p className="text-slate-600">
              Your saved jobs will appear here
            </p>
          </div>
        )}
      </div>

      <AdminSettings 
        open={isAdminOpen}
        onOpenChange={setIsAdminOpen}
        onSearch={handleSearch}
        isLoading={isLoading}
        postedFrom={postedFrom}
        postedTo={postedTo}
        deadlineFrom={deadlineFrom}
        deadlineTo={deadlineTo}
        setPostedFrom={setPostedFrom}
        setPostedTo={setPostedTo}
        setDeadlineFrom={setDeadlineFrom}
        setDeadlineTo={setDeadlineTo}
      />
    </main>
  );
}