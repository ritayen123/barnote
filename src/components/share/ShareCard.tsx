"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { User, DrinkRecord } from "../../lib/types";
import TasteRadar from "../profile/TasteRadar";
import Button from "../ui/Button";

interface ShareCardProps {
  type: "record" | "bar" | "taste_profile";
  user: User;
  record?: DrinkRecord;
  barName?: string;
  barDrinkCount?: number;
  onClose: () => void;
}

export default function ShareCard({
  type,
  user,
  record,
  barName,
  barDrinkCount,
  onClose,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<"9:16" | "1:1">("9:16");
  const [saving, setSaving] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0f0f0f",
      });
      const link = document.createElement("a");
      link.download = `sipnote-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Share card generation failed:", err);
    }
    setSaving(false);
  };

  const cardWidth = ratio === "1:1" ? 360 : 270;
  const cardHeight = ratio === "1:1" ? 360 : 480;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary rounded-2xl p-4 max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Ratio toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={ratio === "9:16" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setRatio("9:16")}
          >
            Stories 9:16
          </Button>
          <Button
            variant={ratio === "1:1" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setRatio("1:1")}
          >
            Feed 1:1
          </Button>
        </div>

        {/* Card preview */}
        <div className="flex justify-center mb-4">
          <div
            ref={cardRef}
            style={{ width: cardWidth, height: cardHeight }}
            className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 flex flex-col justify-between text-white overflow-hidden relative"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative z-10">
              {type === "record" && record && (
                <>
                  <p className="text-accent text-xs font-medium mb-1">今晚喝了</p>
                  <h3 className="text-xl font-bold mb-1">{record.cocktailName}</h3>
                  {record.barName && (
                    <p className="text-white/60 text-sm">@ {record.barName}</p>
                  )}
                  <div className="flex mt-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`text-lg ${s <= record.overallRating ? "text-star" : "text-white/20"}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {record.flavorTags && record.flavorTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {record.flavorTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-white/10 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {type === "bar" && (
                <>
                  <p className="text-accent text-xs font-medium mb-1">今晚在</p>
                  <h3 className="text-xl font-bold mb-1">{barName}</h3>
                  <p className="text-white/60 text-sm">喝了 {barDrinkCount} 杯</p>
                </>
              )}

              {type === "taste_profile" && (
                <>
                  <p className="text-accent text-xs font-medium mb-1">我的口味圖譜</p>
                  <TasteRadar vector={user.tasteVector} size={ratio === "1:1" ? 200 : 250} />
                  <p className="text-white/60 text-sm text-center">
                    已記錄 {user.recordCount} 杯調酒
                  </p>
                </>
              )}
            </div>

            {/* Footer: Logo */}
            <div className="relative z-10 flex items-center gap-2 mt-auto pt-3">
              <span className="text-lg">🍸</span>
              <div>
                <p className="text-sm font-bold text-accent">SipNote</p>
                <p className="text-[10px] text-white/40">每一杯，都讓你更了解自己</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button fullWidth onClick={handleDownload} disabled={saving}>
            {saving ? "生成中..." : "下載圖片"}
          </Button>
          <Button fullWidth variant="ghost" onClick={onClose}>
            關閉
          </Button>
        </div>
      </div>
    </div>
  );
}
