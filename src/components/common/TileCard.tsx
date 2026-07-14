import type { LucideIcon } from "lucide-react";
import { CardMenu } from "./CardMenu";

interface TileCardProps {
  title: string;
  value: string;
  unit?: string;
  remarks?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  cardId?: string;
  module?: "central-dashboard" | "procurement" | "accounting" | "hris";
  customMenu?: React.ReactNode;
  onClick?: () => void;
  hasLeftAccent?: boolean;
  alignUnit?: "inline" | "below";
  hideIcon?: boolean;
}

export function TileCard({
  title,
  value,
  unit,
  remarks,
  icon: Icon,
  iconBgColor = "bg-green-100",
  iconColor = "text-green-600",
  cardId,
  module,
  customMenu,
  onClick,
  hasLeftAccent = false,
  alignUnit = "below",
  hideIcon = false,
}: Readonly<TileCardProps>) { 
  const showMenu = customMenu || (cardId && module);

  const content = (
    <div className="flex flex-col h-full">
      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-50 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-80 pointer-events-none z-0" />

      {/* Main content area — vertically centered */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Header with title and menu */}
        <div className="relative z-10 flex items-start justify-between gap-2 px-4 sm:px-5 pt-4 sm:pt-5 pb-1 sm:pb-2">
          <span className="flex-1 min-w-0 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-slate-500 line-clamp-2">
            {title}
          </span>

          {showMenu && (
            <span className="flex-shrink-0 -mt-1">
              {customMenu || (
                <CardMenu
                  cardId={cardId!}
                  cardType="tile"
                  cardData={{
                    title,
                    value,
                    unit,
                    remarks,
                    icon: Icon.name,
                    iconBgColor,
                    iconColor,
                  }}
                />
              )}
            </span>
          )}
        </div>

        {/* Content with icon and value */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 px-4 sm:px-5 pb-4 sm:pb-5">
          {!hideIcon && (
            <div
              className={`flex-shrink-0 flex items-center justify-center rounded-xl sm:rounded-xl p-3 sm:p-3.5 ${iconBgColor} shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
            >
              <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconColor}`} />
            </div>
          )}

          {/* Value + Unit */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {alignUnit === "inline" ? (
              <div className="flex items-baseline gap-1.5">
                <span className="block text-lg sm:text-2xl font-bold tracking-tight text-slate-800 leading-none break-words">
                  {value}
                </span>
                {unit && (
                  <span className="block text-xs sm:text-sm font-semibold mt-1 leading-none text-slate-500">
                    {unit}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <span className="block text-lg sm:text-2xl font-bold tracking-tight text-slate-800 leading-none break-words">
                  {value}
                </span>
                {unit && (
                  <span className="block text-xs sm:text-sm font-semibold mt-1.5 text-slate-500">
                    {unit}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remarks footer — pinned to bottom */}
      {remarks && (
        <div className="relative z-10 border-t border-slate-100/80 bg-slate-50/50 px-4 sm:px-5 py-2.5 sm:py-3 transition-colors duration-300 group-hover:bg-slate-50 mt-auto text-slate-500/90">
          <p className="text-[11px] sm:text-xs font-medium leading-relaxed">
            {remarks}
          </p>
        </div>
      )}
    </div>
  );

  const baseClasses = `relative overflow-hidden rounded-xl border bg-white border-slate-200/60 w-full h-full flex flex-col transition-all duration-300 ${
    hasLeftAccent ? "border-l-4 border-l-red-600" : ""
  }`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group text-left`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`${baseClasses} group hover:shadow-md`}>{content}</div>
  );
}