# Expense application amount calculations

## 概要

経費申請の金額の自動計算

## エンドポイント一覧

### POST /api/1/expense_applications/amount_calculations

操作: 経費申請の金額の自動計算

説明: 概要 指定した経費科目の金額計算設定にカスタム申請項目の入力値を適用し、経費申請の明細行の金額を計算します。計算するだけで、経費申請も計算結果も保存されません。

### リクエストボディ

(必須)

- company_id (必須): integer(int64) - 事業所ID 例: `1` (最小: 1)
- expense_application_line_template_id (必須): integer(int64) - 金額計算設定を持つ経費科目のID 例: `101` (最小: 1)
- custom_values (必須): array[object] - カスタム申請項目の入力値。計算式が参照する項目を含めてください
- applicant (必須): object - 計算対象の申請者。申請者はアクセストークンのユーザーに固定され、指定できるのは所属部門だけです。所属部門と役職が金額計算ルールの条件判定に使われます
  - group_id (必須): integer(int64) - 申請者 (アクセストークンのユーザー) の所属部門ID (部門に所属しない場合は null)。申請者が所属していない部門を指定した場合は 400 になります 例: `2` (最小: 1)

### レスポンス (200)

- calculated_amount (必須): integer(int64) - 計算式によって算出された金額 例: `15000`
- applied_rule (必須): object - 適用された金額計算ルール。経費科目APIの amount_calculation_setting と同じ語彙です
  - condition (必須): object - ルールの適用条件。typeで条件の種類を表します。
- applicant_position: 申請者の役職による条件。match と position_ids を持ちます
- unsupported: 本APIで表現できない条件 (Web版freee会計の旧設定で作成された条件式)。レスポンス専用で、リクエストには指定できません。条件を変更する場合は applicant_position の条件で送り直してください
  - formula (必須): string - 適用された金額計算式。カスタム申請項目の参照は {key} で表します。経費科目APIの amount_calculation_setting.rules[].formula と同じ公開文法です 例: `{travel_days}*5000`
- evaluated_as (必須): object - 金額計算の条件判定に用いた申請者の所属情報
  - group_id (必須): integer(int64) - 申請者の所属部門ID (リクエストで部門を指定しなかった場合は null) 例: `10` (最小: 1)
  - position_id (必須): integer(int64) - 申請者の役職ID (役職が設定されていない場合は null) 例: `3` (最小: 1)



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
