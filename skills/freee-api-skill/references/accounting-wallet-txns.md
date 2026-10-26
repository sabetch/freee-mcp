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



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
