# Partners

## 概要

取引先

## エンドポイント一覧

### GET /api/1/partners

操作: 取引先一覧の取得

説明: 概要 指定した事業所に登録されている取引先の一覧を取得します。取引・請求書・支払依頼などの取引先マスタとして参照する用途を想定しています。 注意点 アーカイブされた取引先は含まれません。 keyword は、取引先コード・取引先名・正式名称・カナ名称・ショートカット1・2 のいずれかへの部分一致で絞り込みます。半角スペース・全角スペース・タブで区切ると AND 検索になります。 start_update_date / end_update_date で更新日を範囲指定できます。JST の日付を yyyy-mm-dd で指定してください。 取引先コード（code）は、事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。 振込元口座ID（payer_walletable_id）、振込手数料負担（transfer_fee_handling_side）は法人スタータープラン（および旧法人プロフェッショナルプラン）以上の事業所でのみ返却されます。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID。取得対象の事業所を指定します。 |
| start_update_date | query | いいえ | string | 更新日で絞り込む開始日 (yyyy-mm-dd, JST)。指定日以降に更新された取引先を対象にします。 |
| end_update_date | query | いいえ | string | 更新日で絞り込む終了日 (yyyy-mm-dd, JST)。指定日以前に更新された取引先を対象にします。 |
| offset | query | いいえ | integer(int64) | 取得レコードのオフセット (デフォルト: 0)。ページング用に、スキップする件数を指定します。 |
| limit | query | いいえ | integer(int64) | 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 3000)。1 回のリクエストで取得する上限件数を指定します。 |
| keyword | query | いいえ | string | 検索キーワード。取引先コード・取引先名・正式名称・カナ名称・ショートカットキー1・2 のいずれかに対する部分一致で絞り込みます。
以下のいずれかで区切って複数キーワードを指定した場合は AND 検索になります。
<ul>
<li>半角スペース</li>
<li>全角スペース</li>
<li>タブ</li>
</ul>
 |

### レスポンス (200)

取引先一覧の取得に成功しました。

- partners (必須): array[object] - 取引先の配列。offset / limit / keyword / start_update_date / end_update_date の条件で絞り込まれた結果が id 昇順で返ります。件数がない場合は空配列。
  配列の要素:
    - id (必須): integer(int64) - 取引先ID。事業所内でユニークな取引先の識別子。取引・請求書などで参照するためのキーになります。 例: `1` (最小: 1)
    - code (必須): string - 取引先コード。事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。取引先マスタを外部システムのコードと突合する用途で利用します。 例: `code001`
    - company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所の識別子。 例: `1` (最小: 1)
    - name (必須): string - 取引先名。事業所内で重複しない一意の名称。取引・請求書などで表示・検索に使われます。 例: `ABC商店`
    - update_date (必須): string - 更新日 (yyyy-mm-dd, JST)。取引先情報が最後に更新された日付。start_update_date / end_update_date による絞り込みキーになります。 例: `2024-12-17`
    - available (必須): boolean - 使用可能フラグ。取引先が入力候補として表示可能かを示します。
<ul>
  <li>true: 使用可能。Web 画面の取引登録時などに入力候補として表示されます。本 API で新規作成した取引先は常に true になります。</li>
  <li>false: 使用停止。入力候補として表示されません（取引先自体は削除されず、取引作成 API で false の取引先を指定すれば利用可能）。</li>
