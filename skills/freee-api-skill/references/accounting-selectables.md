# Selectables

## 概要

フォーム用選択項目情報

## エンドポイント一覧

### GET /api/1/forms/selectables

操作: フォーム用選択項目情報の取得

説明: 概要 指定した事業所で勘定科目の入力フォームを構築するための、勘定科目カテゴリー、勘定科目、デフォルト税区分、決算書表示名を取得します。 注意点 includes に account_item を指定した場合に、account_categories と account_groups を返します。 includes を指定しない場合、レスポンスは空のオブジェクトになります。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| includes | query | いいえ | string | 取得する選択項目
* `account_item` - 勘定科目カテゴリー、勘定科目、デフォルト税区分、決算書表示名 (選択肢: account_item) |

### レスポンス (200)

フォーム用選択項目情報の取得に成功

- account_categories (任意): array[object] - 勘定科目を用途別に分類したカテゴリーの一覧
  配列の要素:
    - balance (必須): string - 収支区分（expense: 支出、income: 収入） (選択肢: expense, income) 例: `expense`
    - org_code (必須): string - 事業形態（personal: 個人事業主、corporate: 法人） (選択肢: personal, corporate) 例: `personal`
    - role (必須): string - 勘定科目カテゴリーを識別するコード 例: `ex_food`
    - title (必須): string - フォームに表示する勘定科目カテゴリー名 例: `飲食費`
    - desc (必須): string - 勘定科目カテゴリーの用途。説明がない場合は空文字列になります。 例: `飲食に使用した経費`
    - account_items (必須): array[object] - 勘定科目の一覧
- account_groups (任意): array[object] - 勘定科目を決算書上で集約するための決算書表示名（小カテゴリー）の一覧
  配列の要素:
    - id (必須): integer(int64) - 決算書表示名（小カテゴリー）を識別するID 例: `1` (最小: 1)
    - name (必須): string - 決算書に表示する小カテゴリー名 例: `預託金`
    - account_structure_id (必須): integer(int64) - 決算書表示名が属する勘定科目体系のID 例: `1` (最小: 1)
    - account_category_id (必須): integer(int64) - 決算書表示名が属する勘定科目カテゴリーのID 例: `1` (最小: 1)
    - company_id (必須): integer(int64) - 事業所ID 例: `1`
    - detail_type (必須): integer(int64) - 補助項目種別（現状は常に `0`（補助項目なし）が返ります） (選択肢: 0, 1, 2, 3, 4) 例: `0` (最小: 0, 最大: 4)
    - index (必須): integer(int64) - 決算書表示名の並び順。小さい値ほど先に表示されます。 例: `1` (最小: 0, 最大: 2147483647)
    - created_at (必須): string(date-time) - 作成日時（ISO 8601）。記録されていない場合は null になります。 例: `2019-12-17T13:47:24+09:00`
    - updated_at (必須): string(date-time) - 更新日時（ISO 8601）。記録されていない場合は null になります。 例: `2019-12-17T13:47:24+09:00`



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
