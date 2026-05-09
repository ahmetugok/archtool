# Archtool — İnceleme Notları

> Kod incelemesi ve UI/UX değerlendirmesi. Geliştirme yaparken referans olarak kullanılacak.

---

## Öncelik Sırası

1. 🔴 **Kritik** — temel kullanımı engelliyor
2. 🟡 **Önemli** — düzeltilmeli ama tool çalışıyor
3. 🟢 **İyileştirme** — kalite ve kullanıcı deneyimi

---

## 🔴 Kritik Bug'lar ve Eksikler

### 1. Undo/Redo yok
- Ctrl+Z / Ctrl+Y çalışmıyor
- Node silindiğinde ya da yanlış bağlantı çizildiğinde geri dönüş yolu yok
- **Çözüm:** Zustand `temporal` middleware veya manuel history stack
  ```js
  // useStore.js'e eklenecek
  history: [],
  historyIndex: -1,
  pushHistory: (snapshot) => ...,
  undo: () => ...,
  redo: () => ...,
  ```

### 2. AI audit raporu kaybolıyor
- `handleAiArchitectureAudit` raporu alıyor ama ekranda göstermiyor
- Sadece "Rapor başarıyla oluşturuldu" toast'u çıkıyor, içerik yok
- **Dosya:** `App.jsx:80-83`
  ```js
  const res = await callAI(`...`);
  if (res) {
    toast.success('Rapor başarıyla oluşturuldu'); // res burada kayboluyor!
  }
  ```
- **Çözüm:** Sağdan açılan drawer/modal içinde markdown olarak render et

### 3. Sidebar açılma mekanizması çalışmıyor
- `showLeftPanel=false` iken sidebar `w-0 overflow-hidden`
- Hover `onMouseEnter` sidebar'ın kendi `div`'ine bağlı — 0 genişlikte hover edilemez
- **Dosya:** `Sidebar/index.jsx:38-43`
- **Çözüm:** Sol kenarda her zaman görünür 48px ikon şeridi veya toggle butonu

### 4. Canvas event handler'ları boş
- Aşağıdaki prop'lar App.jsx'te boş fonksiyon olarak geçiriliyor:
  ```js
  handleNodePointerDown={() => {}}
  handleSpecificResizeStart={() => {}}
  handleHandlePointerDown={() => {}}
  handleConnectionSelect={() => {}}
  handleConnectionControlPointDown={() => {}}
  handleWaypointDown={() => {}}
  handleConnectionDragStart={() => {}}
  ```
- **Dosya:** `App.jsx:229-235`
- Node taşıma, resize, bağlantı çizme çalışıyor mu doğrulanmalı

---

## 🟡 Önemli Bug'lar

### 5. Multi-select risk toggle bug'ı
- Multi-select modunda `selectedNode` her zaman `null`
- `!selectedNode?.hasRisk` → `!undefined` → hep `true` setleniyor
- **Dosya:** `PropertiesPanel/index.jsx:347`
  ```js
  // Hatalı:
  onClick={() => updateMultipleNodesData(selectedNodeIds, 'hasRisk', !selectedNode?.hasRisk)}
  // Doğru: mevcut değerlere bakarak toggle et
  ```

### 6. `parseInt` NaN üretebilir
- Boyut input'u temizlenince `parseInt('')` → `NaN` → node bozuluyor
- **Dosya:** `PropertiesPanel/index.jsx:244, 252`
  ```js
  // Hatalı:
  parseInt(e.target.value)
  // Doğru:
  parseInt(e.target.value) || 160  // fallback default değer
  ```

### 7. Node ID çakışma riski
- `Date.now().toString()` ile ID üretiliyor
- Hızlı işlemlerde aynı millisecond'da iki node aynı ID'yi alabilir
- **Dosya:** `App.jsx:167`
  ```js
  // Hatalı:
  const id = Date.now().toString();
  // Doğru:
  const id = crypto.randomUUID();
  ```