</ul>
    - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。Web 画面のショートカット入力で利用されます。 例: `ABC`
    - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 に加えて指定できる補助的な検索キーワード。 例: `501`
    - org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 例: `1` (最小: 1, 最大: 2)
    - country_code (任意): string - 地域。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 例: `JP`
    - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
    - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
    - default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
    - phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマットの制約はありません。 例: `03-1234-5678`
    - contact_name (任意): string - 担当者 氏名。取引先窓口の担当者名。 例: `freee太郎`
    - email (任意): string - 担当者 メールアドレス。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
    - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。この取引先への振込元として設定されている口座 ID。未設定の場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。 例: `1` (最小: 1)
    - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。振込手数料をどちらが負担するかを示します。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
    - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
    - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字。未登録の場合は null。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001`
    - address_attributes (任意): object - 住所情報。取引先に住所が登録されていない場合はキー自体が返却されません。
    - partner_doc_setting_attributes (任意): object - 請求書送付設定。設定されていない場合はキー自体が返却されません。
    - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。口座が登録されていない場合はキー自体が返却されません。

### POST /api/1/partners

操作: 取引先の作成

説明: 概要 指定した事業所に新しい取引先を作成します。取引や請求書で参照する取引先マスタを新規登録する用途で利用します。 注意点 取引先名称（name）は事業所内で重複できません。すでに同名の取引先が存在するとエラーになります。 code は、事業所設定で「取引先コードの利用」を有効にしている場合のみ利用可能です。 有効時は code の指定が必須で、name・code いずれも重複不可です。 無効時に code を指定するとエラーになります。 作成された取引先の available（使用可能フラグ）は常に true になります。 以下の属性は法人スタータープラン（および旧法人プロフェッショナルプラン）以上の事業所でのみ設定・返却されます。無料プラン等では指定しても無視されます。 振込元口座ID（payer_walletable_id） 振込手数料負担（transfer_fee_handling_side） 支払期日設定（payment_term_attributes） 請求の入金期日設定（invoice_payment_term_attributes）

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID。作成先の事業所を指定します。 例: `1` (最小: 1)
- name (必須): string - 取引先名 (255 文字以内、事業所内で重複不可)。取引・請求書で参照される表示名。 例: `新しい取引先`
- code (任意): string - 取引先コード。事業所設定で「取引先コードの利用」を有効にしている場合は必須で、事業所内で重複不可。無効な事業所では指定するとエラーになります。 例: `code001`
- shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。 例: `NEWPARTNER`
- shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 と併用可能な補助キーワード。 例: `502`
- org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定（デフォルト）</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 (選択肢: 1, 2) 例: `1`
- country_code (任意): string - 地域。指定しない場合は JP になります。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 (選択肢: JP, ZZ) 例: `JP`
- long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
- name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
- default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
- phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマット制約はありません。 例: `03-1234-5678`
- contact_name (任意): string - 担当者 氏名 (255 文字以内)。取引先窓口の担当者名。 例: `freee太郎`
- email (任意): string - 担当者 メールアドレス (255 文字以内)。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
- payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。walletable の type が 'bank_account' の口座 ID のみ指定できます。未設定にする場合は null を指定してください。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能で、それ未満の事業所では指定しても無視されます。 例: `1` (最小: 1)
- transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。指定しない場合は payer になります。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能で、それ未満の事業所では指定しても無視されます。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
- qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。デフォルトは false。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
- invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字（先頭 T なしの数字 13 桁も許容）。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001` (パターン: ^T?[1-9][0-9]{12}$)
- address_attributes (任意): object - 住所情報。省略した場合、address_attributes 自体が未設定になります。country_code を指定していれば address_attributes を省略しても地域は反映されます。
  - zipcode (任意): string - 郵便番号（ハイフン含む可、8 文字以内）。 例: `000-0000`
  - prefecture_code (任意): integer(int64) - 都道府県コード（-1: 設定しない、0: 北海道、1:青森、2:岩手、3:宮城、4:秋田、5:山形、6:福島、7:茨城、8:栃木、9:群馬、10:埼玉、11:千葉、12:東京、13:神奈川、14:新潟、15:富山、16:石川、17:福井、18:山梨、19:長野、20:岐阜、21:静岡、22:愛知、23:三重、24:滋賀、25:京都、26:大阪、27:兵庫、28:奈良、29:和歌山、30:鳥取、31:島根、32:岡山、33:広島、34:山口、35:徳島、36:香川、37:愛媛、38:高知、39:福岡、40:佐賀、41:長崎、42:熊本、43:大分、44:宮崎、45:鹿児島、46:沖縄） 例: `4` (最小: -1, 最大: 46)
  - street_name1 (任意): string - 市区町村・番地（255 文字以内）。 例: `千代田区丸の内1-1-1`
  - street_name2 (任意): string - 建物名・部屋番号など（255 文字以内）。 例: `freeeビル 10F`
- partner_doc_setting_attributes (任意): object - 請求書送付方法の設定。
  - sending_method (任意): string - 請求書送付方法。null を指定すると未設定になります。
<ul>
  <li>email: メール</li>
  <li>posting: 郵送</li>
  <li>email_and_posting: メールと郵送</li>
  <li>pdf_delivery: メール（PDFファイル添付）</li>
  <li>pdf_delivery_and_posting: メール（PDFファイル添付）と郵送</li>
</ul>
 (選択肢: email, posting, email_and_posting, pdf_delivery, pdf_delivery_and_posting) 例: `posting`
- partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。
  - bank_name (任意): string - 銀行名。 例: `freee銀行`
  - bank_name_kana (任意): string - 銀行名（カナ）。 例: `フリーギンコウ`
  - bank_code (任意): string - 銀行コード（4 桁の統一金融機関コード）。 例: `0001`
  - branch_name (任意): string - 支店名。 例: `銀座支店`
  - branch_kana (任意): string - 支店名（カナ）。 例: `ギンザシテン`
  - branch_code (任意): string - 支店番号（3 桁）。 例: `101`
  - account_type (任意): string - 口座種別。指定しない場合は ordinary になります。
<ul>
  <li>ordinary: 普通</li>
  <li>checking: 当座</li>
  <li>earmarked: 納税準備預金</li>
  <li>savings: 貯蓄</li>
  <li>other: その他</li>
</ul>
 例: `ordinary`
  - account_number (任意): string - 口座番号。 例: `1010101`
  - long_account_name (任意): string - 受取人名。 例: `freee太郎`
  - account_name (任意): string - 受取人名（カナ）。全銀フォーマットで送信する際に使用されます。 例: `フリータロウ`
- payment_term_attributes (任意): object - 支払期日設定。この取引先への支払日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day を組み合わせて指定します。
  - cutoff_day (任意): integer(int64) - 締め日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `15` (最小: 1, 最大: 32)
  - additional_months (任意): integer(int64) - 支払月。締め日から数えて何ヶ月後に支払うか。当月を指定する場合は 0 を指定してください。 例: `1` (最小: 0, 最大: 6)
  - fixed_day (任意): integer(int64) - 支払日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `32` (最小: 1, 最大: 32)
- invoice_payment_term_attributes (任意): object - 請求の入金期日設定。この取引先からの入金日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。
  - cutoff_day (任意): integer(int64) - 締め日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `15` (最小: 1, 最大: 32)
  - additional_months (任意): integer - 入金月。締め日から数えて何ヶ月後に入金されるか。当月を指定する場合は 0 を指定してください。 例: `1` (最小: 0, 最大: 6)
  - fixed_day (任意): integer(int64) - 入金日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `32` (最小: 1, 最大: 32)

### レスポンス (201)

取引先の作成に成功しました。作成された取引先が返ります。

