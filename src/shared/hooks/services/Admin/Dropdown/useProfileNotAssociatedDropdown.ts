import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { get } from "@shared/services/api/api.service";
import { useEffect, useState } from "react";

import { removeEmptyEntries } from "@/shared/utils/generic";

export interface IProfiles {
  id: string;
  name: string;
}

export function useProfileNotAssociatedDropdown() {
  const [result, setResult] = useState<IOption[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setResult([]);

        const queryParams = removeEmptyEntries({
          isActive: true,
        });

        const { data } = await get(
          `${"parametrizations/profile-management/profiles/dropdown"}`,
          queryParams,
        );

        if (Array.isArray(data.data) && data.data.length > 0) {
          const profiles = data.data.map((item: IProfiles) => ({
            value: item.id,
            label: item.name,
          }));

          setResult(profiles);
        } else {
          setResult([]);
        }
      } catch {
        setResult([]);
      }
    }

    fetchData();
  }, []);

  return { result };
}
