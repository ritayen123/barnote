"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cocktailService } from "../../../lib/services/cocktail-service";
import { recordService } from "../../../lib/services/record-service";
import { barService as barSvc } from "../../../lib/services/bar-service";
import type { Cocktail } from "../../../lib/types";
import Button from "../../../components/ui/Button";
import StarRating from "../../../components/ui/StarRating";
import SliderInput from "../../../components/ui/SliderInput";
import FlavorTagPicker from "../../../components/ui/FlavorTagPicker";
import TasteBars from "../../../components/ui/TasteBars";
import { useApp } from "../../../lib/context/AppContext";
import { getCocktailDescription, getBaseDescription } from "../../../lib/utils/cocktail-desc";

function RecordPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useApp();
  const preselectedId = searchParams.get("cocktailId");

  const [mode, setMode] = useState<"select" | "quick" | "full">("select");
  const [step, setStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Cocktail[]>([]);
  const [allCocktails, setAllCocktails] = useState<Cocktail[]>([]);

  // Record data
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [customName, setCustomName] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [acidityRating, setAcidityRating] = useState(3);
  const [sweetnessRating, setSweetnessRating] = useState(3);
  const [bitternessRating, setBitternessRating] = useState(3);
  const [saltinessRating, setSaltinessRating] = useState(3);
  const [strengthRating, setStrengthRating] = useState(3);
  const [texture, setTexture] = useState<"light" | "medium" | "heavy">("medium");
  const [temperatureFeel, setTemperatureFeel] = useState<"cool" | "neutral" | "warm">("neutral");
  const [flavorTags, setFlavorTags] = useState<string[]>([]);
  const [occasion, setOccasion] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [barName, setBarName] = useState("");
  const [barAmbiance, setBarAmbiance] = useState(3);
  const [barServiceRating, setBarServiceRating] = useState(3);
  const [barFood, setBarFood] = useState(3);

  const [saving, setSaving] = useState(false);
  const [unlocked, setUnlocked] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const all = await cocktailService.getAll();
      setAllCocktails(all);
      if (preselectedId) {
        const c = all.find((c) => c.id === preselectedId);
        if (c) {
          setSelectedCocktail(c);
          setMode("select");
        }
      }
    }
    load();
  }, [preselectedId]);

  const handleSearch = useCallback(
    (q: string) => {
      setSearchQuery(q);
      if (q.length === 0) {
        setSearchResults(allCocktails.slice(0, 20));
      } else {
        const lower = q.toLowerCase();
        setSearchResults(
          allCocktails.filter(
            (c) =>
              c.nameEn.toLowerCase().includes(lower) ||
              c.nameZh.includes(q) ||
              c.baseSpirit.toLowerCase().includes(lower)
          ).slice(0, 20)
        );
      }
    },
    [allCocktails]
  );

  useEffect(() => {
    if (allCocktails.length > 0 && searchResults.length === 0 && !searchQuery) {
      setSearchResults(allCocktails.slice(0, 20));
    }
  }, [allCocktails, searchResults.length, searchQuery]);

  const handleSave = async () => {
    if (overallRating === 0) return;
    setSaving(true);

    let barId: string | undefined;
    if (barName.trim()) {
      const bar = await barSvc.create({ name: barName.trim() });
      barId = bar.id;
      if (mode === "full") {
        await barSvc.updateStats(bar.id, barAmbiance, barServiceRating, barFood);
      }
    }

    const recordData = {
      cocktailId: selectedCocktail?.id || "custom",
      cocktailName: selectedCocktail?.nameZh || customName || "自訂調酒",
      barId,
      barName: barName.trim() || undefined,
      overallRating,
      flavorTags: mode === "full" ? flavorTags : [],
      ...(mode === "full" && {
        acidityRating,
        sweetnessRating,
        bitternessRating,
        saltinessRating,
        strengthRating,
        texture,
        temperatureFeel,
        barAmbiance: barName ? barAmbiance : undefined,
        barService: barName ? barServiceRating : undefined,
        barFood: barName ? barFood : undefined,
        occasion: occasion as "date" | "friends" | "solo" | "celebration" | "business" | undefined,
        priceRange: priceRange as "<300" | "300-500" | "500-800" | "800+" | undefined,
      }),
    };

    const { unlockedFeature } = await recordService.create(recordData);
    await refreshUser();

    if (unlockedFeature) {
      setUnlocked(unlockedFeature);
    } else {
      router.push("/home");
    }
  };

  // Unlock celebration
  if (unlocked) {
    const featureNames: Record<string, string> = {
      taste_profile: "個人口味圖譜",
      taste_insights: "口味分析洞察",
      explore_recommendations: "探索推薦",
      full_report: "完整口味報告",
      bartender_card: "調酒師卡片",
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold mb-2">解鎖新功能！</h2>
        <p className="text-accent text-lg mb-8">{featureNames[unlocked] || unlocked}</p>
        <Button onClick={() => router.push("/home")} size="lg">回到首頁</Button>
      </div>
    );
  }

  // Step: Select cocktail
  if (!selectedCocktail && !customName && mode === "select") {
    return (
      <div className="px-4 py-6 space-y-4">
        <h1 className="text-xl font-bold">記錄一杯調酒</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="搜尋調酒名稱..."
          className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {searchResults.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCocktail(c)}
              className="w-full bg-bg-card rounded-xl p-3.5 text-left border border-border hover:border-accent transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{c.nameZh}</p>
                  <p className="text-text-muted text-sm">{c.nameEn}</p>
                  <p className="text-text-muted text-xs mt-0.5">{getBaseDescription(c.baseSpirit)} · {c.category}</p>
                </div>
                <TasteBars cocktail={c} />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {c.flavorTags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-bg-input rounded-full text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="pt-2 border-t border-border">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="或手動輸入酒名..."
            className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && customName.trim()) {
                setMode("quick");
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Mode selection
  if (mode === "select" && (selectedCocktail || customName)) {
    return (
      <div className="min-h-screen flex flex-col justify-center px-6 space-y-6">
        {/* Cocktail info card */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border">
          <p className="text-text-muted text-xs mb-1">你選了</p>
          <h2 className="text-2xl font-bold">
            {selectedCocktail?.nameZh || customName}
          </h2>
          {selectedCocktail && (
            <>
              <p className="text-text-muted text-sm mt-0.5">{selectedCocktail.nameEn}</p>

              <p className="text-text-secondary text-sm mt-3">
                {getBaseDescription(selectedCocktail.baseSpirit)} · {selectedCocktail.category}
              </p>
              <p className="text-text-secondary text-sm mt-1">
                {getCocktailDescription(selectedCocktail)}
              </p>

              {/* Taste bars */}
              <div className="flex items-center gap-4 mt-4">
                <TasteBars cocktail={selectedCocktail} />
                <div className="flex-1 flex flex-wrap gap-1.5">
                  {selectedCocktail.flavorTags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-bg-input rounded-full text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-full space-y-3">
          <Button fullWidth size="lg" onClick={() => setMode("quick")}>
            ⚡ 快速記錄（30秒）
          </Button>
          <Button fullWidth size="lg" variant="secondary" onClick={() => setMode("full")}>
            📝 完整記錄（2分鐘）
          </Button>
        </div>
        <button
          onClick={() => {
            setSelectedCocktail(null);
            setCustomName("");
          }}
          className="text-text-muted text-sm hover:text-text-secondary"
        >
          ← 重新選擇
        </button>
      </div>
    );
  }

  // Quick mode
  if (mode === "quick") {
    return (
      <div className="min-h-screen flex flex-col px-6 py-8">
        <h1 className="text-xl font-bold mb-2">
          {selectedCocktail?.nameZh || customName}
        </h1>
        <p className="text-text-muted text-sm mb-8">快速記錄</p>

        <div className="flex-1 flex flex-col justify-center space-y-8">
          <div className="text-center space-y-3">
            <p className="text-text-secondary">整體評分</p>
            <div className="flex justify-center">
              <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
            </div>
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-2">酒吧名稱（選填）</label>
            <input
              type="text"
              value={barName}
              onChange={(e) => setBarName(e.target.value)}
              placeholder="輸入酒吧名稱"
              className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-3 mt-8">
          <Button
            fullWidth
            size="lg"
            onClick={handleSave}
            disabled={overallRating === 0 || saving}
          >
            {saving ? "儲存中..." : "完成記錄"}
          </Button>
          <button
            onClick={() => setMode("select")}
            className="w-full text-text-muted text-sm hover:text-text-secondary py-2"
          >
            ← 返回
          </button>
        </div>
      </div>
    );
  }

  // Full mode - multi-step
  const fullSteps = [
    // Step 0: Rating
    <div key="rating" className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-text-secondary">整體評分</p>
        <div className="flex justify-center">
          <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
        </div>
      </div>
    </div>,

    // Step 1: Taste sliders
    <div key="taste" className="space-y-5">
      <SliderInput label="酸度" value={acidityRating} onChange={setAcidityRating} labels={["不酸", "很酸"]} />
      <SliderInput label="甜度" value={sweetnessRating} onChange={setSweetnessRating} labels={["不甜", "很甜"]} />
      <SliderInput label="苦度" value={bitternessRating} onChange={setBitternessRating} labels={["不苦", "很苦"]} />
      <SliderInput label="鹹度" value={saltinessRating} onChange={setSaltinessRating} labels={["不鹹", "很鹹"]} />
      <SliderInput label="烈度" value={strengthRating} onChange={setStrengthRating} labels={["順口", "很烈"]} />
    </div>,

    // Step 2: Flavor tags
    <div key="flavor">
      <FlavorTagPicker selected={flavorTags} onChange={setFlavorTags} />
    </div>,

    // Step 3: Texture & Temperature
    <div key="texture" className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary mb-3">口感</p>
        <div className="flex gap-2">
          {(["light", "medium", "heavy"] as const).map((t) => (
            <Button
              key={t}
              variant={texture === t ? "primary" : "secondary"}
              onClick={() => setTexture(t)}
              className="flex-1"
            >
              {{ light: "輕盈", medium: "中等", heavy: "厚重" }[t]}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-3">溫度感</p>
        <div className="flex gap-2">
          {(["cool", "neutral", "warm"] as const).map((t) => (
            <Button
              key={t}
              variant={temperatureFeel === t ? "primary" : "secondary"}
              onClick={() => setTemperatureFeel(t)}
              className="flex-1"
            >
              {{ cool: "清涼", neutral: "中性", warm: "溫暖" }[t]}
            </Button>
          ))}
        </div>
      </div>
    </div>,

    // Step 4: Bar info
    <div key="bar" className="space-y-5">
      <div>
        <label className="text-sm text-text-secondary block mb-2">酒吧名稱（選填）</label>
        <input
          type="text"
          value={barName}
          onChange={(e) => setBarName(e.target.value)}
          placeholder="輸入酒吧名稱"
          className="w-full px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
      </div>
      {barName && (
        <>
          <SliderInput label="環境" value={barAmbiance} onChange={setBarAmbiance} labels={["差", "優"]} />
          <SliderInput label="服務" value={barServiceRating} onChange={setBarServiceRating} labels={["差", "優"]} />
          <SliderInput label="餐食" value={barFood} onChange={setBarFood} labels={["差", "優"]} />
        </>
      )}
    </div>,

    // Step 5: Occasion & Price
    <div key="occasion" className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary mb-3">場合</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "date", label: "約會" },
            { value: "friends", label: "朋友聚會" },
            { value: "solo", label: "獨飲" },
            { value: "celebration", label: "慶祝" },
            { value: "business", label: "商務" },
          ].map((o) => (
            <Button
              key={o.value}
              variant={occasion === o.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setOccasion(occasion === o.value ? "" : o.value)}
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-3">價格區間（TWD）</p>
        <div className="flex flex-wrap gap-2">
          {["<300", "300-500", "500-800", "800+"].map((p) => (
            <Button
              key={p}
              variant={priceRange === p ? "primary" : "secondary"}
              size="sm"
              onClick={() => setPriceRange(priceRange === p ? "" : p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>,
  ];

  const stepLabels = ["評分", "味覺", "風味", "口感", "酒吧", "場合"];

  return (
    <div className="min-h-screen flex flex-col px-6 py-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold">
          {selectedCocktail?.nameZh || customName}
        </h1>
        <span className="text-sm text-text-muted">{step + 1}/{fullSteps.length}</span>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 mb-6">
        {fullSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>

      <p className="text-text-muted text-sm mb-4">{stepLabels[step]}</p>

      {/* Step content */}
      <div className="flex-1">{fullSteps[step]}</div>

      {/* Navigation */}
      <div className="space-y-3 mt-6">
        {step < fullSteps.length - 1 ? (
          <Button
            fullWidth
            size="lg"
            onClick={() => setStep(step + 1)}
            disabled={step === 0 && overallRating === 0}
          >
            下一步
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            onClick={handleSave}
            disabled={overallRating === 0 || saving}
          >
            {saving ? "儲存中..." : "完成記錄"}
          </Button>
        )}
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : setMode("select"))}
          className="w-full text-text-muted text-sm hover:text-text-secondary py-2"
        >
          ← {step > 0 ? "上一步" : "返回"}
        </button>
      </div>
    </div>
  );
}

export default function RecordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-5xl animate-pulse">🍸</div></div>}>
      <RecordPageInner />
    </Suspense>
  );
}