- partner (必須): object
  - id (必須): integer(int64) - 取引先ID。事業所内でユニークな取引先の識別子。取引・請求書などで参照するためのキーになります。 例: `1` (最小: 1)
  - code (必須): string - 取引先コード。事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。取引先マスタを外部システムのコードと突合する用途で利用します。 例: `code001`
  - company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所の識別子。 例: `1` (最小: 1)
  - name (必須): string - 取引先名。事業所内で重複しない一意の名称。取引・請求書などで表示・検索に使われます。 例: `ABC商店`
  - update_date (必須): string - 更新日 (yyyy-mm-dd, JST)。取引先情報が最後に更新された日付。start_update_date / end_update_date による絞り込みキーになります。 例: `2024-12-17`
  - available (必須): boolean - 使用可能フラグ。取引先が入力候補として表示可能かを示します。
<ul>
  <li>true: 使用可能。Web 画面の取引登録時などに入力候補として表示されます。本 API で新規作成した取引先は常に true になります。</li>
  <li>false: 使用停止。入力候補として表示されません（取引先自体は削除されず、取引作成 API で false の取引先を指定すれば利用可能）。</li>
</ul>
  - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。Web 画面のショートカット入力で利用されます。 例: `ABC`
  - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 に加えて指定できる補助的な検索キーワード。 例: `501`
  - org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 例: `1` (最小: 1, 最大: 2)
  - country_code (任意): string - 地域。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 例: `JP`
  - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
  - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
  - default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
  - phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマットの制約はありません。 例: `03-1234-5678`
  - contact_name (任意): string - 担当者 氏名。取引先窓口の担当者名。 例: `freee太郎`
  - email (任意): string - 担当者 メールアドレス。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
  - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。この取引先への振込元として設定されている口座 ID。未設定の場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。 例: `1` (最小: 1)
  - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。振込手数料をどちらが負担するかを示します。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
  - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
  - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字。未登録の場合は null。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001`
  - address_attributes (任意): object - 住所情報。取引先に住所が登録されていない場合はキー自体が返却されません。
  - partner_doc_setting_attributes (任意): object - 請求書送付設定。設定されていない場合はキー自体が返却されません。
  - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。口座が登録されていない場合はキー自体が返却されません。
  - payment_term_attributes (任意): object - 支払期日設定。取引先への支払日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。
  - invoice_payment_term_attributes (任意): object - 請求の入金期日設定。取引先からの入金日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。

### GET /api/1/partners/{id}

操作: 取引先の取得

説明: 概要 指定した事業所の取引先 1 件を ID を指定して取得します。取引先の詳細確認や、更新前の現在値取得に利用します。 注意点 取引先コード（code）は、事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。 アーカイブ済みの取引先は取得対象になり得ますが、更新・削除はできません。 以下の属性は法人スタータープラン（および旧法人プロフェッショナルプラン）以上の事業所でのみ返却されます。 振込元口座ID（payer_walletable_id） 振込手数料負担（transfer_fee_handling_side） 支払期日設定（payment_term_attributes） 請求の入金期日設定（invoice_payment_term_attributes）

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 取引先ID。取得対象の取引先を指定します。 |
| company_id | query | はい | integer(int64) | 事業所ID。取引先が属する事業所を指定します。 |

### レスポンス (200)

取引先の取得に成功しました。

- partner (必須): object
  - id (必須): integer(int64) - 取引先ID。事業所内でユニークな取引先の識別子。取引・請求書などで参照するためのキーになります。 例: `1` (最小: 1)
  - code (必須): string - 取引先コード。事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。取引先マスタを外部システムのコードと突合する用途で利用します。 例: `code001`
  - company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所の識別子。 例: `1` (最小: 1)
  - name (必須): string - 取引先名。事業所内で重複しない一意の名称。取引・請求書などで表示・検索に使われます。 例: `ABC商店`
  - update_date (必須): string - 更新日 (yyyy-mm-dd, JST)。取引先情報が最後に更新された日付。start_update_date / end_update_date による絞り込みキーになります。 例: `2024-12-17`
  - available (必須): boolean - 使用可能フラグ。取引先が入力候補として表示可能かを示します。
<ul>
  <li>true: 使用可能。Web 画面の取引登録時などに入力候補として表示されます。本 API で新規作成した取引先は常に true になります。</li>
  <li>false: 使用停止。入力候補として表示されません（取引先自体は削除されず、取引作成 API で false の取引先を指定すれば利用可能）。</li>
</ul>
  - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。Web 画面のショートカット入力で利用されます。 例: `ABC`
  - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 に加えて指定できる補助的な検索キーワード。 例: `501`
  - org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 例: `1` (最小: 1, 最大: 2)
  - country_code (任意): string - 地域。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 例: `JP`
  - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
  - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
  - default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
  - phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマットの制約はありません。 例: `03-1234-5678`
  - contact_name (任意): string - 担当者 氏名。取引先窓口の担当者名。 例: `freee太郎`
  - email (任意): string - 担当者 メールアドレス。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
  - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。この取引先への振込元として設定されている口座 ID。未設定の場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。 例: `1` (最小: 1)
  - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。振込手数料をどちらが負担するかを示します。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
  - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
  - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字。未登録の場合は null。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001`
  - address_attributes (任意): object - 住所情報。取引先に住所が登録されていない場合はキー自体が返却されません。
  - partner_doc_setting_attributes (任意): object - 請求書送付設定。設定されていない場合はキー自体が返却されません。
  - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。口座が登録されていない場合はキー自体が返却されません。
  - payment_term_attributes (任意): object - 支払期日設定。取引先への支払日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。
  - invoice_payment_term_attributes (任意): object - 請求の入金期日設定。取引先からの入金日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。

### PUT /api/1/partners/{id}

操作: 取引先の更新

