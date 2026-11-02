# Banks

## 概要

連携サービス

## エンドポイント一覧

### GET /api/1/banks

操作: 連携サービス一覧の取得

説明: 概要 freee会計に口座として登録できる連携サービス（銀行口座・クレジットカード・その他の決済口座）の一覧を取得する 注意点 連携サービスはfreeeが管理する事業所に依存しないマスタデータのため、company_idパラメータの指定は不要です。 typeパラメータは指定必須です。未指定または定義されていない値を指定した場合は、ステータスコード400のエラーが返ります。 取得結果は連携サービス名(カナ)の昇順（name_kanaが同一の場合はidの昇順）で返ります。 取得したidは、口座の作成（POST /api/1/walletables）のbank_idパラメータに指定して利用します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| offset | query | いいえ | integer(int64) | 取得レコードのオフセット (デフォルト: 0)。limitと組み合わせてページングに利用します。 |
| limit | query | いいえ | integer(int64) | 取得レコードの件数 (デフォルト: 20, 最小: 1, 最大: 500) |
| type | query | いいえ | string | 連携サービス種別
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座

このパラメータは指定必須です。未指定または上記以外の値を指定した場合は、ステータスコード400のエラーが返ります。 (選択肢: bank_account, credit_card, wallet) |

### レスポンス (200)

- banks (必須): array[object]
  配列の要素:
    - id (必須): integer(int64) - 連携サービスID。口座の作成（POST /api/1/walletables）のbank_idパラメータに指定して利用します。 例: `1` (最小: 1)
    - name (必須): string - 連携サービス名 例: `フリー銀行`
    - type (必須): string - 連携サービス種別
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座 (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
    - name_kana (必須): string - 連携サービス名(カナ)。連携サービス一覧の取得（GET /api/1/banks）の取得結果はこの値の昇順で返ります。カナ名が未登録の場合はnullになります。 例: `フリーギンコウ`

### GET /api/1/banks/{id}

操作: 連携サービスの取得

説明: 概要 指定したIDの連携サービス（銀行口座・クレジットカード・その他の決済口座）を取得する 注意点 連携サービスはfreeeが管理する事業所に依存しないマスタデータのため、company_idパラメータの指定は不要です。 存在しないID、または連携が終了したサービスのIDを指定した場合は、ステータスコード404のエラーが返ります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 連携サービスID。連携サービス一覧の取得（GET /api/1/banks）で取得したidを指定します。 |

### レスポンス (200)

- bank (必須): object
  - id (必須): integer(int64) - 連携サービスID。口座の作成（POST /api/1/walletables）のbank_idパラメータに指定して利用します。 例: `1` (最小: 1)
  - name (必須): string - 連携サービス名 例: `フリー銀行`
  - type (必須): string - 連携サービス種別
* `bank_account` - 銀行口座
* `credit_card` - クレジットカード
* `wallet` - その他の決済口座 (選択肢: bank_account, credit_card, wallet) 例: `bank_account`
  - name_kana (必須): string - 連携サービス名(カナ)。連携サービス一覧の取得（GET /api/1/banks）の取得結果はこの値の昇順で返ります。カナ名が未登録の場合はnullになります。 例: `フリーギンコウ`



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
