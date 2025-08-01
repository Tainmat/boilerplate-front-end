import { removeEmptyEntries } from "@/shared/utils/generic";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

export interface IUserDropdown {
  id: string;
  name: string;
}

export function useUsersDropdown() {
  const [result, setResult] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setResult([]);

      const queryParams = removeEmptyEntries({
        isActive: true,
      });

      const { data } = await get<{ data: IUserDropdown[] }>(
        "parametrizations/profile-management/users/dropdown",
        queryParams,
      );

      if (Array.isArray(data.data) && data.data.length > 0) {
        const users = data.data.map((item: IUserDropdown) => ({
          value: item.id,
          label: item.name,
        }));

        setResult(users);
      } else {
        setResult([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setResult([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { result, loading, refetch: fetchData };
}