説明: 概要 指定した取引先の情報を更新します。id で更新対象を特定します。取引先コード（code）をキーに更新したい場合は PUT /api/1/partners/code/{code} を利用してください。 注意点 取引先名称（name）は事業所内で重複できません。 取引先コード（code）は本 API では指定・更新できません（指定するとエラーになります）。code をキーに更新したい場合は PUT /api/1/partners/code/{code} を、code 自体を新しい値に変更する用途は本 API ではサポートしていません。 本 API は PATCH 相当の挙動をします。リクエストに含まれていない属性は更新されず、既存値が保持されます。属性を「未設定に戻したい」場合は、payment_term_attributes / invoice_payment_term_attributes のみ null を指定できます（他の属性は未設定化の指定不可）。 以下の属性は法人スタータープラン（および旧法人プロフェッショナルプラン）以上の事業所でのみ設定できます。無料プラン等では指定し...

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 取引先ID。更新対象の取引先を指定します。 |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所を指定します。 例: `1` (最小: 1)
- name (必須): string - 取引先名 (255 文字以内、事業所内で重複不可)。 例: `新しい取引先`
- available (任意): boolean - 使用可能フラグ。false を指定すると Web 画面の入力候補として表示されなくなります（取引先自体は削除されません）。
<ul>
  <li>true: 使用可能</li>
  <li>false: 使用停止</li>
</ul>
 例: `false`
- shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。 例: `NEWPARTNER`
- shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 と併用可能な補助キーワード。 例: `502`
- org_code (任意): integer(int64) - 事業所種別。null を指定すると未設定に戻ります。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 (選択肢: 1, 2) 例: `1`
- country_code (任意): string - 地域。指定しない場合は JP になります。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 (選択肢: JP, ZZ) 例: `JP`
- long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。 例: `株式会社ABC商店`
- name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。 例: `エービーシーショウテン`
- default_title (任意): string - 敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
- phone (任意): string - 電話番号。フォーマット制約はありません。 例: `03-1234-5678`
- contact_name (任意): string - 担当者 氏名 (255 文字以内)。 例: `freee太郎`
- email (任意): string - 担当者 メールアドレス (255 文字以内)。 例: `contact@example.com`
- payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。walletable の type が 'bank_account' の口座 ID のみ指定できます。未設定にする場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。 例: `1` (最小: 1)
- transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。指定しない場合は payer になります。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
- qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
- invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字（先頭 T なしの数字 13 桁も許容）。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001` (パターン: ^T?[1-9][0-9]{12}$)
- address_attributes (任意): object - 住所情報。指定した属性のみ更新されます（省略した属性は既存値を維持）。
  - zipcode (任意): string - 郵便番号（ハイフン含む可、8 文字以内）。 例: `000-0000`
  - prefecture_code (任意): integer(int64) - 都道府県コード（-1: 設定しない、0: 北海道、1:青森、2:岩手、3:宮城、4:秋田、5:山形、6:福島、7:茨城、8:栃木、9:群馬、10:埼玉、11:千葉、12:東京、13:神奈川、14:新潟、15:富山、16:石川、17:福井、18:山梨、19:長野、20:岐阜、21:静岡、22:愛知、23:三重、24:滋賀、25:京都、26:大阪、27:兵庫、28:奈良、29:和歌山、30:鳥取、31:島根、32:岡山、33:広島、34:山口、35:徳島、36:香川、37:愛媛、38:高知、39:福岡、40:佐賀、41:長崎、42:熊本、43:大分、44:宮崎、45:鹿児島、46:沖縄） 例: `4` (最小: -1, 最大: 46)
  - street_name1 (任意): string - 市区町村・番地（255 文字以内）。 例: `千代田区丸の内1-1-1`
  - street_name2 (任意): string - 建物名・部屋番号など（255 文字以内）。 例: `freeeビル 10F`
- partner_doc_setting_attributes (任意): object - 請求書送付方法の設定。
  - sending_method (任意): string - 請求書送付方法。null を指定すると未設定になります。
<ul>
  <li>email: メール</li>
  <li>posting: 郵送</li>
  <li>email_and_posting: メールと郵送</li>
  <li>pdf_delivery: メール（PDFファイル添付）</li>
  <li>pdf_delivery_and_posting: メール（PDFファイル添付）と郵送</li>
</ul>
 (選択肢: email, posting, email_and_posting, pdf_delivery, pdf_delivery_and_posting) 例: `posting`
- partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。指定した属性のみ更新されます。account_type に空文字を指定した場合は ordinary で置き換わる点に注意してください。
  - bank_name (任意): string - 銀行名。 例: `freee銀行`
  - bank_name_kana (任意): string - 銀行名（カナ）。 例: `フリーギンコウ`
  - bank_code (任意): string - 銀行コード（4 桁の統一金融機関コード）。 例: `0001`
  - branch_name (任意): string - 支店名。 例: `銀座支店`
  - branch_kana (任意): string - 支店名（カナ）。 例: `ギンザシテン`
  - branch_code (任意): string - 支店番号（3 桁）。 例: `101`
  - account_type (任意): string - 口座種別。指定しない場合は既存値を維持します（空文字は ordinary で置き換わります）。
<ul>
  <li>ordinary: 普通</li>
  <li>checking: 当座</li>
  <li>earmarked: 納税準備預金</li>
  <li>savings: 貯蓄</li>
  <li>other: その他</li>
</ul>
 例: `ordinary`
  - account_number (任意): string - 口座番号。 例: `1010101`
  - long_account_name (任意): string - 受取人名。 例: `freee太郎`
  - account_name (任意): string - 受取人名（カナ）。全銀フォーマットで送信する際に使用されます。 例: `フリータロウ`
- payment_term_attributes (任意): object - 支払期日設定。null を指定すると期日設定を未設定に戻します。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day はまとめて指定する必要があります（一部だけの更新はできません）。
  - cutoff_day (任意): integer(int64) - 締め日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `15` (最小: 1, 最大: 32)
  - additional_months (任意): integer(int64) - 支払月。締め日から数えて何ヶ月後に支払うか。当月を指定する場合は 0 を指定してください。 例: `1` (最小: 0, 最大: 6)
  - fixed_day (任意): integer(int64) - 支払日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `32` (最小: 1, 最大: 32)
- invoice_payment_term_attributes (任意): object - 請求の入金期日設定。null を指定すると期日設定を未設定に戻します。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day はまとめて指定する必要があります。
  - cutoff_day (任意): integer(int64) - 締め日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `15` (最小: 1, 最大: 32)
  - additional_months (任意): integer(int64) - 入金月。締め日から数えて何ヶ月後に入金されるか。当月を指定する場合は 0 を指定してください。 例: `1` (最小: 0, 最大: 6)
  - fixed_day (任意): integer(int64) - 入金日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `32` (最小: 1, 最大: 32)

### レスポンス (200)

取引先の更新に成功しました。更新後の取引先が返ります。

- partner (必須): object
  - id (必須): integer(int64) - 取引先ID。事業所内でユニークな取引先の識別子。取引・請求書などで参照するためのキーになります。 例: `1` (最小: 1)
  - code (必須): string - 取引先コード。事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。取引先マスタを外部システムのコードと突合する用途で利用します。 例: `code001`
  - company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所の識別子。 例: `1` (最小: 1)
  - name (必須): string - 取引先名。事業所内で重複しない一意の名称。取引・請求書などで表示・検索に使われます。 例: `ABC商店`
  - update_date (必須): string - 更新日 (yyyy-mm-dd, JST)。取引先情報が最後に更新された日付。start_update_date / end_update_date による絞り込みキーになります。 例: `2024-12-17`
  - available (必須): boolean - 使用可能フラグ。取引先が入力候補として表示可能かを示します。
<ul>
  <li>true: 使用可能。Web 画面の取引登録時などに入力候補として表示されます。本 API で新規作成した取引先は常に true になります。</li>
  <li>false: 使用停止。入力候補として表示されません（取引先自体は削除されず、取引作成 API で false の取引先を指定すれば利用可能）。</li>
</ul>
  - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。Web 画面のショートカット入力で利用されます。 例: `ABC`
  - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 に加えて指定できる補助的な検索キーワード。 例: `501`
  - org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 例: `1` (最小: 1, 最大: 2)
  - country_code (任意): string - 地域。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 例: `JP`
  - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
  - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
  - default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
  - phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマットの制約はありません。 例: `03-1234-5678`
  - contact_name (任意): string - 担当者 氏名。取引先窓口の担当者名。 例: `freee太郎`
  - email (任意): string - 担当者 メールアドレス。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
  - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。この取引先への振込元として設定されている口座 ID。未設定の場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。 例: `1` (最小: 1)
  - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。振込手数料をどちらが負担するかを示します。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
  - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
  - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字。未登録の場合は null。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001`
  - address_attributes (任意): object - 住所情報。取引先に住所が登録されていない場合はキー自体が返却されません。
  - partner_doc_setting_attributes (任意): object - 請求書送付設定。設定されていない場合はキー自体が返却されません。
  - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。口座が登録されていない場合はキー自体が返却されません。
  - payment_term_attributes (任意): object - 支払期日設定。取引先への支払日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。
  - invoice_payment_term_attributes (任意): object - 請求の入金期日設定。取引先からの入金日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。

