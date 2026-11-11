# העלאה לאוויר — GitHub, Supabase, Cloudflare

התשתיות מוכנות בריפו. **שום דבר לא נפרס** — כל השלבים כאן ידניים, ותוכל להריץ
אותם כשתרצה.

```
.github/workflows/ci.yml                 lint + typecheck + build בכל push/PR
.github/workflows/deploy-cloudflare.yml  פריסה ידנית (workflow_dispatch)
open-next.config.ts                      אדפטר OpenNext ל-Cloudflare
wrangler.jsonc                           Worker, assets, R2 cache, Images
supabase/migrations/*.sql                סכימת portal_events + RLS
.env.example                             משתני סביבה לפיתוח
.dev.vars.example                        סודות ל-preview מקומי ב-Wrangler
```

---

## 1. GitHub

```bash
git init                      # אם עדיין אין ריפו
git add .
git commit -m "Tag Markets clone: marketing pages, portal, admin, infra"
gh repo create tagmarkets-clone --private --source=. --remote=origin --push
```

אם אין `gh`:

```bash
git remote add origin git@github.com:<USER>/tagmarkets-clone.git
git push -u origin main
```

לאחר ה-push, לשונית **Actions** תריץ את `CI` אוטומטית. הפריסה **לא** רצה
אוטומטית — רק דרך **Actions → Deploy to Cloudflare → Run workflow**.

הוסף ב-**Settings → Secrets and variables → Actions**:

| Secret | תיאור |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | טוקן עם הרשאות Workers Scripts:Edit (אין צורך ב-R2) |
| `CLOUDFLARE_ACCOUNT_ID` | מזהה החשבון מ-Cloudflare Dashboard |

---

## 2. Supabase

1. צור פרויקט חדש ב-[supabase.com](https://supabase.com) ובחר אזור קרוב
   (Frankfurt / eu-central-1).
2. הרץ את המיגרציה. או דרך **SQL Editor** (הדבק את תוכן
   `supabase/migrations/20261108000000_portal_events.sql`), או עם ה-CLI:

   ```bash
   npx supabase login                 # פעם אחת
   npx supabase link --project-ref <PROJECT_REF>
   npx supabase db push               # מריץ את supabase/migrations
   ```

   `supabase/config.toml` כבר קיים בריפו, כך ש-`link` ו-`db push` עובדים
   בלי `supabase init`.

3. העתק מ-**Project Settings → API**:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

   ה-`service_role` נשאר בצד השרת בלבד. ה-`anon` key לא נדרש כרגע.

הטבלה `public.portal_events` מוגנת ב-RLS ללא policies: רק מפתח
`service_role` שקיים בצד השרת יכול לקרוא ולכתוב. מפתח ציבורי לא רואה כלום.

> אם משתני Supabase חסרים, האפליקציה נופלת חזרה לקובץ
> `.data/portal-events.json` — נוח לפיתוח מקומי, אבל בפרודקשן חייבים Supabase
> כי ל-Worker אין דיסק כתיב.

---

## 3. Cloudflare

היעד הוא **Cloudflare Workers** עם אדפטר OpenNext — זו הדרך הנתמכת היום
להרצת Next.js על Cloudflare. פרויקט "Pages" הקלאסי לא תומך ב-Next.js 16
(התמיכה ב-`next-on-pages` הוצאה משימוש), ולכן אין צורך ליצור Pages project;
ה-Worker מקבל דומיין, assets ו-cache בדיוק כמו Pages, עם ביצועים טובים יותר.

```bash
# התחברות חד-פעמית
npx wrangler login

# סודות ריצה על ה-Worker (לא נכנסים ל-Git)
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put ADMIN_PASSWORD        # חובה בפרודקשן

# כתובות ארנקים להפקדה — משתני Worker רגילים (לא סודיים)
npx wrangler secret put DEPOSIT_WALLET_BTC
npx wrangler secret put DEPOSIT_WALLET_ETH
npx wrangler secret put DEPOSIT_WALLET_USDT
npx wrangler secret put DEPOSIT_WALLET_USDC
npx wrangler secret put DEPOSIT_WALLET_BNB
npx wrangler secret put DEPOSIT_WALLET_SOL

# בדיקה מקומית של הבילד על Workers
npm run cf:preview

# פריסה (כשתרצה)
npm run cf:deploy
```

`wrangler.jsonc` מגדיר:

- Worker בשם `tagmarkets-clone`
- `nodejs_compat` (נדרש ל-Next ול-Supabase)
- Assets מ-`.open-next/assets`
- Images binding לאופטימיזציית תמונות

> אין דלי R2: האפליקציה לא משתמשת ב-ISR/`revalidate`, ולכן ה-cache הוא קריאה
> בלבד מה-assets (`staticAssetsIncrementalCache`). אם תוסיף revalidation בהמשך,
> תחזיר את `r2IncrementalCache` וגם את ה-binding `NEXT_INC_CACHE_R2_BUCKET`.

לדומיין מותאם: **Cloudflare Dashboard → Workers & Pages → tagmarkets-clone →
Settings → Domains & Routes → Add custom domain**.

### משתני סביבה ב-Cloudflare

| משתנה | חובה | הערה |
| --- | --- | --- |
| `SUPABASE_URL` | כן | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | כן | Secret, לא משתנה ציבורי |
| `ADMIN_PASSWORD` | **כן** | בלי זה `/admin` מחזיר 401 לכל התחברות. אין ברירת מחדל בפרודקשן |
| `DEPOSIT_WALLET_BTC` / `_ETH` / `_USDT` / `_USDC` / `_BNB` / `_SOL` | לא | ריק = מוצג "צור קשר עם התמיכה" בעמוד ההפקדות |

### בדיקת עשן אחרי הפריסה

1. `https://<worker-host>/` — עמוד הבית נטען.
2. `https://<worker-host>/admin/login` — התחברות עם `ADMIN_PASSWORD`.
3. שלח לוגין דמו ב-`/login`, ואז פתח `/admin` — ההגשה מופיעה (כלומר
   ה-`service_role` וה-RLS עובדים).
4. `https://<worker-host>/deposit-methods` — הכתובות שהוגדרו מוצגות.

---

## 4. פיתוח מקומי

```bash
cp .env.example .env.local     # מלא רק את מה שצריך
npm run dev
```

- בלי Supabase: הנתונים נכתבים ל-`.data/portal-events.json` (ב-`.gitignore`).
- כניסה ל-`/admin` דורשת את סיסמת האדמין; `/admin/login` היא הדלת.
- `/login` שולח אחרי התחברות מוצלחת ל-`https://portal.tagmarkets.com/login`.

## 5. לפני עלייה אמיתית

- [ ] החלף את סיסמת האדמין (`ADMIN_PASSWORD`) בערך חזק.
- [ ] ודא ש-`SUPABASE_SERVICE_ROLE_KEY` מוגדר כ-secret ולא בקוד.
- [ ] הגבל את `/admin` ב-Cloudflare Access או לפי IP אם אפשר.
- [ ] זכור: הסיסמאות נשמרות בטקסט גלוי. זו קונסולת דמו — לא מוצר אבטחה.
- [ ] שקול להוסיף Turnstile לטופסי הלוגין/הרשמה.
