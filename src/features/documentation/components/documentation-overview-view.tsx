import { documentationFiles } from "@/features/documentation/data/documentation";
import { DamageImageAnalysisLauncher } from "@/features/documentation/components/damage-image-analysis-modal";
import { FileGalleryGrid } from "@/features/documentation/components/file-gallery-grid";

const visionReady = documentationFiles.filter((f) => f.visionAnalysis.applicable).length;

const STAT_ITEMS = [
  { label: "Verified", value: documentationFiles.filter((f) => f.status === "Verified").length.toString(), color: "#059669" },
  { label: "Pending Review", value: documentationFiles.filter((f) => f.status === "Pending Review").length.toString(), color: "#d97706" },
  { label: "Total Files", value: documentationFiles.length.toString(), color: "#145d66" },
  { label: "Vision analyzed", value: visionReady.toString(), color: "#1e293b", hint: "Raster images with CV snapshot" },
];

export function DocumentationOverviewView() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Documentation
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-slate-500 dark:text-stone-400">
              Image library only (PNG/JPEG in production). Each record can include a stored vision analysis snapshot. Use{" "}
              <span className="font-medium text-slate-700 dark:text-stone-300">Upload Image</span> for live simulated inference.
            </p>
          </div>
          <DamageImageAnalysisLauncher />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {STAT_ITEMS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-sm sm:rounded-[24px] sm:px-5 sm:py-5 dark:border-white/10 dark:bg-[#171815]"
            >
              <p className="text-sm font-medium text-slate-500 dark:text-stone-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:mt-4 sm:text-5xl dark:text-stone-100">
                {stat.value}
              </p>
              {"hint" in stat && stat.hint ? (
                <p className="mt-2 text-xs text-slate-400 dark:text-stone-500">{stat.hint}</p>
              ) : null}
              <div className="mt-3 h-1.5 w-12 rounded-full sm:mt-4" style={{ backgroundColor: stat.color, opacity: 0.5 }} />
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8">
          <FileGalleryGrid files={documentationFiles} />
        </div>
      </div>
    </div>
  );
}
