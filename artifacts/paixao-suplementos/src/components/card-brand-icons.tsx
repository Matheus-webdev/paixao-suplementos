import visa from "@assets/vi_1776754047714.webp";
import mastercard from "@assets/mc_1776754043858.webp";
import amex from "@assets/ae_1776754034767.webp";
import diners from "@assets/dn_1776754030732.webp";
import elo from "@assets/elo_1776754030733.webp";
import hipercard from "@assets/hyper_1776754030733.webp";
import pix from "@assets/pix_1776754039051.webp";

type IconProps = { className?: string };

const wrap = "inline-block h-7 w-12 object-contain";

export function VisaIcon({ className = "" }: IconProps) {
  return <img src={visa} alt="Visa" className={`${wrap} ${className}`} />;
}
export function MastercardIcon({ className = "" }: IconProps) {
  return <img src={mastercard} alt="Mastercard" className={`${wrap} ${className}`} />;
}
export function AmexIcon({ className = "" }: IconProps) {
  return <img src={amex} alt="American Express" className={`${wrap} ${className}`} />;
}
export function DinersIcon({ className = "" }: IconProps) {
  return <img src={diners} alt="Diners Club" className={`${wrap} ${className}`} />;
}
export function EloIcon({ className = "" }: IconProps) {
  return <img src={elo} alt="Elo" className={`${wrap} ${className}`} />;
}
export function HipercardIcon({ className = "" }: IconProps) {
  return <img src={hipercard} alt="Hipercard" className={`${wrap} ${className}`} />;
}
export function PixIcon({ className = "" }: IconProps) {
  return <img src={pix} alt="PIX" className={`${wrap} ${className}`} />;
}

export function NubankIcon({ className = "" }: IconProps) {
  return (
    <span className={`inline-flex items-center justify-center h-7 w-14 rounded-md bg-[#820ad1] ${className}`} title="Nubank">
      <span className="text-white font-black italic text-[11px] tracking-tight">nuPay</span>
    </span>
  );
}

export function GenericCardIcon({ className = "" }: IconProps) {
  return (
    <span className={`inline-flex items-center justify-center h-7 w-12 rounded-md bg-neutral-700 ${className}`} title="Cartão">
      <svg width="20" height="14" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="22" height="14" rx="2" stroke="white" strokeWidth="1.5" />
        <rect x="3" y="4" width="18" height="2" fill="white" />
      </svg>
    </span>
  );
}