### 8. API anahtarı URL'de gönderiliyor (güvenlik)
- Gemini API key query string'de — sunucu loglarına, proxy önbelleklerine açık
- **Dosya:** `useAI.js:22`
  ```js
  // Hatalı:
  `https://generativelanguage.googleapis.com/...?key=${apiKeyInput}`
  // Doğru: header ile gönder
  headers: { 'x-goog-api-key': apiKeyInput }
  ```

---

## 🟢 Kod Kalitesi İyileştirmeleri

### 9. `expandedSections` state yanlış yerde
- App.jsx'te tanımlı, PropertiesPanel'e prop olarak geçiriliyor
- Bu state sadece PropertiesPanel'i ilgilendiriyor
- **Çözüm:** PropertiesPanel içine taşı, App.jsx'i sadeleştir

### 10. localStorage her render'da okunuyor
- `useAI.js:6-8` — hook içinde `localStorage.getItem()` state değil
- Her callAI çağrısında tekrar okunuyor
- **Çözüm:** `useState` veya store üzerinden yönet

### 11. Checkbox erişilebilirlik sorunu
- `<input type="checkbox" readOnly>` — ekran okuyucu "değiştirilemez" der
- **Dosya:** `PropertiesPanel/index.jsx:205-210, 349-355`
  ```jsx
  // Hatalı:
  <div onClick={...}><input type="checkbox" readOnly /></div>
  // Doğru:
  <input type="checkbox" checked={...} onChange={...} />
  ```

### 12. Sayfa yönetimi UI yok
- Store'da `pages[]` var ama sayfa ekleme/silme/yeniden adlandırma için UI yok
- Özellik ya gizli ya eksik

---

## UI/UX Önerileri

### Layout Felsefesi
> Canvas her şeyin önünde gelir. UI, kullanılmadığında görünmez.

**Hedef layout:**
```
┌─────────────────────────────────────────────────────┐
│  [⟵] Proje Adı  ●  [↩][↪]  [⊡ Sığdır] [↓ PNG] [✦ AI] │  ← Top bar 40px
├─────────────────────────────────────────────────────┤
│                                                     │
│ [≡]                                                 │  ← 48px ikon strip
│ [⬡]                        CANVAS                  │
│ [⚙]                                        [Panel] │  ← Seçim olunca çıkar
│ [⬜]                                                │
│ [?]                                                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│ [+] [Sayfa 1 ✎] [Sayfa 2 ✎]          [⊡] [−] 75% [+] │  ← Bottom bar 32px
└─────────────────────────────────────────────────────┘
```

---

### A. Top Bar (yeni)

Şu an yok. Eklenecekler:
- **Sol:** Geri butonu, proje adı (inline edit)
- **Orta:** Kayıt durumu göstergesi (● yeşil/sarı), Undo [↩], Redo [↪]
- **Sağ:** Fit-to-screen [⊡], Export [↓ PNG/SVG], AI Analiz [✦ AI]

### B. Sol Sidebar → İkon Strip + Fly-out

Şu an: 0px veya 256px, ortası yok.

**Yeni yaklaşım:**
- Her zaman görünür 48px ikon şeridi
- İkona tıklayınca o grup canvas üstünde floating panel açılır
- Mouse uzaklaşınca kapanır
- Drag-drop buradan çalışmaya devam eder

```
│ ≡ │  tıkla → tüm palette
│   │
│ ⬡ │  Akış & Yapı (START, END, DECISION, SWIMLANE)
│ ⚙ │  Sistem & Aktör (SERVER, DATABASE, WEB, MOBILE...)
│ ⬜ │  UML (LIFELINE, UML_CLASS)
│   │
│ ? │  Klavye kısayolları
```

### C. Sağ Panel → Seçime Duyarlı Slide-in

Şu an: Her zaman açık, boş duruyor.

**Yeni yaklaşım:**
- Hiçbir şey seçili değil → panel yok, canvas tam genişlik
- Node seçildi → sağdan 280px panel kayar gelir
- Bağlantı seçildi → 200px panel

**Panel içi — Accordion yerine Sekme:**
```
┌──────────────────────────────┐
│ Backend API          [🗑][✕] │
├────────┬──────────┬──────────┤
│ Temel  │ Görünüm  │ Boyut    │  ← Sekmeli, hepsi aynı anda açık değil
├────────┴──────────┴──────────┤
│  Başlık: [______________]    │
│  Aktör:  [______________]    │
│  Etiket: [______________]    │
│                              │
│  Açıklama:                   │
│  [                      ]    │
│  [              ] [✦ AI]     │
│                              │
│  ⚠ [ ] Risk İşaretle         │
└──────────────────────────────┘
```

### D. Node Üstü Floating Toolbar

Seçili node'un hemen yanında çıkan mini toolbar:
```
      ╔══════════════╗
      ║  Backend API ║
      ╚══════════════╝
        [🗑][⧉][✦AI]    ← hover'da görünür
