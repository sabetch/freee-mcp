# Walletables

## 概要

口座

## エンドポイント一覧

### GET /api/1/walletables

操作: 口座一覧の取得

説明: 概要 指定した事業所の口座（銀行口座・クレジットカード・その他の決済口座）の一覧を取得する 取得できる口座は、リクエストしたユーザーが所属するグループ管理（work_group）で参照可能な口座に限られます。 ここで取得できる口座IDと種別（type）は、取引の作成（POST /api/1/deals）・口座振替（POST /api/1/transfers）・入出金明細の取得（GET /api/1/wallet_txns）などで from_walletable_type / to_walletable_type と ID を指定する際に利用します。 注意点 type を指定しない場合は、bank_account・credit_card・wallet の全種別を返します。 残高情報（walletable_balance / last_balance）、最終同期成功日時（last_synced_at）、同期ステータス（sync_status）は、いずれもオプションのため、それぞれ with_balance / with_last_synced_at / with_sync_status を...

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID。/api/1/companies（事業所一覧の取得）で取得できます。 |
| type | query | いいえ | string | 口座種別で絞り込みます。未指定の場合は全種別を返します。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) |
| with_balance | query | いいえ | boolean | true を指定すると、レスポンスに walletable_balance（登録残高、円）と last_balance（同期残高、円）を含めます。デフォルトは false です。 |
| with_last_synced_at | query | いいえ | boolean | true を指定すると、レスポンスに last_synced_at（最終同期成功日時、ISO 8601 形式）を含めます。同期成功実績がない場合は null になります。デフォルトは false です。 |
| with_sync_status | query | いいえ | boolean | true を指定すると、レスポンスに sync_status（同期ステータス）を含めます。デフォルトは false です。 |
| start_update_date | query | いいえ | string | 更新日で絞込：開始日（yyyy-mm-dd、JST）。指定した日以降に更新された口座のみを返します。 |
| end_update_date | query | いいえ | string | 更新日で絞込：終了日（yyyy-mm-dd、JST）。指定した日以前に更新された口座のみを返します。 |

### レスポンス (200)

- walletables (必須): array[object] - 口座一覧
  配列の要素:
    - id (必須): integer(int64) - 口座ID。取引の作成（POST /api/1/deals）や口座振替（POST /api/1/transfers）などで from_walletable_type / to_walletable_type と併せて指定します。 例: `1` (最小: 1)
    - name (必須): string - 口座名（255文字以内） 例: `freee銀行`
    - bank_id (必須): integer(int64) - 連携サービスID。銀行やクレジットカード等のサービス種別を表します。/api/1/banks（連携サービス一覧の取得）で取得できます。type が wallet で連携サービスに紐づかない口座（現金など）の場合は null になります。 例: `3` (最小: 1)
    - type (必須): string - 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
    - last_synced_at (任意): string - 最終同期成功日時（ISO 8601 形式）。リクエスト時に with_last_synced_at=true を指定した場合のみ返却されます。同期成功実績がない場合や、同期に対応しない口座の場合は null になります。 例: `2019-01-01T00:00:00+09:00`
    - sync_status (任意): string - 口座の同期ステータス。リクエスト時に with_sync_status=true を指定した場合のみ返却されます。
* `success` - 同期成功
* `disabled` - 同期設定なし
* `syncing` - 同期中
* `token_refresh_error` - トークンリフレッシュエラー
* `unsupported` - 同期非対応
* `other_error` - その他のエラー（詳細はfreee会計画面上でご確認ください） (選択肢: success, disabled, syncing, token_refresh_error, unsupported, other_error) 例: `success`
    - last_balance (任意): integer(int64) - 同期残高（円）。連携サービスから同期した残高です。リクエスト時に with_balance=true を指定した場合のみ返却されます。 例: `1565583`
    - walletable_balance (任意): integer(int64) - 登録残高（円）。freee会計上の取引から計算される、借方を正とする残高です。リクエスト時に with_balance=true を指定した場合のみ返却されます。 例: `1340261`
    - update_date (必須): string - 口座設定の最終更新日（yyyy-mm-dd、JST） 例: `2020-06-15`
- meta (任意): object - メタ情報
  - up_to_date (任意): boolean - 集計結果が最新かどうか。false の場合、直近の取引が残高計算に反映されていない可能性があります。 例: `true`

