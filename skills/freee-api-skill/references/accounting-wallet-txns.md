# Wallet txns

## 概要

口座明細

## エンドポイント一覧

### GET /api/1/wallet_txns

操作: 口座明細一覧の取得

説明: 概要 指定した事業所の口座明細（銀行口座・クレジットカード・その他の決済口座の入出金明細）一覧を取得する 注意点 デフォルトでは取引日（date）の降順で返されます。sort_type に created_at_desc を指定すると、明細の作成日時の降順で返されます。 取得件数は limit と offset で制御します（デフォルト: 20件、最大: 100件）。 定義 amount : 取引金額（単位: 円） due_amount : 取引登録待ち金額（明細に対してまだ取引が登録されていない金額） balance : 残高（銀行口座等） entry_side income : 入金 expense : 出金 walletable_type bank_account : 銀行口座 credit_card : クレジットカード wallet : 現金・その他の決済口座

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| walletable_type | query | いいえ | string | 口座区分で絞り込みます。walletable_type と walletable_id は同時に指定が必要です（片方のみ指定した場合、この条件は無視されます）。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - 現金・その他の決済口座 (選択肢: bank_account, credit_card, wallet) |
| walletable_id | query | いいえ | integer(int64) | 口座IDで絞り込みます。walletable_type と walletable_id は同時に指定が必要です（片方のみ指定した場合、この条件は無視されます）。口座IDは口座一覧の取得API（GET /api/1/walletables）で確認できます。 |
| start_date | query | いいえ | string | 取引日で絞込：開始日 (yyyy-mm-dd) |
| end_date | query | いいえ | string | 取引日で絞込：終了日 (yyyy-mm-dd) |
| entry_side | query | いいえ | string | 入金・出金の区分で絞り込みます。
* `income` - 入金
* `expense` - 出金 (選択肢: income, expense) |
| sort_type | query | いいえ | string | 並び順の指定（未指定の場合は取引日の降順で返されます）
* `created_at_desc` - 明細の作成日時の降順 |
| offset | query | いいえ | integer(int64) | 取得レコードのオフセット (デフォルト: 0) |
| limit | query | いいえ | integer(int64) | 取得レコードの件数 (デフォルト: 20, 最小: 1, 最大: 100)  |

### レスポンス (200)

- wallet_txns (必須): array[object]
  配列の要素:
    - id (必須): integer(int64) - 明細ID 例: `1` (最小: 1)
    - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
    - date (必須): string - 取引日 (yyyy-mm-dd) 例: `2019-12-17`
    - amount (必須): integer(int64) - 取引金額（単位: 円）。入金・出金の区別は entry_side で表されます。 例: `5000` (最小: -9223372036854776000, 最大: 9223372036854776000)
    - due_amount (必須): integer(int64) - 取引登録待ち金額（単位: 円）。明細に対してまだ取引が登録されていない金額を表します。取引が未登録（status が 1）の場合は取引金額と同額になり、取引登録が完了する（status が 2 になる）と 0 になります。 例: `0`
    - balance (必須): integer(int64) - 残高（単位: 円）。銀行口座等の残高が入ります。Webで残高未設定で登録した場合や、口座明細の作成APIで balance を指定せずに登録した場合などは null になります。 例: `10000`
    - entry_side (必須): string - 入金・出金の区分