### DELETE /api/1/partners/{id}

操作: 取引先の削除

説明: 概要 指定した事業所の取引先を削除します。取引で参照されている取引先は削除できないため、削除に失敗した場合は該当取引先の参照を先に解消してください。 注意点 削除された取引先は復元できません。使用停止のみ行いたい場合は、代わりに PUT で available を false に更新することを検討してください。 アーカイブ済みの取引先は削除できません。Web 画面からアーカイブを解除してから再度お試しください。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 取引先ID。削除対象の取引先を指定します。 |
| company_id | query | はい | integer(int64) | 事業所ID。取引先が属する事業所を指定します。 |

### レスポンス (204)

取引先の削除に成功しました。レスポンスボディはありません。

### PUT /api/1/partners/code/{code}

操作: 取引先コードでの取引先の更新

説明: 概要 取引先コード（code）をキーに、指定した取引先の情報を更新します。取引先 ID を持たず取引先コードで運用しているシステムからの更新用途を想定しています。 注意点 本 API を利用するには、事業所設定で「取引先コードの利用」を有効にしている必要があります。無効な事業所への呼び出しはエラーになります。 code に日本語や記号を含む場合は、URL エンコードして URL に含めてください。 取引先名称（name）は事業所内で重複できません。 本 API では id の指定はできません（指定するとエラーになります）。 本 API は PATCH 相当の挙動をします。リクエストに含まれていない属性は更新されず、既存値が保持されます。payment_term_attributes / invoice_payment_term_attributes に null を指定すると期日設定を未設定に戻せます。 以下の属性は法人スタータープラン（および旧法人プロフェッショナルプラン）以上の事業所でのみ設定できます。 振込元口座ID（payer_walletable_id） 振込手数料負担（tr...

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| code | path | はい | string | 取引先コード。更新対象の取引先を特定するキー。日本語・記号を含む場合は URL エンコードして指定してください。 |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所を指定します。 例: `1` (最小: 1)
- name (必須): string - 取引先名 (255 文字以内、事業所内で重複不可)。 例: `新しい取引先`
- available (任意): boolean - 使用可能フラグ。false を指定すると Web 画面の入力候補として表示されなくなります（取引先自体は削除されません）。
<ul>
  <li>true: 使用可能</li>
  <li>false: 使用停止</li>
</ul>
 例: `false`
- shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。 例: `NEWPARTNER`
- shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 と併用可能な補助キーワード。 例: `502`
- org_code (任意): integer(int64) - 事業所種別。null を指定すると未設定に戻ります。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 (選択肢: 1, 2) 例: `1`
- country_code (任意): string - 地域。指定しない場合は JP になります。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 (選択肢: JP, ZZ) 例: `JP`
- long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。 例: `株式会社ABC商店`
- name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。 例: `エービーシーショウテン`
- default_title (任意): string - 敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
- phone (任意): string - 電話番号。フォーマット制約はありません。 例: `03-1234-5678`
- contact_name (任意): string - 担当者 氏名 (255 文字以内)。 例: `freee太郎`
- email (任意): string - 担当者 メールアドレス (255 文字以内)。 例: `contact@example.com`
- payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。walletable の type が 'bank_account' の口座 ID のみ指定できます。未設定にする場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。 例: `1` (最小: 1)
- transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。指定しない場合は payer になります。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
- qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
- invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字（先頭 T なしの数字 13 桁も許容）。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001` (パターン: ^T?[1-9][0-9]{12}$)
- address_attributes (任意): object - 住所情報。指定した属性のみ更新されます（省略した属性は既存値を維持）。
  - zipcode (任意): string - 郵便番号（ハイフン含む可、8 文字以内）。 例: `000-0000`
  - prefecture_code (任意): integer(int64) - 都道府県コード（-1: 設定しない、0: 北海道、1:青森、2:岩手、3:宮城、4:秋田、5:山形、6:福島、7:茨城、8:栃木、9:群馬、10:埼玉、11:千葉、12:東京、13:神奈川、14:新潟、15:富山、16:石川、17:福井、18:山梨、19:長野、20:岐阜、21:静岡、22:愛知、23:三重、24:滋賀、25:京都、26:大阪、27:兵庫、28:奈良、29:和歌山、30:鳥取、31:島根、32:岡山、33:広島、34:山口、35:徳島、36:香川、37:愛媛、38:高知、39:福岡、40:佐賀、41:長崎、42:熊本、43:大分、44:宮崎、45:鹿児島、46:沖縄） 例: `4` (最小: -1, 最大: 46)
  - street_name1 (任意): string - 市区町村・番地（255 文字以内）。 例: `千代田区丸の内1-1-1`
  - street_name2 (任意): string - 建物名・部屋番号など（255 文字以内）。 例: `freeeビル 10F`
- partner_doc_setting_attributes (任意): object - 請求書送付方法の設定。
  - sending_method (任意): string - 請求書送付方法。null を指定すると未設定になります。
<ul>
  <li>email: メール</li>
  <li>posting: 郵送</li>
  <li>email_and_posting: メールと郵送</li>
  <li>pdf_delivery: メール（PDFファイル添付）</li>
  <li>pdf_delivery_and_posting: メール（PDFファイル添付）と郵送</li>
</ul>
 (選択肢: email, posting, email_and_posting, pdf_delivery, pdf_delivery_and_posting) 例: `posting`
- partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。指定した属性のみ更新されます。account_type に空文字を指定した場合は ordinary で置き換わる点に注意してください。
  - bank_name (任意): string - 銀行名。 例: `freee銀行`
  - bank_name_kana (任意): string - 銀行名（カナ）。 例: `フリーギンコウ`
  - bank_code (任意): string - 銀行コード（4 桁の統一金融機関コード）。 例: `0001`
  - branch_name (任意): string - 支店名。 例: `銀座支店`
  - branch_kana (任意): string - 支店名（カナ）。 例: `ギンザシテン`
  - branch_code (任意): string - 支店番号（3 桁）。 例: `101`
  - account_type (任意): string - 口座種別。指定しない場合は既存値を維持します（空文字は ordinary で置き換わります）。
<ul>
  <li>ordinary: 普通</li>
  <li>checking: 当座</li>
  <li>earmarked: 納税準備預金</li>
  <li>savings: 貯蓄</li>
  <li>other: その他</li>
</ul>
 例: `ordinary`
  - account_number (任意): string - 口座番号。 例: `1010101`
  - long_account_name (任意): string - 受取人名。 例: `freee太郎`
  - account_name (任意): string - 受取人名（カナ）。全銀フォーマットで送信する際に使用されます。 例: `フリータロウ`
- payment_term_attributes (任意): object - 支払期日設定。null を指定すると期日設定を未設定に戻します。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day はまとめて指定する必要があります（一部だけの更新はできません）。
  - cutoff_day (任意): integer(int64) - 締め日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `15` (最小: 1, 最大: 32)
  - additional_months (任意): integer(int64) - 支払月。締め日から数えて何ヶ月後に支払うか。当月を指定する場合は 0 を指定してください。 例: `1` (最小: 0, 最大: 6)
  - fixed_day (任意): integer(int64) - 支払日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `32` (最小: 1, 最大: 32)
- invoice_payment_term_attributes (任意): object - 請求の入金期日設定。null を指定すると期日設定を未設定に戻します。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day はまとめて指定する必要があります。
  - cutoff_day (任意): integer(int64) - 締め日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `15` (最小: 1, 最大: 32)
  - additional_months (任意): integer(int64) - 入金月。締め日から数えて何ヶ月後に入金されるか。当月を指定する場合は 0 を指定してください。 例: `1` (最小: 0, 最大: 6)
  - fixed_day (任意): integer(int64) - 入金日。1〜31 の日付を指定します。29, 30, 31 日の末日を指定する場合は 32 を指定してください。 例: `32` (最小: 1, 最大: 32)

### レスポンス (200)

取引先の更新に成功しました。更新後の取引先が返ります。

- partner (必須): object
  - id (必須): integer(int64) - 取引先ID。事業所内でユニークな取引先の識別子。取引・請求書などで参照するためのキーになります。 例: `1` (最小: 1)
  - code (必須): string - 取引先コード。事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。取引先マスタを外部システムのコードと突合する用途で利用します。 例: `code001`
  - company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所の識別子。 例: `1` (最小: 1)
  - name (必須): string - 取引先名。事業所内で重複しない一意の名称。取引・請求書などで表示・検索に使われます。 例: `ABC商店`
  - update_date (必須): string - 更新日 (yyyy-mm-dd, JST)。取引先情報が最後に更新された日付。start_update_date / end_update_date による絞り込みキーになります。 例: `2024-12-17`
  - available (必須): boolean - 使用可能フラグ。取引先が入力候補として表示可能かを示します。
<ul>
  <li>true: 使用可能。Web 画面の取引登録時などに入力候補として表示されます。本 API で新規作成した取引先は常に true になります。</li>
  <li>false: 使用停止。入力候補として表示されません（取引先自体は削除されず、取引作成 API で false の取引先を指定すれば利用可能）。</li>
</ul>
  - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。Web 画面のショートカット入力で利用されます。 例: `ABC`
  - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 に加えて指定できる補助的な検索キーワード。 例: `501`
  - org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 例: `1` (最小: 1, 最大: 2)
  - country_code (任意): string - 地域。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 例: `JP`
  - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
  - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
  - default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
  - phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマットの制約はありません。 例: `03-1234-5678`
  - contact_name (任意): string - 担当者 氏名。取引先窓口の担当者名。 例: `freee太郎`
  - email (任意): string - 担当者 メールアドレス。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
  - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。この取引先への振込元として設定されている口座 ID。未設定の場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。 例: `1` (最小: 1)
  - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。振込手数料をどちらが負担するかを示します。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
  - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
  - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字。未登録の場合は null。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001`
  - address_attributes (任意): object - 住所情報。取引先に住所が登録されていない場合はキー自体が返却されません。
  - partner_doc_setting_attributes (任意): object - 請求書送付設定。設定されていない場合はキー自体が返却されません。
  - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。口座が登録されていない場合はキー自体が返却されません。
  - payment_term_attributes (任意): object - 支払期日設定。取引先への支払日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。
  - invoice_payment_term_attributes (任意): object - 請求の入金期日設定。取引先からの入金日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。

