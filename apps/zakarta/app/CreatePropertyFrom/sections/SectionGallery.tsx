import { Camera } from "lucide-react";

import { SectionCard } from "../formComponents/SectionCard";
import type { SectionStatus } from "../schema";

interface SectionGalleryProps {
  number: number;
  status: SectionStatus;
  onExpand: () => void;
  onSave: () => void;
  isSell: boolean;
}

export function SectionGallery({
  number,
  status,
  onExpand,
  onSave,
  isSell,
}: SectionGalleryProps) {
  return (
    <SectionCard
      number={number}
      title="Gallery"
      icon={<Camera className="h-4 w-4 text-emerald-500" />}
      status={status}
      onExpand={onExpand}
      onSave={onSave}
    >
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
        <Camera className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm font-medium text-muted-foreground">Photo upload coming soon</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Up to {isSell ? 6 : 5} photos · At least 1 required at launch
        </p>
        <p className="mt-2 text-xs text-muted-foreground/60">
          Photos will be stored securely. Integration with R2 storage is in progress.
        </p>
      </div>
    </SectionCard>
  );
}