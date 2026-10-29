// src/components/ForSaleBadge.tsx
// Floating "This site is for sale" pill shown on every page; opens a details modal.
// Contact address lives only inside the modal, so it isn't in the prerendered HTML.
import { Tag, Mail, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CONTACT_EMAIL = "hello@jpbcwebdesigns.com";
const MAIL_SUBJECT = "Inquiry: buying fengshuiandbeyond.com";

const INCLUDED = [
  "Domain: fengshuiandbeyond.com",
  "Full React/Vite codebase (prerendered, SEO-ready)",
  "Sanity CMS with all published articles",
  "Automated daily horoscope & article pipeline",
  "Tools: Kua number, wedding date planner, birth chart, zodiac compatibility & more",
];

const ForSaleBadge = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-gold/60 bg-black/80 px-4 py-2 text-sm font-semibold text-gold shadow-gold backdrop-blur transition hover:scale-105 hover:bg-black"
      >
        <Tag className="h-4 w-4" />
        This site is for sale
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-md border-gold/40 bg-gradient-to-b from-indigo-950 to-black text-white">
      <DialogHeader>
        <DialogTitle className="text-2xl text-gold">Buy Feng Shui & Beyond</DialogTitle>
        <DialogDescription className="text-gray-300">
          This website is available for purchase. Open to offers.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg border border-purple-400/30 bg-white/5 p-3">
          <div className="text-xl font-bold text-gold">~475</div>
          <div className="text-xs text-gray-400">visitors / 30 days</div>
        </div>
        <div className="rounded-lg border border-purple-400/30 bg-white/5 p-3">
          <div className="text-xl font-bold text-gold">~640</div>
          <div className="text-xs text-gray-400">page views / 30 days</div>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">What's included</h3>
        <ul className="space-y-1.5 text-sm">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}`}
        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-4 py-3 font-semibold text-black transition hover:opacity-90"
      >
        <Mail className="h-4 w-4" />
        Make an offer
      </a>
      <p className="text-center text-xs text-gray-400">{CONTACT_EMAIL}</p>
    </DialogContent>
  </Dialog>
);

export default ForSaleBadge;
