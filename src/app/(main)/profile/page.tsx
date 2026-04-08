"use client";

import { useState, useEffect } from "react";
import { useApp } from "../../../lib/context/AppContext";
import { recordService } from "../../../lib/services/record-service";
import type { DrinkRecord } from "../../../lib/types";
import TasteRadar from "../../../components/profile/TasteRadar";
import TasteInsights from "../../../components/profile/TasteInsights";
import ProgressBar from "../../../components/ui/ProgressBar";
import StarRating from "../../../components/ui/StarRating";
import Button from "../../../components/ui/Button";
import ShareCard from "../../../components/share/ShareCard";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout, refreshUser } = useApp();
  const router = useRouter();
  const [records, setRecords] = useState<DrinkRecord[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      await refreshUser();
      const recs = await recordService.getAll();
      setRecords(recs);
      setLoading(false);
    }
    load();
  }, [refreshUser]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-5xl animate-pulse">🍸</div>
      </div>
    );
  }

  const hasProfile = user.unlockedFeatures.includes("taste_profile");
  const hasInsights = user.unlockedFeatures.includes("taste_insights");

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-text-muted text-sm">
            已記錄 {user.recordCount} 杯調酒
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-text-muted text-sm hover:text-danger"
        >
          登出
        </button>
      </div>

      {/* Progress */}
      <div className="bg-bg-card rounded-2xl p-4">
        <ProgressBar
          current={user.recordCount}
          milestones={[1, 5, 10, 25, 50]}
          label="記錄進度"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { count: 1, label: "口味圖譜", feature: "taste_profile" },
            { count: 5, label: "口味洞察", feature: "taste_insights" },
            { count: 10, label: "探索推薦", feature: "explore_recommendations" },
            { count: 25, label: "完整報告", feature: "full_report" },
            { count: 50, label: "調酒師卡片", feature: "bartender_card" },
          ].map((m) => (
            <span
              key={m.feature}
              className={`text-xs px-2 py-1 rounded-full ${
                user.unlockedFeatures.includes(m.feature)
                  ? "bg-accent/20 text-accent"
                  : "bg-bg-input text-text-muted"
              }`}
            >
              {m.count}筆 {m.label} {user.unlockedFeatures.includes(m.feature) ? "✓" : "🔒"}
            </span>
          ))}
        </div>
      </div>

      {/* Taste Radar */}
      {hasProfile && (
        <div className="bg-bg-card rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">口味圖譜</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareModal(true)}
            >
              分享
            </Button>
          </div>
          <TasteRadar vector={user.tasteVector} />
        </div>
      )}

      {/* Taste Insights */}
      {hasInsights && (
        <TasteInsights vector={user.tasteVector} recordCount={user.recordCount} />
      )}

      {/* Records List */}
      {records.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">所有記錄</h3>
          <div className="space-y-2">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{record.cocktailName || "未知調酒"}</p>
                    {record.barName && (
                      <p className="text-text-muted text-sm">{record.barName}</p>
                    )}
                    <p className="text-text-muted text-xs mt-1">
                      {new Date(record.recordedAt).toLocaleDateString("zh-TW")}
                    </p>
                    {record.flavorTags && record.flavorTags.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {record.flavorTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 bg-bg-input rounded-full text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <StarRating
                    value={record.overallRating}
                    onChange={() => {}}
                    readonly
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareCard
          type="taste_profile"
          user={user}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
