# WorkloadAvailableProjects

## 概要

工数入力可能なプロジェクト

## エンドポイント一覧

### GET /workloads/available_projects

操作: 工数入力可能なプロジェクトの取得

説明: 指定した日付時点で、対象従業員が工数を入力できるプロジェクトの一覧を取得します。 「アサインされている」「運用ステータスが運用中」「指定日がプロジェクト期間内」の3条件を全て満たすプロジェクトを、プロジェクトIDの昇順で返します。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer | 事業所ID |
| target_date | query | はい | string | 対象日（この日付時点で工数入力可能なプロジェクトを返します） |
| person_id | query | いいえ | integer | 従業員ID
本人以外を指定できるのは、本人が「工数カレンダー　閲覧（全従業員）」権限を持つか、対象従業員が所属するチームのリーダーである場合のみ
本人は権限がなくても指定可能
省略時はAPI利用者本人が対象 |
| limit | query | いいえ | integer | 取得レコードの件数（デフォルト：50, 最小：1, 最大：100） |
| offset | query | いいえ | integer | 取得レコードのオフセット（デフォルト：0） |

### レスポンス (200)

成功時

- workload_available_projects (必須): array[object]
  配列の要素:
    - id (必須): integer - プロジェクトID 例: `1`
    - name (必須): string - プロジェクト名 例: `PJ-AAA`
    - code (必須): string - プロジェクトコード 例: `PJ-AAA`
    - from_date (必須): string(date) - プロジェクト開始日 例: `2021-01-01`
    - thru_date (必須): string(date) - プロジェクト終了日 例: `2021-12-31`
    - workload_tag_groups (必須): array[object] - プロジェクトで使える工数タグのグループ
- meta (必須): object



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [pm-api-schema.json](../../openapi/pm-api-schema.json)