```
Panel açmadan sil, kopyala, AI açıklama — 1 tık.

### E. Sağ Tık Menüsü (Context Menu)

```
┌──────────────────┐
│ Kopyala    Ctrl+C│
│ Kes        Ctrl+X│
│ Sil        Del   │
│ ──────────────── │
│ Öne Getir        │
│ Arkaya Gönder    │
│ ──────────────── │
│ AI Açıklama Ekle │
└──────────────────┘
```

### F. AI Raporu → Drawer

Şu an: Kaybolur.

**Yeni yaklaşım:** Sağdan açılan drawer:
```
                    ┌────────────────────────────┐
                    │ ✦ AI Analiz Raporu    [✕]  │
                    ├────────────────────────────┤
                    │ ## Süreç Özeti             │
                    │ 3 aktör, 8 adım...         │
                    │                            │
                    │ ## Riskler                 │
                    │ • Onay adımı belirsiz      │
                    │                            │
                    │ ## Öneriler                │
                    │ • Veritabanı bağlantısı... │
                    │                            │
                    │         [Kopyala] [Kapat]  │
                    └────────────────────────────┘
```
- Canvas'ı tamamen kapatmaz, yan yana çalışılabilir
- Markdown render edilmeli (`react-markdown` veya basit parse)
- Kopyala butonu ile rapor panoya alınabilir

### G. Bottom Bar (yeni)

```
[+ Sayfa] [Sayfa 1 ✎] [Sayfa 2 ✎] [Sayfa 3 ✎]     [⊡] [−] 75% [+]
```
- **Sol:** Sayfa sekmeleri, çift tıkla isim değiştir, + ile yeni sayfa
- **Sağ:** Fit-to-screen, zoom -, yüzde (tıklayınca %100'e sıfırla), zoom +

### H. Boş Canvas Yönlendirme

Yeni sayfa açılınca:
```
        Araç kutusundan sürükle
        veya canvas'a çift tıkla
        [Başlangıç şablonu yükle]
```

### I. Klavye Kısayolları Ekranı

`?` tuşu veya sol alt köşedeki buton:

| Kısayol | Eylem |
|---|---|
| Ctrl+Z | Geri al |
| Ctrl+Y | İleri al |
| Ctrl+C | Kopyala |
| Ctrl+X | Kes |
| Ctrl+V | Yapıştır |
| Delete | Sil |
| ← → ↑ ↓ | Taşı (5px) |
| Shift+↑↓ | Taşı (1px) |
| Ctrl+↑↓ | Taşı (20px) |
| Ctrl+A | Tümünü seç |
| Escape | Seçimi kaldır |

### J. Font Büyüklükleri

- `text-[9px]` → `text-[11px]` (Sidebar etiketleri)
- `text-[10px]` → `text-[11px]` (PropertiesPanel label'ları)
- Minimum 11px — WCAG erişilebilirlik sınırı

### K. Bağlantı Paneli Özel Renk

Bağlantı seçince sadece 8 hardcoded renk var, Node panelindeki gibi `<input type="color">` eklenebilir.

---

## Özet Karşılaştırma

| Alan | Şu An | Hedef |
|---|---|---|
| Sol panel | 0 veya 256px | 48px sabit + fly-out |
| Sağ panel | Her zaman açık | Seçim olunca slide-in |
| Silme | Sadece panelde | Node üstü floating toolbar |
| AI sonucu | Toast (kaybolur) | Kalıcı drawer, markdown render |
| Zoom | Sadece scroll | Bottom bar toolbar |
| Sayfa yönetimi | Yok | Bottom bar sekme |
| Undo/Redo | Yok | Top bar + Ctrl+Z/Y |
| API güvenliği | Key URL'de | Header ile gönder |
| Font boyutu | 9-10px | Min 11px |
| Checkbox | readOnly, div onClick | Erişilebilir onChange |
