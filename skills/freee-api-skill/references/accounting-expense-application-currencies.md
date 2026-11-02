# Expense application currencies

## 概要

経費精算の外貨

## エンドポイント一覧

### GET /api/1/expense_applications/currencies

操作: 経費精算の外貨一覧の取得

説明: 概要 指定した事業所の経費精算で利用する外貨の一覧を取得します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| search_status | query | いいえ | string | 利用状態での絞り込み (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) |

### レスポンス (200)

- data (必須): array[object] - 外貨一覧
  配列の要素:
    - id (必須): integer(int64) - 外貨ID 例: `123` (最小: 1)
    - name (必須): string - 外貨名 (30文字以内) 例: `米ドル`
    - code (必須): string - 通貨コード (半角英大文字3文字) 例: `USD`
    - description (必須): string - 備考 例: `海外出張で頻用`
    - search_status (必須): string - 利用状態 (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) 例: `usable`
    - updated_at (必須): string - 更新日時 (ISO8601形式) 例: `2024-05-10T14:23:11+09:00`

### POST /api/1/expense_applications/currencies

操作: 経費精算の外貨の作成

説明: 概要 指定した事業所の経費精算で利用する外貨を作成します。

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- name (必須): string - 外貨名 (30文字以内、前後の空白を除去した上で事業所内で重複不可) 例: `ベトナム・ドン`
- code (必須): string - 通貨コード (半角英大文字3文字) 例: `VND` (パターン: ^[A-Z]{3}$)
- search_status (必須): string - 利用状態 (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) 例: `usable`
- description (任意): string - 備考 例: `ハノイ支社経費用`

### レスポンス (201)

- id (必須): integer(int64) - 外貨ID 例: `123` (最小: 1)
- name (必須): string - 外貨名 (30文字以内) 例: `米ドル`
- code (必須): string - 通貨コード (半角英大文字3文字) 例: `USD`
- description (必須): string - 備考 例: `海外出張で頻用`
- search_status (必須): string - 利用状態 (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) 例: `usable`
- updated_at (必須): string - 更新日時 (ISO8601形式) 例: `2024-05-10T14:23:11+09:00`

### GET /api/1/expense_applications/currencies/{id}

操作: 経費精算の外貨の取得

説明: 概要 指定した事業所の経費精算で利用する外貨を取得します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 外貨ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- id (必須): integer(int64) - 外貨ID 例: `123` (最小: 1)
- name (必須): string - 外貨名 (30文字以内) 例: `米ドル`
- code (必須): string - 通貨コード (半角英大文字3文字) 例: `USD`
- description (必須): string - 備考 例: `海外出張で頻用`
- search_status (必須): string - 利用状態 (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) 例: `usable`
- updated_at (必須): string - 更新日時 (ISO8601形式) 例: `2024-05-10T14:23:11+09:00`

### PUT /api/1/expense_applications/currencies/{id}

操作: 経費精算の外貨の更新

説明: 概要 指定した事業所の経費精算で利用する外貨を更新します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 外貨ID |

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- name (必須): string - 外貨名 (30文字以内、前後の空白を除去した上で事業所内で重複不可) 例: `ベトナム・ドン`
- code (必須): string - 通貨コード (半角英大文字3文字) 例: `VND` (パターン: ^[A-Z]{3}$)
- search_status (必須): string - 利用状態 (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) 例: `usable`
- description (任意): string - 備考 例: `ハノイ支社経費用`

### レスポンス (200)

- id (必須): integer(int64) - 外貨ID 例: `123` (最小: 1)
- name (必須): string - 外貨名 (30文字以内) 例: `米ドル`
- code (必須): string - 通貨コード (半角英大文字3文字) 例: `USD`
- description (必須): string - 備考 例: `海外出張で頻用`
- search_status (必須): string - 利用状態 (usable: 利用可能, unusable: 利用不可) (選択肢: usable, unusable) 例: `usable`
- updated_at (必須): string - 更新日時 (ISO8601形式) 例: `2024-05-10T14:23:11+09:00`

### DELETE /api/1/expense_applications/currencies/{id}

操作: 経費精算の外貨の削除

説明: 概要 指定した事業所の経費精算で利用する外貨を削除します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 外貨ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (204)



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