### PUT /api/1/partners/upsert_by_code

操作: 取引先の更新（存在しない場合は作成）

説明: 概要 取引先コード（code）をキーに、指定した取引先の情報を更新します。該当する取引先が存在しない場合は新規作成します（upsert）。同期処理を伴う外部システムとの連携で、取引先マスタを一括で登録・更新する用途を想定しています。 注意点 本 API を利用するには、事業所設定で「取引先コードの利用」を有効にしている必要があります。無効な事業所への呼び出しはエラーになります。 取引先名称（name）は事業所内で重複できません。 partner オブジェクト内で code を指定することはできません（変更不可）。URL パスの code のみが有効です。 更新レスポンスは 200 OK、新規作成レスポンスは 201 Created で返ります。作成・更新のどちらが行われたかは HTTP ステータスコードで判別してください。 更新時は PATCH 相当の挙動をします。リクエストに含まれていない属性は既存値が保持されます。payment_term_attributes / invoice_payment_term_attributes に null を指定すると期日設定を未設定に戻せます。...

### リクエストボディ

(必須)

- code (必須): string - 取引先コード。upsert のキーになります。事業所内で重複不可。事業所設定で「取引先コードの利用」が有効になっている必要があります。 例: `code001`
- company_id (必須): integer(int64) - 事業所ID。upsert 先の事業所を指定します。 例: `1` (最小: 1)
- partner (必須): object - 取引先の属性。更新経路では PATCH 相当の挙動で、指定した属性のみ既存値を上書きします（payment_term_attributes / invoice_payment_term_attributes のみ null 指定で未設定に戻せます）。作成経路（該当 code が存在しない場合）では、name 以外の属性は省略時にデフォルト値になります。
  - name (必須): string - 取引先名 (255 文字以内、事業所内で重複不可)。 例: `新しい取引先`
  - available (任意): boolean - 使用可能フラグ。更新経路でのみ有効。
<ul>
  <li>true: 使用可能</li>
  <li>false: 使用停止</li>
