/**
 * Heroicons adapter for the chat mock.
 * Matches Paper mappings: 24 outline for chrome, 20 solid for send/status.
 * Brand / chain / wallet logos stay outside this file.
 */
import type { ComponentType, SVGProps } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowsRightLeftIcon,
  ChartBarSquareIcon,
  ChartPieIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  CpuChipIcon,
  CubeIcon,
  DocumentTextIcon,
  HandThumbUpIcon,
  KeyIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  ShareIcon,
  ShieldCheckIcon,
  Square2StackIcon,
  Squares2X2Icon,
  SunIcon,
  ViewColumnsIcon,
  WalletIcon as HeroWalletIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowUpIcon as ArrowUpSolidIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

type HeroIcon = ComponentType<
  SVGProps<SVGSVGElement> & { title?: string; titleId?: string }
>;

function icon(Icon: HeroIcon, defaultSize = 16) {
  return function HeroAdapter({
    size = defaultSize,
    className,
    ...props
  }: IconProps) {
    return (
      <Icon
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
        {...props}
      />
    );
  };
}

export const Plus = icon(PlusIcon);
export const ChevronDown = icon(ChevronDownIcon);
export const ChevronUp = icon(ChevronUpIcon);
export const ChevronExpand = icon(ChevronUpDownIcon);
export const PanelLeft = icon(ViewColumnsIcon, 18);
export const Gear = icon(Cog6ToothIcon, 18);
export const Check = icon(CheckCircleIcon, 14);
export const ArrowUp = icon(ArrowUpSolidIcon);
export const ArrowRight = icon(ArrowRightIcon);
export const Swap = icon(ArrowsRightLeftIcon);
export const Copy = icon(Square2StackIcon);
export const Rerun = icon(ArrowPathIcon);
export const Branch = icon(ShareIcon);
export const WalletIcon = icon(HeroWalletIcon);
export const Close = icon(XMarkIcon);
export const Coins = icon(ChartPieIcon);
export const Cube = icon(CubeIcon);
export const Sun = icon(SunIcon, 17);
export const Moon = icon(MoonIcon, 17);
export const Chart = icon(ChartBarSquareIcon);
export const Key = icon(KeyIcon);
export const Bot = icon(CpuChipIcon);
export const Lock = icon(LockClosedIcon);
export const Shield = icon(ShieldCheckIcon);
export const Sliders = icon(AdjustmentsHorizontalIcon);
export const AppMark = icon(Squares2X2Icon);
export const CodeSquare = icon(CubeIcon);
export const Search = icon(MagnifyingGlassIcon);
export const Logout = icon(ArrowRightStartOnRectangleIcon);
export const Like = icon(HandThumbUpIcon);
export const Docs = icon(DocumentTextIcon);
