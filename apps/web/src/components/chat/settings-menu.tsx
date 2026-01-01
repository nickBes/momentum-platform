"use client";

import { Settings } from "lucide-react";
import { useCallback, type Key } from "react";
import { useAsyncList } from "react-stately";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { ComboBox, ComboBoxItem } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { useDatasets } from "@/contexts/dataset-context";
import { orpc } from "@/utils/orpc";
import type { Dataset } from "@momentum/schemas/ai";

export function SettingsMenu() {
  const { selectedDatasets, addDataset, removeDataset } = useDatasets();

  const list = useAsyncList<Dataset>({
    load: async ({ signal, filterText }) => {
      const results = await orpc.searchDatasets.call({ query: filterText ?? "" }, { signal });
      // Filter out already selected datasets
      return {
        items: results.filter((r) => !selectedDatasets.some((d) => d.id === r.id)),
      };
    },
  });

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      if (key) {
        const item = list.items.find((i) => i.id === key);
        if (item) {
          addDataset(item);
          list.setFilterText("");
        }
      }
    },
    [list, addDataset],
  );

  return (
    <PopoverTrigger>
      <Button variant="ghost" size="icon">
        <Settings className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Settings</span>
      </Button>
      <Popover placement="bottom end">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Chat Settings</h3>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Datasets</label>
            <ComboBox
              items={list.items}
              inputValue={list.filterText}
              onInputChange={list.setFilterText}
              onSelectionChange={handleSelectionChange}
              placeholder="Search datasets..."
              isLoading={list.isLoading}
              emptyMessage="No datasets found"
              menuTrigger="focus"
              allowsEmptyCollection
            >
              {(item) => <ComboBoxItem id={item.id}>{item.name}</ComboBoxItem>}
            </ComboBox>

            {selectedDatasets.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {selectedDatasets.map((dataset) => (
                  <Badge
                    key={dataset.id}
                    color="primary"
                    variant="soft"
                    size="sm"
                    onRemove={() => removeDataset(dataset.id)}
                  >
                    {dataset.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </Popover>
    </PopoverTrigger>
  );
}
