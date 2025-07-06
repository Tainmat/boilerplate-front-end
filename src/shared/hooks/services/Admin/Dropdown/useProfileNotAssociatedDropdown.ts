import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { fakeRequest } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

export function useProfileNotAssociatedDropdown() {
  const [uuidUser, setUuidUser] = useState<string>("");
  const [result, setResult] = useState<IOption[]>([]);

  const fetchData = useCallback(async (uuidUser: string) => {
    try {
      // Mock data for available profiles
      const mockProfiles = [
        { value: "perf-1111", label: "Administrador" },
        { value: "perf-2222", label: "Inspetor" },
        { value: "perf-3333", label: "Cliente" },
      ];

      await fakeRequest(500);
      
      setResult(mockProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setResult([]);
    }
  }, []);

  useEffect(() => {
    if (uuidUser) {
      fetchData(uuidUser);
    }
  }, [uuidUser, fetchData]);

  return { result, setUuidUser };
}