* `income` - 入金
* `expense` - 出金 (選択肢: income, expense) 例: `income`
    - walletable_type (必須): string - 口座区分
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - 現金・その他の決済口座 (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
    - walletable_id (必須): integer(int64) - 口座ID（walletable_type で示される口座のID）。口座の詳細は口座一覧の取得API（GET /api/1/walletables）で確認できます。 例: `1` (最小: 1)
    - description (必須): string - 取引内容（銀行やクレジットカードの明細に記載された摘要等）。未設定の場合は空文字列になります。 例: `振込 カ）ABC`
    - status (必須): integer(int64) - 明細のステータス
* `1` - 消込待ち（明細に対する取引が未登録の状態）
* `2` - 消込済み（明細に対する取引の登録が完了した状態）
* `3` - 無視（取引を登録せず明細を無視した状態）
* `4` - 消込中（明細の一部の金額のみ取引登録された状態）
* `6` - 対象外（取引登録の対象外の明細） 例: `1` (最小: 1, 最大: 6)
    - rule_matched (必須): boolean - 登録時に<a href="https://support.freee.co.jp/hc/ja/articles/202848350-明細の自動登録ルールを設定する" target="_blank">自動登録ルールの設定</a>が適用され、登録処理が実行された場合、
trueになります。〜を推測する、〜の消込をするの条件の場合は一致してもfalseになります。
 例: `true`

### POST /api/1/wallet_txns

操作: 口座明細の作成

説明: 概要 指定した事業所の口座明細を作成する 注意点 登録時に自動登録ルールの設定の条件に一致した場合はルールが適用され、取引の登録などが自動で行われることがあります。ルールが適用され登録処理が実行された場合、レスポンスの rule_matched が true になります。 定義 amount : 取引金額（単位: 円） due_amount : 取引登録待ち金額（明細に対してまだ取引が登録されていない金額） balance : 残高（銀行口座等） entry_side income : 入金 expense : 出金 walletable_type bank_account : 銀行口座 credit_card : クレジットカード wallet : 現金・その他の決済口座

### リクエストボディ

- entry_side (必須): string - 入金・出金の区分
* `income` - 入金
* `expense` - 出金 (選択肢: income, expense) 例: `income`
- description (任意): string - 取引内容（摘要）。未指定の場合は空文字列で登録されます。 例: `振込 カ）ABC`
- amount (必須): integer(int64) - 取引金額（単位: 円）。入金・出金の区別は entry_side で指定します。 例: `5000` (最小: -9223372036854776000, 最大: 9223372036854776000)
- walletable_id (必須): integer(int64) - 口座ID（walletable_type で指定した口座区分の口座のID）。口座一覧の取得API（GET /api/1/walletables）で確認できます。 例: `1` (最小: 1)
- walletable_type (必須): string - 口座区分
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - 現金・その他の決済口座 (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
- date (必須): string - 取引日 (yyyy-mm-dd) 例: `2019-12-17`
- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- balance (任意): integer(int64) - 残高（単位: 円）。指定しない場合、作成された明細の balance は null になります。 例: `10000` (最小: -9223372036854776000, 最大: 9223372036854776000)

### レスポンス (201)

- wallet_txn (必須): object
  - id (必須): integer(int64) - 明細ID 例: `1` (最小: 1)
  - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
  - date (必須): string - 取引日 (yyyy-mm-dd) 例: `2019-12-17`
  - amount (必須): integer(int64) - 取引金額（単位: 円）。入金・出金の区別は entry_side で表されます。 例: `5000` (最小: -9223372036854776000, 最大: 9223372036854776000)
  - due_amount (必須): integer(int64) - 取引登録待ち金額（単位: 円）。明細に対してまだ取引が登録されていない金額を表します。取引が未登録（status が 1）の場合は取引金額と同額になり、取引登録が完了する（status が 2 になる）と 0 になります。 例: `0`
  - balance (必須): integer(int64) - 残高（単位: 円）。銀行口座等の残高が入ります。Webで残高未設定で登録した場合や、口座明細の作成APIで balance を指定せずに登録した場合などは null になります。 例: `10000`
  - entry_side (必須): string - 入金・出金の区分
* `income` - 入金
* `expense` - 出金 (選択肢: income, expense) 例: `income`
  - walletable_type (必須): string - 口座区分
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - 現金・その他の決済口座 (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
  - walletable_id (必須): integer(int64) - 口座ID（walletable_type で示される口座のID）。口座の詳細は口座一覧の取得API（GET /api/1/walletables）で確認できます。 例: `1` (最小: 1)
  - description (必須): string - 取引内容（銀行やクレジットカードの明細に記載された摘要等）。未設定の場合は空文字列になります。 例: `振込 カ）ABC`
  - status (必須): integer(int64) - 明細のステータス
* `1` - 消込待ち（明細に対する取引が未登録の状態）
* `2` - 消込済み（明細に対する取引の登録が完了した状態）
* `3` - 無視（取引を登録せず明細を無視した状態）
* `4` - 消込中（明細の一部の金額のみ取引登録された状態）
* `6` - 対象外（取引登録の対象外の明細） 例: `1` (最小: 1, 最大: 6)
  - rule_matched (必須): boolean - 登録時に<a href="https://support.freee.co.jp/hc/ja/articles/202848350-明細の自動登録ルールを設定する" target="_blank">自動登録ルールの設定</a>が適用され、登録処理が実行された場合、
trueになります。〜を推測する、〜の消込をするの条件の場合は一致してもfalseになります。
 例: `true`

### GET /api/1/wallet_txns/{id}

操作: 口座明細の取得

説明: 概要 指定した事業所の口座明細を取得する 定義 amount : 取引金額（単位: 円） due_amount : 取引登録待ち金額（明細に対してまだ取引が登録されていない金額） balance : 残高（銀行口座等） entry_side income : 入金 expense : 出金 walletable_type bank_account : 銀行口座 credit_card : クレジットカード wallet : 現金・その他の決済口座

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- wallet_txn (必須): object
  - id (必須): integer(int64) - 明細ID 例: `1` (最小: 1)
  - company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
  - date (必須): string - 取引日 (yyyy-mm-dd) 例: `2019-12-17`
  - amount (必須): integer(int64) - 取引金額（単位: 円）。入金・出金の区別は entry_side で表されます。 例: `5000` (最小: -9223372036854776000, 最大: 9223372036854776000)
  - due_amount (必須): integer(int64) - 取引登録待ち金額（単位: 円）。明細に対してまだ取引が登録されていない金額を表します。取引が未登録（status が 1）の場合は取引金額と同額になり、取引登録が完了する（status が 2 になる）と 0 になります。 例: `0`
  - balance (必須): integer(int64) - 残高（単位: 円）。銀行口座等の残高が入ります。Webで残高未設定で登録した場合や、口座明細の作成APIで balance を指定せずに登録した場合などは null になります。 例: `10000`
  - entry_side (必須): string - 入金・出金の区分
* `income` - 入金
* `expense` - 出金 (選択肢: income, expense) 例: `income`
  - walletable_type (必須): string - 口座区分
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - 現金・その他の決済口座 (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
  - walletable_id (必須): integer(int64) - 口座ID（walletable_type で示される口座のID）。口座の詳細は口座一覧の取得API（GET /api/1/walletables）で確認できます。 例: `1` (最小: 1)
  - description (必須): string - 取引内容（銀行やクレジットカードの明細に記載された摘要等）。未設定の場合は空文字列になります。 例: `振込 カ）ABC`
  - status (必須): integer(int64) - 明細のステータス
* `1` - 消込待ち（明細に対する取引が未登録の状態）
* `2` - 消込済み（明細に対する取引の登録が完了した状態）
* `3` - 無視（取引を登録せず明細を無視した状態）
* `4` - 消込中（明細の一部の金額のみ取引登録された状態）
* `6` - 対象外（取引登録の対象外の明細） 例: `1` (最小: 1, 最大: 6)
  - rule_matched (必須): boolean - 登録時に<a href="https://support.freee.co.jp/hc/ja/articles/202848350-明細の自動登録ルールを設定する" target="_blank">自動登録ルールの設定</a>が適用され、登録処理が実行された場合、
trueになります。〜を推測する、〜の消込をするの条件の場合は一致してもfalseになります。
 例: `true`

### DELETE /api/1/wallet_txns/{id}

操作: 口座明細の削除

説明: 概要 指定した事業所の口座明細を削除する 注意点 同期をして取得したデータが「明細」の場合は、削除および再取得はできません。 詳細はfreeeヘルプセンターをご確認ください。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (204)

### POST /api/1/wallet_txns/{id}/reconcile

操作: 口座明細で未決済取引の消込

説明: 指定した口座明細と既存の未決済取引を紐づけて消込する ### 注意点 - deals に指定した取引の決済金額の合計と adjustment_deal の金額の合計を合わせた額は、明細金額と一致させてください。決済金額の合計が明細金額に満たない・超える場合は、差額を新規取引として登録するために adjustment_deal を指定してください。 - adjustment_deal を指定した場合、作成された取引のIDがレスポンスの new_deal_id に入ります。指定しない場合は null になります。 - 同一のパラメータで再リクエストした場合も冪等に同じレスポンスを返します。 - 明細が既に別の取引で消込済みの場合、または取引が既に別の明細で決済済みの場合は409エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- deals (必須): array[object] - 紐づけ対象の取引のリスト
  配列の要素:
    - deal_id (必須): integer(int64) - 取引ID 例: `101`
    - amount (必須): integer(int64) - 決済金額（単位: 円）。正の整数で指定します。 例: `5000` (最小: 1)
- adjustment_deal (任意): object - 消込時に差額を新規取引として登録するための取引
  - issue_date (任意): string(date) - 取引発生日 (yyyy-mm-dd)。明細の取引日以前の日付を指定します。省略時は明細の取引日と同日になります。 例: `2026-08-24`
  - ref (任意): string - 管理番号 例: `REF-001`
  - partner_id (任意): integer(int64) - 取引先ID 例: `101`
  - deal_lines (必須): array[object] - 取引の内訳行

### レスポンス (200)

口座明細の消込レスポンス

- wallet_txn_id (必須): integer(int64) - 明細ID 例: `1` (最小: 1)
- deal_ids (必須): array[integer] - リクエストで指定した既存取引のIDのリスト
- new_deal_id (必須): integer(int64) - adjustment_deal から新規作成された取引のID。adjustment_deal を指定しなかった場合は null になります。 例: `101`

### POST /api/1/wallet_txns/{id}/create_deal

操作: 口座明細からの取引登録

説明: 指定した口座明細から取引を作成し、作成した取引で明細を消込する ### 注意点 - deal_lines の amount は符号付きの整数で指定します。明細の入出金区分（entry_side）と amount の符号から、借方・貸方が自動で決まります。 - deal_lines の金額の合計は明細金額と一致させてください。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- issue_date (任意): string(date) - 取引発生日 (yyyy-mm-dd)。明細の取引日以前の日付を指定します。省略時は明細の取引日と同日になります。 例: `2026-08-24`
- ref (任意): string - 管理番号 例: `REF-001`
- partner_id (任意): integer(int64) - 取引先ID 例: `101`
- deal_lines (必須): array[object] - 取引の内訳行
  配列の要素:
    - amount (必須): integer(int64) - 金額（税込。単位: 円）。0以外の符号付きの整数で指定します。明細の入出金区分（entry_side）と符号から借方・貸方が決まります。 例: `1100`
    - vat (任意): integer(int64) - 税額（単位: 円）。省略時は amount と tax_code から自動計算されます。 例: `100`
    - tag_ids (任意): array[integer] - メモタグIDのリスト 例: `[201]`
    - segment_1_tag_id (任意): integer(int64) - セグメント1タグID 例: `601`
    - segment_2_tag_id (任意): integer(int64) - セグメント2タグID 例: `602`
    - segment_3_tag_id (任意): integer(int64) - セグメント3タグID 例: `603`
    - item_id (任意): integer(int64) - 品目ID 例: `301`
    - description (任意): string - 摘要 例: `利用料`
    - tax_code (任意): integer(int32) - 税区分コード。省略時は勘定科目に紐づくデフォルトの税区分が適用されます。 例: `21`
    - tax_entry_method (任意): object - 税入力方法。省略時は内税（in）として扱われます。画面上での金額の表示方法を決める指定であり、`out` を指定した場合も amount は税込金額で指定します。
- `in` - 内税
- `out` - 外税 例: `in`
    - section_id (任意): integer(int64) - 部門ID 例: `401`
    - account_item_id (必須): integer(int64) - 勘定科目ID 例: `501`
    - partner_id (任意): integer(int64) - 取引先ID。「内訳行ごとの取引先個別指定」の設定が有効な事業所でのみ指定できます。設定が有効な場合、省略するとその内訳行には取引先を設定しません。 例: `102`

### レスポンス (200)

口座明細からの取引登録レスポンス

- deal_ids (必須): array[integer] - 作成された取引のIDのリスト

### POST /api/1/wallet_txns/{id}/create_transfer

操作: 口座明細からの口座振替登録

説明: 指定した口座明細を口座振替として登録する ### 注意点 - 振替元は transfer_from_line で1口座、振替先は transfer_to_lines で複数口座を指定できます。 - 入金明細の場合は transfer_to_lines、出金明細の場合は transfer_from_line に、必ず対象の明細の口座を含めてください。 - transfer_from_line の振替元口座から出金される金額は、transfer_to_lines の金額の合計と charge_lines の金額の合計（line_type が paid は加算、received は減算）を合わせた額と必ず一致させてください。 - 明細の口座に対応する金額（出金明細の場合は上記の振替元の金額、入金明細の場合は transfer_to_lines のうち明細の口座の行の金額）は、明細金額と一致させてください。 - transfer_to_lines に同一口座（walletable_type と walletable_id の組み合わせ）を重複して指定できません。 - 税込経理の事業所では ch...

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- transfer_from_line (必須): object - 口座振替の振替元の口座
  - walletable_type (必須): object - 振替元の口座区分
- `bank_account` - 銀行口座
- `credit_card` - クレジットカード
- `wallet` - 現金・その他の決済口座 例: `bank_account`
  - walletable_id (必須): integer(int64) - walletable_type で指定した振替元口座のID 例: `10`
  - walletable_tags (任意): object - 口座振替の仕訳行に付与する品目・部門・取引先・メモタグ・セグメント
- transfer_to_lines (必須): array[object] - 振替先。同一口座の重複は指定できません。
  配列の要素:
    - walletable_type (必須): object - 振替先の口座区分
- `bank_account` - 銀行口座
- `credit_card` - クレジットカード
- `wallet` - 現金・その他の決済口座 例: `wallet`
    - walletable_id (必須): integer(int64) - walletable_type で指定した振替先口座のID 例: `20`
    - amount (必須): integer(int64) - 振替先口座へ振り替える金額（単位: 円）。正の整数で指定します。 例: `6000` (最小: 1)
    - description (任意): string - 振替先の仕訳行に記録する摘要 例: `現金口座への振替`
    - walletable_tags (任意): object - 口座振替の仕訳行に付与する品目・部門・取引先・メモタグ・セグメント
- charge_lines (任意): array[object] - 手数料等の行。省略時は手数料等なしとして扱われます。
  配列の要素:
    - account_item_id (必須): integer(int64) - 手数料等の仕訳行に使用する勘定科目のID 例: `40`
    - amount (必須): integer(int64) - 手数料等の金額（単位: 円）。正の整数で指定します。 例: `100` (最小: 1)
    - line_type (必須): object - 手数料等の収支区分
- `paid` - 支払手数料等として計上する
- `received` - 受取利息等として計上する 例: `paid`
    - tax_code (任意): integer(int32) - 手数料等の仕訳行に適用する税区分コード 例: `21`
    - vat (任意): integer(int64) - 手数料等の消費税額（単位: 円）。0以上の整数で指定します。省略時は amount と tax_code から自動計算されます。税込経理の事業所では指定できません。 例: `0` (最小: 0)
    - description (任意): string - 手数料等の仕訳行に記録する摘要 例: `振込手数料`
    - item_id (任意): integer(int64) - 手数料等の仕訳行に付与する品目のID 例: `301`
    - section_id (任意): integer(int64) - 手数料等の仕訳行に付与する部門のID 例: `401`
    - partner_id (任意): integer(int64) - 手数料等の仕訳行に付与する取引先のID 例: `102`
    - tag_ids (任意): array[integer] - 手数料等の仕訳行に付与するメモタグのIDのリスト 例: `[201]`
    - segment_1_tag_id (任意): integer(int64) - 手数料等の仕訳行に付与するセグメント1のタグID 例: `601`
    - segment_2_tag_id (任意): integer(int64) - 手数料等の仕訳行に付与するセグメント2のタグID 例: `602`
    - segment_3_tag_id (任意): integer(int64) - 手数料等の仕訳行に付与するセグメント3のタグID 例: `603`

### レスポンス (200)

口座明細からの口座振替登録レスポンス

- wallet_txn_id (必須): integer(int64) - 口座振替として登録した明細のID 例: `1` (最小: 1)
- transfer_ids (必須): array[integer] - 作成された口座振替のIDのリスト

### POST /api/1/wallet_txns/{id}/create_private_deal

操作: 口座明細のプライベート取引としての登録

説明: 指定した口座明細に対応するプライベート取引を作成し、明細を消込する ### 注意点 - プライベート取引は、個人事業所では事業主貸・事業主借、法人事業所では役員貸付金・役員借入金として登録されます。勘定科目や金額の指定は不要です。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)

### レスポンス (200)

口座明細のプライベート取引としての登録レスポンス

- deal_id (必須): integer(int64) - 作成された取引のID 例: `101`

### POST /api/1/wallet_txns/{id}/ignore

操作: 口座明細の無視

説明: 指定した口座明細を「無視」の状態に変更する ### 注意点 - 既に「無視」の明細を指定した場合も、冪等に成功として200を返します。 - 「消込済み」の明細は無視できません。先に口座明細の未消込への変更API（POST /api/1/wallet_txns/{id}/reset）で「未消込」に戻してください。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)

### レスポンス (200)

口座明細の無視レスポンス

### POST /api/1/wallet_txns/{id}/reset

操作: 口座明細の未消込への変更

説明: 「無視」または「消込済み」の口座明細を「未消込」の状態に戻す ### 注意点 - 「無視」の明細は無視を解除し、「消込済み」の明細は消込を解除します。 - 既に「未消込」の明細を指定した場合も、冪等に成功として200を返します。 - 明細に紐づく仕訳が承認済みの場合、または非同期処理中の場合は400エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 明細ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)

### レスポンス (200)

口座明細の未消込への変更レスポンス



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
