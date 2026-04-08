"use client";

import { useState, useEffect } from "react";
import { useApp } from "../../../lib/context/AppContext";
import { recordService } from "../../../lib/services/record-service";
import { cocktailService } from "../../../lib/services/cocktail-service";
import { getComfortRecommendations } from "../../../lib/recommendation/engine";
import type { Cocktail, DrinkRecord } from "../../../lib/types";
import ProgressBar from "../../../components/ui/ProgressBar";
import StarRating from "../../../components/ui/StarRating";
import Button from "../../../components/ui/Button";
import TasteBars from "../../../components/ui/TasteBars";
import ShareCard from "../../../components/share/ShareCard";
import { getCocktailDescription, getBaseDescription } from "../../../lib/utils/cocktail-desc";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user } = useApp();
  const router = useRouter();
  const [records, setRecords] = useState<DrinkRecord[]>([]);
  const [recommendations, setRecommendations] = useState<{ cocktail: Cocktail; similarity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareRecord, setShareRecord] = useState<DrinkRecord | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const recs = await recordService.getAll();
      setRecords(recs);

      const cocktails = await cocktailService.getAll();
      const recordedIds = recs.map((r) => r.cocktailId);
      const reco = getComfortRecommendations(user.tasteVector, cocktails, recordedIds);
      setRecommendations(reco);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="px-4 py-6 space-y-4">
        <div className="h-8 w-32 bg-bg-card rounded-lg animate-pulse" />
        <div className="h-20 bg-bg-card rounded-2xl animate-pulse" />
        <div className="h-14 bg-bg-card rounded-xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-bg-card rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-safe-top py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-text-muted text-sm">歡迎回來</p>
          <h1 className="text-2xl font-bold">{user.username}</h1>
        </div>
        <span className="text-3xl">🍸</span>
      </div>

      {/* Progress */}
      <div className="bg-bg-card rounded-2xl p-4">
        <ProgressBar
          current={user.recordCount}
          milestones={[1, 5, 10, 25, 50]}
          label="記錄進度"
        />
      </div>

      {/* Quick Record Button */}
      <Button fullWidth size="lg" onClick={() => router.push("/record")}>
        + 記錄一杯調酒
      </Button>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">推薦給你</h2>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <button
                key={rec.cocktail.id}
                onClick={() => router.push(`/record?cocktailId=${rec.cocktail.id}`)}
                className="w-full bg-bg-card rounded-xl p-4 text-left hover:border-accent border border-border transition-all active:scale-[0.99]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-lg">{rec.cocktail.nameZh}</p>
                    <p className="text-text-muted text-sm">{rec.cocktail.nameEn}</p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <span className="inline-block bg-accent/15 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                      {Math.round(rec.similarity * 100)}% 合口味
                    </span>
                  </div>
                </div>

                <p className="text-text-secondary text-sm mt-2">
                  {getBaseDescription(rec.cocktail.baseSpirit)} · {getCocktailDescription(rec.cocktail)}
                </p>

                <div className="flex justify-between items-end mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {rec.cocktail.flavorTags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-bg-input rounded-full text-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <TasteBars cocktail={rec.cocktail} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Records */}
      {records.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">最近記錄</h2>
            {records.length > 5 && (
              <button
                onClick={() => router.push("/profile")}
                className="text-accent text-sm"
              >
                查看全部
              </button>
            )}
          </div>
          <div className="space-y-2">
            {records.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="bg-bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{record.cocktailName || "未知調酒"}</p>
                    {record.barName && (
                      <p className="text-text-muted text-sm">@ {record.barName}</p>
                    )}
                    <p className="text-text-muted text-xs mt-1">
                      {new Date(record.recordedAt).toLocaleDateString("zh-TW")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <StarRating value={record.overallRating} onChange={() => {}} readonly size="sm" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareRecord(record);
                      }}
                      className="text-text-muted hover:text-accent text-sm transition-colors p-1"
                      title="分享"
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {records.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-lg">還沒有記錄</p>
          <p className="text-sm mt-1 mb-6">記錄你的第一杯調酒吧！</p>
          <Button onClick={() => router.push("/record")}>開始記錄</Button>
        </div>
      )}

      {/* Share Modal */}
      {shareRecord && (
        <ShareCard
          type="record"
          user={user}
          record={shareRecord}
          onClose={() => setShareRecord(null)}
        />
      )}
    </div>
  );
}
