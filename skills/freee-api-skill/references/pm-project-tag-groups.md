# ProjectTagGroups

## 概要



## エンドポイント一覧

### GET /project_tag_groups

操作: プロジェクトタググループの取得

説明: 事業所のプロジェクトタググループと、その配下に属するプロジェクトタグの一覧を取得します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer | 事業所ID |
| limit | query | いいえ | integer | 取得レコードの件数（デフォルト：50, 最小：1, 最大：100） |
| offset | query | いいえ | integer | 取得レコードのオフセット（デフォルト：0） |

### レスポンス (200)

成功時

- project_tag_groups (必須): array[object]
  配列の要素:
    - id (必須): integer - プロジェクトタググループID 例: `1`
    - name (必須): string - プロジェクトタググループ名 例: `事業部`
    - required (必須): boolean - プロジェクトでのタグ付けを必須にするか 例: `true`
    - project_tags (必須): array[object] - 配下のプロジェクトタグ
- meta (必須): object



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [pm-api-schema.json](../../openapi/pm-api-schema.json)
