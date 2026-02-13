import { cn } from "@/lib/utils";
import Link from "next/link";

export const BentoGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return <div className={cn("grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ", className)}>{children}</div>;
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  href,
  category,
  author,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  category?: string;
  author?: string;
}) => {
  // Logic: Kalau ada href, jadi Link. Kalau gak, jadi div biasa.
  const Component = href ? Link : "div";

  return (
    <Component
      href={href || ""}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {/* Header Kecil: Icon & Kategori */}
        <div className="flex items-center justify-between mb-2">
          {icon}
          {category && <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-full dark:bg-violet-900/30 dark:text-violet-300">{category}</span>}
        </div>

        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2 line-clamp-1">{title}</div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 line-clamp-2">{description}</div>

        {/* Footer Kecil: Author */}
        {author && <div className="mt-4 text-xs text-neutral-400 font-medium">Oleh: {author}</div>}
      </div>
    </Component>
  );
};
