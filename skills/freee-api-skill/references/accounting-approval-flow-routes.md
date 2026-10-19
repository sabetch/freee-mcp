# Approval flow routes

## 概要

申請経路

## エンドポイント一覧

### GET /api/1/approval_flow_routes

操作: 申請経路一覧の取得

説明: 概要 指定した事業所の申請経路一覧を取得する 各種申請APIの使い方については、freee会計の各種申請APIの使い方をご参照ください 経費精算APIの使い方については、freee会計の経費精算APIの使い方をご参照ください 注意点 承認ステップの詳細（steps）は本APIのレスポンスには含まれません。承認方法や分岐条件を確認する場合は、申請経路の取得（GET /api/1/approval_flow_routes/{id}）をご利用ください。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| company_id | query | はい | integer(int64) | 事業所ID |
| included_user_id | query | いいえ | integer(int64) | 経路に含まれるユーザーのユーザーID（指定したユーザーが承認ステップの承認者に含まれる申請経路に絞り込めます） |
| usage | query | いいえ | string | 申請種別（各申請種別が使用できる申請経路に絞り込めます。例えば、ApprovalRequest を指定すると、各種申請が使用できる申請経路に絞り込めます。未指定の場合は全ての申請種別の申請経路が対象になります。）
* `TxnApproval` - 仕訳承認
* `ExpenseApplication` - 経費精算
* `PaymentRequest` - 支払依頼
* `ApprovalRequest` - 各種申請
* `DocApproval` - 請求書等 (見積書・納品書・請求書・発注書) (選択肢: TxnApproval, ExpenseApplication, PaymentRequest, ApprovalRequest, DocApproval) |
| request_form_id | query | いいえ | integer(int64) | 申請フォームID（指定した申請フォームが使用できる申請経路に絞り込めます。usage に ApprovalRequest を指定した場合のみ有効で、usage が ApprovalRequest 以外または未指定の場合、このパラメータは無視されます。指定した申請フォームが存在しない場合や無効な場合は空配列が返ります。） |

### レスポンス (200)

- approval_flow_routes (必須): array[object] - 申請経路の一覧
  配列の要素:
    - id (必須): integer(int64) - 申請経路ID 例: `1` (最小: 1)
    - name (必須): string - 申請経路名 例: `申請経路`
    - description (必須): string - 申請経路の説明（未設定の場合は空文字列になります） 例: `申請経路の説明`
    - user_id (必須): integer(int64) - 申請経路を作成したユーザーのユーザーID（削除済みのユーザーでもIDは返ります。作成ユーザーが記録されていない場合は null になります） 例: `1` (最小: 1)
    - definition_system (必須): boolean - システムにより自動作成された申請経路かどうか（true の場合、freee が自動作成した申請経路であることを示します） 例: `true`
    - first_step_id (必須): integer(int64) - 最初の承認ステップのID 例: `1` (最小: 1)
    - usages (必須): array[string] - 申請種別（申請経路を使用できる申請種別を示します。例えば、ApprovalRequest の場合は、各種申請で使用できる申請経路です。）
* `TxnApproval` - 仕訳承認
* `ExpenseApplication` - 経費精算
* `PaymentRequest` - 支払依頼
* `ApprovalRequest` - 各種申請
* `DocApproval` - 請求書等 (見積書・納品書・請求書・発注書)
* `PurchaseRequest` - 購買申請
    - request_form_ids (必須): array[integer] - 申請経路で利用できる申請フォームID配列（無効化・削除された申請フォームは含まれません）
    - default_route (必須): boolean - 基本経路として設定されているかどうか<br><br>
リクエストパラメータusageに下記のいずれかが指定され、かつ、基本経路の場合はtrueになります。
* `TxnApproval` - 仕訳承認
* `ExpenseApplication` - 経費精算
* `PaymentRequest` - 支払依頼
* `ApprovalRequest`(リクエストパラメータrequest_form_idを同時に指定) - 各種申請
* `DocApproval` - 請求書等 (見積書・納品書・請求書・発注書)

<a href="https://support.freee.co.jp/hc/ja/articles/900000507963" target="_blank">申請フォームの基本経路設定</a>
 例: `true`

### GET /api/1/approval_flow_routes/{id}

操作: 申請経路の取得

説明: 概要 指定した事業所の申請経路を取得する 各種申請APIの使い方については、freee会計の各種申請APIの使い方をご参照ください 経費精算APIの使い方については、freee会計の経費精算APIの使い方をご参照ください 注意点 承認ステップごとの承認方法は steps[].resource_type で判別できます。役職で承認者を指定する承認ステップ（and_position / or_position）では steps[].approver_determination_type、steps[].group、steps[].position_types を、条件分岐の承認ステップ（switchable）では steps[].switching_rules をご参照ください。

### パラメータ

| 名前 | 位置 | 必須 | 型 | 説明 |
|------|------|------|-----|------|
| id | path | はい | integer(int64) | 申請経路ID |
| company_id | query | はい | integer(int64) | 事業所ID |

### レスポンス (200)

- approval_flow_route (必須): object
  - id (必須): integer(int64) - 申請経路ID 例: `1` (最小: 1)
  - name (必須): string - 申請経路名 例: `申請経路`
  - description (必須): string - 申請経路の説明（未設定の場合は空文字列になります） 例: `申請経路の説明`
  - user_id (必須): integer(int64) - 申請経路を作成したユーザーのユーザーID（削除済みのユーザーでもIDは返ります。作成ユーザーが記録されていない場合は null になります） 例: `1` (最小: 1)
  - definition_system (必須): boolean - システムにより自動作成された申請経路かどうか（true の場合、freee が自動作成した申請経路であることを示します） 例: `true`
  - first_step_id (必須): integer(int64) - 最初の承認ステップのID（steps に含まれる先頭の承認ステップのIDと一致します） 例: `1` (最小: 1)
  - usages (必須): array[string] - 申請種別（申請経路を使用できる申請種別を示します。例えば、ApprovalRequest の場合は、各種申請で使用できる申請経路です。）
* `TxnApproval` - 仕訳承認
* `ExpenseApplication` - 経費精算
* `PaymentRequest` - 支払依頼
* `ApprovalRequest` - 各種申請
* `DocApproval` - 請求書等 (見積書・納品書・請求書・発注書)
* `PurchaseRequest` - 購買申請
  - request_form_ids (必須): array[integer] - 申請経路で利用できる申請フォームID配列（無効化・削除された申請フォームは含まれません）
  - steps (必須): array[object] - 承認ステップ（配列）。承認順に並びます。



## 参考情報

- freee API公式ドキュメント: https://developer.freee.co.jp/docs
- OpenAPIスキーマ: [accounting-api-schema.json](../../openapi/accounting-api-schema.json)
