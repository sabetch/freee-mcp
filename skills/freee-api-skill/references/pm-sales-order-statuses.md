# SalesOrderStatuses

## 概要



## エンドポイント一覧

### GET /sales_order_statuses

操作: 受注ステータスの取得

説明: 事業所の受注ステータスの一覧を取得します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer | 事業所ID |
| limit | query | いいえ | integer | 取得レコードの件数（デフォルト：50, 最小：1, 最大：100） |
| offset | query | いいえ | integer | 取得レコードのオフセット（デフォルト：0） |

### レスポンス (200)

成功時

- sales_order_statuses (必須): array[object]
  配列の要素:
    - id (必須): integer - 受注ステータスID 例: `1`
    - name (必須): string - 受注ステータス名 例: `受注済み`
- meta (必須): object



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [pm-api-schema.json](../../openapi/pm-api-schema.json)