</ul>
 例: `false`
  - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。 例: `NEWPARTNER`
  - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 と併用可能な補助キーワード。 例: `502`
  - org_code (任意): integer(int64) - 事業所種別。null を指定すると未設定になります。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 (選択肢: 1, 2) 例: `1`
  - country_code (任意): string - 地域。指定しない場合は JP になります。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 (選択肢: JP, ZZ) 例: `JP`
  - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。 例: `株式会社ABC商店`
  - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。 例: `エービーシーショウテン`
  - default_title (任意): string - 敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
  - phone (任意): string - 電話番号。フォーマット制約はありません。 例: `03-1234-5678`
  - contact_name (任意): string - 担当者 氏名 (255 文字以内)。 例: `freee太郎`
  - email (任意): string - 担当者 メールアドレス (255 文字以内)。 例: `contact@example.com`
  - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。walletable の type が 'bank_account' の口座 ID のみ指定できます。未設定にする場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。 例: `1` (最小: 1)
  - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。指定しない場合は payer になります。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
  - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
  - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字（先頭 T なしの数字 13 桁も許容）。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001` (パターン: ^T?[1-9][0-9]{12}$)
  - address_attributes (任意): object - 住所情報。更新経路では指定した属性のみ上書きし、省略した属性は既存値を維持します。
  - partner_doc_setting_attributes (任意): object - 請求書送付方法の設定。
  - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。更新経路では指定した属性のみ上書きし、省略した属性は既存値を維持します。account_type に空文字を指定した場合は ordinary で置き換わる点に注意してください。
  - payment_term_attributes (任意): object - 支払期日設定。更新経路では null を指定すると期日設定を未設定に戻せます。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day はまとめて指定する必要があります。
  - invoice_payment_term_attributes (任意): object - 請求の入金期日設定。更新経路では null を指定すると期日設定を未設定に戻せます。法人スタータープラン（および旧法人プロフェッショナルプラン）以上でのみ設定可能。cutoff_day / additional_months / fixed_day はまとめて指定する必要があります。

### レスポンス (200)

既存の取引先を更新しました。更新後の取引先が返ります。

- partner (必須): object
  - id (必須): integer(int64) - 取引先ID。事業所内でユニークな取引先の識別子。取引・請求書などで参照するためのキーになります。 例: `1` (最小: 1)
  - code (必須): string - 取引先コード。事業所設定で「取引先コードの利用」が有効な場合のみ実際の値が返り、無効な場合は null が返ります。取引先マスタを外部システムのコードと突合する用途で利用します。 例: `code001`
  - company_id (必須): integer(int64) - 事業所ID。取引先が属する事業所の識別子。 例: `1` (最小: 1)
  - name (必須): string - 取引先名。事業所内で重複しない一意の名称。取引・請求書などで表示・検索に使われます。 例: `ABC商店`
  - update_date (必須): string - 更新日 (yyyy-mm-dd, JST)。取引先情報が最後に更新された日付。start_update_date / end_update_date による絞り込みキーになります。 例: `2024-12-17`
  - available (必須): boolean - 使用可能フラグ。取引先が入力候補として表示可能かを示します。
<ul>
  <li>true: 使用可能。Web 画面の取引登録時などに入力候補として表示されます。本 API で新規作成した取引先は常に true になります。</li>
  <li>false: 使用停止。入力候補として表示されません（取引先自体は削除されず、取引作成 API で false の取引先を指定すれば利用可能）。</li>
</ul>
  - shortcut1 (任意): string - ショートカット1 (255 文字以内)。取引先検索用の任意キーワード。Web 画面のショートカット入力で利用されます。 例: `ABC`
  - shortcut2 (任意): string - ショートカット2 (255 文字以内)。shortcut1 に加えて指定できる補助的な検索キーワード。 例: `501`
  - org_code (任意): integer(int64) - 事業所種別。
<ul>
  <li>null: 未設定</li>
  <li>1: 法人</li>
  <li>2: 個人</li>
</ul>
 例: `1` (最小: 1, 最大: 2)
  - country_code (任意): string - 地域。
<ul>
  <li>JP: 国内</li>
  <li>ZZ: 国外</li>
</ul>
 例: `JP`
  - long_name (任意): string - 正式名称（255 文字以内）。取引先の正式な法人・屋号名称。請求書などの帳票に印字される名称。 例: `株式会社ABC商店`
  - name_kana (任意): string - カナ名称（255 文字以内）。取引先名の全角カナ表記。Web 画面のカナ検索で利用されます。 例: `エービーシーショウテン`
  - default_title (任意): string - 敬称。請求書などで取引先名の後ろに付与される敬称。御中、様、(空白) の 3 つから選択します。 例: `御中`
  - phone (任意): string - 電話番号。取引先の連絡先電話番号。フォーマットの制約はありません。 例: `03-1234-5678`
  - contact_name (任意): string - 担当者 氏名。取引先窓口の担当者名。 例: `freee太郎`
  - email (任意): string - 担当者 メールアドレス。取引先窓口の担当者メールアドレス。 例: `contact@example.com`
  - payer_walletable_id (任意): integer(int64) - 振込元口座ID（一括振込ファイル用）。この取引先への振込元として設定されている口座 ID。未設定の場合は null。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。 例: `1` (最小: 1)
  - transfer_fee_handling_side (任意): string - 振込手数料負担（一括振込ファイル用）。振込手数料をどちらが負担するかを示します。法人スタータープラン（および旧法人プロフェッショナルプラン）未満の事業所ではキー自体が返却されません。
<ul>
  <li>payer: 振込元（当方）負担</li>
  <li>payee: 振込先（先方）負担</li>
</ul>
 (選択肢: payer, payee) 例: `payer`
  - qualified_invoice_issuer (任意): boolean - インボイス制度適格請求書発行事業者フラグ。
<ul>
  <li>true: 適格請求書発行事業者</li>
  <li>false: 非対象事業者</li>
</ul>
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `false`
  - invoice_registration_number (任意): string - インボイス制度適格請求書発行事業者登録番号。先頭 T + 数字 13 桁の固定 14 文字。未登録の場合は null。
<a target="_blank" href="https://www.invoice-kohyo.nta.go.jp/index.html">国税庁インボイス制度適格請求書発行事業者公表サイト</a>
 例: `T1000000000001`
  - address_attributes (任意): object - 住所情報。取引先に住所が登録されていない場合はキー自体が返却されません。
  - partner_doc_setting_attributes (任意): object - 請求書送付設定。設定されていない場合はキー自体が返却されません。
  - partner_bank_account_attributes (任意): object - 銀行口座情報（この取引先の受取口座）。口座が登録されていない場合はキー自体が返却されません。
  - payment_term_attributes (任意): object - 支払期日設定。取引先への支払日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。
  - invoice_payment_term_attributes (任意): object - 請求の入金期日設定。取引先からの入金日を締め日基準で計算するための設定。法人スタータープラン（および旧法人プロフェッショナルプラン）未満、または期日設定が登録されていない場合はキー自体が返却されません。



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