### POST /api/1/walletables

操作: 口座の作成

説明: 概要 指定した事業所に口座を作成する 作成した口座は、取引の作成（POST /api/1/deals）や口座振替（POST /api/1/transfers）などで from_walletable_type / to_walletable_type と ID を指定して利用できます。 注意点 同期に対応した金融機関の口座はこのAPIでは作成できません。web画面で登録してください。 type に bank_account / credit_card を指定する場合は bank_id が必須です。type に wallet を指定する場合は bank_id を省略できます。 type に wallet を指定し、かつ bank_id を省略した場合のみ、is_asset で資産口座（true）と負債口座（false）を選択できます。bank_id を指定した場合は、資産口座か負債口座かは bank_id で指定したサービスに応じて自動判定され、is_asset は無視されます。 既存の口座と重複する口座名を指定した場合は 400 エラーが返ります。

### リクエストボディ

- name (必須): string - 口座名（255文字以内）。事業所内で既存の口座名と重複する場合は 400 エラーになります。 例: `ＸＸ銀行`
- type (必須): string - 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
- company_id (必須): integer(int64) - 事業所ID。/api/1/companies（事業所一覧の取得）で取得できます。 例: `1` (最小: 1)
- bank_id (任意): integer(int64) - 連携サービスID。/api/1/banks（連携サービス一覧の取得）で取得できます。type に bank_account、credit_card を指定する場合は必須です。type に wallet を指定する場合は省略できます（省略時は連携サービスに紐づかない現金口座などとして作成されます）。 例: `1` (最小: 1)
- is_asset (任意): boolean - 口座を資産口座（true、デフォルト）とするか負債口座（false）とするか。<br>
type に wallet を指定し、かつ bank_id を省略した場合にのみ有効です。<br>
bank_id を指定した場合は、資産口座か負債口座かは bank_id に指定したサービスに応じて自動判定され、is_asset に指定した値は無視されます。
 例: `true`

### レスポンス (201)

- walletable (必須): object - 作成された口座
  - id (必須): integer(int64) - 口座ID 例: `1` (最小: 1)
  - name (必須): string - 口座名（255文字以内） 例: `〇〇銀行`
  - bank_id (必須): integer(int64) - 連携サービスID。type が wallet で bank_id を省略して作成した場合は null になります。 例: `1` (最小: 1)
  - type (必須): string - 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) 例: `bank_account`

### GET /api/1/walletables/{type}/{id}

操作: 口座の取得

説明: 概要 指定した事業所の口座を1件取得する 注意点 指定した口座が存在しない、またはリクエストしたユーザーのグループ管理（work_group）で参照できない口座を指定した場合は 404 エラーが返ります。 残高情報（walletable_balance / last_balance）は常に含まれます。最終同期成功日時（last_synced_at）と同期ステータス（sync_status）は、それぞれ with_last_synced_at / with_sync_status を true にした場合のみレスポンスに含まれます。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 口座ID。/api/1/walletables（口座一覧の取得）で取得できます。 |
| type | path | はい | string | 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) |
| company_id | query | はい | integer(int64) | 事業所ID。/api/1/companies（事業所一覧の取得）で取得できます。 |
| with_last_synced_at | query | いいえ | boolean | true を指定すると、レスポンスに last_synced_at（最終同期成功日時、ISO 8601 形式）を含めます。同期成功実績がない場合は null になります。デフォルトは false です。 |
| with_sync_status | query | いいえ | boolean | true を指定すると、レスポンスに sync_status（同期ステータス）を含めます。デフォルトは false です。 |

### レスポンス (200)

- walletable (必須): object
  - id (必須): integer(int64) - 口座ID。取引の作成（POST /api/1/deals）や口座振替（POST /api/1/transfers）などで from_walletable_type / to_walletable_type と併せて指定します。 例: `1` (最小: 1)
  - name (必須): string - 口座名（255文字以内） 例: `freee銀行`
  - bank_id (必須): integer(int64) - 連携サービスID。銀行やクレジットカード等のサービス種別を表します。/api/1/banks（連携サービス一覧の取得）で取得できます。type が wallet で連携サービスに紐づかない口座（現金など）の場合は null になります。 例: `3` (最小: 1)
  - type (必須): string - 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
  - last_synced_at (任意): string - 最終同期成功日時（ISO 8601 形式）。リクエスト時に with_last_synced_at=true を指定した場合のみ返却されます。同期成功実績がない場合や、同期に対応しない口座の場合は null になります。 例: `2019-01-01T00:00:00+09:00`
  - sync_status (任意): string - 口座の同期ステータス。リクエスト時に with_sync_status=true を指定した場合のみ返却されます。
