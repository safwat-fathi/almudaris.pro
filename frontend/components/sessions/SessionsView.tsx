"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SessionsHeader from "./SessionsHeader";
import SessionsList from "./SessionsList";
import { NewSessionBottomSheet } from "./NewSessionBottomSheet";
import { Group } from "@/services/api/groups";
import { Student } from "@/services/api/teachers";

interface SessionsViewProps {
  groups: Group[];
  students: Student[];
}

export default function SessionsView({ groups, students }: SessionsViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsNewSheetOpen(true);
      // Clean up the URL to remove the parameter without reloading
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return (
    <>
      <SessionsHeader onNewSession={() => setIsNewSheetOpen(true)} />
      <SessionsList groups={groups} students={students} />
      <NewSessionBottomSheet
        isOpen={isNewSheetOpen}
        onClose={() => setIsNewSheetOpen(false)}
        students={students}
      />
    </>
  );
}