* `success` - 同期成功
* `disabled` - 同期設定なし
* `syncing` - 同期中
* `token_refresh_error` - トークンリフレッシュエラー
* `unsupported` - 同期非対応
* `other_error` - その他のエラー（詳細はfreee会計画面上でご確認ください） (選択肢: success, disabled, syncing, token_refresh_error, unsupported, other_error) 例: `success`
  - last_balance (任意): integer(int64) - 同期残高（円）。連携サービスから同期した残高です。リクエスト時に with_balance=true を指定した場合のみ返却されます。 例: `1565583`
  - walletable_balance (任意): integer(int64) - 登録残高（円）。freee会計上の取引から計算される、借方を正とする残高です。リクエスト時に with_balance=true を指定した場合のみ返却されます。 例: `1340261`
  - update_date (必須): string - 口座設定の最終更新日（yyyy-mm-dd、JST） 例: `2020-06-15`
- meta (任意): object - メタ情報
  - up_to_date (任意): boolean - 集計結果が最新かどうか。false の場合、直近の取引が残高計算に反映されていない可能性があります。 例: `true`

### PUT /api/1/walletables/{type}/{id}

操作: 口座の更新

説明: 概要 指定した事業所の口座の口座名を更新する 注意点 更新できるのは口座名（name）のみです。type や bank_id、資産/負債区分の変更はできません。 既存の口座と重複する口座名を指定した場合は 400 エラーが返ります。 指定した口座が存在しない、またはリクエストしたユーザーのグループ管理（work_group）で参照できない口座を指定した場合は 404 エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 口座ID。/api/1/walletables（口座一覧の取得）で取得できます。 |
| type | path | はい | string | 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) |

### リクエストボディ

- name (必須): string - 口座名（255文字以内）。事業所内で既存の口座名と重複する場合は 400 エラーになります。type や bank_id、資産/負債区分は更新できません（変更したい場合は口座を作り直してください）。 例: `ＸＸ銀行`
- company_id (必須): integer(int64) - 事業所ID。/api/1/companies（事業所一覧の取得）で取得できます。 例: `1` (最小: 1)

### レスポンス (200)

- walletable (必須): object
  - id (必須): integer(int64) - 口座ID 例: `1` (最小: 1)
  - name (必須): string - 口座名（255文字以内） 例: `freee銀行`
  - bank_id (必須): integer(int64) - 連携サービスID。type が wallet で連携サービスに紐づかない口座の場合は null になります。 例: `3` (最小: 1)
  - type (必須): string - 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
  - last_balance (必須): integer(int64) - 同期残高（円）。連携サービスから同期した残高です。 例: `1565583`
  - walletable_balance (必須): integer(int64) - 登録残高（円）。freee会計上の取引から計算される、借方を正とする残高です。 例: `1340261`
- meta (任意): object - メタ情報
  - up_to_date (任意): boolean - 集計結果が最新かどうか。false の場合、直近の取引が残高計算に反映されていない可能性があります。 例: `true`

### DELETE /api/1/walletables/{type}/{id}

操作: 口座の削除

説明: 概要 指定した事業所の口座を削除する 注意点 削除を実行するには、当該口座に関連する仕訳データを事前に削除する必要があります。仕訳が残っている場合は 400 エラーが返ります。 当該口座に仕訳が残っていないか確認するには、レポートの「仕訳帳」等を参照し、必要に応じて、「取引」や「口座振替」も削除します。 指定した口座が存在しない、またはリクエストしたユーザーのグループ管理（work_group）で参照できない口座を指定した場合は 404 エラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 口座ID。/api/1/walletables（口座一覧の取得）で取得できます。 |
| type | path | はい | string | 口座種別。
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座（現金・電子マネー・売掛/買掛など） (選択肢: bank_account, credit_card, wallet) |
| company_id | query | はい | integer(int64) | 事業所ID。/api/1/companies（事業所一覧の取得）で取得できます。 |

### レスポンス (204)



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
